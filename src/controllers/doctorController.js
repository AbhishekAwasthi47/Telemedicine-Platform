const Doctor = require('../models/Doctor');

// @route   POST /api/doctors
// @desc    Register a new doctor
const registerDoctor = async (req, res) => {
  try {
    const { userId, firstName, lastName, email, passwordHash, specialty, licenseNumber } = req.body;
    
    let doctor = await Doctor.findOne({ email });
    if (doctor) {
      return res.status(400).json({ error: 'Doctor already exists' });
    }

    doctor = new Doctor({
      userId,
      firstName,
      lastName,
      email,
      passwordHash,
      specialty,
      licenseNumber
    });

    await doctor.save();
    res.status(201).json({ message: 'Doctor registered successfully', doctorId: doctor._id });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @route   GET /api/doctors/:id
// @desc    Get doctor profile
const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select('-passwordHash');
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  registerDoctor,
  getDoctorProfile
};
