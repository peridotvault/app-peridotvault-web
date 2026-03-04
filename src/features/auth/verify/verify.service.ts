import { authRepo } from "@/core/db/repositories/auth.repo";
import { useAuthStore } from "../_store/auth.store";
import { verifyApi } from "./verify.api";
import { VerifyRequest } from "./verify.type";

export async function verifyAndCreateSession(payload: VerifyRequest) {
    useAuthStore.getState().setStatus("loading");

    const res = await verifyApi(payload);
    if (!res.success || !res.data) {
        useAuthStore.getState().setStatus("anonymous");
        throw new Error(res.error ?? "VERIFY_FAILED");
    }

    await authRepo.setSession({
        token: res.data.token,
        refresh_token: res.data.refreshToken,
        expires_at: res.data.expiresAt,

        account_id: payload.accountId,
        account_type: payload.accountType,
    });

    useAuthStore.getState().setToken(res.data.token);
    useAuthStore.getState().setStatus("authenticated");

    return res.data;
}
