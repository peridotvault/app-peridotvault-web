import { http } from "@/shared/lib/http";
import type { RefreshRequest, RefreshResponse, RefreshData } from "./refresh.type";

export async function refreshApi(payload: RefreshRequest): Promise<RefreshData> {
    // penting: refresh tidak butuh Authorization (boleh ada, tapi tidak wajib)
    const res = await http.post<RefreshResponse>("/api/auth/refresh", payload);

    if (!res.data.success || !res.data.data) {
        throw new Error(res.data.error ?? "REFRESH_FAILED");
    }

    return res.data.data;
}
