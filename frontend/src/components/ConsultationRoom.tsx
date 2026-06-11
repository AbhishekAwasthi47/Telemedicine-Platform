import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { Container, Typography, Box, Paper, Grid, Button } from '@mui/material';

// TODO: move this to a config file later!
const SOCKET_SERVER_URL = 'http://localhost:5000';

const ConsultationRoom: React.FC = () => {
  const { roomToken } = useParams<{ roomToken: string }>();
  const navigate = useNavigate();
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [callConnected, setCallConnected] = useState(false);
  const [error, setError] = useState('');

  const myVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const connectionRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    // Finally got this working after 3 hours! Need to make sure we ask for permissions.
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      })
      .catch((err) => {
        console.error("Error accessing media devices.", err);
        setError("Could not access camera/microphone. Please allow permissions.");
      });

    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    // I'm just gonna use a random string for userId for now lol
    const tempUserId = Math.random().toString(36).substring(7);

    if (roomToken) {
      newSocket.emit('join-room', roomToken, tempUserId);
    }

    newSocket.on('user-connected', (userId) => {
      console.log('User connected: ', userId);
      // Wait a sec before calling to make sure they are ready
      // Is this a race condition? Maybe. Ask senior dev later.
      setTimeout(() => {
        callUser(newSocket);
      }, 1000);
    });

    newSocket.on('offer', async (offer) => {
      console.log('Received offer');
      const peerConnection = createPeerConnection(newSocket);
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      newSocket.emit('answer', answer);
    });

    newSocket.on('answer', async (answer) => {
      console.log('Received answer');
      if (connectionRef.current) {
        await connectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        setCallConnected(true);
      }
    });

    newSocket.on('ice-candidate', async (candidate) => {
      if (connectionRef.current) {
        try {
          await connectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.error('Error adding ice candidate', e);
        }
      }
    });

    return () => {
      // cleanup! very important!
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (connectionRef.current) {
        connectionRef.current.close();
      }
      newSocket.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomToken]); // ignore stream warning

  const createPeerConnection = (currentSocket: Socket) => {
    // using google's public stun servers
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:global.stun.twilio.com:3478' }
      ]
    });

    connectionRef.current = peerConnection;

    if (stream) {
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });
    }

    peerConnection.ontrack = (event) => {
      console.log("Got remote track!", event.streams[0]);
      if (userVideo.current) {
        userVideo.current.srcObject = event.streams[0];
      }
      setCallConnected(true);
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        currentSocket.emit('ice-candidate', event.candidate);
      }
    };

    return peerConnection;
  };

  const callUser = async (currentSocket: Socket) => {
    console.log("Calling user...");
    const peerConnection = createPeerConnection(currentSocket);
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    currentSocket.emit('offer', offer);
  };

  const leaveCall = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom align="center">
        Secure Telehealth Consultation
      </Typography>
      
      {error && (
        <Box p={2} mb={2} bgcolor="error.light" color="error.contrastText" borderRadius={1}>
          {error}
        </Box>
      )}

      <Grid container spacing={3} justifyContent="center">
        {/* My Video */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center', backgroundColor: '#fafafa' }}>
            <Typography variant="h6">You</Typography>
            <video playsInline muted ref={myVideo} autoPlay style={{ width: '100%', borderRadius: '8px' }} />
          </Paper>
        </Grid>

        {/* Remote Video */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center', backgroundColor: '#e0f7fa' }}>
            <Typography variant="h6">Partner</Typography>
            {/* If not connected, show a placeholder */}
            <video playsInline ref={userVideo} autoPlay style={{ width: '100%', borderRadius: '8px', display: callConnected ? 'block' : 'none' }} />
            {!callConnected && (
              <Box sx={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="textSecondary">Waiting for someone to join...</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Box textAlign="center" mt={4}>
        <Button variant="contained" color="error" size="large" onClick={leaveCall}>
          End Call
        </Button>
      </Box>
      
      <Box mt={2} textAlign="center">
         <Typography variant="caption" color="textSecondary">Room Token: {roomToken}</Typography>
      </Box>
    </Container>
  );
};

export default ConsultationRoom;
