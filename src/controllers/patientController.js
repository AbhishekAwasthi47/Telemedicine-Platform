const Patient = require('../models/Patient');

// @route   POST /api/patients
// @desc    Register a new patient
const registerPatient = async (req, res) => {
  try {
    const { userId, firstName, lastName, email, passwordHash, ssn, dateOfBirth, contactNumber, address } = req.body;
    
    // Check if patient already exists
    let patient = await Patient.findOne({ email });
    if (patient) {
      return res.status(400).json({ error: 'Patient already exists' });
    }

    patient = new Patient({
      userId,
      firstName,
      lastName,
      email,
      passwordHash,
      ssn,
      dateOfBirth,
      contactNumber,
      address
    });

    await patient.save();
    res.status(201).json({ message: 'Patient registered successfully', patientId: patient._id });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @route   GET /api/patients/:id
// @desc    Get patient profile
const getPatientProfile = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).select('-passwordHash');
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  registerPatient,
  getPatientProfile
};
