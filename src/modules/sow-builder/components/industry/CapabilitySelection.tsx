import React, { useState } from 'react';
import { Grid, Box, Typography, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip } from '@mui/material';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { CAPABILITY_OPTIONS } from '../../data/options';
import { VrmaButton } from '@apex-ui/components/core-framework';

interface CapabilitySelectionProps {
  selectedIds: Set<string>;
  industryId: string;
  customCapabilities?: string[];
  onSelect: (id: string) => void;
  onAddCustom?: (capability: string) => void;
}

export const CapabilitySelection: React.FC<CapabilitySelectionProps> = ({
  selectedIds = new Set(),
  industryId,
  customCapabilities = [],
  onSelect,
  onAddCustom,
}) => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [customInput, setCustomInput] = useState('');

  const filteredCapabilities = CAPABILITY_OPTIONS.filter((cap) =>
    cap.associatedIndustries?.includes(industryId)
  );

  if (!industryId) {
    return (
      <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'action.hover', borderRadius: '10px' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          Please select an industry above to see available capabilities.
        </Typography>
      </Box>
    );
  }

  const handleCustomClick = () => {
    setOpenDialog(true);
  };

  const handleAddCustom = () => {
    if (customInput.trim()) {
      onAddCustom?.(customInput.trim());
      setCustomInput('');
      setOpenDialog(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCustomInput('');
  };

  const totalSelected = selectedIds.size + customCapabilities.length;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Typography variant="caption" sx={{
          fontWeight: 700, color: 'primary.main',
          textTransform: 'uppercase', letterSpacing: '0.07em', fontSize: '0.68rem',
        }}>
          Capability
        </Typography>
        <Box sx={{ flex: 1, height: 1, bgcolor: 'divider' }} />
        {totalSelected > 0 && (
          <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600, fontSize: '0.7rem' }}>
            {totalSelected} selected
          </Typography>
        )}
      </Box>

      {/* Custom Capabilities Display */}
      {customCapabilities.length > 0 && (
        <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
          {customCapabilities.map((cap, idx) => (
            <Chip
              key={idx}
              label={cap}
              size="small"
              variant="outlined"
              sx={{
                borderColor: 'primary.main',
                color: 'primary.main',
                fontWeight: 500,
                fontSize: '0.8rem',
                height: 28
              }}
            />
          ))}
        </Box>
      )}

      <Grid container spacing={1.25}>
        {filteredCapabilities.map((cap) => {
          const isSelected = selectedIds.has(cap.id);
          const isCustom = cap.isCustom;

          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={`${cap.id}-${isSelected}`}>
              <Box
                onClick={() => isCustom ? handleCustomClick() : onSelect(cap.id)}
                sx={{
                  cursor: 'pointer',
                  borderRadius: '10px',
                  border: '1.5px solid',
                  borderColor: isSelected ? 'primary.main' : 'divider',
                  bgcolor: isSelected ? (theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.08)' : 'rgba(59, 75, 97, 0.04)') : 'background.paper',
                  px: 2, py: 1.5,
                  display: 'flex', alignItems: 'center', gap: 1.5,
                  transition: 'all 0.12s ease',
                  userSelect: 'none',
                  '&:hover': {
                    borderColor: isSelected ? 'primary.main' : theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.4)' : '#BFC9D8',
                    bgcolor: isSelected ? (theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.12)' : 'rgba(59, 75, 97, 0.06)') : 'action.hover',
                  },
                }}
              >
                {!isCustom && (
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
                )}
                <Typography variant="body2" sx={{
                  fontWeight: isSelected ? 600 : 400,
                  color: isSelected ? 'text.primary' : 'text.secondary',
                  fontSize: '0.85rem', flex: 1, lineHeight: 1.3,
                }}>
                  {cap.label}
                </Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>

      {/* Custom Capability Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Add Custom Capability</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            autoFocus
            fullWidth
            label="Capability Name"
            placeholder="e.g., Legacy System Migration"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddCustom()}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
            Enter a capability that's not listed above
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <VrmaButton
            label="Cancel"
            variant="outlined"
            onClick={handleCloseDialog}
            sx={{ borderColor: 'divider', color: 'text.secondary' }}
          />
          <VrmaButton
            label="Add"
            variant="contained"
            onClick={handleAddCustom}
            disabled={!customInput.trim()}
            sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}
          />
        </DialogActions>
      </Dialog>
    </Box>
  );
};