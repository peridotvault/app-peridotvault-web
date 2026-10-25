/**
 * Client/server contract for refresh-family revocation (ANT-531 / ANT-530).
 *
 * Backend (Tyler, ANT-530) implements YouTube-style sessions per ANT-520 §9:
 * 30d sliding refresh + rotation + reuse detection. When a revoked or unknown
 * refresh token is presented, the server revokes the whole token family and
 * answers the refresh call with HTTP 401 and a DISTINCT error code so the
 * web client can tell "signed out for security" apart from a plain expiry.
 *
 * Canonical code proposed to the backend — `REFRESH_FAMILY_REVOKED`.
 * Status (2026-10-25): proposed by web client (ANT-531); Tyler to confirm or
 * counter on ANT-530. The detector below is alias-tolerant on purpose so the
 * client keeps working whatever near-variant the server ships, as long as it
 * contains the `FAMILY_REVOKED` marker. If the server ships a code WITHOUT
 * that marker, update `FAMILY_REVOKED_CODES` here and in the API docs.
 */

export const FAMILY_REVOKED_CODE = "REFRESH_FAMILY_REVOKED";

/** Near-variants the client also accepts (exact match, case-sensitive). */
export const FAMILY_REVOKED_CODES = [
    FAMILY_REVOKED_CODE,
    "SESSION_FAMILY_REVOKED",
    "FAMILY_REVOKED",
] as const;

/** Substring marker — matches any `*_FAMILY_REVOKED` code, any casing. */
const FAMILY_REVOKED_MARKER = "FAMILY_REVOKED";

function containsMarker(value: unknown): boolean {
    return (
        typeof value === "string" &&
        value.toUpperCase().includes(FAMILY_REVOKED_MARKER)
    );
}

/**
 * Returns true when `error` (AxiosError, thrown Error, or raw response body)
 * carries a family-revoked code. Inspects, in order:
 *  - response body fields: `error`, `code`, `message`
 *  - thrown `Error.message` (refreshApi rethrows backend `error` as message)
 */
export function isFamilyRevokedError(error: unknown): boolean {
    if (!error || typeof error !== "object") return false;

    const err = error as {
        response?: { data?: unknown };
        message?: unknown;
    };

    const data = err.response?.data;
    if (data && typeof data === "object") {
        const body = data as Record<string, unknown>;
        if (
            containsMarker(body.error) ||
            containsMarker(body.code) ||
            containsMarker(body.message)
        ) {
            return true;
        }
    } else if (containsMarker(data)) {
        return true;
    }

    if (containsMarker(err.message)) return true;

    return false;
}
