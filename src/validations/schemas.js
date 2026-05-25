const { z } = require('zod');

// Schema for creating an appointment
const appointmentSchema = z.object({
  body: z.object({
    doctorId: z.string({
      required_error: 'Doctor ID is required',
    }),
    patientId: z.string({
      required_error: 'Patient ID is required',
    }),
    startTime: z.string({
      required_error: 'Start time is required',
    }).datetime(),
    endTime: z.string({
      required_error: 'End time is required',
    }).datetime(),
  }).refine(data => new Date(data.startTime) < new Date(data.endTime), {
    message: 'End time must be after start time',
    path: ['endTime']
  })
});

// Schema for medical record
const medicalRecordSchema = z.object({
  body: z.object({
    patientId: z.string({ required_error: 'Patient ID is required' }),
    doctorId: z.string({ required_error: 'Doctor ID is required' }),
    appointmentId: z.string().optional(),
    diagnosis: z.string({ required_error: 'Diagnosis is required' }),
    clinicalNotes: z.string().optional(),
    allergies: z.string().optional(),
    vitalSigns: z.string().optional() // Assumes stringified JSON for now
  })
});

module.exports = {
  appointmentSchema,
  medicalRecordSchema
};
