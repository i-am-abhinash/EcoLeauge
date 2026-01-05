import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import Confetti from 'react-confetti';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box } from '@mui/material';

function LeaderboardPage() {
  const [players, setPlayers] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const location = useLocation();

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/leaderboard');
      setPlayers(response.data);
    } catch (error) { console.error("Failed to fetch leaderboard:", error); }
  };

  useEffect(() => {
    fetchLeaderboard();
    window.addEventListener('profileUpdated', fetchLeaderboard);
    return () => {
      window.removeEventListener('profileUpdated', fetchLeaderboard);
    };
  }, []);

  // New useEffect to check for the 'celebrate' flag
  useEffect(() => {
    if (location.state?.celebrate) {
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000); // Stop after 5 seconds
    }
  }, [location.state]);

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 6, mb: 4 }}>
      {showConfetti && <Confetti />}

      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4, color: 'text.primary' }}>
        Top Players
      </Typography>
      
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Button
          variant="outlined"
          color="primary"
          component={Link}
          to="/"
        >
          Back to Dashboard
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ bgcolor: 'background.paper', border: '1px solid #233554' }}>
        <Table aria-label="leaderboard table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Rank</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Username</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>School/College</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', color: 'primary.main' }}>Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {players.map((player, index) => (
              <TableRow key={player.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                  {index + 1}
                </TableCell>
                <TableCell>{player.username}</TableCell>
                <TableCell>{player.school}</TableCell>
                <TableCell align="right">{player.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
export default LeaderboardPage;