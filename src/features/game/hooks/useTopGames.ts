"use client";
import { useEffect, useState } from "react";
import { GameCard } from "../interfaces/published";
import { getTopGames } from "../services/topGames";

interface UseTopGamesState {
    games: GameCard[];
    isLoading: boolean;
    error: string | null;
}

export function useTopGames(): UseTopGamesState {
    const [games, setGames] = useState<GameCard[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                setError(null);

                const resAllGames = await getTopGames();
                console.log(resAllGames);

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
