import db from '../models/index.js';
const { Property, PropertyImage, PropertyVideo, PropertyPricing, PropertyAmenity, OwnerProperty } = db;
import { v4 as uuidv4 } from 'uuid';

export const createPropertyWithMedia = async (req, res) => {
  try {
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
      amenities,        // [{ type: 'Pool', value: 'Yes' }]
      pricing           // { base_price_day_shift, ... }
    } = req.body;

    // 1. Create property
    const newProperty = await Property.create({
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
    });

    const property_id = newProperty.property_id;

    // 2. Link property to owner
    await OwnerProperty.create({
      owner_id,
      property_id,
    });

    // 3. Insert amenities (if provided)
    if (amenities && Array.isArray(amenities)) {
      const amenityRecords = amenities.map(a => ({
        property_id,
        type: a.type,
        value: a.value,
      }));
      await PropertyAmenity.bulkCreate(amenityRecords);
    }

    // 4. Insert pricing
    if (pricing) {
      await PropertyPricing.create({
        property_id,
        ...pricing,
      });
    }

    const now = new Date();

    // 5. Handle uploaded images
    if (req.files?.images) {
      const imageRecords = req.files.images.map(file => ({
        property_id,
        image_url: file.path,
        uploaded_at: now,
      }));
      await PropertyImage.bulkCreate(imageRecords);
    }

    // 6. Handle uploaded videos
    if (req.files?.videos) {
      const videoRecords = req.files.videos.map(file => ({
        property_id,
        video_url: file.path,
        uploaded_at: now,
      }));
      await PropertyVideo.bulkCreate(videoRecords);
    }

    res.status(201).json({
      message: 'Property created successfully',
      property_id,
    });
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({ message: 'Failed to create property', error: error.message });
  }
};
