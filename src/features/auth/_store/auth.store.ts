import { create } from "zustand";

export type AuthStatus = "anonymous" | "authenticated" | "loading" | "expired";

/**
 * Why the local session was dropped outside an explicit logout.
 * `family-revoked` = server reported refresh-family reuse/revocation
 * (see session-code.ts) — the UI must say "signed out for security",
 * not a plain "session expired" copy.
 */
export type RevokedReason = "family-revoked" | null;

type AuthState = {
    status: AuthStatus;
    token: string | null;
    revokedReason: RevokedReason;

    setToken: (t: string | null) => void;
    setStatus: (s: AuthStatus) => void;
    setRevokedReason: (r: RevokedReason) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    status: "loading",
    token: null,
    revokedReason: null,
    setToken: (t) => set({ token: t }),
    setStatus: (s) => set({ status: s }),
    setRevokedReason: (r) => set({ revokedReason: r }),
}));
