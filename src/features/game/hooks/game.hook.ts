/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { getGamesApi, getBannerGamesApi, getTopGamesApi, getGameRelatedApi, getGameDetailApi } from "../../../core/api/game.api";
import { GameBanner } from "../types/game.type";
import { GameApi, GameDetailApi, GameTopApi } from "@/core/api/game.api.type";

export function usePublishedGames({ page, limit, category_id }: {
    page?: number;
    limit?: number;
    category_id?: string;
}): {
    games: GameApi[];
    isLoading: boolean;
    error: string | null;
} {
    const [games, setGames] = useState<GameApi[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                setError(null);

                const resAllGames = await getGamesApi({ page, limit, category_id });

                console.log(resAllGames);

                setGames(resAllGames);
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

                const resAllGames = await getBannerGamesApi();

                setGames(resAllGames);
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
    games: GameTopApi[];
    isLoading: boolean;
    error: string | null;
} {
    const [games, setGames] = useState<GameTopApi[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                setError(null);

                const resAllGames = await getTopGamesApi();

                setGames(resAllGames);
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
    games: GameApi[];
    isLoading: boolean;
    error: string | null;
} {
    const [games, setGames] = useState<GameApi[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!gameId) return;

        let cancelled = false;

        (async () => {
            try {
                setIsLoading(true);
                setError(null);

                const res = await getGameRelatedApi(gameId, { limit });
                if (!cancelled) setGames(res);
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
    game: GameDetailApi | null;
    isLoading: boolean;
    hasFetched: boolean;
    error: string | null;
} {
    const [game, setGame] = useState<GameDetailApi | null>(null);
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

                const res = await getGameDetailApi(gameId);
                console.log(res);
                setGame(res);
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
