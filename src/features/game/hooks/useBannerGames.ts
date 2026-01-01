"use client";
import { useEffect, useState } from "react";
import { GameBanner } from "../interfaces/banner";
import { getBannerGames } from "../services/banner";

interface UseBannerGamesState {
    games: GameBanner[];
    isLoading: boolean;
    error: string | null;
}

export function useBannerGames(): UseBannerGamesState {
    const [games, setGames] = useState<GameBanner[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                setError(null);

                const resAllGames = await getBannerGames();

                setGames(resAllGames.data?.data || []);
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
