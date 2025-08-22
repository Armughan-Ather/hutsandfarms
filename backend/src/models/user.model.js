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