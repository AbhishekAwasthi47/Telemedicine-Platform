const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  specialty: {
    type: String,
    required: true
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  // Doctor availability matrix can be complex, but for MVP keeping it simple
  availability: [{
    dayOfWeek: { type: Number, min: 0, max: 6 }, // 0 = Sunday, 6 = Saturday
    startTime: { type: String }, // e.g. '09:00'
    endTime: { type: String }    // e.g. '17:00'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Doctor', doctorSchema);
