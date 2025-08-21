import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Message = sequelize.define('Message', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    sender: {
      type: DataTypes.STRING,
    },
    content: {
      type: DataTypes.TEXT,
    },
    timestamp: {
      type: DataTypes.DATE,
    },
    whatsapp_message_id: {
      type: DataTypes.STRING,
    },
    query_embedding: {
      type: 'vector', // Custom type to match database's vector type
    },
  }, {
    tableName: 'messages',
    timestamps: false,
  });

  return Message;
};