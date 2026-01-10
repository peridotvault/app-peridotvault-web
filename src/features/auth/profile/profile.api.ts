import { http } from "@/shared/lib/http";
import type { ProfileResponse } from "./profile.type";

export async function profileApi() {
    const res = await http.get<ProfileResponse>("/api/auth/profile");
    return res.data;
}
