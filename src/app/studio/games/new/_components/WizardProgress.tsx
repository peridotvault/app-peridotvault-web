import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faImage, faCloudUploadAlt, faSave, faCheck } from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export interface WizardStep {
  id: string;
  label: string;
  icon: IconDefinition;
}

const WIZARD_STEPS: WizardStep[] = [
  { id: "basic-info", label: "Basic Info", icon: faInfoCircle },
  { id: "media", label: "Media", icon: faImage },
  { id: "builds", label: "Builds", icon: faCloudUploadAlt },
  { id: "review", label: "Review", icon: faSave },
] as const;

interface WizardProgressProps {
  currentStep: number;
  completedSteps: Set<number>;
  onStepClick?: (stepIndex: number) => void;
}

export function WizardProgress({ currentStep, completedSteps, onStepClick }: WizardProgressProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-md">
      <h3 className="text-lg font-semibold text-foreground mb-6">Progress</h3>

      <div className="space-y-4">
        {WIZARD_STEPS.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep === stepNumber;
          const isCompleted = completedSteps.has(stepNumber);
          const isPast = index < currentStep - 1;
          const canNavigate = onStepClick && (isCompleted || isPast || isActive);

          return (
            <div key={step.id} className="relative">
              {/* Step Item */}
              <button
                onClick={() => canNavigate && onStepClick(index)}
                disabled={!canNavigate}
                className={`
                  w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200
                  ${isActive
                    ? "bg-accent/10 border-2 border-accent shadow-md"
                    : isCompleted
                      ? "bg-success/10 border-2 border-success/50 hover:bg-success/20"
                      : "bg-muted/30 border-2 border-border hover:border-border/80"
                  }
                  ${canNavigate ? "cursor-pointer" : "cursor-default"}
                `}
              >
                {/* Step Circle */}
                <div
                  className={`
                    w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                    transition-all duration-200
                    ${isActive
                      ? "bg-accent text-white shadow-lg scale-110"
                      : isCompleted
                        ? "bg-success text-white"
                        : "bg-muted text-muted-foreground"
                    }
                  `}
                >
                  {isCompleted ? (
                    <FontAwesomeIcon icon={faCheck} className="text-lg" />
                  ) : (
                    <FontAwesomeIcon icon={step.icon} className="text-lg" />
                  )}
                </div>

                {/* Step Info */}
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span
                      className={`
                        font-semibold
                        ${isActive ? "text-accent" : isCompleted ? "text-success" : "text-foreground"}
                      `}
                    >
                      {step.label}
                    </span>
                    {isCompleted && (
                      <span className="text-xs text-success font-medium">Completed</span>
                    )}
                  </div>
                  {isActive && (
                    <p className="text-sm text-muted-foreground mt-1">In progress...</p>
                  )}
                </div>
              </button>

              {/* Connecting Line */}
              {index < WIZARD_STEPS.length - 1 && (
                <div className="flex justify-center">
                  <div
                    className={`
                      w-0.5 h-6 my-2
                      ${isCompleted ? "bg-success" : "bg-border"}
                    `}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Overall Progress */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Overall Progress</span>
          <span className="text-sm font-bold text-accent">
            {Math.round((completedSteps.size / WIZARD_STEPS.length) * 100)}%
          </span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent to-accent/70 transition-all duration-500"
            style={{ width: `${(completedSteps.size / WIZARD_STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export { WIZARD_STEPS };
