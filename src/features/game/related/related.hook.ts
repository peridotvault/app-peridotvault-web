/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { getGameRelated } from "./related.service";
import { GameCard } from "../published/published.type";

interface UseRelatedGameState {
    games: GameCard[];
    isLoading: boolean;
    error: string | null;
}

export function useRelatedGame({
    gameId,
    limit
}: {
    gameId: string,
    limit?: number;
}): UseRelatedGameState {
    const [games, setGames] = useState<GameCard[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!gameId) return;

        let cancelled = false;

        (async () => {
            try {
                setIsLoading(true);
                setError(null);

                const res = await getGameRelated(gameId, { limit });
                if (!cancelled) setGames(res.data.data);
            } catch (e: any) {
                if (!cancelled) setError(e?.message ?? "Failed to load games");
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [gameId, limit]);

    return { games, isLoading, error };
}
