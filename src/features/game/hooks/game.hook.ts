/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { getPublishedGames, getBannerGames, getTopGames, getGameRelated, getGameDetail } from "../services/game.service";
import { GameCard, GameBanner, Game } from "../types/game.type";

export function usePublishedGames({ page, limit, category_id }: {
    page?: number;
    limit?: number;
    category_id?: string;
}): {
    games: GameCard[];
    isLoading: boolean;
    error: string | null;
} {
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


export function useBannerGames(): {
    games: GameBanner[];
    isLoading: boolean;
    error: string | null;
} {
    const [games, setGames] = useState<GameBanner[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                setError(null);

                const resAllGames = await getBannerGames();

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

export function useTopGames(): {
    games: GameCard[];
    isLoading: boolean;
    error: string | null;
} {
    const [games, setGames] = useState<GameCard[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                setError(null);

                const resAllGames = await getTopGames();

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

export function useRelatedGame({
    gameId,
    limit
}: {
    gameId: string,
    limit?: number;
}): {
    games: GameCard[];
    isLoading: boolean;
    error: string | null;
} {
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

export function useGameDetail({ gameId }: { gameId: string }): {
    game: Game | null;
    isLoading: boolean;
    hasFetched: boolean;
    error: string | null;
} {
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
                console.log(res.data);
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
