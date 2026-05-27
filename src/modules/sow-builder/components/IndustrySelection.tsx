import React from 'react';
import { Grid, Box, Typography, alpha } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ApexAdvancedCard from '@apex-ui/components/core-framework/ApexAdvancedCard';

// Import data along with embedded icon maps
import { INDUSTRY_OPTIONS } from '../data/options';

interface IndustrySelectionProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export const IndustrySelection: React.FC<IndustrySelectionProps> = ({ selectedId, onSelect }) => {
  return (
    <Box sx={{ mb: 4 }}>
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
        Industry
      </Typography>
      <Grid container spacing={2}>
        {INDUSTRY_OPTIONS.map((ind) => {
          const isSelected = selectedId === ind.id;
          
          // Alias the property to a capitalized component variable name for proper React rendering
          const IndustryIcon = ind.icon;

          return (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={ind.id}>
              <Box 
                onClick={() => onSelect(ind.id)}
                sx={{ cursor: 'pointer', height: '100%' }}
              >
                <ApexAdvancedCard
                  hoverEffect
                  sx={{
                    p: 2.5,
                    height: '100%',
                    position: 'relative',
                    border: '1.5px solid',
                    borderColor: isSelected ? 'primary.main' : 'divider',
                    bgcolor: isSelected ? alpha('#2563EB', 0.06) : 'background.paper',
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  {isSelected && (
                    <CheckCircleIcon 
                      color="primary" 
                      sx={{ position: 'absolute', top: 12, right: 12, fontSize: 16 }} 
                    />
                  )}
                  
                  {/* Render directly from object key */}
                  <IndustryIcon 
                    sx={{ 
                      color: isSelected ? 'primary.main' : 'text.secondary', 
                      fontSize: 24, 
                      mb: 1.5 
                    }} 
                  />
                  
                  <Typography variant="body2" fontWeight={600} color={isSelected ? 'primary.main' : 'text.primary'}>
                    {ind.label}
                  </Typography>
                </ApexAdvancedCard>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};