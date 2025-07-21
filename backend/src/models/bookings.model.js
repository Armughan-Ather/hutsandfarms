export default (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    booking_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_phone_number: DataTypes.STRING,
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    property_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    booking_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    shift_type: {
      type: DataTypes.ENUM('Day', 'Night', 'Full Day'),
      allowNull: false,
    },
    total_cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    booking_source: {
      type: DataTypes.ENUM('Website', 'WhatsApp Bot', 'Third-Party'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Confirmed', 'Cancelled', 'Completed'),
      defaultValue: 'Pending',
    },
    booked_at: DataTypes.DATE,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    tableName: 'bookings',
    timestamps: false,
  });

  return Booking;
};
