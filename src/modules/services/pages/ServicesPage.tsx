import { Box, Grid } from '@mui/material'
import BuildIcon from '@mui/icons-material/Build'
import CloudIcon from '@mui/icons-material/Cloud'
import SecurityIcon from '@mui/icons-material/Security'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import VrmaAdvancedCard from '@apex-ui/components/core-framework/VrmaAdvancedCard'
import VrmaAdvancedButton from '@apex-ui/components/core-framework/VrmaAdvancedButton'
import VrmaTypography from '@apex-ui/components/core-framework/VrmaTypography'
import { useI18n } from '@core/i18n'

const SERVICE_ICONS = [
  { Icon: BuildIcon, color: 'primary.main' },
  { Icon: CloudIcon, color: 'secondary.main' },
  { Icon: SecurityIcon, color: 'error.main' },
  { Icon: SupportAgentIcon, color: 'success.main' },
]

export default function ServicesPage() {
  const { t } = useI18n()

  const services = [
    { ...SERVICE_ICONS[0], title: 'Development', description: 'Custom software solutions tailored to your business needs.' },
    { ...SERVICE_ICONS[1], title: 'Cloud Solutions', description: 'Scalable cloud infrastructure and migration services.' },
    { ...SERVICE_ICONS[2], title: 'Security', description: 'End-to-end security audits, monitoring, and compliance.' },
    { ...SERVICE_ICONS[3], title: 'Support', description: '24/7 technical support and maintenance packages.' },
  ]

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', mb: 4 }}>
        <VrmaTypography variant="h4" fontWeight={700} margin="0 0 4px">{t.services.title}</VrmaTypography>
        <VrmaTypography variant="body1" color="text.secondary" margin="0">{t.services.subtitle}</VrmaTypography>
      </Box>

      <Grid container spacing={3}>
        {services.map(({ Icon, title, color, description }) => (
          <Grid key={title} size={{ xs: 12, sm: 6, md: 3 }}>
            <VrmaAdvancedCard
              elevation={1}
              hoverEffect
              height="100%"
              footer={
                <VrmaAdvancedButton
                  label={t.common.next}
                  variant="text"
                  size="small"
                  onClick={() => {}}
                />
              }
            >
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ color, mb: 2, display: 'flex' }}><Icon sx={{ fontSize: 40 }} /></Box>
                <VrmaTypography variant="h6" fontWeight={600} margin="0 0 8px">{title}</VrmaTypography>
                <VrmaTypography variant="body2" color="text.secondary" margin="0">{description}</VrmaTypography>
              </Box>
            </VrmaAdvancedCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
