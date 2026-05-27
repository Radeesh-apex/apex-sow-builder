import { Box, Grid } from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import GroupIcon from '@mui/icons-material/Group'
import AssignmentIcon from '@mui/icons-material/Assignment'
import ApexCard from '@apex-ui/components/core-framework/ApexCard'
import ApexTypography from '@apex-ui/components/core-framework/ApexTypography'
import { useI18n } from '@core/i18n'

const STATS = [
  { label: 'Total Users', value: '1,284', Icon: GroupIcon, color: 'primary.main' },
  { label: 'Active Projects', value: '42', Icon: AssignmentIcon, color: 'secondary.main' },
  { label: 'Growth', value: '+18%', Icon: TrendingUpIcon, color: 'success.main' },
]

export default function HomePage() {
  const { t } = useI18n()

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', mb: 4 }}>
        <ApexTypography variant="h4" fontWeight={700} margin="0 0 4px">{t.home.dashboard}</ApexTypography>
        <ApexTypography variant="body1" color="text.secondary" margin="0">{t.home.overview}</ApexTypography>
      </Box>

      <Grid container spacing={3} mb={4}>
        {STATS.map(({ label, value, Icon, color }) => (
          <Grid key={label} size={{ xs: 12, sm: 4 }}>
            <ApexCard elevation={1} centerContent={false} padding={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ color, display: 'flex' }}><Icon sx={{ fontSize: 40 }} /></Box>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <ApexTypography variant="h5" fontWeight={700} margin="0">{value}</ApexTypography>
                  <ApexTypography variant="body2" color="text.secondary" margin="0">{label}</ApexTypography>
                </Box>
              </Box>
            </ApexCard>
          </Grid>
        ))}
      </Grid>

      <ApexCard elevation={1} centerContent={false} padding={3}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <ApexTypography variant="h6" margin="0">{t.home.title}</ApexTypography>
          <ApexTypography variant="body2" color="text.secondary" margin="0">{t.home.subtitle}</ApexTypography>
        </Box>
      </ApexCard>
    </Box>
  )
}
