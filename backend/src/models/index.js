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
});

// Models
import PropertyModel from './property.model.js';
import PropertyAmenityModel from './propertyAmenity.model.js';
import PricingModel from './pricing.model.js';
import PropertyImageModel from './propertyImage.model.js';
import PropertyVideoModel from './propertyVideo.model.js';
import UserModel from './user.model.js';
import OwnerModel from './owner.model.js';
import OwnerPropertyModel from './ownerProperty.model.js';
import Booking from './bookings.model.js';

// Initialize models
const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Property = PropertyModel(sequelize, DataTypes);
db.PropertyAmenity = PropertyAmenityModel(sequelize, DataTypes);
db.Pricing = PricingModel(sequelize, DataTypes);
db.PropertyImage = PropertyImageModel(sequelize, DataTypes);
db.PropertyVideo = PropertyVideoModel(sequelize, DataTypes);

db.User = UserModel(sequelize, DataTypes);
db.Owner = OwnerModel(sequelize, DataTypes);
db.OwnerProperty = OwnerPropertyModel(sequelize, DataTypes);

db.Booking = Booking(sequelize, DataTypes);

// You can also define associations here later if needed

export default db;
