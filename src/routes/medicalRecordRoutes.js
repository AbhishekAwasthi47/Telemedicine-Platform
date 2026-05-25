const express = require('express');
const router = express.Router();
const { createMedicalRecord, getPatientRecords } = require('../controllers/medicalRecordController');
const validate = require('../middleware/validateRequest');
const { medicalRecordSchema } = require('../validations/schemas');
const { authenticate } = require('../middleware/authMiddleware');
const { auditLogPHI } = require('../middleware/auditMiddleware');

// Using Zod validation and Audit Logging middleware to protect these routes
router.post('/', authenticate, validate(medicalRecordSchema), auditLogPHI('CREATE_MEDICAL_RECORD'), createMedicalRecord);
router.get('/patient/:patientId', authenticate, auditLogPHI('READ_PATIENT_MEDICAL_RECORDS'), getPatientRecords);

module.exports = router;
