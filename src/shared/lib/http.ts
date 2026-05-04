import { authRepo } from "@/core/db/repositories/auth.repo";
import { useAuthStore } from "@/features/auth/_store/auth.store";
import { refreshApi } from "@/features/auth/refresh/refresh.api";
import { toastService } from "@/core/ui-system/toast/toast.service";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const baseURL =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.PUBLIC_API_BASE_URL ??
    "https://api.peridotvault.com";

export const http = axios.create({
    baseURL,
    timeout: 15_000,
});

// ─── Proactive refresh timer ───────────────────────────────────────
let refreshTimer: ReturnType<typeof setTimeout> | null = null;

const FIVE_MINUTES = 5 * 60 * 1000;

function scheduleProactiveRefresh(expiresAtIso: string) {
    cancelProactiveRefresh();

    const expiresAt = new Date(expiresAtIso).getTime();
    if (isNaN(expiresAt)) return;

    const now = Date.now();
    const delay = expiresAt - now - FIVE_MINUTES;

    // Already expired or too close — refresh now
    if (delay <= 0) {
        refreshTokenSingleFlight().catch(() => {});
        return;
    }

    refreshTimer = setTimeout(() => {
        refreshTokenSingleFlight().catch(() => {});
    }, delay);
}

function cancelProactiveRefresh() {
    if (refreshTimer) {
        clearTimeout(refreshTimer);
        refreshTimer = null;
    }
}

// ─── Session hydration on app init ─────────────────────────────────
let hydrated = false;

async function hydrateSession() {
    if (hydrated) return;
    hydrated = true;

    const session = await authRepo.getSession();
    if (!session?.token || !session?.refresh_token) {
        useAuthStore.getState().setStatus("anonymous");
        return;
    }

    const expiresAt = session.expires_at ? new Date(session.expires_at).getTime() : 0;

    if (expiresAt && expiresAt < Date.now()) {
        // Token expired — try refresh immediately
        try {
            await refreshTokenSingleFlight();
        } catch {
            useAuthStore.getState().setStatus("expired");
        }
        return;
    }

    useAuthStore.getState().setToken(session.token);
    useAuthStore.getState().setStatus("authenticated");

    if (session.expires_at) {
        scheduleProactiveRefresh(session.expires_at);
    }
}

// ─── REQUEST: attach Authorization + hydrate ────────────────────────
http.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    await hydrateSession();

    const inMemory = useAuthStore.getState().token;
    if (inMemory) {
        config.headers.Authorization = `Bearer ${inMemory}`;
        return config;
    }

    const session = await authRepo.getSession();
    if (session?.token) {
        config.headers.Authorization = `Bearer ${session.token}`;
        useAuthStore.getState().setToken(session.token);
    }

    return config;
});

// ─── RESPONSE: refresh on 401 (single-flight) ──────────────────────
let refreshPromise: Promise<string> | null = null;

async function refreshTokenSingleFlight(): Promise<string> {
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
        const session = await authRepo.getSession();
        if (!session?.refresh_token) throw new Error("NO_REFRESH_TOKEN");

        const refreshed = await refreshApi({ refreshToken: session.refresh_token });
        await authRepo.updateToken(refreshed.token, refreshed.expiresAt);
        useAuthStore.getState().setToken(refreshed.token);
        useAuthStore.getState().setStatus("authenticated");

        // Schedule next proactive refresh
        scheduleProactiveRefresh(refreshed.expiresAt);

        return refreshed.token;
    })();

    try {
        return await refreshPromise;
    } finally {
        refreshPromise = null;
    }
}

http.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const status = error.response?.status;
        const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

        if (status !== 401 || !original) {
            return Promise.reject(error);
        }

        if (original._retry) {
            // Refresh already attempted and failed — session truly expired
            cancelProactiveRefresh();
            useAuthStore.getState().setToken(null);
            useAuthStore.getState().setStatus("expired");
            return Promise.reject(error);
        }
        original._retry = true;

        try {
            const newToken = await refreshTokenSingleFlight();
            original.headers = original.headers ?? {};
            original.headers.Authorization = `Bearer ${newToken}`;
            return http.request(original);
        } catch {
            // Refresh failed — expire gracefully (keep Dexie for re-login context)
            cancelProactiveRefresh();
            useAuthStore.getState().setToken(null);
            useAuthStore.getState().setStatus("expired");
            return Promise.reject(error);
        }
    }
);
