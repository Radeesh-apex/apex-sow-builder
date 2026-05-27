import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Box, Typography, Button, Paper } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { logger } from '@core/http'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    logger.error('Uncaught error in component tree', { error: error.message, stack: info.componentStack })
  }

  handleReset = () => this.setState({ hasError: false, error: null })

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
          <Paper sx={{ p: 4, maxWidth: 480, textAlign: 'center' }}>
            <ErrorOutlineIcon sx={{ fontSize: 56, color: 'error.main', mb: 2 }} />
            <Typography variant="h6" mb={1}>Something went wrong</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              {this.state.error?.message ?? 'An unexpected error occurred.'}
            </Typography>
            <Button variant="contained" onClick={this.handleReset}>Try again</Button>
          </Paper>
        </Box>
      )
    }
    return this.props.children
  }
}
