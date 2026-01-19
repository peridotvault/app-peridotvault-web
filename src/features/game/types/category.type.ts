import { ApiResponse } from "@/shared/types/api";
import { PaginatedData } from "@/shared/types/pagination";

export type CategoryListResponse = ApiResponse<PaginatedData<Category>>;

export interface Category {
    category_id: string,
    name: string,
    cover_image: string,
}
