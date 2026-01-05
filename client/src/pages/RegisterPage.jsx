import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Box, Typography, TextField, Button, Alert, Paper } from '@mui/material';

function RegisterPage() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [school, setSchool] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    const formData = { name, username, email, password, school };

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/users/register', formData);
      if (response.status === 200 || response.status === 201) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 1500); // redirect after short delay
      }
    } catch (err) {
      setError(err.response?.data?.detail || "An unknown error occurred.");
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
          backgroundColor: 'rgba(17, 34, 64, 0.75)',
          backdropFilter: 'blur(10px)',
          border: '1px solid #233554',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          Create Account
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <TextField margin="dense" required fullWidth label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField margin="dense" required fullWidth label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <TextField margin="dense" required fullWidth label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField margin="dense" required fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <TextField margin="dense" required fullWidth label="School / College" value={school} onChange={(e) => setSchool(e.target.value)} />
          
          {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ width: '100%', mt: 2 }}>{success}</Alert>}
          
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign Up
          </Button>
          <Typography variant="body2" align="center">
            <Link to="/login" style={{ color: '#64ffda', textDecoration: 'none' }}>
              Already have an account? Sign In
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default RegisterPage;
