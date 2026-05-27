import { Box, Grid, Alert } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import ApexTextField from '@apex-ui/components/core-framework/ApexTextField'
import ApexAdvancedButton from '@apex-ui/components/core-framework/ApexAdvancedButton'
import ApexTypography from '@apex-ui/components/core-framework/ApexTypography'
import ApexCard from '@apex-ui/components/core-framework/ApexCard'
import ApexNotificationMessage from '@apex-ui/components/core-framework/ApexNotificationMessage'
import { useContactForm } from '../hooks/useContactForm'
import { useI18n } from '@core/i18n'

export default function ContactPage() {
  const { t } = useI18n()
  const { form, errors, status, apiError, handleChange, submit, reset } = useContactForm()

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', mb: 4 }}>
        <ApexTypography variant="h4" fontWeight={700} margin="0 0 4px">{t.contact.title}</ApexTypography>
        <ApexTypography variant="body1" color="text.secondary" margin="0">{t.contact.subtitle}</ApexTypography>
      </Box>

      <ApexCard elevation={1} centerContent={false} padding={4} sx={{ maxWidth: 640 }}>
        {apiError && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={reset}>
            {apiError.message}
          </Alert>
        )}

        <Box component="form" onSubmit={(e) => { e.preventDefault(); submit() }} noValidate>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <ApexTextField
                label={t.contact.name}
                fullWidth required
                value={form.name}
                onChange={(v) => handleChange('name', v)}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <ApexTextField
                label={t.contact.email}
                type="email" fullWidth required
                value={form.email}
                onChange={(v) => handleChange('email', v)}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <ApexTextField
                label={t.contact.subject}
                fullWidth required
                value={form.subject}
                onChange={(v) => handleChange('subject', v)}
                error={!!errors.subject}
                helperText={errors.subject}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <ApexTextField
                label={t.contact.message}
                multiline rows={5} fullWidth required
                value={form.message}
                onChange={(v) => handleChange('message', v)}
                error={!!errors.message}
                helperText={errors.message}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <ApexAdvancedButton
                label={t.contact.send}
                onClick={async () => { await submit() }}
                loadingText={t.contact.sending}
                startIcon={<SendIcon />}
              />
            </Grid>
          </Grid>
        </Box>
      </ApexCard>

      <ApexNotificationMessage
        open={status === 'success'}
        onClose={reset}
        severity="success"
        message={t.contact.success}
        autoHideDuration={5000}
      />
    </Box>
  )
}
