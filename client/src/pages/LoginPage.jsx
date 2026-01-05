import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Container, Box, Typography, TextField, Button, Alert, Paper } from '@mui/material';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/users/login', { email, password },{ headers: { 'Content-Type': 'application/json' }});

      // Save token
      if (response.data?.token) localStorage.setItem('token', response.data.token);

      login(response.data);
      navigate('/');
    } catch (err) {
      const detail = err.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(detail[0]?.msg || "Invalid input");
      } else if (typeof detail === "string") {
        setError(detail);
      } else {
        setError("Login failed");
      }

    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ display: 'flex', alignItems: 'center', height: '100vh' }}>
      <Paper 
        elevation={3}
        sx={{
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'rgba(17, 34, 64, 0.85)',
          backdropFilter: 'blur(10px)',
          border: '1px solid #233554',
          borderRadius: 2,
        }}
      >
        <Typography component="h1" variant="h5" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          EcoLeauge Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal" required fullWidth
            id="email" label="Email Address" name="email"
            autoComplete="email" autoFocus
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal" required fullWidth
            name="password" label="Password" type="password"
            id="password" autoComplete="current-password"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          {error && <Alert severity="error" sx={{ width: '100%', mt: 1 }}>{error}</Alert>}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
          <Link to="/register" style={{ color: '#64ffda', display: 'block', textAlign: 'center', marginTop: '10px' }}>
            {"Don't have an account? Sign Up"}
          </Link>
        </Box>
      </Paper>
    </Container>
  );
}

export default LoginPage;
