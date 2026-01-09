"use client";
import { useEffect, useState } from "react";
import { GameCard } from "../types/published";
import { getPublishedGames } from "../services/published";

interface UsePublishedGamesState {
  games: GameCard[];
  isLoading: boolean;
  error: string | null;
}

export function usePublishedGames(): UsePublishedGamesState {
  const [games, setGames] = useState<GameCard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

        const resAllGames = await getPublishedGames();

        setGames(resAllGames.data.data);
      } catch {
        setError("Failed to fetch games");
        // setError(err?.message ?? "Failed to fetch games");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return { games, isLoading, error };
}
