import { http } from "@/shared/lib/http";
import { CategoryApi } from "./category.api.type";
import { ApiResponse, ApiResponseWithPagination } from "./types/response.type";

function getPaginatedItems<T>(res: { data?: ApiResponseWithPagination<T> }): T[] {
    return res.data?.data?.data ?? [];
}

export async function getCategoriesApi(params?: {
    page?: number;
    limit?: number
}): Promise<Array<CategoryApi>> {
    const res = await http.get<ApiResponseWithPagination<CategoryApi>>("/api/categories", {
        params,
    });

    return getPaginatedItems(res);
}

export async function getFavoriteCategoriesApi(params?: {
    page?: number;
    limit?: number
}): Promise<Array<CategoryApi>> {
    const res = await http.get<ApiResponseWithPagination<CategoryApi>>("/api/categories", {
        params,
    });

    return getPaginatedItems(res);
}

export async function getCategorieByIdApi(params: {
    page?: number;
    limit?: number;
    category_id: string;
}): Promise<CategoryApi> {
    const res = await http.get<ApiResponse<CategoryApi>>(`/api/categories/${params?.category_id}`, {
        params,
    });

    return res.data.data;
}
