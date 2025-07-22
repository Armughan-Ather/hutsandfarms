import { Sequelize, DataTypes } from 'sequelize';
import dbConfig from '../db/config.js';

// Initialize Sequelize
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.DIALECT,
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Required for NeonDB
    },
  },
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

// Models
import PropertyModel from './property.model.js';
import PropertyAmenityModel from './propertyAmenity.model.js';
import PropertyPricingModel from './pricing.model.js';
import PropertyImageModel from './propertyImage.model.js';
import PropertyVideoModel from './propertyVideo.model.js';
import UserModel from './user.model.js';
import OwnerModel from './owner.model.js';
import OwnerPropertyModel from './ownerProperty.model.js';
import BookingModel from './bookings.model.js';

// Initialize models
const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Property = PropertyModel(sequelize, DataTypes);
db.PropertyAmenity = PropertyAmenityModel(sequelize, DataTypes);
db.PropertyPricing = PropertyPricingModel(sequelize, DataTypes);
db.PropertyImage = PropertyImageModel(sequelize, DataTypes);
db.PropertyVideo = PropertyVideoModel(sequelize, DataTypes);
db.User = UserModel(sequelize, DataTypes);
db.Owner = OwnerModel(sequelize, DataTypes);
db.OwnerProperty = OwnerPropertyModel(sequelize, DataTypes);
db.Booking = BookingModel(sequelize, DataTypes);

// Define associations
db.Property.associate = (models) => {
  models.Property.hasMany(models.PropertyImage, { foreignKey: 'property_id' });
  models.Property.hasMany(models.PropertyVideo, { foreignKey: 'property_id' });
  models.Property.hasOne(models.PropertyPricing, { foreignKey: 'property_id' });
  models.Property.hasMany(models.PropertyAmenity, { foreignKey: 'property_id' });
  models.Property.hasMany(models.OwnerProperty, { foreignKey: 'property_id' });
  models.Property.hasMany(models.Booking, { foreignKey: 'property_id' });
};

db.PropertyImage.associate = (models) => {
  models.PropertyImage.belongsTo(models.Property, { foreignKey: 'property_id' });
};

db.PropertyVideo.associate = (models) => {
  models.PropertyVideo.belongsTo(models.Property, { foreignKey: 'property_id' });
};

db.PropertyPricing.associate = (models) => {
  models.PropertyPricing.belongsTo(models.Property, { foreignKey: 'property_id' });
};

db.PropertyAmenity.associate = (models) => {
  models.PropertyAmenity.belongsTo(models.Property, { foreignKey: 'property_id' });
};

db.OwnerProperty.associate = (models) => {
  models.OwnerProperty.belongsTo(models.Property, { foreignKey: 'property_id' });
  models.OwnerProperty.belongsTo(models.Owner, { foreignKey: 'owner_id' });
};

db.Booking.associate = (models) => {
  models.Booking.belongsTo(models.Property, { foreignKey: 'property_id' });
  models.Booking.belongsTo(models.User, { foreignKey: 'user_id' });
};

db.User.associate = (models) => {
  models.User.hasMany(models.Booking, { foreignKey: 'user_id' });
};

db.Owner.associate = (models) => {
  models.Owner.hasMany(models.OwnerProperty, { foreignKey: 'owner_id' });
};

// Apply associations
Object.values(db).forEach((model) => {
  if (model.associate) {
    model.associate(db);
  }
});

export default db;