import { Box, Grid, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

import VrmaButton from '@apex-ui/components/core-framework/VrmaButton';
import {VrmaTypography} from '@apex-ui/components/core-framework';
import { PATHS } from '@core/router/routePaths';

import { KpiGrid } from '@modules/dashboard/components/KpiCards';
import { MySowsCard } from '../components/MySowsCard';
import { RecentActivityCard } from '../components/RecentActivityCard';
import { RecentTemplatesCard } from '../components/RecentTemplatesCard';

export default function DashboardPage() {
  const navigate = useNavigate();

  const handleNavigateToSows = () => {
    navigate(PATHS.sowCreate);
  };

  return (
    <Box>
      {/* Container Header */}
      <Box sx={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2,
      }}>
        <Box>
          <VrmaTypography variant="h5" fontWeight={700}>Dashboard</VrmaTypography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
            Welcome back. Here&apos;s your pipeline at a glance.
          </Typography>
        </Box>
        <VrmaButton
          label="New SOW"
          startIcon={<AddIcon />}
          variant="contained"
          onClick={handleNavigateToSows}
        />
      </Box>

      {/* Structured Dashboard Panels */}
      <KpiGrid />

      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <MySowsCard onNavigateToSows={handleNavigateToSows} />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <RecentActivityCard />
        </Grid>
      </Grid>

      <RecentTemplatesCard onUseTemplate={handleNavigateToSows} />
    </Box>
  );
}