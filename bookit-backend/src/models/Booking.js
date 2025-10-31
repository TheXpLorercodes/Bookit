const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  experienceId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'experience_id'
  },
  slotId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'slot_id'
  },
  numPeople: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'num_people'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'total_amount'
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    field: 'discount_amount'
  },
  finalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'final_amount'
  },
  promoCode: {
    type: DataTypes.STRING,
    field: 'promo_code'
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
    defaultValue: 'confirmed'
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'customer_name'
  },
  customerEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'customer_email'
  },
  customerPhone: {
    type: DataTypes.STRING,
    field: 'customer_phone'
  }
}, {
  tableName: 'bookings',
  timestamps: true,
  underscored: true
});

module.exports = Booking;
