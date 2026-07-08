import { Box } from '@mui/material'
import VrmaCard from '@apex-ui/components/core-framework/VrmaCard'
import VrmaCheckbox from '@apex-ui/components/core-framework/VrmaCheckbox'
import VrmaSelect from '@apex-ui/components/core-framework/VrmaSelect'
import VrmaTextField from '@apex-ui/components/core-framework/VrmaTextField'
import VrmaAdvancedButton from '@apex-ui/components/core-framework/VrmaAdvancedButton'
import VrmaTypography from '@apex-ui/components/core-framework/VrmaTypography'
import { useI18n } from '@core/i18n'
import { useRegistration } from '../hooks/useRegistration'

const roleOptions = [
  { label: 'Project Manager', value: 'pm' },
  { label: 'Business Analyst', value: 'ba' },
  { label: 'Developer', value: 'dev' },
  { label: 'Designer', value: 'designer' },
]

const departmentOptions = [
  { label: 'Operations', value: 'ops' },
  { label: 'Finance', value: 'finance' },
  { label: 'Human Resources', value: 'hr' },
  { label: 'Technology', value: 'tech' },
]

export default function RegistrationPage() {
  const { t } = useI18n()
  const {
    fields, visibleErrors, feedbackMessage, isSubmitting, isFormValid,
    handleFieldChange, handleCheckboxChange, handleFieldBlur, handleSubmit, resetForm,
  } = useRegistration()

  return (
    <Box sx={{ maxWidth: 680, mx: 'auto', py: 4 }}>
      <VrmaCard elevation={4} borderRadius={4} backgroundColor="#ffffff" centerContent={false} sx={{ p: { xs: 2.5, sm: 4 } }}>
        <Box
          component="form"
          onSubmit={(e) => { e.preventDefault(); handleSubmit() }}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <VrmaTypography variant="h5" fontWeight={700} margin="0 0 4px">
            {t.registration.title}
          </VrmaTypography>
          <VrmaTypography variant="body2" color="#64748b" fontSize={14} margin="0 0 20px">
            {t.registration.subtitle}
          </VrmaTypography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, mb: 1 }}>
            <VrmaTextField
              label={t.registration.firstName}
              value={fields.firstName}
              onChange={(v) => { if (typeof v === 'string') handleFieldChange('firstName', v) }}
              onBlur={() => handleFieldBlur('firstName')}
              fullWidth size="medium" variant="outlined" labelSize={14} inputFontSize={14}
              error={Boolean(visibleErrors.firstName)} helperText={visibleErrors.firstName}
            />
            <VrmaTextField
              label={t.registration.lastName}
              value={fields.lastName}
              onChange={(v) => { if (typeof v === 'string') handleFieldChange('lastName', v) }}
              onBlur={() => handleFieldBlur('lastName')}
              fullWidth size="medium" variant="outlined" labelSize={14} inputFontSize={14}
              error={Boolean(visibleErrors.lastName)} helperText={visibleErrors.lastName}
            />
          </Box>

          <VrmaTextField
            label={t.registration.email}
            value={fields.email}
            onChange={(v) => { if (typeof v === 'string') handleFieldChange('email', v) }}
            onBlur={() => handleFieldBlur('email')}
            fullWidth size="medium" variant="outlined" labelSize={14} inputFontSize={14}
            type="email" sx={{ mb: 1 }}
            error={Boolean(visibleErrors.email)} helperText={visibleErrors.email}
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, mb: 1 }}>
            <VrmaTextField
              label={t.registration.password}
              value={fields.password}
              onChange={(v) => { if (typeof v === 'string') handleFieldChange('password', v) }}
              onBlur={() => handleFieldBlur('password')}
              fullWidth type="password" labelSize={14} inputFontSize={14}
              error={Boolean(visibleErrors.password)} helperText={visibleErrors.password}
            />
            <VrmaTextField
              label={t.registration.confirmPassword}
              value={fields.confirmPassword}
              onChange={(v) => { if (typeof v === 'string') handleFieldChange('confirmPassword', v) }}
              onBlur={() => handleFieldBlur('confirmPassword')}
              fullWidth type="password" labelSize={14} inputFontSize={14}
              error={Boolean(visibleErrors.confirmPassword)} helperText={visibleErrors.confirmPassword}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, mb: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <VrmaSelect
                label={t.registration.role} value={fields.role} options={roleOptions}
                onChange={(v) => handleFieldChange('role', String(v))}
                fullWidth width="100%" size="medium" labelSize={14}
              />
              {visibleErrors.role && (
                <VrmaTypography variant="caption" color="#b91c1c" sx={{ mt: 0.5 }}>{visibleErrors.role}</VrmaTypography>
              )}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <VrmaSelect
                label={t.registration.department} value={fields.department} options={departmentOptions}
                onChange={(v) => handleFieldChange('department', String(v))}
                fullWidth width="100%" size="medium" labelSize={14}
              />
              {visibleErrors.department && (
                <VrmaTypography variant="caption" color="#b91c1c" sx={{ mt: 0.5 }}>{visibleErrors.department}</VrmaTypography>
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
            <Box>
              <VrmaCheckbox
                label={t.registration.agreeTerms}
                checked={fields.agreeTerms}
                onChange={(v) => { if (typeof v === 'boolean') handleCheckboxChange('agreeTerms', v) }}
                size="small" customSize={18} labelSize={13} labelColor="#334155" labelPosition="right"
              />
              {visibleErrors.agreeTerms && (
                <VrmaTypography variant="caption" color="#b91c1c" sx={{ ml: 4, mt: 0.5 }}>
                  {visibleErrors.agreeTerms}
                </VrmaTypography>
              )}
            </Box>
            <VrmaCheckbox
              label={t.registration.subscribeUpdates}
              checked={fields.subscribeUpdates}
              onChange={(v) => { if (typeof v === 'boolean') handleCheckboxChange('subscribeUpdates', v) }}
              size="small" customSize={18} labelSize={13} labelColor="#334155" labelPosition="right"
            />
          </Box>

          {feedbackMessage && (
            <VrmaTypography
              variant="body2"
              color={isFormValid ? '#0f766e' : '#b91c1c'}
              fontSize={14}
              margin="0 0 12px"
            >
              {feedbackMessage}
            </VrmaTypography>
          )}

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mt: 1 }}>
            <VrmaAdvancedButton
              label={t.registration.createAccount}
              onClick={() => handleSubmit()}
              loadingText={t.registration.signingUp}
              disabled={isSubmitting}
              sx={{ flex: 1, minWidth: 160 }}
            />
            <VrmaAdvancedButton
              label={t.common.reset}
              onClick={resetForm}
              variant="outlined"
              color="inherit"
              sx={{ flex: 1, minWidth: 160, borderColor: '#cbd5e1' }}
            />
          </Box>
        </Box>
      </VrmaCard>
    </Box>
  )
}
