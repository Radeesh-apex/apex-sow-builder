import { AppThemeProvider } from '@core/theme'
import { I18nProvider } from '@core/i18n'
import { AuthProvider } from '@core/auth'
import { AppRoutes } from '@core/router'

export default function App() {
  return (
    <AppThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </I18nProvider>
    </AppThemeProvider>
  )
}
