import { ApiResponse } from "@/core/api/types/response.type";

export type LogoutRequest = {
    refreshToken: string;
    /**
     * Revoke the whole refresh-token family on the server (all devices),
     * per ANT-520 §9 / ANT-530. Unknown extra fields are ignored by older
     * backends, which then degrade to single-session logout — the local
     * session is still cleared in both cases.
     */
    allDevices?: boolean;
};

export type LogoutResponse = ApiResponse<null>;
