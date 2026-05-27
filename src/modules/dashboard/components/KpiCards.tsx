import React from 'react';
import { Grid } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { MetricCard } from './MetricCard';
import { MOCK_STATS } from '../services/mockData';

export const KpiGrid: React.FC = () => {
  const metricItems = [
    {
      title: 'Total SOWs',
      value: MOCK_STATS.totalSOWs,
      subtitle: `${MOCK_STATS.activeSOWs} active`,
      trend: 12,
      icon: <DescriptionOutlinedIcon sx={{ fontSize: 22 }} />,
      accent: '#0f2b52',
    },
    {
      title: 'Completed SOWs',
      value: MOCK_STATS.approved || 0,
      subtitle: 'Ready for execution',
      trend: 6,
      icon: <CheckCircleOutlineIcon sx={{ fontSize: 22 }} />,
      accent: '#10B981',
    },
    {
      title: 'Drafted SOWs',
      value: MOCK_STATS.rejected || 0,
      subtitle: 'Requires revisions',
      trend: -1,
      icon: <HighlightOffIcon sx={{ fontSize: 22 }} />,
      accent: '#EF4444',
    },
  ];

  return (
    <Grid container spacing={2.5} sx={{ mb: 3 }}>
      {metricItems.map((metric) => (
        <Grid key={metric.title} size={{ xs: 12, sm: 6, lg: 4 }}>
          <MetricCard {...metric} />
        </Grid>
      ))}
    </Grid>
  );
};