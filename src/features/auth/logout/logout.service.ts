import { logoutApi } from "./logout.api";
import { useAuthStore } from "../_store/auth.store";
import { authRepo } from "@/core/db/repositories/auth.repo";

export async function logoutEverywhere() {
    // eslint-disable-next-line no-console
    console.log("[logout] Starting logout process...");

    // 1) ambil refreshToken dari Dexie
    const session = await authRepo.getSession();
    // eslint-disable-next-line no-console
    console.log("[logout] Session found:", !!session);

    // 2) best effort revoke di server (jangan bikin user "gagal logout" hanya karena server error)
    if (session?.refresh_token) {
        try {
            // Add timeout to prevent hanging
            const logoutPromise = logoutApi({ refreshToken: session.refresh_token });
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Logout API timeout")), 5000)
            );
            const res = await Promise.race([logoutPromise, timeoutPromise]) as { success: boolean };
            // eslint-disable-next-line no-console
            console.log("[logout] Server logout response:", res.success);
        } catch (e) {
            // ignore network/backend error - this is best effort
            // eslint-disable-next-line no-console
            console.log("[logout] Server logout failed (ignored):", e);
        }
    }

    // 3) clear local - wrap in try/catch to ensure state is always reset
    try {
        await authRepo.clearSession();
        // eslint-disable-next-line no-console
        console.log("[logout] Local session cleared");
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error("[logout] Failed to clear session from storage:", e);
    }

    // 4) reset in-memory auth state (ALWAYS do this, even if storage clear fails)
    // eslint-disable-next-line no-console
    console.log("[logout] Setting auth state to anonymous");
    useAuthStore.getState().setToken(null);
    useAuthStore.getState().setStatus("anonymous");
    // eslint-disable-next-line no-console
    console.log("[logout] Logout complete");
}
