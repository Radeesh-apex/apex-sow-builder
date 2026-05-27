import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import ApexButton from '@apex-ui/components/core-framework/ApexButton';
import ApexTypography from '@apex-ui/components/core-framework/ApexTypography';
import { PATHS } from '@core/router/routePaths';

import { StepHeaderIndicator } from '../components/StepHeaderIndicator';
import { IndustrySelection } from '../components/IndustrySelection';
import { CapabilitySelection } from '../components/CapabilitySelection';

export default function NewSowPage() {
  const navigate = useNavigate();
  
  // Track state for wizard form selection blocks
  const [selectedIndustry, setSelectedIndustry] = useState<string>('healthcare');
  const [selectedCapability, setSelectedCapability] = useState<string>('managed-support');

  const handleNextStep = () => {
    // Pipeline route transition logic can go here
    console.log('Proceeding with parameters:', { selectedIndustry, selectedCapability });
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100%', pb: 4 }}>
      {/* Dynamic step visual line tracker - explicitly set to index 1 (Industry step) */}
      <StepHeaderIndicator currentStep={1} />

      {/* Main Form Title Section Blocks */}
      <Box sx={{ mb: 4 }}>
        <ApexTypography variant="h5" fontWeight={700}>
          Select Industry & Capability
        </ApexTypography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Choose the client's primary industry, then the capability you're scoping.
        </Typography>
      </Box>

      {/* Input Form Containers */}
      <IndustrySelection selectedId={selectedIndustry} onSelect={setSelectedIndustry} />
      <CapabilitySelection selectedId={selectedCapability} onSelect={setSelectedCapability} />

      {/* Bottom Layout Action Navigation Buttons Footer */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 6, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
        <ApexButton
          label="Back"
          variant="outlined"
          startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
          onClick={() => navigate(-1)}
          sx={{ borderColor: 'divider', color: 'text.secondary', px: 3 }}
        />
        <ApexButton
          label="Next"
          variant="contained"
          endIcon={<NavigateNextIcon sx={{ fontSize: 16 }} />}
          onClick={handleNextStep}
          disabled={!selectedIndustry || !selectedCapability}
          sx={{ px: 4 }}
        />
      </Box>
    </Box>
  );
}