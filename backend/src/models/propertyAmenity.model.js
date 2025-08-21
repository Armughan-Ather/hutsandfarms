// export default (sequelize, DataTypes) => {
//   const PropertyAmenity = sequelize.define('PropertyAmenity', {
//     amenity_id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//     },
//     property_id: {
//       type: DataTypes.UUID,
//       allowNull: false,
//     },
//     type: DataTypes.STRING,
//     value: DataTypes.STRING,
//   }, {
//     tableName: 'property_amenities',
//     timestamps: false,
//   });

//   return PropertyAmenity;
// };


import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const PropertyAmenity = sequelize.define('PropertyAmenity', {
    amenity_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    property_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
    },
    value: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'property_amenities',
    timestamps: false,
  });

  return PropertyAmenity;
};