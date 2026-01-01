"use client";

import { useEffect, useState } from "react";
import { getUserGames, getUserDrafts, getUserPublishedGames, getGameById } from "../services/userGames";
import { StudioGame } from "../interfaces/gameForm";

export function useUserGames() {
  const [games, setGames] = useState<StudioGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getUserGames();

      if (response.success) {
        setGames(response.data || []);
      } else {
        setError(response.error || "Failed to fetch games");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return { games, isLoading, error, refetch: fetchGames };
}

export function useUserDrafts() {
  const [drafts, setDrafts] = useState<StudioGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getUserDrafts();

      if (response.success) {
        setDrafts(response.data || []);
      } else {
        setError(response.error || "Failed to fetch drafts");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return { drafts, isLoading, error, refetch: fetchDrafts };
}

export function useGameById(gameId: string) {
  const [game, setGame] = useState<StudioGame | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gameId) {
      setIsLoading(false);
      return;
    }

    fetchGame();
  }, [gameId]);

  const fetchGame = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getGameById(gameId);

      if (response.success) {
        setGame(response.data); // data can be null, which is fine for StudioGame | null
      } else {
        setError(response.error || "Failed to fetch game");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return { game, isLoading, error, refetch: fetchGame };
}
