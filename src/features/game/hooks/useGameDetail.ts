/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { Game } from "../interfaces/game";
import { getGameDetail } from "../services/detail";

interface UseGameDetailState {
    game: Game | null;
    isLoading: boolean;
    hasFetched: boolean;
    error: string | null;
}

export function useGameDetail({ gameId }: { gameId: string }): UseGameDetailState {
    const [game, setGame] = useState<Game | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!gameId) return;

        let cancelled = false;

        (async () => {
            try {
                setIsLoading(true);
                setError(null);

                const res = await getGameDetail(gameId);
                setGame(res.data ?? null);
            } catch (e: any) {
                setError(e?.message ?? "Failed to load game");
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                    setHasFetched(true);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [gameId]);

    return { game, isLoading, hasFetched, error };
}
