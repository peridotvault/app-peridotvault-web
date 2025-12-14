import { CategoryListResponse } from "@/shared/interfaces/category";
import { http } from "@/shared/lib/http";

export async function getCategories(params?: {
    page?: number;
    limit?: number;
    category?: string;
}): Promise<CategoryListResponse> {
    const res = await http.get<CategoryListResponse>("/api/categories", {
        params,
    });

    return res.data;
}