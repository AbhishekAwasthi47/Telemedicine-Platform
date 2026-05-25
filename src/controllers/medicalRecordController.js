const MedicalRecord = require('../models/MedicalRecord');

// @route   POST /api/medical-records
// @desc    Create a new medical record
const createMedicalRecord = async (req, res) => {
  try {
    const { patientId, doctorId, appointmentId, diagnosis, clinicalNotes, allergies, vitalSigns } = req.body;
    
    const record = new MedicalRecord({
      patientId,
      doctorId,
      appointmentId,
      diagnosis,
      clinicalNotes,
      allergies,
      vitalSigns
    });

    await record.save();
    res.status(201).json({ message: 'Medical record created successfully', recordId: record._id });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @route   GET /api/medical-records/:patientId
// @desc    Get all medical records for a patient
const getPatientRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patientId: req.params.patientId });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  createMedicalRecord,
  getPatientRecords
};
