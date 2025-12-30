import { useState } from "react";
import { useCreateGame } from "./useCreateGame";
import { GameFormData } from "../interfaces/gameForm";

interface SubmissionResult {
  success: boolean;
  error?: string;
}

export function useGameFormSubmission() {
  const { createNewGame } = useCreateGame();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: GameFormData): Promise<SubmissionResult> => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createNewGame(formData);

      if (result.success) {
        return { success: true };
      } else {
        const errorMessage = result.error || "Failed to create game";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    handleSubmit,
    isSubmitting,
    error,
    clearError,
  };
}
