"use client";

import { useEffect, useState } from "react";
import { Category } from "../interfaces/category";
import { getCategories } from "@/app/(main)/_services/getCategory";

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

                const resAllCategories = await getCategories();

                setCategories(resAllCategories.data?.data || []);
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