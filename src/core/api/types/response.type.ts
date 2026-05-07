import { PaginatedData } from "./pagination.type";

export interface ApiResponse<TData> {
    success: boolean;
    message: string;
    data: TData;
    error: string | null;
}

export interface ApiResponseWithPagination<TData> {
    success: boolean;
    message: string;
    data: PaginatedData<TData>;
    error: string | null;
}

export interface ApiResponseV1Meta {
    requestId: string;
    timestamp: string;
    version: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface ApiResponseV1<TData> {
    success: boolean;
    message: string;
    data: TData;
    error: string | null;
    meta: ApiResponseV1Meta;
}
