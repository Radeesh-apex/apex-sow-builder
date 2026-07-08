import { Box, Typography, FormHelperText, Alert, useTheme, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import { VrmaButton, VrmaTypography } from '@apex-ui/components/core-framework';
import { StepHeaderIndicator } from '../components/StepHeaderIndicator';
import { IndustrySelection } from '@modules/sow-builder/components/industry/IndustrySelection.tsx';
import { CapabilitySelection } from '@modules/sow-builder/components/industry/CapabilitySelection.tsx';
import { DeliveryModelSelection } from '@modules/sow-builder/components/DeliveryModel/DeliveryModelSelection.tsx';
import { useNewSowForm } from '../hooks/useNewSowForm';
import { CommercialModelSelection } from '@modules/sow-builder/components/CommercialModel/CmodelSelection.tsx';
import { ReviewDetails } from '@modules/sow-builder/components/Review/ReviewDetails.tsx';

const STEP_LABELS = ['Context', 'Industry', 'Services', 'Configure', 'Review'];

export default function NewSowPage() {
  const theme = useTheme();
  const {
    formData, errors, currentStep,
    isFormValid, isSubmitting, submitSuccess,
    handleSelectIndustry, handleSelectCapability, handleAddCustomCapability,
    handleSelectService, handleSelectCommercial, // Add this handler extraction here
    handleNextStep, handleBackStep, handleSelectConfigure,
  } = useNewSowForm(1);

  const progressPct = (currentStep / (STEP_LABELS.length - 1)) * 100;

  return (
    // Change 1100 to 1400, 1600, or use a percentage / '100%'
    <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto' }}>

      {/* Page title */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Box sx={{
          width: 40, height: 40, borderRadius: 2,
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.12)' : 'rgba(59, 75, 97, 0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <ArticleOutlinedIcon sx={{ color: 'primary.main', fontSize: 22 }} />
        </Box>
        <Box>
          <VrmaTypography variant="h6" fontWeight={700} sx={{ color: 'text.primary', lineHeight: 1.2 }}>
            New Statement of Work
          </VrmaTypography>
          {/* <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Step {currentStep} of {STEP_LABELS.length - 1} — {STEP_LABELS[currentStep]}
          </Typography> */}
        </Box>
      </Box>



      {/* Step stepper */}
      <StepHeaderIndicator currentStep={currentStep} />

      {/* Main form card */}
      <Box sx={{
        bgcolor: 'background.paper', borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.palette.mode === 'dark' ? '0 1px 4px rgba(0,0,0,0.3)' : '0 1px 4px rgba(13,30,53,0.06)',
        p: { xs: 3, md: 4 }, mb: 2,
      }}>

        {/* Step 1: Industry & Capability */}
        {currentStep === 1 && (
          <>
            <Box sx={{ mb: 3.5 }}>
              <VrmaTypography variant="h6" fontWeight={700} sx={{ color: 'text.primary', mb: 0.5 }}>
                Select Industry &amp; Capability
              </VrmaTypography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                Choose the client&apos;s primary industry vertical, then select one or more capabilities
                you&apos;re scoping for this engagement.
              </Typography>
            </Box>

            <IndustrySelection selectedId={formData.industryId} onSelect={handleSelectIndustry} />
            {errors.industryId && (
              <FormHelperText error sx={{ mt: -2, mb: 2.5, ml: 0.5, fontWeight: 500 }}>
                {errors.industryId}
              </FormHelperText>
            )}

            <Box sx={{ my: 3, borderTop: `1px solid ${theme.palette.divider}` }} />

            <CapabilitySelection
              selectedIds={formData.capabilityIds}
              industryId={formData.industryId}
              customCapabilities={formData.customCapabilities}
              onSelect={handleSelectCapability}
              onAddCustom={handleAddCustomCapability}
            />
            {errors.capabilityIds && (
              <FormHelperText error sx={{ mt: 1.5, ml: 0.5, fontWeight: 500 }}>
                {errors.capabilityIds}
              </FormHelperText>
            )}
          </>
        )}

        {/* Step 2: Services */}
        {currentStep === 2 && (
          <>
            <Box sx={{ mb: 3.5 }}>
              <VrmaTypography variant="h6" fontWeight={700} sx={{ color: 'text.primary', mb: 0.5 }}>
                Select Delivery Model
              </VrmaTypography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                Choose the delivery approach that best aligns with your project execution methodology, risk profile, and client expectations.
              </Typography>
            </Box>

            {/* Hooked up to the new DeliveryModelSelection UI element */}
            <DeliveryModelSelection
              selectedIds={formData.serviceIds}
              onSelect={handleSelectService}
            />
            {errors.serviceIds && (
              <FormHelperText error sx={{ mt: 2, ml: 0.5, fontWeight: 500 }}>
                {errors.serviceIds}
              </FormHelperText>
            )}
          </>
        )}

        {/* Step 3: Configure */}
        {currentStep === 3 && (
          <>
            <Box sx={{ mb: 3.5 }}>
              <VrmaTypography variant="h6" fontWeight={700} sx={{ color: 'text.primary', mb: 0.5 }}>
                Select Commercial Model
              </VrmaTypography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                Select the overarching commercial governance structure that dictates accountability and client management splits.
              </Typography>
            </Box>

            <CommercialModelSelection
              selectedIds={formData.commercialIds || new Set()} // Fallback if schema doesn't match yet
              onSelect={handleSelectCommercial} // Map to your respective handler inside useNewSowForm
            />
          </>
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && (
          <Box sx={{ mb: 3.5 }}>
            <VrmaTypography variant="h6" fontWeight={700} sx={{ color: 'text.primary', mb: 0.5 }}>
              Review &amp; Submit
            </VrmaTypography>
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6, mb: 2 }}>
              Review your statement of work details before submission.
            </Typography>

            <Divider sx={{ mb: 2 }} />

            {/* 2. Insert the child Review View here */}
            <ReviewDetails formData={formData} />
          </Box>
        )}

        {errors.submit && <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>{errors.submit}</Alert>}
        {submitSuccess && <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>SOW created successfully!</Alert>}
      </Box>

      {/* Footer nav */}
      <Box sx={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        pt: 2.5, borderTop: `1px solid ${theme.palette.divider}`,
      }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          {currentStep === 1 && (formData.industryId ? `${formData.capabilityIds.size + formData.customCapabilities.length} capability selected` : 'No selection yet')}
          {currentStep === 2 && `${formData.serviceIds.size} delivery model(s) selected`}
          {currentStep === 3 && `${formData.commercialIds.size} commercial model(s) selected`}

          {currentStep === 4 && 'Ready for submission'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
    <VrmaButton
      label="Back"
      variant="outlined"
      startIcon={<ArrowBackIcon sx={{ fontSize: 15 }} />}
      onClick={handleBackStep}
      disabled={currentStep === 1 || isSubmitting}
      sx={{
        borderColor: 'divider', color: 'text.secondary', borderRadius: 2, px: 3, fontWeight: 600,
        '&:hover': { bgcolor: 'action.hover', borderColor: theme.palette.mode === 'dark' ? theme.palette.divider : '#BFC9D8' },
        '&.Mui-disabled': { color: theme.palette.action.disabled, borderColor: theme.palette.action.disabled },
      }}
    />
    <VrmaButton
      /* CRITICAL FIX: Changes label to Submit on Step 5 (Review Screen) */
      label={isSubmitting ? 'Saving...' : currentStep === 4 ? 'Submit SOW' : 'Next'}
      variant="contained"
      /* CRITICAL FIX: Shows arrow icon on everything EXCEPT the final submission view */
      endIcon={currentStep === 4 ? undefined : <NavigateNextIcon sx={{ fontSize: 15 }} />}
      onClick={handleNextStep}
      /* 
        CRITICAL FIX: Checks hook form validity + handles step 5 validation 
        so it stays disabled if selections are structurally missing.
      */
      disabled={!isFormValid || isSubmitting}
      sx={{
        bgcolor: 'primary.main', color: 'primary.contrastText', borderRadius: 2,
        px: 4, fontWeight: 600, boxShadow: 'none',
        '&:hover': { bgcolor: 'primary.dark', boxShadow: 'none' },
        '&.Mui-disabled': { bgcolor: theme.palette.action.disabledBackground || 'action.disabled', color: theme.palette.action.disabled },
      }}
    />
  </Box>
      </Box>
    </Box>
  );
}
