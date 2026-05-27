import { createTheme } from '@mui/material/styles'

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#90caf9' },
    secondary: { main: '#ce93d8' },
    background: { default: '#0f172a', paper: '#1e293b' },
    text: { primary: '#e2e8f0', secondary: '#c7d1df' },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
    h1: { fontWeight: 700 }, h2: { fontWeight: 700 },
    h3: { fontWeight: 600 }, h4: { fontWeight: 600 },
    h5: { fontWeight: 600 }, h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 6 },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
  },
})