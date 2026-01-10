import { create } from "zustand";

export type AuthStatus = "anonymous" | "authenticated" | "loading";

type AuthState = {
    status: AuthStatus;
    token: string | null;

    setToken: (t: string | null) => void;
    setStatus: (s: AuthStatus) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    status: "authenticated",
    token: null,
    setToken: (t) => set({ token: t }),
    setStatus: (s) => set({ status: s }),
}));
