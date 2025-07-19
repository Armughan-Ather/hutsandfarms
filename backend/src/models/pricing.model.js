export default (sequelize, DataTypes) => {
  const PropertyPricing = sequelize.define('PropertyPricing', {
    pricing_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    property_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    base_price_day_shift: DataTypes.DECIMAL(10, 2),
    base_price_night_shift: DataTypes.DECIMAL(10, 2),
    base_price_full_day: DataTypes.DECIMAL(10, 2),
    season_start_date: DataTypes.DATE,
    season_end_date: DataTypes.DATE,
    special_offer_note: DataTypes.TEXT,
  }, {
    tableName: 'property_pricing',
    timestamps: false,
  });

  return PropertyPricing;
};
