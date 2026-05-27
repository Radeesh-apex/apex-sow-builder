import { Box } from '@mui/material'
import ApexCard from '@apex-ui/components/core-framework/ApexCard'
import ApexCheckbox from '@apex-ui/components/core-framework/ApexCheckbox'
import ApexSelect from '@apex-ui/components/core-framework/ApexSelect'
import ApexTextField from '@apex-ui/components/core-framework/ApexTextField'
import ApexAdvancedButton from '@apex-ui/components/core-framework/ApexAdvancedButton'
import ApexTypography from '@apex-ui/components/core-framework/ApexTypography'
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
      <ApexCard elevation={4} borderRadius={4} backgroundColor="#ffffff" centerContent={false} sx={{ p: { xs: 2.5, sm: 4 } }}>
        <Box
          component="form"
          onSubmit={(e) => { e.preventDefault(); handleSubmit() }}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <ApexTypography variant="h5" fontWeight={700} margin="0 0 4px">
            {t.registration.title}
          </ApexTypography>
          <ApexTypography variant="body2" color="#64748b" fontSize={14} margin="0 0 20px">
            {t.registration.subtitle}
          </ApexTypography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, mb: 1 }}>
            <ApexTextField
              label={t.registration.firstName}
              value={fields.firstName}
              onChange={(v) => { if (typeof v === 'string') handleFieldChange('firstName', v) }}
              onBlur={() => handleFieldBlur('firstName')}
              fullWidth size="medium" variant="outlined" labelSize={14} inputFontSize={14}
              error={Boolean(visibleErrors.firstName)} helperText={visibleErrors.firstName}
            />
            <ApexTextField
              label={t.registration.lastName}
              value={fields.lastName}
              onChange={(v) => { if (typeof v === 'string') handleFieldChange('lastName', v) }}
              onBlur={() => handleFieldBlur('lastName')}
              fullWidth size="medium" variant="outlined" labelSize={14} inputFontSize={14}
              error={Boolean(visibleErrors.lastName)} helperText={visibleErrors.lastName}
            />
          </Box>

          <ApexTextField
            label={t.registration.email}
            value={fields.email}
            onChange={(v) => { if (typeof v === 'string') handleFieldChange('email', v) }}
            onBlur={() => handleFieldBlur('email')}
            fullWidth size="medium" variant="outlined" labelSize={14} inputFontSize={14}
            type="email" sx={{ mb: 1 }}
            error={Boolean(visibleErrors.email)} helperText={visibleErrors.email}
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, mb: 1 }}>
            <ApexTextField
              label={t.registration.password}
              value={fields.password}
              onChange={(v) => { if (typeof v === 'string') handleFieldChange('password', v) }}
              onBlur={() => handleFieldBlur('password')}
              fullWidth type="password" labelSize={14} inputFontSize={14}
              error={Boolean(visibleErrors.password)} helperText={visibleErrors.password}
            />
            <ApexTextField
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
              <ApexSelect
                label={t.registration.role} value={fields.role} options={roleOptions}
                onChange={(v) => handleFieldChange('role', String(v))}
                fullWidth width="100%" size="medium" labelSize={14}
              />
              {visibleErrors.role && (
                <ApexTypography variant="caption" color="#b91c1c" sx={{ mt: 0.5 }}>{visibleErrors.role}</ApexTypography>
              )}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <ApexSelect
                label={t.registration.department} value={fields.department} options={departmentOptions}
                onChange={(v) => handleFieldChange('department', String(v))}
                fullWidth width="100%" size="medium" labelSize={14}
              />
              {visibleErrors.department && (
                <ApexTypography variant="caption" color="#b91c1c" sx={{ mt: 0.5 }}>{visibleErrors.department}</ApexTypography>
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
            <Box>
              <ApexCheckbox
                label={t.registration.agreeTerms}
                checked={fields.agreeTerms}
                onChange={(v) => { if (typeof v === 'boolean') handleCheckboxChange('agreeTerms', v) }}
                size="small" customSize={18} labelSize={13} labelColor="#334155" labelPosition="right"
              />
              {visibleErrors.agreeTerms && (
                <ApexTypography variant="caption" color="#b91c1c" sx={{ ml: 4, mt: 0.5 }}>
                  {visibleErrors.agreeTerms}
                </ApexTypography>
              )}
            </Box>
            <ApexCheckbox
              label={t.registration.subscribeUpdates}
              checked={fields.subscribeUpdates}
              onChange={(v) => { if (typeof v === 'boolean') handleCheckboxChange('subscribeUpdates', v) }}
              size="small" customSize={18} labelSize={13} labelColor="#334155" labelPosition="right"
            />
          </Box>

          {feedbackMessage && (
            <ApexTypography
              variant="body2"
              color={isFormValid ? '#0f766e' : '#b91c1c'}
              fontSize={14}
              margin="0 0 12px"
            >
              {feedbackMessage}
            </ApexTypography>
          )}

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mt: 1 }}>
            <ApexAdvancedButton
              label={t.registration.createAccount}
              onClick={() => handleSubmit()}
              loadingText={t.registration.signingUp}
              disabled={isSubmitting}
              sx={{ flex: 1, minWidth: 160 }}
            />
            <ApexAdvancedButton
              label={t.common.reset}
              onClick={resetForm}
              variant="outlined"
              color="inherit"
              sx={{ flex: 1, minWidth: 160, borderColor: '#cbd5e1' }}
            />
          </Box>
        </Box>
      </ApexCard>
    </Box>
  )
}
