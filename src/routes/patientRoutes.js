const express = require('express');
const router = express.Router();
const { registerPatient, getPatientProfile } = require('../controllers/patientController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/', registerPatient);
router.get('/:id', authenticate, getPatientProfile);

module.exports = router;
