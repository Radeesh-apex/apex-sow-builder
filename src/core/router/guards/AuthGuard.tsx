import { Navigate, useLocation } from 'react-router-dom'
import { tokenService } from '@core/http'
import { PATHS } from '../routePaths'

interface AuthGuardProps {
  children: React.ReactNode
}

// Wrap protected routes with <AuthGuard> to redirect unauthenticated users.
export function AuthGuard({ children }: AuthGuardProps) {
  const location = useLocation()

  if (!tokenService.isAuthenticated()) {
    return <Navigate to={PATHS.notFound} state={{ from: location }} replace />
  }

  return <>{children}</>
}
