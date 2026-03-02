"use client";

import { useEffect, useState } from "react";
import { Category } from "../types/category.type";
import { getCategoriesApi } from "@/core/api/category.api";

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

                const resAllCategories = await getCategoriesApi({ page: 1, limit: 12 });

                setCategories(resAllCategories);
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
