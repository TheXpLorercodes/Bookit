const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Experience = sequelize.define('Experience', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  location: {
    type: DataTypes.STRING
  },
  category: {
    type: DataTypes.STRING
  },
  pricePerPerson: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'price_per_person'
  },
  duration: {
    type: DataTypes.STRING
  },
  maxCapacity: {
    type: DataTypes.INTEGER,
    field: 'max_capacity'
  },
  imageUrl: {
    type: DataTypes.TEXT,
    field: 'image_url'
  }
}, {
  tableName: 'experiences',
  timestamps: true,
  underscored: true
});

module.exports = Experience;
