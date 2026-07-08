import React from 'react';
import { Grid, Box, Typography, useTheme } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { INDUSTRY_OPTIONS } from '../../data/options';

interface IndustrySelectionProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export const IndustrySelection: React.FC<IndustrySelectionProps> = ({ selectedId, onSelect }) => {
  const theme = useTheme();

  return (
    <Box sx={{ mb: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Typography variant="caption" sx={{
          fontWeight: 700, color: 'primary.main',
          textTransform: 'uppercase', letterSpacing: '0.07em', fontSize: '0.68rem',
        }}>
          Industry
        </Typography>
        <Box sx={{ flex: 1, height: 1, bgcolor: 'divider' }} />
        {selectedId && (
          <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600, fontSize: '0.7rem' }}>
            1 selected
          </Typography>
        )}
      </Box>
      <Grid container spacing={1.5}>
        {INDUSTRY_OPTIONS.map((ind) => {
          const isSelected = selectedId === ind.id;
          const IndustryIcon = ind.icon;
          return (
            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={ind.id}>
              <Box
                onClick={() => onSelect(ind.id)}
                sx={{
                  cursor: 'pointer',
                  position: 'relative',
                  borderRadius: '12px',
                  border: '1.5px solid',
                  borderColor: isSelected ? 'primary.main' : 'divider',
                  bgcolor: isSelected ? (theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.08)' : 'rgba(59, 75, 97, 0.04)') : 'background.paper',
                  p: 2,
                  display: 'flex', flexDirection: 'column', gap: 1,
                  transition: 'all 0.15s ease',
                  userSelect: 'none',
                  '&:hover': {
                    borderColor: isSelected ? 'primary.main' : theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.4)' : '#BFC9D8',
                    bgcolor: isSelected ? (theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.12)' : 'rgba(59, 75, 97, 0.06)') : 'action.hover',
                    transform: 'translateY(-1px)',
                    boxShadow: theme.palette.mode === 'dark' ? '0 3px 10px rgba(0,0,0,0.2)' : '0 3px 10px rgba(13,30,53,0.08)',
                  },
                }}
              >
                {isSelected && (
                  <CheckCircleRoundedIcon sx={{ position: 'absolute', top: 8, right: 8, fontSize: 17, color: 'primary.main' }} />
                )}
                <Box sx={{
                  width: 38, height: 38, borderRadius: '8px',
                  bgcolor: isSelected ? (theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.12)' : 'rgba(59, 75, 97, 0.10)') : (theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.08)' : 'rgba(100, 116, 139, 0.07)'),
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <IndustryIcon sx={{ fontSize: 20, color: isSelected ? 'primary.main' : 'text.secondary' }} />
                </Box>
                <Typography variant="body2" sx={{
                  fontWeight: isSelected ? 700 : 500,
                  color: isSelected ? 'text.primary' : 'text.secondary',
                  fontSize: '0.82rem', lineHeight: 1.3,
                }}>
                  {ind.label}
                </Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
