// src/modules/sow-builder/hooks/useNewSowForm.ts
import { useState, useCallback } from 'react';

// Total number of screens updated to 6 (Review is step 5)
const STEP_COUNT = 6;

export interface SowFormState {
  configureId: number | null;
  industryId: string;
  capabilityIds: Set<string>;
  customCapabilities: string[];
  serviceIds: Set<string>;       // Targets Delivery Models
  commercialIds: Set<string>;    // Targets Commercial Models
}

export interface SowFormErrors {
  industryId?: string;
  capabilityIds?: string;
  serviceIds?: string;
  commercialIds?: string;
  configureId?: string;
  submit?: string;
}

export const useNewSowForm = (initialStep = 1) => {
  const [formData, setFormData] = useState<SowFormState>({
    industryId: '',
    capabilityIds: new Set<string>(),
    customCapabilities: [],
    serviceIds: new Set<string>(),
    commercialIds: new Set<string>(),
    configureId: null,
  });

  const [errors, setErrors] = useState<SowFormErrors>({});
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSelectIndustry = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      industryId: id,
      capabilityIds: new Set<string>(),
      customCapabilities: [],
    }));

    if (errors.industryId) {
      setErrors((prev) => ({ ...prev, industryId: undefined }));
    }
  };

  const handleSelectService = (id: string) => {
    setFormData((prev) => {
      const nextSet = new Set(prev.serviceIds);
      if (nextSet.has(id)) {
        nextSet.delete(id);
      } else {
        nextSet.add(id);
      }
      return { ...prev, serviceIds: nextSet };
    });

    if (errors.serviceIds) {
      setErrors((prev) => ({ ...prev, serviceIds: undefined }));
    }
  };

  // Dedicated selection handler for Commercial Models
  const handleSelectCommercial = (id: string) => {
    setFormData((prev) => {
      const nextSet = new Set(prev.commercialIds);
      if (nextSet.has(id)) {
        nextSet.delete(id);
      } else {
        nextSet.add(id);
      }
      return { ...prev, commercialIds: nextSet };
    });

    if (errors.commercialIds) {
      setErrors((prev) => ({ ...prev, commercialIds: undefined }));
    }
  };

  const handleSelectConfigure = (id: number | null) => {
    setFormData((prev) => {
      const nextId = id === prev.configureId ? null : id;
      return {
        ...prev,
        configureId: nextId,
      };
    });
    setErrors((prev) => ({ ...prev, configureId: undefined }));
  };

  const handleSelectCapability = useCallback((id: string) => {
    setFormData((prev) => {
      const nextSet = new Set(prev.capabilityIds);
      if (nextSet.has(id)) {
        nextSet.delete(id);
      } else {
        nextSet.add(id);
      }
      return { ...prev, capabilityIds: nextSet };
    });

    setErrors((prev) => ({ ...prev, capabilityIds: undefined }));
  }, []);

  const handleAddCustomCapability = useCallback((capability: string) => {
    setFormData((prev) => ({
      ...prev,
      customCapabilities: [...prev.customCapabilities, capability],
    }));

    setErrors((prev) => ({ ...prev, capabilityIds: undefined }));
  }, []);

  // Structural step check logic
  const isStepOneValid = formData.industryId !== '' && (formData.capabilityIds.size > 0 || formData.customCapabilities.length > 0);
  const isStepTwoValid = formData.serviceIds.size > 0;
  const isStepThreeValid = formData.commercialIds.size > 0;
  const isStepFourValid = formData.configureId !== null;

  const isFormValid =
    currentStep === 1
      ? isStepOneValid
      : currentStep === 2
      ? isStepTwoValid
      : currentStep === 3
      ? isStepThreeValid
      : currentStep === 4
      ? isStepFourValid
      : isStepOneValid && isStepTwoValid && isStepThreeValid && isStepFourValid;

  /**
   * Primary API submission function
   */
  const handleSubmit = async () => {
    if (!isStepOneValid || !isStepTwoValid || !isStepThreeValid || !isStepFourValid) {
      setErrors((prev) => ({
        ...prev,
        submit: 'Please complete all required steps before submitting.',
      }));
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);
    setErrors((prev) => ({ ...prev, submit: undefined }));

    // Prepare payload by converting Sets to Arrays for JSON serialization
    const payload = {
      industryId: formData.industryId,
      capabilityIds: Array.from(formData.capabilityIds),
      customCapabilities: formData.customCapabilities,
      serviceIds: Array.from(formData.serviceIds),
      commercialIds: Array.from(formData.commercialIds),
      configureId: formData.configureId,
    };

    try {
      const response = await fetch('/api/sow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to submit Statement of Work.');
      }

      const result = await response.json();
      setSubmitSuccess(true);
      return result;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred during submission.';
      setErrors((prev) => ({
        ...prev,
        submit: message,
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStep = async () => {
    if (currentStep === 1 && !isStepOneValid) {
      setErrors({
        industryId: formData.industryId ? undefined : 'Please select an industry.',
        capabilityIds: (formData.capabilityIds.size > 0 || formData.customCapabilities.length > 0) ? undefined : 'Please select at least one capability.',
      });
      return;
    }

    if (currentStep === 2 && !isStepTwoValid) {
      setErrors({
        serviceIds: 'Please select at least one delivery model.',
      });
      return;
    }

    if (currentStep === 3 && !isStepThreeValid) {
      setErrors({
        commercialIds: 'Please select at least one commercial model.',
      });
      return;
    }

    if (currentStep === 4 && !isStepFourValid) {
      setErrors({
        configureId: 'Please select a configuration option.',
      });
      return;
    }

    // On Step 5 (Review), execute API submission
    if (currentStep === 5) {
      await handleSubmit();
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, STEP_COUNT - 1));
  };

  const handleBackStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return {
    formData,
    errors,
    currentStep,
    isFormValid,
    isSubmitting,
    submitSuccess,
    handleSelectIndustry,
    handleSelectCapability,
    handleAddCustomCapability,
    handleSelectService,
    handleSelectCommercial, // Exported to use on your page wrapper
    handleNextStep,
    handleBackStep,
    handleSelectConfigure,
    handleSubmit,
  };
};