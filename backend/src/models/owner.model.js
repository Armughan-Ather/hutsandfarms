// export default (sequelize, DataTypes) => {
//   const Owner = sequelize.define('Owner', {
//     owner_id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//     },
//     first_name: DataTypes.STRING,
//     last_name: DataTypes.STRING,
//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     phone_number: DataTypes.STRING,
//     username: {
//       type: DataTypes.STRING,
//       unique: true,
//       allowNull: false,
//     },
//     password: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     },
//     created_at: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW,
//     },
//   }, {
//     tableName: 'owners',
//     timestamps: false,
//   });

//   return Owner;
// };


import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Owner = sequelize.define('Owner', {
    owner_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'owners',
    timestamps: false,
  });

  return Owner;
};