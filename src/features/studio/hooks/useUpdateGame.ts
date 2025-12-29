"use client";

import { useState } from "react";
import { updateGame } from "../services/updateGame";
import { GameFormData, StudioGame } from "../interfaces/gameForm";

export function useUpdateGame() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [game, setGame] = useState<StudioGame | null>(null);

  const updateExistingGame = async (
    gameId: string,
    formData: GameFormData
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await updateGame(gameId, formData);

      if (response.success) {
        setGame(response.data);
        return { success: true };
      } else {
        setError(response.error || "Failed to update game");
        return { success: false, error: response.error || undefined };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateExistingGame,
    isLoading,
    error,
    game,
  };
}
