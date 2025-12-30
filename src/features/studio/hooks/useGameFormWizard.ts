import { useState } from "react";

export function useGameFormWizard(totalSteps: number = 4) {
  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // Navigation handlers
  const handleNext = () => {
    // Mark current step as completed
    setCompletedSteps((prev) => new Set([...prev, currentStep]));

    // Move to next step
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    // Mark as completed even if skipped
    setCompletedSteps((prev) => new Set([...prev, currentStep]));

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepClick = async (stepIndex: number) => {
    // Only allow navigation to completed or previous steps
    if (completedSteps.has(stepIndex + 1) || stepIndex < currentStep - 1) {
      setCurrentStep(stepIndex + 1);
    }
  };

  // Check if can proceed to next step
  const canGoNext = (step: number, formData: any) => {
    switch (step) {
      case 1:
        return !!(
          formData.name &&
          formData.shortDescription &&
          formData.description &&
          formData.categories.length > 0
        );
      case 2:
        return true; // Media optional
      case 3:
        return true; // Builds optional
      default:
        return true;
    }
  };

  const canSkip = (step: number) => {
    return step === 2 || step === 3; // Media and Builds are optional
  };

  return {
    currentStep,
    completedSteps,
    handleNext,
    handleBack,
    handleSkip,
    handleStepClick,
    canGoNext,
    canSkip,
  };
}
