import axios from "axios";
import type { LogoutRequest, LogoutResponse } from "./logout.type";

const baseURL =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.PUBLIC_API_BASE_URL ??
    "https://api.peridotvault.com";

export async function logoutApi(payload: LogoutRequest) {
    // Use plain axios to bypass the http interceptor
    // The interceptor tries to refresh on 401, which we don't want during logout
    const res = await axios.post<LogoutResponse>(`${baseURL}/api/auth/logout`, payload, {
        timeout: 5000,
    });
    return res.data;
}
