import { ApiResponse } from "@/shared/types/api";

export type LogoutRequest = {
    refreshToken: string;
};

export type LogoutResponse = ApiResponse<null>;
