// export default (sequelize, DataTypes) => {
//   const PropertyVideo = sequelize.define('PropertyVideo', {
//     video_id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//     },
//     property_id: {
//       type: DataTypes.UUID,
//       allowNull: false,
//     },
//     video_url: DataTypes.TEXT,
//     uploaded_at: DataTypes.DATE,
//   }, {
//     tableName: 'property_videos',
//     timestamps: false,
//   });

//   return PropertyVideo;
// };

import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const PropertyVideo = sequelize.define('PropertyVideo', {
    video_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    property_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    video_url: {
      type: DataTypes.TEXT,
    },
    uploaded_at: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'property_videos',
    timestamps: false,
  });

  return PropertyVideo;
};