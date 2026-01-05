import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem } from '@mui/material';

function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleLevelClick = (level) => {
      navigate(`/levels/${level}`);
      handleClose();
    };

    if (!user) return null;

    return (
        <AppBar
            position="sticky"
            sx={{
                bgcolor: 'background.paper',
                boxShadow: 'none',
                borderBottom: '1px solid #233554',
            }}
        >
            <Toolbar>
                <Typography
                    variant="h6"
                    component={Link}
                    to="/"
                    sx={{
                        textDecoration: 'none',
                        color: 'primary.main',
                        fontWeight: 700,
                    }}
                >
                    <h1><strong>EcoLeauge</strong></h1>
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        {user.username || user.name}  <strong>{user.points || 0} Points</strong>
                    </Typography>

                    <Button
                      id="levels-button"
                      aria-controls={open ? 'levels-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                      onClick={handleClick}
                      sx={{ color: 'text.primary' }}
                    >
                      Levels
                    </Button>
                    <Menu
                      id="levels-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      MenuListProps={{
                        'aria-labelledby': 'levels-button',
                      }}
                    >
                      <MenuItem onClick={() => handleLevelClick('basic')}>Basic</MenuItem>
                      <MenuItem onClick={() => handleLevelClick('intermediate')}>Intermediate</MenuItem>
                      <MenuItem onClick={() => handleLevelClick('advanced')}>Advanced</MenuItem>
                    </Menu>

                    <Button component={Link} to="/badges" sx={{ color: 'text.primary' }}>
                        My Badges
                    </Button>
                    <Button component={Link} to="/leaderboard" sx={{ color: 'text.primary' }}>
                        Leaderboard
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                            logout();
                            navigate('/login');
                        }}
                    >
                        Logout
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;