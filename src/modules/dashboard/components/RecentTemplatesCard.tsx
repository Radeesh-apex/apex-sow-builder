import React from 'react';
import { Box, Typography, alpha, useTheme } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ApexAdvancedCard from '@apex-ui/components/core-framework/ApexAdvancedCard';
import ApexButton from '@apex-ui/components/core-framework/ApexButton';
import ApexTypography from '@apex-ui/components/core-framework/ApexTypography';
import { MOCK_TEMPLATES } from '../services/mockData';

interface RecentTemplatesCardProps {
  onUseTemplate: () => void;
}

export const RecentTemplatesCard: React.FC<RecentTemplatesCardProps> = ({ onUseTemplate }) => {
  const theme = useTheme();

  return (
    <ApexAdvancedCard
      header={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <ApexTypography variant="subtitle1" fontWeight={700}>Recent Templates</ApexTypography>
          <ApexButton
            label="View all"
            variant="text"
            size="small"
            endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
            sx={{ color: 'primary.main', fontSize: '0.8rem' }}
          />
        </Box>
      }
      sx={{ p: 0 }}
    >
      {MOCK_TEMPLATES.map((tmpl, i) => (
        <Box key={tmpl.id} sx={{
          px: 3, py: 1.75,
          display: 'flex', alignItems: 'center', gap: 2,
          borderBottom: i < MOCK_TEMPLATES.length - 1 ? '1px solid' : 'none',
          borderColor: 'divider',
        }}>
          <Box sx={{
            width: 34, height: 34, borderRadius: 1.5, flexShrink: 0,
            bgcolor: alpha(theme.palette.primary.main, 0.07),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <AutoAwesomeIcon sx={{ fontSize: 16, color: 'primary.main' }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }} noWrap>
              {tmpl.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {tmpl.category} · {tmpl.industry}
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: 'text.disabled', flexShrink: 0 }}>
            Used {tmpl.timesUsed}×
          </Typography>
          <ApexButton
            label="Use"
            size="small"
            variant="outlined"
            endIcon={<OpenInNewIcon sx={{ fontSize: '11px !important' }} />}
            onClick={onUseTemplate}
            sx={{
              borderColor: 'divider', color: 'text.secondary',
              fontSize: '0.75rem', flexShrink: 0,
            }}
          />
        </Box>
      ))}
    </ApexAdvancedCard>
  );
};