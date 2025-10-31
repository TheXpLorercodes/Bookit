const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TimeSlot = sequelize.define('TimeSlot', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  experienceId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'experience_id',
    references: {
      model: 'experiences',
      key: 'id'
    }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false,
    field: 'start_time'
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false,
    field: 'end_time'
  },
  availableSpots: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'available_spots'
  },
  totalSpots: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'total_spots'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  tableName: 'time_slots',
  timestamps: true,
  underscored: true,
  updatedAt: false
});

module.exports = TimeSlot;
