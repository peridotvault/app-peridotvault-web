import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

export type StepStatus = "pending" | "active" | "completed" | "error";

export type Step = {
  label: string;
  status: StepStatus;
  description?: string;
};

interface StepperProps {
  steps: Step[];
  className?: string;
}

function StepIcon({ status, index }: { status: StepStatus; index: number }) {
  return (
    <div
      className={clsx(
        "relative flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors duration-300",
        {
          "border-muted bg-background text-muted-foreground": status === "pending",
          "border-primary bg-primary text-primary-foreground": status === "active",
          "border-green-500 bg-green-500 text-white": status === "completed",
          "border-red-500 bg-red-500 text-white": status === "error",
        },
      )}
    >
      {status === "completed" ? (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : status === "error" ? (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <span>{index + 1}</span>
      )}
      {status === "active" && (
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-primary"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
}

export function Stepper({ steps, className }: StepperProps) {
  return (
    <div className={clsx("flex flex-col gap-0", className)}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        return (
          <div key={index} className="flex gap-3">
            <div className="flex flex-col items-center">
              <StepIcon status={step.status} index={index} />
              {!isLast && (
                <div
                  className={clsx("w-0.5 flex-1 transition-colors duration-500", {
                    "bg-green-500": step.status === "completed",
                    "bg-muted": step.status !== "completed",
                  })}
                />
              )}
            </div>
            <div className={clsx("pb-6 pt-1", isLast && "pb-0")}>
              <p
                className={clsx("text-sm font-medium transition-colors duration-300", {
                  "text-muted-foreground": step.status === "pending",
                  "text-foreground": step.status === "active" || step.status === "completed",
                  "text-red-500": step.status === "error",
                })}
              >
                {step.label}
              </p>
              <AnimatePresence>
                {step.description && (step.status === "active" || step.status === "error") && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={clsx("mt-0.5 text-xs", {
                      "text-muted-foreground": step.status === "active",
                      "text-red-400": step.status === "error",
                    })}
                  >
                    {step.description}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}
