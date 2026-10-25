/**
 * Peridot ID session helpers — storefront (spec ANT-511 §3.3).
 *
 * Hard constraint (spec §3.3): Peridot ID login/checkout uses
 * BROWSER NAVIGATION ONLY. Never `fetch()` the Peridot ID login or
 * checkout URL — cross-origin `fetch` is CORS-blocked and popup
 * first-party flows (`transferInquiry` in popup) throw. Always navigate
 * the top-level window (`window.location.assign`) and let Peridot ID /
 * DOKU pages run first-party, then return to `returnTo`.
 *
 * The PeridotVault API verifies the Peridot session server-side
 * (`POST /v1/auth/peridot-session`); this module only starts the
 * navigation and reads the resulting local session via the existing
 * session plumbing.
 */

function getPeridotIdBaseUrl(): string {
  const base =
    process.env.NEXT_PUBLIC_PERIDOT_ID_URL ??
    process.env.NEXT_PUBLIC_PERIDOT_WALLET_URL ??
    "";
  if (!base) {
    throw new Error(
      "Peridot ID URL is not configured (set NEXT_PUBLIC_PERIDOT_ID_URL).",
    );
  }
  return base.replace(/\/$/, "");
}

/** Start Peridot ID login in the top-level window (no fetch, no popup). */
export function startPeridotLogin(returnTo?: string): void {
  const base = getPeridotIdBaseUrl();
  const url = new URL("/login", base);
  const fallbackReturn =
    typeof window !== "undefined" ? window.location.href : "/";
  url.searchParams.set("returnTo", returnTo ?? fallbackReturn);
  window.location.assign(url.toString());
}

/** Start Peridot ID account claim (mint `<handle>@pid`) via navigation. */
export function startPeridotClaim(returnTo?: string): void {
  const base = getPeridotIdBaseUrl();
  const url = new URL("/claim", base);
  const fallbackReturn =
    typeof window !== "undefined" ? window.location.href : "/";
  url.searchParams.set("returnTo", returnTo ?? fallbackReturn);
  window.location.assign(url.toString());
}

/** Whether Peridot ID login is configured in this build. */
export function isPeridotLoginConfigured(): boolean {
  try {
    getPeridotIdBaseUrl();
    return true;
  } catch {
    return false;
  }
}
