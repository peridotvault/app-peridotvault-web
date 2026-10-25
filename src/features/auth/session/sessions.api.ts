import { http } from "@/shared/lib/http";
import type {
    AuthSession,
    SessionItemRaw,
    SessionsResponse,
} from "./session.type";

/**
 * GET /v1/auth/sessions — list the caller's active sessions (ANT-530).
 * Returns normalised rows; tolerates `{ data: [...] }` and
 * `{ data: { sessions: [...] } }` envelopes. Throws on transport errors
 * (including 404 when the backend predates ANT-530) so callers can render
 * an explicit error/unavailable state instead of a silent empty list.
 */
export async function listSessionsApi(): Promise<AuthSession[]> {
    const res = await http.get<SessionsResponse>("/api/v1/auth/sessions");
    const data = (res.data ?? {}) as SessionsResponse;

    const raw: SessionItemRaw[] = Array.isArray(
        (data as { data?: unknown }).data,
    )
        ? ((data as { data: SessionItemRaw[] }).data ?? [])
        : Array.isArray((data as { sessions?: unknown }).sessions)
          ? (data as { sessions: SessionItemRaw[] }).sessions
          : [];

    return raw.map(normaliseSession).filter((s) => s.id.length > 0);
}

function pick(
    row: SessionItemRaw,
    ...keys: (keyof SessionItemRaw)[]
): string | undefined {
    for (const key of keys) {
        const value = row[key];
        if (typeof value === "string" && value.length > 0) return value;
    }
    return undefined;
}

function normaliseSession(row: SessionItemRaw): AuthSession {
    const id = pick(row, "id", "sessionId", "jti") ?? "";
    const label =
        pick(row, "deviceLabel", "device", "label", "userAgent") ??
        "Unknown device";
    const ip = pick(row, "ip", "ipAddress");
    const createdAt = pick(row, "createdAt", "created_at");
    const lastSeenAt = pick(row, "lastSeenAt", "last_seen_at", "lastActiveAt");
    const current = row.current ?? row.isCurrent ?? false;
    return { id, label, ip, createdAt, lastSeenAt, current: !!current };
}

/** Formats an ISO timestamp for the devices list; falls back to raw text. */
export function formatSessionDate(iso?: string): string | null {
    if (!iso) return null;
    const time = new Date(iso).getTime();
    if (isNaN(time)) return iso;
    return new Date(time).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    });
}
