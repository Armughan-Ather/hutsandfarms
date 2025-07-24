import db from '../models/index.js';

const { Booking, User, Property, PropertyPricing, sequelize } = db;

// Create a new booking
export const createBooking = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { user_email, user_phone_number, property_username, booking_date, shift_type, booking_source } = req.body;

    // Validate required fields
    if (!user_email || !user_phone_number || !property_username || !booking_date || !shift_type || !booking_source) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Missing required fields: user_email, user_phone_number, property_username, booking_date, shift_type, booking_source' });
    }

    // Validate shift_type
    if (!['Day', 'Night', 'Full Day'].includes(shift_type)) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Invalid shift_type. Must be "Day", "Night", or "Full Day"' });
    }

    // Validate booking_source
    if (!['Website', 'WhatsApp Bot', 'Third-Party'].includes(booking_source)) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Invalid booking_source. Must be "Website", "WhatsApp Bot", or "Third-Party"' });
    }

    // Validate booking_date
    const parsedBookingDate = new Date(booking_date);
    if (isNaN(parsedBookingDate)) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Invalid booking_date format. Use ISO format (e.g., "2025-07-23")' });
    }

    // Find user by email and verify phone_number
    const user = await User.findOne({ where: { email: user_email }, transaction });
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.phone_number !== user_phone_number) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Phone number does not match user record' });
    }
    // Verify the authenticated user matches the request
    if (req.user.user_id !== user.user_id) {
      await transaction.rollback();
      return res.status(403).json({ error: 'Forbidden - You can only book for yourself' });
    }

    // Find property by username
    const property = await Property.findOne({ where: { username: property_username }, transaction });
    if (!property) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Property not found' });
    }

    // Check for existing booking on the same date and shift
    const existingBooking = await Booking.findOne({
      where: {
        property_id: property.property_id,
        booking_date: parsedBookingDate,
        shift_type,
      },
      transaction,
    });
    if (existingBooking) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Property is already booked for this date and shift' });
    }

    // Find property pricing
    const pricing = await PropertyPricing.findOne({ where: { property_id: property.property_id }, transaction });
    if (!pricing) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Pricing not found for this property' });
    }

    // Calculate total_cost based on shift_type and booking_date
    const isWeekend = parsedBookingDate.getDay() === 0 || parsedBookingDate.getDay() === 6; // Sunday or Saturday
    let total_cost;
    if (shift_type === 'Day') {
      total_cost = isWeekend && pricing.weekend_multiplier
        ? pricing.base_price_day_shift * pricing.weekend_multiplier
        : pricing.base_price_day_shift;
    } else if (shift_type === 'Night') {
      total_cost = isWeekend && pricing.weekend_multiplier
        ? pricing.base_price_night_shift * pricing.weekend_multiplier
        : pricing.base_price_night_shift;
    } else {
      total_cost = isWeekend && pricing.weekend_multiplier
        ? pricing.base_price_full_day * pricing.weekend_multiplier
        : pricing.base_price_full_day;
    }

    if (!total_cost || isNaN(total_cost)) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Invalid pricing data for the selected shift_type' });
    }

    // Create booking
    const booking = await Booking.create({
      user_id: user.user_id,
      user_phone_number,
      property_id: property.property_id,
      booking_date: parsedBookingDate,
      shift_type,
      total_cost,
      booking_source,
      status: 'Pending',
      booked_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    }, { transaction });

    await transaction.commit();

    // Return response
    res.status(201).json({
      message: 'Booking created successfully',
      booking: {
        booking_id: booking.booking_id,
        user_id: booking.user_id,
        user_phone_number: booking.user_phone_number,
        property_id: booking.property_id,
        booking_date: booking.booking_date,
        shift_type: booking.shift_type,
        total_cost: booking.total_cost,
        booking_source: booking.booking_source,
        status: booking.status,
        booked_at: booking.booked_at,
        created_at: booking.created_at,
        updated_at: booking.updated_at,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating booking:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        error: 'Failed to create booking',
        details: `Unique constraint violation: ${error.errors.map(e => `${e.path} (${e.value}) already exists`).join(', ')}`,
      });
    }
    res.status(500).json({ error: 'Failed to create booking', details: error.message });
  }
};