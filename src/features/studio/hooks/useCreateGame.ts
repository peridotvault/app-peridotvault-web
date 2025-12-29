"use client";

import { useState } from "react";
import { createGame } from "../services/createGame";
import { GameFormData, StudioGame, FormErrors } from "../interfaces/gameForm";

export function useCreateGame() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [game, setGame] = useState<StudioGame | null>(null);

  const createNewGame = async (formData: GameFormData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await createGame(formData);

      if (response.success) {
        setGame(response.data);
        return { success: true };
      } else {
        setError(response.error || "Failed to create game");
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
    createNewGame,
    isLoading,
    error,
    game,
  };
}
