export default (sequelize, DataTypes) => {
  const OwnerProperty = sequelize.define('OwnerProperty', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    owner_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    property_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  }, {
    tableName: 'owner_properties',
    timestamps: false,
  });

  return OwnerProperty;
};
