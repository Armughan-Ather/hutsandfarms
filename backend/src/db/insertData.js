import db from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

const { Property, PropertyPricing, PropertyShiftPricing } = db;

async function insertPricingData() {
  try {
    // Ensure Sequelize is connected
    await db.sequelize.authenticate();
    console.log('✅ DB connected successfully.');

    // Step 1: Find the property_id for 'White Palace Farmhouse'
    const property = await Property.findOne({
      where: { name: 'White Palace Farmhouse' },
    });

    if (!property) {
      console.error('❌ Property "White Palace Farmhouse" not found');
      process.exit(1);
    }

    // Step 2: Insert into property_pricing
    const pricing = await PropertyPricing.create({
      pricing_id: uuidv4(),
      property_id: property.property_id,
      season_start_date: '2025-07-01',
      season_end_date: '2025-07-31',
      special_offer_note: "2025 Revised Rate List for July - Want better prices!! Let's discuss",
    });

    console.log('✅ Inserted into property_pricing:', pricing.pricing_id);

    // Step 3: Insert into property_shift_pricing
    const shiftPricingData = [
      // Weekday Morning (Mon-Fri Day)
      { id: uuidv4(), pricing_id: pricing.pricing_id, day_of_week: 'monday', shift_type: 'Day', price: 100000 },
      { id: uuidv4(), pricing_id: pricing.pricing_id, day_of_week: 'tuesday', shift_type: 'Day', price: 100000 },
      { id: uuidv4(), pricing_id: pricing.pricing_id, day_of_week: 'wednesday', shift_type: 'Day', price: 100000 },
      { id: uuidv4(), pricing_id: pricing.pricing_id, day_of_week: 'thursday', shift_type: 'Day', price: 100000 },
      { id: uuidv4(), pricing_id: pricing.pricing_id, day_of_week: 'friday', shift_type: 'Day', price: 100000 },
      // Weekday Night (Mon-Fri Night)
      { id: uuidv4(), pricing_id: pricing.pricing_id, day_of_week: 'monday', shift_type: 'Night', price: 115000 },
      { id: uuidv4(), pricing_id: pricing.pricing_id, day_of_week: 'tuesday', shift_type: 'Night', price: 115000 },
      { id: uuidv4(), pricing_id: pricing.pricing_id, day_of_week: 'wednesday', shift_type: 'Night', price: 115000 },
      { id: uuidv4(), pricing_id: pricing.pricing_id, day_of_week: 'thursday', shift_type: 'Night', price: 115000 },
      { id: uuidv4(), pricing_id: pricing.pricing_id, day_of_week: 'friday', shift_type: 'Night', price: 115000 },
      // Weekend Morning (Sat-Sun Day)
      { id: uuidv4(), pricing_id: pricing.pricing_id, day_of_week: 'saturday', shift_type: 'Day', price: 120000 },
      { id: uuidv4(), pricing_id: pricing.pricing_id, day_of_week: 'sunday', shift_type: 'Day', price: 120000 },
      // Weekend Night (Fri-Sun Night)
      { id: uuidv4(), pricing_id: pricing.pricing_id, day_of_week: 'friday', shift_type: 'Night', price: 140000 },
      { id: uuidv4(), pricing_id: pricing.pricing_id, day_of_week: 'saturday', shift_type: 'Night', price: 140000 },
      { id: uuidv4(), pricing_id: pricing.pricing_id, day_of_week: 'sunday', shift_type: 'Night', price: 140000 },
      // Weekday Full Day (Mon-Thu)
      { id: uuidv4(), pricing_id: pricing.pricing_id, day_of_week: 'monday', shift_type: 'Full Day', price: 210000 },
      { id: uuidv4(), pricing_id: pricing.pricing_id, day_of_week: 'tuesday', shift_type: 'Full Day', price: 210000 },
      { id: uuidv4(), pricing_id: pricing.pricing_id, day_of_week: 'wednesday', shift_type: 'Full Day', price: 210000 },
      { id: uuidv4(), pricing_id: pricing.pricing_id, day_of_week: 'thursday', shift_type: 'Full Day', price: 210000 },
      // Weekend Full Day (Fri-Sun)
      { id: uuidv4(), pricing_id: pricing.pricing_id, day_of_week: 'friday', shift_type: 'Full Day', price: 250000 },
      { id: uuidv4(), pricing_id: pricing.pricing_id, day_of_week: 'saturday', shift_type: 'Full Day', price: 250000 },
      { id: uuidv4(), pricing_id: pricing.pricing_id, day_of_week: 'sunday', shift_type: 'Full Day', price: 250000 },
    ];

    await PropertyShiftPricing.bulkCreate(shiftPricingData);
    console.log('✅ Inserted into property_shift_pricing:', shiftPricingData.length, 'records');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error inserting data:', error);
    process.exit(1);
  }
}

insertPricingData();