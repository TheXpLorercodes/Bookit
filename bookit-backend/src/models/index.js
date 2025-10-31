const Experience = require('./Experience');
const TimeSlot = require('./TimeSlot');
const Booking = require('./Booking');
const PromoCode = require('./PromoCode');

// Associations
Experience.hasMany(TimeSlot, {
  foreignKey: 'experience_id',
  as: 'slots',
  onDelete: 'CASCADE'
});

TimeSlot.belongsTo(Experience, {
  foreignKey: 'experience_id',
  as: 'experience'
});

Booking.belongsTo(Experience, {
  foreignKey: 'experience_id',
  as: 'experience'
});

Booking.belongsTo(TimeSlot, {
  foreignKey: 'slot_id',
  as: 'slot'
});

module.exports = {
  Experience,
  TimeSlot,
  Booking,
  PromoCode
};
