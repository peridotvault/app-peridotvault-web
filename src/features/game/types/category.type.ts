import { ApiResponse } from "@/core/api/types/response.type";
import { PaginatedData } from "@/core/api/types/pagination.type";

export type CategoryListResponse = ApiResponse<PaginatedData<Category>>;

export interface Category {
    category_id: string,
    name: string,
    cover_image: string,
}
