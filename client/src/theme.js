import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#64ffda' },
    background: { default: '#0a1929', paper: '#112240' },
    text: { primary: '#ccd6f6', secondary: '#8892b0' },
  },
  typography: { fontFamily: 'Roboto, sans-serif', h4: { fontWeight: 700 }, h5: { fontWeight: 600 } },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600, borderRadius: '4px' } } },
    MuiCard: { styleOverrides: { root: { transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)' } } } },
    MuiAppBar: { styleOverrides: { root: { backgroundColor: 'rgba(17, 34, 64, 0.85)', backdropFilter: 'blur(8px)', color: '#ccd6f6' } } }
  },
});
export default theme;
