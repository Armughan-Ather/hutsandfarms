export default (sequelize, DataTypes) => {
  const PropertyVideo = sequelize.define('PropertyVideo', {
    video_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    property_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    video_url: DataTypes.TEXT,
    uploaded_at: DataTypes.DATE,
  }, {
    tableName: 'property_videos',
    timestamps: false,
  });

  return PropertyVideo;
};
