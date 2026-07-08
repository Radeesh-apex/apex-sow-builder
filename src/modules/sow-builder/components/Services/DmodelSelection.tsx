import React from 'react';
import { Grid, Box, Typography, useTheme, Chip, Collapse, Divider } from '@mui/material';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { SERVICES_DATA } from '../../data/services';

interface ServiceSelectionProps {
  selectedIds: Set<string>;
  onSelect: (id: string) => void;
}

export const ServiceSelection: React.FC<ServiceSelectionProps> = ({
  selectedIds = new Set(),
  onSelect,
}) => {
  const theme = useTheme();
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Typography variant="caption" sx={{
          fontWeight: 700, color: 'primary.main',
          textTransform: 'uppercase', letterSpacing: '0.07em', fontSize: '0.68rem',
        }}>
          Services
        </Typography>
        <Box sx={{ flex: 1, height: 1, bgcolor: 'divider' }} />
        {selectedIds.size > 0 && (
          <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600, fontSize: '0.7rem' }}>
            {selectedIds.size} selected
          </Typography>
        )}
      </Box>

      <Grid container spacing={1.5}>
        {SERVICES_DATA.map((service) => {
          const isSelected = selectedIds.has(service.id);
          const isExpanded = expandedId === service.id;

          return (
            <Grid size={{ xs: 12 }} key={service.id}>
              <Box
                sx={{
                  borderRadius: '10px',
                  border: '1.5px solid',
                  borderColor: isSelected ? 'primary.main' : 'divider',
                  bgcolor: isSelected ? (theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.08)' : 'rgba(59, 75, 97, 0.04)') : 'background.paper',
                  transition: 'all 0.12s ease',
                  overflow: 'hidden',
                }}
              >
                {/* Header - Click area */}
                <Box
                  onClick={() => onSelect(service.id)}
                  sx={{
                    cursor: 'pointer',
                    px: 2, py: 1.5,
                    display: 'flex', alignItems: 'center', gap: 1.5,
                    userSelect: 'none',
                    '&:hover': {
                      borderColor: isSelected ? 'primary.main' : theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.4)' : '#BFC9D8',
                      bgcolor: isSelected ? (theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.12)' : 'rgba(59, 75, 97, 0.06)') : 'action.hover',
                    },
                  }}
                >
                  {/* Checkbox */}
                  <Box sx={{
                    width: 18, height: 18, borderRadius: '4px',
                    border: '1.5px solid',
                    borderColor: isSelected ? 'primary.main' : theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.4)' : '#BFC9D8',
                    bgcolor: isSelected ? 'primary.main' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, transition: 'all 0.12s ease',
                  }}>
                    {isSelected && <CheckRoundedIcon sx={{ fontSize: 12, color: 'primary.contrastText' }} />}
                  </Box>

                  {/* Service info */}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{
                      fontWeight: isSelected ? 600 : 500,
                      color: 'text.primary',
                      fontSize: '0.9rem', lineHeight: 1.3,
                    }}>
                      {service.name}
                    </Typography>
                    <Typography variant="caption" sx={{
                      color: 'text.secondary',
                      fontSize: '0.75rem', lineHeight: 1.2,
                      display: 'block', mt: 0.25
                    }}>
                      {service.duration} • {service.effort}
                    </Typography>
                  </Box>

                  {/* Expand button */}
                  <Box
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(service.id);
                    }}
                    sx={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'text.secondary', cursor: 'pointer', flexShrink: 0,
                    }}
                  >
                    {isExpanded ? <ExpandLessIcon sx={{ fontSize: 20 }} /> : <ExpandMoreIcon sx={{ fontSize: 20 }} />}
                  </Box>
                </Box>

                {/* Expandable Details */}
                <Collapse in={isExpanded}>
                  <Divider />
                  <Box sx={{ px: 2, py: 1.5, bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.02)' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem', mb: 1.5, lineHeight: 1.5 }}>
                      {service.description}
                    </Typography>

                    <Box sx={{ mb: 1.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary', display: 'block', mb: 0.75 }}>
                        Deliverables:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {service.deliverables.map((deliverable, idx) => (
                          <Chip
                            key={idx}
                            label={deliverable}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderColor: 'divider',
                              color: 'text.secondary',
                              fontSize: '0.7rem',
                              height: 24
                            }}
                          />
                        ))}
                      </Box>
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.7rem' }}>
                          Team Size
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem', fontWeight: 500 }}>
                          {service.teamSize} members
                        </Typography>
                      </Box>
                      {service.estimatedCost && (
                        <Box>
                          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.7rem' }}>
                            Estimated Cost
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'primary.main', fontSize: '0.8rem', fontWeight: 600 }}>
                            ${service.estimatedCost.toLocaleString()}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Collapse>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
