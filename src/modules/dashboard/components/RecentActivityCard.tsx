import React from 'react';
import { Box, Typography, Avatar, alpha, useTheme } from '@mui/material';
import VrmaAdvancedCard from '@apex-ui/components/core-framework/VrmaAdvancedCard';
import VrmaTypography from '@apex-ui/components/core-framework/VrmaTypography';
import { MOCK_ACTIVITIES } from '../services/mockData';

export const RecentActivityCard: React.FC = () => {
  const theme = useTheme();

  return (
    <VrmaAdvancedCard
      header={<VrmaTypography variant="subtitle1" fontWeight={700}>Recent Activity</VrmaTypography>}
      sx={{ height: '100%'  }}
    >
      <Box sx={{ position: 'relative' }}>
        <Box sx={{
          position: 'absolute', left: 15, top: 8, bottom: 8, width: 1.5,
          bgcolor: 'divider', zIndex: 0,
        }} />
        {MOCK_ACTIVITIES.map((activity) => (
          <Box key={activity.id} sx={{ display: 'flex', gap: 2, mb: 2.5, position: 'relative', zIndex: 1 }}>
            <Avatar sx={{
              width: 30, height: 30, flexShrink: 0,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main', fontSize: '0.65rem', fontWeight: 700,
            }}>
              {activity.user.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </Avatar>
            <Box sx={{ pt: 0.25 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.35 }}>
                {activity.user}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                {activity.action}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mt: 0.2 }}>
                {activity.time}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </VrmaAdvancedCard>
  );
};