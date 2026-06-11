import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Paper, Grid } from '@mui/material';
import axios from 'axios';
import ConsultationRoom from './components/ConsultationRoom';

function Home() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const defaultDateTime = now.toISOString().slice(0, 16);

  const [doctorId, setDoctorId] = useState('');
  const [patientId, setPatientId] = useState('');
  const [startTime, setStartTime] = useState(defaultDateTime);
  const [endTime, setEndTime] = useState(defaultDateTime);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/appointments', {
        doctorId,
        patientId,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
      }, {
        headers: {
          Authorization: 'Bearer dummy-token'
        }
      });
      setMessage(response.data.message + ' (Room Token: ' + response.data.roomToken + ')');
      // Intern: Automatically go to the room for testing so I don't have to copy-paste it
      setTimeout(() => {
         navigate(`/room/${response.data.roomToken}`);
      }, 2000);
    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(err.response.data.error + ': ' + (err.response.data.message || ''));
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h3" align="center" gutterBottom>
        Telemedicine EHR Platform
      </Typography>
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Smart Scheduling Engine
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Book a secure teleconsultation. The system will algorithmically detect and prevent double-booking.
        </Typography>
        
        <Box component="form" onSubmit={handleBooking}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField 
                label="Doctor ID" 
                fullWidth 
                required 
                value={doctorId} 
                onChange={(e) => setDoctorId(e.target.value)} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                label="Patient ID" 
                fullWidth 
                required 
                value={patientId} 
                onChange={(e) => setPatientId(e.target.value)} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                label="Start Time" 
                type="datetime-local" 
                fullWidth 
                required 
                InputLabelProps={{ shrink: true }}
                value={startTime} 
                onChange={(e) => setStartTime(e.target.value)} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                label="End Time" 
                type="datetime-local" 
                fullWidth 
                required 
                InputLabelProps={{ shrink: true }}
                value={endTime} 
                onChange={(e) => setEndTime(e.target.value)} 
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth size="large">
                Check Availability & Book
              </Button>
            </Grid>
          </Grid>
        </Box>

        {message && (
          <Box mt={3} p={2} bgcolor="success.light" color="success.contrastText" borderRadius={1}>
            <Typography>{message}</Typography>
          </Box>
        )}
        {error && (
          <Box mt={3} p={2} bgcolor="error.light" color="error.contrastText" borderRadius={1}>
            <Typography>{error}</Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomToken" element={<ConsultationRoom />} />
      </Routes>
    </Router>
  );
}

export default App;

