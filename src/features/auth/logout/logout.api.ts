import { http } from "@/shared/lib/http";
import type { LogoutRequest, LogoutResponse } from "./logout.type";

export async function logoutApi(payload: LogoutRequest) {
    const res = await http.post<LogoutResponse>("/api/auth/logout", payload);
    return res.data;
}
