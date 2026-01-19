import { http } from "@/shared/lib/http";
import { CategoryListResponse } from "../types/category.type";

export async function getCategories(params?: {
    page?: number;
    limit?: number
}): Promise<CategoryListResponse> {
    const res = await http.get<CategoryListResponse>("/api/categories", {
        params,
    });

    return res.data;
}
