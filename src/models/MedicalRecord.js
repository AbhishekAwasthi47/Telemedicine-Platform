const mongoose = require('mongoose');
const { encrypt, decrypt } = require('../utils/cryptoUtils');

const medicalRecordSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  // Highly sensitive PHI fields
  diagnosis: {
    type: String,
    get: decrypt,
    set: encrypt,
    required: true
  },
  clinicalNotes: {
    type: String,
    get: decrypt,
    set: encrypt
  },
  allergies: {
    type: String,
    get: decrypt,
    set: encrypt
  },
  vitalSigns: {
    type: String, // E.g., JSON stringified object, encrypted
    get: decrypt,
    set: encrypt
  }
}, {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
