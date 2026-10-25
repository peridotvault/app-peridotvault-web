import {
  createFiatIntentApi,
  syncFiatIntentApi,
} from "@/core/api/fiat.api";
import type {
  FiatIntent,
  FiatStatus,
} from "@/core/api/fiat.api.type";

export type FiatRedirectStep =
  | "quoting"
  | "creating-intent"
  | "redirecting"
  | "polling"
  | "completed"
  | "error";

/**
 * Fiat checkout orchestration (spec ANT-511 §3.4).
 *
 * Hard constraints:
 * - Checkout login/DOKU handoff uses BROWSER NAVIGATION ONLY
 *   (`window.location.assign`). Never `fetch()` the Peridot ID / DOKU URL:
 *   cross-origin redirects are CORS-blocked and DOKU pages must run
 *   first-party (spec §3.3 sad paths).
 * - After the buyer returns, corroborate via `syncTransaction` polling —
 *   webhooks may lag (spec §3.4).
 */
export class FiatCheckoutService {
  /**
   * Create a fiat intent then hand the browser to DOKU Checkout.
   * Returns the intent (with providerRef) for return-polling.
   */
  static async startCheckout(
    input: {
      gameId: string;
      netAmountIdr: string;
      paymentMethod?: string;
      peridotAppClientId?: string;
    },
    onStep?: (step: FiatRedirectStep, message?: string) => void,
  ): Promise<FiatIntent> {
    onStep?.("creating-intent", "Creating fiat payment intent...");
    const response = await createFiatIntentApi({
      gameId: input.gameId,
      netAmountIdr: input.netAmountIdr,
      paymentMethod: input.paymentMethod,
      peridotAppClientId: input.peridotAppClientId,
    });

    const intent = (response as unknown as { data?: FiatIntent }).data ?? (response as unknown as FiatIntent);
    if (!intent?.paymentUrl) {
      throw new Error("Fiat intent missing paymentUrl — cannot redirect to checkout.");
    }

    onStep?.("redirecting", "Redirecting to secure checkout...");
    // Browser navigation only — never fetch() this URL (spec §3.3).
    window.location.assign(intent.paymentUrl);
    return intent;
  }

  /**
   * Poll `syncTransaction` after the buyer returns from DOKU.
   * Resolves on terminal status; rejects on timeout.
   */
  static async pollUntilTerminal(
    intentId: string,
    options: { intervalMs?: number; timeoutMs?: number } = {},
    onStep?: (step: FiatRedirectStep, message?: string) => void,
  ): Promise<{ status: FiatStatus; purchaseStatus?: string }> {
    const intervalMs = options.intervalMs ?? 2500;
    const timeoutMs = options.timeoutMs ?? 120_000;
    const startedAt = Date.now();

    onStep?.("polling", "Confirming payment...");

    for (;;) {
      const response = await syncFiatIntentApi(intentId);
      const payload = (response as unknown as { data?: { status: FiatStatus; purchaseStatus?: string } }).data
        ?? (response as unknown as { status: FiatStatus; purchaseStatus?: string });

      if (payload.status === "success" || payload.status === "failed" || payload.status === "cancelled") {
        onStep?.("completed");
        return { status: payload.status, purchaseStatus: payload.purchaseStatus };
      }

      if (Date.now() - startedAt > timeoutMs) {
        throw new Error("Payment confirmation timed out. Your purchase stays pending — retry from your library.");
      }

      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
  }
}
