require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require('http'); // Added for socket.io
const { Server } = require('socket.io'); // Added for socket.io

// Import middlewares
const { authenticate } = require('./middleware/authMiddleware');
const { auditLogPHI } = require('./middleware/auditMiddleware');

const app = express();
const server = http.createServer(app); // Wrap express app in http server
const io = new Server(server, {
  cors: {
    origin: '*', // TODO: restrict this later before prod!
    methods: ['GET', 'POST']
  }
});

// Connect to Database
connectDB();

// Init Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/medical-records', require('./routes/medicalRecordRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/prescriptions', require('./routes/prescriptionRoutes'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'Platform API is running' });
});

// --- WebRTC Signaling Logic (Week 3) ---
io.on('connection', (socket) => {
  console.log('A user connected via socket:', socket.id); // debugging

  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    console.log(`User ${userId} joined room ${roomId}`);
    // Broadcast to everyone else in the room that a user connected
    socket.to(roomId).emit('user-connected', userId);

    // Handle SDP offer
    socket.on('offer', (offer) => {
      // console.log('received offer, sending it back to room'); // commented out, was too spammy
      socket.to(roomId).emit('offer', offer);
    });

    // Handle SDP answer
    socket.on('answer', (answer) => {
      socket.to(roomId).emit('answer', answer);
    });

    // Handle ICE candidates
    socket.on('ice-candidate', (candidate) => {
      socket.to(roomId).emit('ice-candidate', candidate);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected from room ${roomId}`);
      socket.to(roomId).emit('user-disconnected', userId);
    });
  });
});

const PORT = process.env.PORT || 5000;

// IMPORTANT: Listen on server, not app, so socket.io works!
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

