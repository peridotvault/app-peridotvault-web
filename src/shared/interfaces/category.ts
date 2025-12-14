import { ApiResponse } from "./api";
import { PaginatedData } from "./pagination";

export type CategoryListResponse = ApiResponse<PaginatedData<Category>>;

export interface Category {
    category_id: string,
    name: string,
}