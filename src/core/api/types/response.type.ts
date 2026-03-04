import { PaginatedData } from "./pagination.type";

export interface ApiResponse<TData> {
    success: boolean;
    message: string;
    data: TData;
    error: string | null;
}

export interface ApiResponseWithPagination<TData> {
    data: PaginatedData<TData>;
}
