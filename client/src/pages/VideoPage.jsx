import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, Paper, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const getEmbedUrl = (url) => {
  const id = url.split("youtu.be/")[1]?.split("?")[0];
  return `https://www.youtube.com/embed/${id}`;
};


const VIDEO_URL = 'https://youtu.be/K6ppCC3lboU?si=r2dEhgC2Qe1WX2Xm';
const EMBED_URL = getEmbedUrl(VIDEO_URL);

function VideoPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [isContinueEnabled, setIsContinueEnabled] = useState(false);
  const [timeLeftToEnable, setTimeLeftToEnable] = useState(60);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    let timerInterval;
    const hasWatchedVideo = localStorage.getItem('hasWatchedVideo');

    if (hasWatchedVideo) {
      setIsContinueEnabled(true);
    } else {
      timerInterval = setInterval(() => {
        setTimeLeftToEnable((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerInterval);
            setIsContinueEnabled(true);
            localStorage.setItem('hasWatchedVideo', 'true');
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerInterval);
  }, []);

  const handleContinue = () => {
    navigate('/path/waste-management');
  };

  if (loading || !user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 6, mb: 4, textAlign: 'center' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'text.primary' }}>
        Lecture Video: Waste Management
      </Typography>

      <Paper elevation={3} sx={{
        position: 'relative',
        paddingTop: '56.25%',
        overflow: 'hidden',
        mb: 2,
        bgcolor: 'background.default'
      }}>
        <iframe
          src={EMBED_URL}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        ></iframe>
      </Paper>
      
      <Button 
        variant="contained" 
        color="primary" 
        size="large" 
        onClick={handleContinue}
        sx={{ mr: 2 }}
        disabled={!isContinueEnabled}
      >
        {isContinueEnabled ? 'Continue to Levels' : `Please wait... (${timeLeftToEnable}s)`}
      </Button>
      <Typography sx={{ mt: 2, color: 'text.secondary' }}>
        {isContinueEnabled ? "" : "You must watch the video for at least one minute to continue."}
      </Typography>
    </Container>
  );
}

export default VideoPage;