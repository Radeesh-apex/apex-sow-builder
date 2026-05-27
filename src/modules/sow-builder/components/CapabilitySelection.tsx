import React from 'react';
import { Grid, Box, Typography, Radio, alpha } from '@mui/material';
import ApexAdvancedCard from '@apex-ui/components/core-framework/ApexAdvancedCard';
import ApexChip from '@apex-ui/components/core-framework/ApexChip';

// Import from the new standalone data/API layer
import { CAPABILITY_OPTIONS } from '../data/options';

interface CapabilitySelectionProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export const CapabilitySelection: React.FC<CapabilitySelectionProps> = ({ selectedId, onSelect }) => {
  return (
    <Box>
      <Typography 
        variant="caption" 
        sx={{ 
          display: 'block', 
          fontWeight: 700, 
          color: 'text.secondary', 
          mb: 1.5, 
          textTransform: 'uppercase', 
          letterSpacing: '0.05em' 
        }}
      >
        Capability
      </Typography>
      <Grid container spacing={2}>
        {CAPABILITY_OPTIONS.map((cap) => {
          const isSelected = selectedId === cap.id;
          return (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={cap.id}>
              <Box 
                              onClick={() => onSelect(cap.id)}
                              sx={{ cursor: 'pointer', height: '100%' }}
                            >
              <ApexAdvancedCard
              hoverEffect
                sx={{
                  p: 1.5,
                  px: 2,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: '1.5px solid',
                  borderColor: isSelected ? 'primary.main' : 'divider',
                  bgcolor: isSelected ? alpha('#2563EB', 0.04) : 'background.paper',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Radio
                    checked={isSelected}
                    size="small"
                    sx={{ p: 0, '&.Mui-checked': { color: 'primary.main' } }}
                  />
                  <Typography variant="body2" fontWeight={500} color="text.primary">
                    {cap.label}
                  </Typography>
                </Box>
                {cap.countLabel && (
                  <ApexChip
                    label={cap.countLabel}
                    fontSize="0.68rem"
                    bgColor={alpha('#2563EB', 0.1)}
                    textColor="#1D4ED8"
                    sx={{ fontWeight: 600, height: 20 }}
                  />
                )}
              </ApexAdvancedCard>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};