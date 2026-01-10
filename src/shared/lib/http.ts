import { clearSession, getSession, updateToken } from "@/features/auth/_db/db.service";
import { useAuthStore } from "@/features/auth/_store/auth.store";
import { refreshApi } from "@/features/auth/refresh/refresh.api";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const baseURL =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.PUBLIC_API_BASE_URL ?? // fallback kalau Anda belum rename env
    "https://api.peridotvault.com";

export const http = axios.create({
    baseURL,
    timeout: 15_000,
});

// http.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// ---------- REQUEST: attach Authorization ----------
http.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const inMemory = useAuthStore.getState().token;
    if (inMemory) {
        config.headers.Authorization = `Bearer ${inMemory}`;
        return config;
    }

    const session = await getSession();
    if (session?.token) {
        config.headers.Authorization = `Bearer ${session.token}`;
        // hydrate memory agar request berikutnya cepat
        useAuthStore.getState().setToken(session.token);
    }

    return config;
});


// ---------- RESPONSE: refresh on 401 (single-flight) ----------
let refreshPromise: Promise<string> | null = null;

async function refreshTokenSingleFlight(): Promise<string> {
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
        const session = await getSession();
        if (!session?.refreshToken) throw new Error("NO_REFRESH_TOKEN");

        const refreshed = await refreshApi({ refreshToken: session.refreshToken });
        // refresh response Anda: data.token + data.expiresAt
        await updateToken(refreshed.token, refreshed.expiresAt);
        useAuthStore.getState().setToken(refreshed.token);
        useAuthStore.getState().setStatus("authenticated");

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

        // kalau bukan 401 atau tidak ada config, lempar
        if (status !== 401 || !original) {
            return Promise.reject(error);
        }

        // hindari loop retry
        if (original._retry) {
            await clearSession();
            useAuthStore.getState().setToken(null);
            useAuthStore.getState().setStatus("anonymous");
            return Promise.reject(error);
        }
        original._retry = true;

        try {
            const newToken = await refreshTokenSingleFlight();
            original.headers = original.headers ?? {};
            original.headers.Authorization = `Bearer ${newToken}`;

            return http.request(original);
        } catch (e) {
            await clearSession();
            useAuthStore.getState().setToken(null);
            useAuthStore.getState().setStatus("anonymous");
            return Promise.reject(error);
        }
    }
);