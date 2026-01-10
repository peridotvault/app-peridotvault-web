import { setSession } from "../_db/db.service";
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

    await setSession({
        token: res.data.token,
        refreshToken: res.data.refreshToken,
        expiresAt: res.data.expiresAt,

        accountId: payload.accountId,
        accountType: payload.accountType,
    });

    useAuthStore.getState().setToken(res.data.token);
    useAuthStore.getState().setStatus("authenticated");

    return res.data;
}
