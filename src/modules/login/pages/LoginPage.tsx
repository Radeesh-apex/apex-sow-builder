import { useNavigate } from 'react-router-dom'
import { Box, Link as MuiLink } from '@mui/material'
import VrmaCard from '@apex-ui/components/core-framework/VrmaCard'
import VrmaTextField from '@apex-ui/components/core-framework/VrmaTextField'
import VrmaAdvancedButton from '@apex-ui/components/core-framework/VrmaAdvancedButton'
import VrmaTypography from '@apex-ui/components/core-framework/VrmaTypography'
import { useI18n } from '@core/i18n'
import { PATHS } from '@core/router/routePaths'
import { useLogin } from '../hooks/useLogin'

export default function LoginPage() {
  const navigate = useNavigate()
  const { t } = useI18n()
  const { fields, visibleErrors, isSubmitting, handleChange, handleBlur, handleSubmit } =
    useLogin(() => navigate(PATHS.home))

  return (
    <Box
      sx={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        px: 2,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 440 }}>
        <VrmaCard elevation={4} borderRadius={4} backgroundColor="#ffffff" centerContent={false} sx={{ p: { xs: 3, sm: 4 } }}>
          <Box
            component="form"
            onSubmit={(e) => { e.preventDefault(); handleSubmit() }}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
          >
            <Box sx={{ textAlign: 'center', mb: 1 }}>
              <VrmaTypography variant="h5" fontWeight={700} margin="0 0 6px">
                {t.login.title}
              </VrmaTypography>
              <VrmaTypography variant="body2" color="#64748b" fontSize={14} margin="0">
                {t.login.subtitle}
              </VrmaTypography>
            </Box>

            {visibleErrors.general && (
              <Box sx={{ bgcolor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 1.5, px: 2, py: 1.5 }}>
                <VrmaTypography variant="body2" color="#b91c1c" fontSize={13} margin="0">
                  {t.login.invalidCredentials}
                </VrmaTypography>
              </Box>
            )}

            <VrmaTextField
              label={t.login.email}
              type="email"
              value={fields.email}
              onChange={(v) => { if (typeof v === 'string') handleChange('email', v) }}
              onBlur={() => handleBlur('email')}
              fullWidth size="medium" variant="outlined" labelSize={14} inputFontSize={14}
              error={Boolean(visibleErrors.email)} helperText={visibleErrors.email}
            />

            <VrmaTextField
              label={t.login.password}
              type="password"
              value={fields.password}
              onChange={(v) => { if (typeof v === 'string') handleChange('password', v) }}
              onBlur={() => handleBlur('password')}
              fullWidth size="medium" variant="outlined" labelSize={14} inputFontSize={14}
              error={Boolean(visibleErrors.password)} helperText={visibleErrors.password}
            />

            <VrmaAdvancedButton
              label={t.login.signIn}
              onClick={handleSubmit}
              loadingText={t.login.signingIn}
              disabled={isSubmitting}
              sx={{ mt: 0.5 }}
            />

            <Box sx={{ textAlign: 'center', mt: 0.5 }}>
              <VrmaTypography variant="body2" color="#64748b" fontSize={13} margin="0">
                {t.login.noAccount}{' '}
                <MuiLink
                  component="button"
                  type="button"
                  onClick={() => navigate(PATHS.registration)}
                  underline="hover"
                  sx={{ color: 'primary.main', fontWeight: 600, cursor: 'pointer' }}
                >
                  {t.login.createOne}
                </MuiLink>
              </VrmaTypography>
            </Box>
          </Box>
        </VrmaCard>
      </Box>
    </Box>
  )
}
