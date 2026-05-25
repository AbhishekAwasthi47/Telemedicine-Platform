const express = require('express');
const router = express.Router();
const { bookAppointment, getDoctorAppointments } = require('../controllers/appointmentController');
const validate = require('../middleware/validateRequest');
const { appointmentSchema } = require('../validations/schemas');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/', authenticate, validate(appointmentSchema), bookAppointment);
router.get('/doctor/:doctorId', authenticate, getDoctorAppointments);

module.exports = router;
