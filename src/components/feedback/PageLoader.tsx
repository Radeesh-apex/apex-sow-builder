import { Box, CircularProgress, Typography } from '@mui/material'

interface PageLoaderProps {
  message?: string
}

export function PageLoader({ message }: PageLoaderProps) {
  return (
    <Box sx={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
      <CircularProgress size={40} />
      {message && <Typography variant="body2" color="text.secondary">{message}</Typography>}
    </Box>
  )
}
