const express = require('express');
const router = express.Router();
const { generatePrescription } = require('../controllers/prescriptionController');
// const { authenticate } = require('../middleware/authMiddleware'); 
// TODO: Put back authenticate middleware after testing!

router.post('/generate', generatePrescription);

module.exports = router;
