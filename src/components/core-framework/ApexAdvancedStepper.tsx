import React from "react";
import {
  Stepper, Step, StepLabel, StepContent,
  Box, Typography, Button, Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckIcon from "@mui/icons-material/Check";

interface StepDetail {
  label: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  iconWidth?: number | string;
  iconHeight?: number | string;
}

interface ApexAdvancedStepperProps {
  steps: StepDetail[];
  activeStep?: number;
  orientation?: "horizontal" | "vertical";
  spacing?: number;
  sx?: object;
  onStepChange?: (step: number) => void;
  showNavigation?: boolean;
  nextLabel?: string;
  backLabel?: string;
  finishLabel?: string;
  onFinish?: () => void;
}

const ApexAdvancedStepper: React.FC<ApexAdvancedStepperProps> = ({
  steps,
  activeStep = 0,
  orientation = "horizontal",
  spacing = 2,
  sx,
  onStepChange,
  showNavigation = false,
  nextLabel = "Next",
  backLabel = "Back",
  finishLabel = "Finish",
  onFinish,
}) => {
  const [internalStep, setInternalStep] = React.useState(activeStep);

  React.useEffect(() => {
    setInternalStep(activeStep);
  }, [activeStep]);

  const currentStep = onStepChange ? activeStep : internalStep;
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLast) { onFinish?.(); return; }
    const next = currentStep + 1;
    if (onStepChange) onStepChange(next);
    else setInternalStep(next);
  };

  const handleBack = () => {
    if (isFirst) return;
    const prev = currentStep - 1;
    if (onStepChange) onStepChange(prev);
    else setInternalStep(prev);
  };

  const stepIcon = (step: StepDetail, index: number) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: step.iconWidth ?? 32,
        height: step.iconHeight ?? 32,
      }}
    >
      {step.icon ?? index + 1}
    </Box>
  );

  const navButtons = showNavigation && (
    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
      <Button
        variant="outlined"
        size="small"
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
        disabled={isFirst}
      >
        {backLabel}
      </Button>
      <Button
        variant="contained"
        size="small"
        endIcon={isLast ? <CheckIcon /> : <ArrowForwardIcon />}
        onClick={handleNext}
      >
        {isLast ? finishLabel : nextLabel}
      </Button>
    </Stack>
  );

  if (orientation === "vertical") {
    return (
      <Box>
        <Stepper activeStep={currentStep} orientation="vertical" sx={{ p: spacing, ...sx }}>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepLabel icon={stepIcon(step, index)}>
                {step.label}
              </StepLabel>
              {/* StepContent renders below each label with the connector line intact */}
              <StepContent>
                {step.description && (
                  <Typography component="div" variant="body2" color="text.secondary" sx={{ pb: 1 }}>
                    {step.description}
                  </Typography>
                )}
                {/* Show nav buttons inside the active step's content for vertical mode */}
                {showNavigation && index === currentStep && (
                  <Box sx={{ mt: 1 }}>{navButtons}</Box>
                )}
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Box>
    );
  }

  return (
    <Box>
      <Stepper activeStep={currentStep} orientation="horizontal" sx={{ p: spacing, ...sx }}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel icon={stepIcon(step, index)}>
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Description panel below horizontal stepper */}
      <Box sx={{ mt: 2 }}>
        {steps[currentStep]?.description && (
          <Typography component="div" variant="body2" color="text.secondary">
            {steps[currentStep].description}
          </Typography>
        )}
      </Box>

      {showNavigation && navButtons}
    </Box>
  );
};

export default ApexAdvancedStepper;
