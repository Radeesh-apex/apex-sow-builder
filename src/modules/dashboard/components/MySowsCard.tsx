import React from 'react';
import { Box, Typography, Avatar, LinearProgress, alpha, useTheme } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ApexAdvancedCard from '@apex-ui/components/core-framework/ApexAdvancedCard';
import ApexButton from '@apex-ui/components/core-framework/ApexButton';
import ApexChip from '@apex-ui/components/core-framework/ApexChip';
import ApexTypography from '@apex-ui/components/core-framework/ApexTypography';
import { MOCK_SOWS } from '../services/mockData';
import type { SOWRecord } from '../services/mockData';

interface MySowsCardProps {
  onNavigateToSows: () => void;
}

const STATUS_CFG: Record<SOWRecord['status'], { text: string; bg: string }> = {
  'Draft':     { text: '#92400E', bg: '#FEF3C7' },
  'In Review': { text: '#1D4ED8', bg: '#DBEAFE' },
  'Completed': { text: '#065F46', bg: '#D1FAE5' },
  'Approved':  { text: '#065F46', bg: '#D1FAE5' },
  'Rejected':  { text: '#991B1B', bg: '#FEE2E2' },
};

export const MySowsCard: React.FC<MySowsCardProps> = ({ onNavigateToSows }) => {
  const theme = useTheme();

  return (
    <ApexAdvancedCard
      header={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <ApexTypography variant="subtitle1" fontWeight={700}>My SOWs</ApexTypography>
          <ApexButton
            label="View all"
            variant="text"
            size="small"
            endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
            onClick={onNavigateToSows}
            sx={{ color: 'primary.main', fontSize: '0.8rem' }}
          />
        </Box>
      }
      sx={{ p: 0 }}
    >
      {MOCK_SOWS.map((sow, i) => {
        const statusConfig = STATUS_CFG[sow.status];
        return (
          <Box
            key={sow.id}
            onClick={onNavigateToSows}
            sx={{
              px: 3, py: 1.75,
              display: 'flex', alignItems: 'center', gap: 2,
              cursor: 'pointer',
              borderBottom: i < MOCK_SOWS.length - 1 ? '1px solid' : 'none',
              borderColor: 'divider',
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.03) },
              transition: 'background 0.15s',
            }}
          >
            <Avatar sx={{
              width: 34, height: 34, flexShrink: 0,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main', fontSize: '0.7rem', fontWeight: 700,
            }}>
              {sow.client.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.3 }} noWrap>
                {sow.title}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {sow.client} · {sow.industry}
              </Typography>
            </Box>

            <Box sx={{ width: 90, display: { xs: 'none', sm: 'block' } }}>
              <LinearProgress
                variant="determinate"
                value={sow.progress}
                sx={{
                  height: 5, borderRadius: 3, mb: 0.25,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  '& .MuiLinearProgress-bar': {
                    bgcolor: sow.progress === 100 ? '#10B981' : 'primary.main',
                    borderRadius: 3,
                  },
                }}
              />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.68rem' }}>
                {sow.progress}%
              </Typography>
            </Box>

            <ApexChip
              label={sow.status}
              fontSize="0.68rem"
              bgColor={statusConfig.bg}
              textColor={statusConfig.text}
              sx={{
                borderRadius: '4px', fontWeight: 600, height: 22,
                '& .MuiChip-label': { px: 1 }, flexShrink: 0,
              }}
            />
            <OpenInNewIcon sx={{ fontSize: 14, color: 'text.disabled', flexShrink: 0 }} />
          </Box>
        );
      })}
    </ApexAdvancedCard>
  );
};