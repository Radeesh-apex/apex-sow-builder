import React from 'react';
import { Box, Typography, alpha } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VrmaAdvancedCard from '@apex-ui/components/core-framework/VrmaAdvancedCard';
import VrmaTypography from '@apex-ui/components/core-framework/VrmaTypography';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  trend?: number;
  icon: React.ReactNode;
  accent: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  title, value, subtitle, trend, icon, accent 
}) => {
  return (
    <VrmaAdvancedCard
      hoverEffect
      sx={{ p: 0, height: '100%', position: 'relative', overflow: 'hidden' }}
    >
      <Box sx={{ p: 3 }}>
        {/* Team accent decorative bubble */}
        <Box sx={{
          position: 'absolute', top: -16, right: -16,
          width: 80, height: 80, borderRadius: '50%',
          bgcolor: alpha(accent, 0.08), pointerEvents: 'none',
        }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="caption" sx={{
              display: 'block', fontWeight: 700,
              fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em',
              color: 'text.secondary', mb: 0.75,
            }}>
              {title}
            </Typography>
            <VrmaTypography variant="h4" fontWeight={700} sx={{ lineHeight: 1.2 }}>
              {value}
            </VrmaTypography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              {subtitle}
            </Typography>
            {trend !== undefined && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 0.5 }}>
                <TrendingUpIcon sx={{ fontSize: 14, color: trend >= 0 ? '#10B981' : '#EF4444' }} />
                <Typography variant="caption" sx={{
                  fontWeight: 600, color: trend >= 0 ? '#10B981' : '#EF4444',
                }}>
                  {Math.abs(trend)}% vs last month
                </Typography>
              </Box>
            )}
          </Box>
          <Box sx={{
            p: 1.25, borderRadius: 1.5,
            bgcolor: alpha(accent, 0.1), color: accent, flexShrink: 0,
          }}>
            {icon}
          </Box>
        </Box>
      </Box>
    </VrmaAdvancedCard>
  );
};