import { ApiResponse } from "@/core/api/types/response.type";

export type LogoutRequest = {
    refreshToken: string;
};

export type LogoutResponse = ApiResponse<null>;
