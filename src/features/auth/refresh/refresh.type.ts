import { ApiResponse } from "@/core/api/types/response.type";

export type RefreshRequest = {
    refreshToken: string;
};

export type RefreshData = {
    token: string;
    expiresAt: string;
};

export type RefreshResponse = ApiResponse<RefreshData>;
