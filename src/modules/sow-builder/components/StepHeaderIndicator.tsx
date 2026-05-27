import React from 'react';
import { Box, Stepper, Step, StepLabel, StepConnector, stepConnectorClasses, styled } from '@mui/material';

const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 14,
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: '#E2E8F0',
    borderRadius: 1,
  },
  [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
    backgroundColor: '#2563EB',
  },
  [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
    backgroundColor: '#2563EB',
  },
}));

interface StepHeaderIndicatorProps {
  currentStep: number;
}

const STEPS = ['Context', 'Industry', 'Services', 'Configure', 'Review'];

export const StepHeaderIndicator: React.FC<StepHeaderIndicatorProps> = ({ currentStep }) => {
  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', mb: 5 }}>
      <Stepper activeStep={currentStep} alternativeLabel connector={<CustomConnector />}>
        {STEPS.map((label, index) => (
          <Step key={label}>
            <StepLabel
              slotProps={{
                stepIcon: {
                  sx: {
                    width: 28,
                    height: 28,
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: index <= currentStep ? '#ffffff' : '#94A3B8',
                    '& .MuiStepIcon-text': { fill: 'currentColor' },
                  },
                },
              }}
              sx={{
                '& .MuiStepLabel-label': {
                  fontSize: '0.75rem',
                  fontWeight: index === currentStep ? 700 : 500,
                  color: index === currentStep ? '#1E3A8A' : 'text.secondary',
                  mt: 0.5,
                },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};