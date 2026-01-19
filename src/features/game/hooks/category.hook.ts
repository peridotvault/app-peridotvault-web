"use client";

import { useEffect, useState } from "react";
import { getCategories } from "@/features/game/services/category.service";
import { Category } from "../types/category.type";

interface UseCategoriesState {
    categories: Category[];
    isLoading: boolean;
    error: string | null;
}

export function useGetCategories(): UseCategoriesState {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                setError(null);

                const resAllCategories = await getCategories({ page: 1, limit: 12 });

                setCategories(resAllCategories.data.data);
            } catch {
                setError("Failed to fetch games");
                // setError(err?.message ?? "Failed to fetch games");
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, []);

    return { categories, isLoading, error };
}
