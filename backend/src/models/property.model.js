export default (sequelize, DataTypes) => {
  const Property = sequelize.define("Property", {
    property_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: DataTypes.TEXT,
    address: DataTypes.STRING(255),
    city: DataTypes.STRING(100),
    province: DataTypes.STRING(100),
    country: DataTypes.STRING(100),
    contact_person: DataTypes.STRING(100),
    contact_number: DataTypes.STRING(20),
    email: DataTypes.STRING(100),
    max_occupancy: DataTypes.INTEGER,
    username: {
      type: DataTypes.STRING(100),
      unique: true,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("hut", "farm"),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: "properties",
    timestamps: false,
  });

  return Property;
};
