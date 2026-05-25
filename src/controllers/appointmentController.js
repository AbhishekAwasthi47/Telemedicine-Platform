const Appointment = require('../models/Appointment');
const crypto = require('crypto');

// @route   POST /api/appointments
// @desc    Book a new appointment using the Smart Scheduling Engine
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, patientId, startTime, endTime } = req.body;
    
    const start = new Date(startTime);
    const end = new Date(endTime);

    // 1. Algorithmic Collision Detection
    // Check if the doctor has any overlapping appointments
    const overlappingAppointments = await Appointment.find({
      doctorId,
      status: { $ne: 'CANCELLED' },
      $or: [
        // Case 1: Existing appointment starts inside the new time interval
        { startTime: { $gte: start, $lt: end } },
        // Case 2: Existing appointment ends inside the new time interval
        { endTime: { $gt: start, $lte: end } },
        // Case 3: Existing appointment completely encompasses the new time interval
        { startTime: { $lte: start }, endTime: { $gte: end } }
      ]
    });

    if (overlappingAppointments.length > 0) {
      return res.status(409).json({ 
        error: 'Scheduling Conflict', 
        message: 'The requested time slot overlaps with an existing appointment for this doctor.' 
      });
    }

    // 2. Generate cryptographically secure room token for WebRTC
    const roomToken = crypto.randomBytes(32).toString('hex');

    // 3. Confirm appointment
    const appointment = new Appointment({
      doctorId,
      patientId,
      startTime: start,
      endTime: end,
      roomToken,
      status: 'SCHEDULED'
    });

    await appointment.save();
    res.status(201).json({ 
      message: 'Appointment booked successfully', 
      appointmentId: appointment._id,
      roomToken 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @route   GET /api/appointments/doctor/:doctorId
// @desc    Get all appointments for a doctor
const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.params.doctorId }).sort({ startTime: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  bookAppointment,
  getDoctorAppointments
};
