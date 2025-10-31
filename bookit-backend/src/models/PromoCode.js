const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PromoCode = sequelize.define('PromoCode', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  discountType: {
    type: DataTypes.ENUM('percentage', 'fixed'),
    allowNull: false,
    field: 'discount_type'
  },
  discountValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'discount_value'
  },
  minBookingAmount: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'min_booking_amount'
  },
  maxUses: {
    type: DataTypes.INTEGER,
    field: 'max_uses'
  },
  timesUsed: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'times_used'
  },
  validFrom: {
    type: DataTypes.DATE,
    field: 'valid_from'
  },
  validUntil: {
    type: DataTypes.DATE,
    field: 'valid_until'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  tableName: 'promo_codes',
  timestamps: true,
  underscored: true
});

module.exports = PromoCode;
