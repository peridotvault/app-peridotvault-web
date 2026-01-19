"use client";
import { useEffect, useState } from "react";
import { GameCard } from "./published.type";
import { getPublishedGames } from "./published.service";

interface UsePublishedGamesState {
  games: GameCard[];
  isLoading: boolean;
  error: string | null;
}

export function usePublishedGames({ page, limit, category_id }: {
  page?: number;
  limit?: number;
  category_id?: string;
}): UsePublishedGamesState {
  const [games, setGames] = useState<GameCard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

        const resAllGames = await getPublishedGames({ page, limit, category_id });

        setGames(resAllGames.data.data);
      } catch {
        setError("Failed to fetch games");
        // setError(err?.message ?? "Failed to fetch games");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [page, limit, category_id]);

  return { games, isLoading, error };
}
