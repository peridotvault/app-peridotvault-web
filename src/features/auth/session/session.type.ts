import { ApiResponse } from "@/core/api/types/response.type";

/**
 * One entry of GET /v1/auth/sessions (ANT-530 backend, ANT-520 §9).
 * Field mapping is intentionally lenient — the backend shape is still being
 * finalised on ANT-530, so the client normalises several near-variants and
 * treats every field except `id` as optional. See sessions.api.ts.
 */
export type SessionItemRaw = {
    id?: string;
    sessionId?: string;
    jti?: string;
    device?: string;
    deviceLabel?: string;
    label?: string;
    userAgent?: string;
    ip?: string;
    ipAddress?: string;
    createdAt?: string;
    created_at?: string;
    lastSeenAt?: string;
    last_seen_at?: string;
    lastActiveAt?: string;
    current?: boolean;
    isCurrent?: boolean;
};

/** Normalised session row rendered by the "Your devices" list. */
export type AuthSession = {
    id: string;
    label: string;
    ip?: string;
    createdAt?: string;
    lastSeenAt?: string;
    current: boolean;
};

export type SessionsResponse =
    | ApiResponse<AuthSession[] | SessionItemRaw[]>
    | ApiResponse<{ sessions: SessionItemRaw[] }>
    | { sessions: SessionItemRaw[] };
