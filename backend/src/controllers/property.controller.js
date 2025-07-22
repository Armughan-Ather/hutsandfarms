import cloudinary from '../utils/cloudinary.js';
import bcrypt from 'bcrypt';
import db from '../models/index.js';

const { Property, PropertyImage, PropertyVideo, PropertyPricing, PropertyAmenity, OwnerProperty, Owner, sequelize } = db;

// Controller to add a new property (hut or farm)
export const addProperty = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    // Validate model imports
    if (!Property || !PropertyImage || !PropertyVideo || !PropertyPricing || !PropertyAmenity || !OwnerProperty || !Owner) {
      throw new Error('One or more models are undefined. Check models/index.js exports.');
    }

    const {
      name,
      description,
      address,
      city,
      province,
      country,
      contact_person,
      contact_number,
      email,
      max_occupancy,
      username,
      password,
      type,
      owner_id,
      pricing,
      amenities,
    } = req.body;

    // Validate required fields
    if (!name || !type || !owner_id || !pricing || !password) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Missing required fields: name, type, owner_id, pricing, password' });
    }

    // Validate owner exists
    const owner = await Owner.findByPk(owner_id, { transaction });
    if (!owner) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Owner not found' });
    }

    // Validate type
    if (!['hut', 'farm'].includes(type)) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Invalid property type. Must be "hut" or "farm"' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Parse pricing and amenities if sent as JSON strings
    const pricingData = typeof pricing === 'string' ? JSON.parse(pricing) : pricing;
    const amenitiesData = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;

    // Create property
    const property = await Property.create({
      name,
      description,
      address,
      city,
      province,
      country,
      contact_person,
      contact_number,
      email,
      max_occupancy: max_occupancy ? parseInt(max_occupancy) : null,
      username,
      password: hashedPassword,
      type,
      created_at: new Date(),
      updated_at: new Date(),
    }, { transaction });

    // Associate property with owner
    await OwnerProperty.create({
      owner_id,
      property_id: property.property_id,
    }, { transaction });

    // Create pricing
    await PropertyPricing.create({
      property_id: property.property_id,
      base_price_day_shift: pricingData.base_price_day_shift ? parseFloat(pricingData.base_price_day_shift) : null,
      base_price_night_shift: pricingData.base_price_night_shift ? parseFloat(pricingData.base_price_night_shift) : null,
      base_price_full_day: pricingData.base_price_full_day ? parseFloat(pricingData.base_price_full_day) : null,
      weekend_multiplier: pricingData.weekend_multiplier ? parseFloat(pricingData.weekend_multiplier) : null,
      season_start_date: pricingData.season_start_date ? new Date(pricingData.season_start_date) : null,
      season_end_date: pricingData.season_end_date ? new Date(pricingData.season_end_date) : null,
      special_offer_note: pricingData.special_offer_note,
    }, { transaction });

    // Create amenities
    const amenityRecords = [];
    if (amenitiesData && Array.isArray(amenitiesData)) {
      for (const amenity of amenitiesData) {
        const record = await PropertyAmenity.create({
          property_id: property.property_id,
          type: amenity.type,
          value: amenity.value,
        }, { transaction });
        amenityRecords.push(record);
      }
    }

    // Handle image uploads
    const uploadedImages = [];
    if (req.files && req.files.images) {
      for (const image of req.files.images) {
        const imageBuffer = image.buffer.toString('base64');
        const result = await cloudinary.uploader.upload(
          `data:${image.mimetype};base64,${imageBuffer}`,
          {
            folder: `huts_and_farms/properties/${property.property_id}/images`,
            resource_type: 'image',
          }
        );

        const propertyImage = await PropertyImage.create({
          property_id: property.property_id,
          image_url: result.secure_url,
          uploaded_at: new Date(),
        }, { transaction });
        uploadedImages.push(propertyImage);
      }
    }

    // Handle video uploads
    const uploadedVideos = [];
    if (req.files && req.files.videos) {
      for (const video of req.files.videos) {
        const videoBuffer = video.buffer.toString('base64');
        const result = await cloudinary.uploader.upload(
          `data:${video.mimetype};base64,${videoBuffer}`,
          {
            folder: `huts_and_farms/properties/${property.property_id}/videos`,
            resource_type: 'video',
          }
        );

        const propertyVideo = await PropertyVideo.create({
          property_id: property.property_id,
          video_url: result.secure_url,
          uploaded_at: new Date(),
        }, { transaction });
        uploadedVideos.push(propertyVideo);
      }
    }

    await transaction.commit();

    // Return response
    res.status(201).json({
      message: 'Property added successfully',
      property,
      pricing: pricingData,
      amenities: amenityRecords,
      images: uploadedImages,
      videos: uploadedVideos,
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error adding property:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        error: 'Failed to add property',
        details: `Unique constraint violation: ${error.errors.map(e => `${e.path} (${e.value}) already exists`).join(', ')}`,
      });
    }
    res.status(500).json({ error: 'Failed to add property', details: error.message });
  }
};