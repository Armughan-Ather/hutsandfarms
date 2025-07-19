export default (sequelize, DataTypes) => {
  const PropertyImage = sequelize.define('PropertyImage', {
    image_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    property_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    image_url: DataTypes.TEXT,
    uploaded_at: DataTypes.DATE,
  }, {
    tableName: 'property_images',
    timestamps: false,
  });

  return PropertyImage;
};
