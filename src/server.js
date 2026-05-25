require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import middlewares
const { authenticate } = require('./middleware/authMiddleware');
const { auditLogPHI } = require('./middleware/auditMiddleware');

const app = express();

// Connect to Database
connectDB();

// Init Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Define Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'Platform API is running' });
});

// Example protected route with audit logging
app.get('/api/patient/:id/records', authenticate, auditLogPHI('READ_MEDICAL_RECORDS'), (req, res) => {
  // In a real application, the controller would fetch the medical records here.
  // The audit middleware will automatically log this access.
  res.json({ message: 'Medical records accessed successfully' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
