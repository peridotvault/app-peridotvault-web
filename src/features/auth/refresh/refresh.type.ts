import { ApiResponse } from "@/shared/types/api";

export type RefreshRequest = {
    refreshToken: string;
};

export type RefreshData = {
    token: string;
    expiresAt: string;
};

export type RefreshResponse = ApiResponse<RefreshData>;
