import { createTheme } from '@mui/material/styles'

export const corporateBlueTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { 
      main: '#3b4b61', // Your Apex corporate color token 
      light: '#534b75', 
      dark: '#2c3a4c', 
      contrastText: '#ffffff' 
    },
    secondary: { 
      main: '#648b6a' 
    },
    background: { 
      default: '#f8fafc', // Clean light gray canvas
      paper: '#ffffff'    // Solid white panels and cards
    },
    text: { 
      primary: '#1e293b',   
      secondary: '#64748b',
      disabled: '#94a3b8' 
    },
    divider: '#e2e8f0', 
  },
  typography: { 
    fontFamily: "'Inter', 'Roboto', sans-serif", 
    h1: { fontWeight: 700 }, h2: { fontWeight: 700 }, 
    h3: { fontWeight: 600 }, h4: { fontWeight: 600 }, 
    h5: { fontWeight: 600 }, h6: { fontWeight: 600 } 
  },
  shape: { borderRadius: 6 },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } } },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        }
      }
    }
  },
})