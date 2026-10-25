import { authRepo } from "@/core/db/repositories/auth.repo";
import { useAuthStore } from "../_store/auth.store";
import { verifyApi } from "./verify.api";
import { VerifyRequest } from "./verify.type";

const VERIFY_TIMEOUT = 5_000;

export async function verifyAndCreateSession(payload: VerifyRequest) {
    useAuthStore.getState().setStatus("loading");

    try {
        const res = await Promise.race([
            verifyApi(payload),
            new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error("Verify API timeout")), VERIFY_TIMEOUT)
            ),
        ]);

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
    } catch (error) {
        useAuthStore.getState().setStatus("anonymous");
        throw error;
    }
}
