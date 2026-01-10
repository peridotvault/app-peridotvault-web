import { logoutApi } from "./logout.api";
import { useAuthStore } from "../_store/auth.store";
import { clearSession, getSession } from "../_db/db.service";

export async function logoutEverywhere() {
    // 1) ambil refreshToken dari Dexie
    const session = await getSession();

    // 2) best effort revoke di server (jangan bikin user “gagal logout” hanya karena server error)
    if (session?.refreshToken) {
        try {
            const res = await logoutApi({ refreshToken: session.refreshToken });
            // optional: bisa cek res.success, tapi tetap lanjut clear local
            void res;
        } catch {
            // ignore network/backend error
        }
    }

    // 3) clear local
    await clearSession();

    // 4) reset in-memory auth state
    useAuthStore.getState().setToken(null);
    useAuthStore.getState().setStatus("anonymous");
}
