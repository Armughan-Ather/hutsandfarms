// export default (sequelize, DataTypes) => {
//   const PropertyPricing = sequelize.define('PropertyPricing', {
//     pricing_id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//     },
//     property_id: {
//       type: DataTypes.UUID,
//       allowNull: false,
//     },
//     base_price_day_shift: DataTypes.DECIMAL(10, 2),
//     base_price_night_shift: DataTypes.DECIMAL(10, 2),
//     base_price_full_day: DataTypes.DECIMAL(10, 2),
//     weekend_multiplier: DataTypes.DECIMAL(10, 2),
//     season_start_date: DataTypes.DATE,
//     season_end_date: DataTypes.DATE,
//     special_offer_note: DataTypes.TEXT,
//   }, {
//     tableName: 'property_pricing',
//     timestamps: false,
//   });

//   return PropertyPricing;
// };


import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const PropertyPricing = sequelize.define('PropertyPricing', {
    pricing_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    property_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'properties',
        key: 'property_id',
      },
    },
    season_start_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    season_end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    special_offer_note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'property_pricing',
    timestamps: false,
    underscored: true,
  });

  return PropertyPricing;
};