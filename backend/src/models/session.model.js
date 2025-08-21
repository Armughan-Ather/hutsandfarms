import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Session = sequelize.define('Session', {
    session_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    property_type: {
      type: 'property_type_enum', // Reference existing ENUM type
    },
    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'sessions',
    timestamps: false,
  });

  return Session;
};