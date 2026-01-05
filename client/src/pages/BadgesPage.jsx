import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Typography, Paper, Box, Chip } from '@mui/material';

function BadgesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 6, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4, color: 'text.primary' }}>
        My Badges
      </Typography>
      <Paper elevation={0} sx={{ p: 4, bgcolor: 'background.paper', border: '1px solid #233554', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
          {user.badges && user.badges.length > 0 ? (
            user.badges.map(badge => (
              <Chip key={badge} label={badge} color="primary" sx={{ fontSize: '1.1rem', fontWeight: 'bold', p: 3 }} />
            ))
          ) : (
            <Typography sx={{ color: 'text.secondary' }}>
              You haven't earned any badges yet. Complete a challenge to get your first one!
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

export default BadgesPage;