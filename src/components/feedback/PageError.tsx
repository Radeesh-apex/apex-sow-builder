import { Box, Typography, Button, Paper } from '@mui/material'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import type { ApiError } from '@core/http'

interface PageErrorProps {
  error: ApiError | Error | string | null
  onRetry?: () => void
}

export function PageError({ error, onRetry }: PageErrorProps) {
  const message = typeof error === 'string' ? error : error?.message ?? 'Something went wrong.'

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
      <Paper sx={{ p: 4, maxWidth: 440, textAlign: 'center' }}>
        <WarningAmberIcon sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
        <Typography variant="h6" mb={1}>Could not load data</Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>{message}</Typography>
        {onRetry && (
          <Button variant="outlined" onClick={onRetry}>Retry</Button>
        )}
      </Paper>
    </Box>
  )
}
