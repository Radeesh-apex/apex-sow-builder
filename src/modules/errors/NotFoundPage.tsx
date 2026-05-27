import { Box, Typography, Button } from '@mui/material'
import SearchOffIcon from '@mui/icons-material/SearchOff'
import { useNavigate } from 'react-router-dom'
import { PATHS } from '@core/router/routePaths'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <Box sx={{ textAlign: 'center', py: 10 }}>
      <SearchOffIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
      <Typography variant="h2" fontWeight={700} color="text.disabled" mb={1}>404</Typography>
      <Typography variant="h5" mb={1}>Page not found</Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        The page you're looking for doesn't exist or has been moved.
      </Typography>
      <Button variant="contained" onClick={() => navigate(PATHS.home)}>
        Back to Home
      </Button>
    </Box>
  )
}
