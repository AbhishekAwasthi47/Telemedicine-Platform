const mongoose = require('mongoose');
const { encrypt, decrypt } = require('../utils/cryptoUtils');

const patientSchema = new mongoose.Schema({
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
  // Protected Health Information (PHI) encrypted at rest
  ssn: {
    type: String,
    get: decrypt,
    set: encrypt
  },
  dateOfBirth: {
    type: String,
    get: decrypt,
    set: encrypt
  },
  contactNumber: {
    type: String,
    get: decrypt,
    set: encrypt
  },
  address: {
    type: String,
    get: decrypt,
    set: encrypt
  }
}, {
  timestamps: true,
  toJSON: { getters: true }, // Ensure getters run when converting to JSON
  toObject: { getters: true }
});

module.exports = mongoose.model('Patient', patientSchema);
