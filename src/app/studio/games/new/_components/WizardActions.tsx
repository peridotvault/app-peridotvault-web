import { Button } from "@/shared/components/ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faSave, faForward, faCheckCircle } from "@fortawesome/free-solid-svg-icons";

interface WizardActionsProps {
  currentStep: number;
  totalSteps: number;
  canGoNext: boolean;
  canSkip: boolean;
  isSubmitting: boolean;
  onBack: () => void;
  onNext: () => void;
  onSkip?: () => void;
  onSaveDraft: () => void;
  onPublish?: () => void;
}

export function WizardActions({
  currentStep,
  totalSteps,
  canGoNext,
  canSkip,
  isSubmitting,
  onBack,
  onNext,
  onSkip,
  onSaveDraft,
  onPublish,
}: WizardActionsProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;
  const isReviewStep = currentStep === 4;

  return (
    <div className="mt-8 pt-6 border-t border-border">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Back Button */}
        {!isFirstStep && (
          <Button
            variant="outline"
            size="md"
            onClick={onBack}
            className="gap-2"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back
          </Button>
        )}

        {/* Spacer */}
        {!isFirstStep && <div className="flex-1" />}
        {isFirstStep && <div className="flex-1" />}

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Save Draft Button (always visible except review step) */}
          {!isLastStep && (
            <Button
              variant="outline"
              size="md"
              onClick={onSaveDraft}
              disabled={isSubmitting}
              className="gap-2"
            >
              <FontAwesomeIcon icon={faSave} />
              Save Draft
            </Button>
          )}

          {/* Skip Button (optional steps) */}
          {canSkip && onSkip && !isLastStep && (
            <Button
              variant="secondary"
              size="md"
              onClick={onSkip}
              className="gap-2"
            >
              <FontAwesomeIcon icon={faForward} />
              Skip
            </Button>
          )}

          {/* Next/Continue Button */}
          {!isLastStep && (
            <Button
              size="md"
              onClick={onNext}
              disabled={!canGoNext || isSubmitting}
              className="gap-2 shadow-md hover:shadow-lg transition-shadow"
            >
              {isReviewStep ? "Review" : "Next"}
              <FontAwesomeIcon icon={faArrowRight} />
            </Button>
          )}

          {/* Review Step Actions */}
          {isLastStep && (
            <>
              <Button
                variant="outline"
                size="md"
                onClick={onSaveDraft}
                disabled={isSubmitting}
                className="gap-2"
              >
                <FontAwesomeIcon icon={faSave} />
                Save as Draft
              </Button>
              {onPublish && (
                <Button
                  size="md"
                  onClick={onPublish}
                  isLoading={isSubmitting}
                  className="gap-2 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <FontAwesomeIcon icon={faCheckCircle} />
                  Publish Game
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Step Info */}
      <div className="text-center mt-4">
        <p className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </p>
      </div>
    </div>
  );
}
