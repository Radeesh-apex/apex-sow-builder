// @/modules/sow-builder/components/Review/ReviewDetails.tsx
import React from 'react';
import { Box, Typography, Grid, Chip, useTheme } from '@mui/material';
import type { SowFormState } from '../../hooks/useNewSowForm';
import { DELIVERY_MODELS_DATA } from '../../data/deliveryModels';
import { COMMERCIAL_MODELS_DATA } from '../../data/commercialModels';

interface ReviewDetailsProps {
  formData: SowFormState;
}

export const ReviewDetails: React.FC<ReviewDetailsProps> = ({ formData }) => {
  const theme = useTheme();

  // Cross-reference selected Sets with data registries safely
  const selectedDeliveryModels = DELIVERY_MODELS_DATA.filter((model) =>
    formData.serviceIds?.has(model.id)
  );

  const selectedCommercialModels = COMMERCIAL_MODELS_DATA.filter((model) =>
    formData.commercialIds?.has(model.id)
  );

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        
        {/* Section 1: Industry & Capabilities */}
        <Grid size={{ xs: 12 }}>
          <Box sx={{ 
            p: 2, borderRadius: 2, 
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)', 
            border: `1px solid ${theme.palette.divider}` 
          }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main', textTransform: 'uppercase', mb: 1, fontSize: '0.75rem', letterSpacing: '0.05em' }}>
              Industry &amp; Capabilities
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>
              Industry vertical: <span style={{ fontWeight: 500, color: theme.palette.text.secondary }}>{formData.industryId || 'None Selected'}</span>
            </Typography>
            
            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 1, color: 'text.primary' }}>
              Selected Capabilities:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {formData.capabilityIds && Array.from(formData.capabilityIds).map((capId) => (
                <Chip key={capId} label={capId} size="small" color="primary" variant="outlined" sx={{ borderRadius: 1, fontSize: '0.75rem' }} />
              ))}
              {formData.customCapabilities?.map((customCap, idx) => (
                <Chip key={`custom-${idx}`} label={`${customCap} (Custom)`} size="small" color="secondary" variant="outlined" sx={{ borderRadius: 1, fontSize: '0.75rem' }} />
              ))}
              {(!formData.capabilityIds || formData.capabilityIds.size === 0) && (!formData.customCapabilities || formData.customCapabilities.length === 0) && (
                <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>No capabilities selected.</Typography>
              )}
            </Box>
          </Box>
        </Grid>

        {/* Section 2: Delivery Approach */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box sx={{ p: 2, height: '100%', borderRadius: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)', border: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main', textTransform: 'uppercase', mb: 1, fontSize: '0.75rem', letterSpacing: '0.05em' }}>
              Delivery Model
            </Typography>
            {selectedDeliveryModels.length > 0 ? (
              selectedDeliveryModels.map((model) => (
                <Box key={model.id} sx={{ mb: 1.5, '&:last-child': { mb: 0 } }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>{model.name}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>{model.duration} • {model.effort}</Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>None Selected</Typography>
            )}
          </Box>
        </Grid>

        {/* Section 3: Commercial Architecture */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box sx={{ p: 2, height: '100%', borderRadius: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)', border: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main', textTransform: 'uppercase', mb: 1, fontSize: '0.75rem', letterSpacing: '0.05em' }}>
              Commercial Framework
            </Typography>
            {selectedCommercialModels.length > 0 ? (
              selectedCommercialModels.map((model) => (
                <Box key={model.id} sx={{ mb: 1.5, '&:last-child': { mb: 0 } }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>{model.name}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>{model.estimatedCost}</Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>None Selected</Typography>
            )}
          </Box>
        </Grid>

        {/* Section 4: Configurations */}
        <Grid size={{ xs: 12 }}>
          <Box sx={{ p: 2, borderRadius: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)', border: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main', textTransform: 'uppercase', mb: 1, fontSize: '0.75rem', letterSpacing: '0.05em' }}>
              SOW Configuration Option
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
              {formData.configureId !== null ? `Configuration Profile Option #${formData.configureId}` : 'No explicit configuration selected.'}
            </Typography>
          </Box>
        </Grid>

      </Grid>
    </Box>
  );
};