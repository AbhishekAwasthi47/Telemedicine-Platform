const express = require('express');
const router = express.Router();
const { registerDoctor, getDoctorProfile } = require('../controllers/doctorController');

router.post('/', registerDoctor);
router.get('/:id', getDoctorProfile);

module.exports = router;
