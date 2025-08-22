// export default (sequelize, DataTypes) => {
//   const User = sequelize.define('User', {
//     user_id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//     },
//     first_name: DataTypes.STRING,
//     last_name: DataTypes.STRING,
//     email: {
//       type: DataTypes.STRING,
//       unique: true,
//       allowNull: false,
//     },
//     phone_number: DataTypes.STRING,
//     password: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     },
//     created_at: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW,
//     },
//   }, {
//     tableName: 'users',
//     timestamps: false,
//   });

//   return User;
// };


import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const User = sequelize.define('User', {
    user_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.TEXT,
    },
    email: {
      type: DataTypes.STRING,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.TEXT,
    },
    cnic: {
      type: DataTypes.STRING(13),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'users',
    timestamps: false,
  });

  return User;
};