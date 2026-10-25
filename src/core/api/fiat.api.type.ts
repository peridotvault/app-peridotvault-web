/**
 * Fiat purchase API contract types (spec ANT-511 §5 — Contract-first,
 * updated for policy ANT-519-v1 §1.3 via ANT-521/ANT-526).
 *
 * Backend endpoints (peridotvault-api owns them; may 404 until shipped):
 * - POST /v1/purchases/quote       {gameId, payment_mode} -> FiatQuote
 * - POST /v1/purchases/fiat-intent {gameId, netAmountIdr, paymentMethod?} -> FiatIntent
 * - POST /v1/purchases/fiat-confirm + POST /v1/webhooks/peridot-fiat (server-side)
 * - GET  /v1/purchases/fiat/:intentId/sync (return polling via syncTransaction)
 *
 * All money fields are strings; currency is explicit (`IDR`).
 *
 * Policy ANT-519 §1.3 semantics:
 * - `grossIdr` is the GAME LIST PRICE (changed from buyer-total-incl-fees).
 * - `totalIdr` is the buyer gross-up total (list + transferFee + appFee).
 * - `vaultCutIdr` / `developerNetIdr` is the 10% marketplace split
 *   (developerNet = round(G*0.90), vaultCut = G - developerNet).
 * - Legacy aliases (`netIdr`, `feeIdr`, `amountIdr`) are still returned by
 *   the backend but deprecated — read `grossIdr` first, fall back to them.
 */

export type FiatStatus = "pending" | "success" | "failed" | "cancelled";

/** Policy revision stamped on fee-split rows (ANT-519 §1.3). */
export const FIAT_POLICY_REVISION = "ANT-519-v1" as const;

export interface FiatQuoteRequest {
  gameId: string;
  payment_mode: "fiat";
}

export interface FiatQuote {
  /** Game id the quote was priced for (policy §1.3). */
  gameId?: string;
  /**
   * Game list price, IDR minor units, as string (policy §1.3).
   * Send this back as `netAmountIdr` on fiat-intent (backend corroborates
   * it against the stored fiat price and aborts + re-quotes on mismatch).
   */
  grossIdr: string;
  /** 10% marketplace cut on the list price, IDR minor units. */
  vaultCutIdr?: string;
  /** Developer share after the cut (round_half_up(G*0.90)), IDR minor units. */
  developerNetIdr?: string;
  /** Total transfer fee (Peridot fee + PPN + gateway fee + PPN), IDR minor units. */
  transferFeeIdr: string;
  /** Per-app fee, IDR minor units. */
  appFeeIdr: string;
  /** Gross charged to buyer (list + rail fees), IDR minor units. */
  totalIdr: string;
  currency: "IDR";
  /** Empty => checkout must be blocked with a reason (spec §3.4). */
  paymentMethods: string[];
  /** Human-readable reason when paymentMethods is empty. */
  emptyMethodsReason?: string;
  /** Policy revision the quote was priced under (ANT-519 §1.3). */
  policyRevision?: string;
  /**
   * Legacy aliases (deprecated, backend-kept for compatibility).
   * `netIdr` equals the list price; `amountIdr` predates the backend field.
   * Prefer `grossIdr` via {@link resolveQuoteListPrice}.
   */
  netIdr?: string;
  amountIdr?: string;
  feeIdr?: string;
}

/**
 * Resolve the game list price from a quote across backend revisions:
 * current `grossIdr` first, then legacy `netIdr` / `amountIdr`.
 */
export function resolveQuoteListPrice(
  quote: Pick<FiatQuote, "grossIdr" | "netIdr" | "amountIdr"> | null | undefined,
): string {
  if (!quote) return "0";
  return quote.grossIdr ?? quote.netIdr ?? quote.amountIdr ?? "0";
}

export interface FiatIntentRequest {
  gameId: string;
  /** Net amount in IDR minor units, as string. */
  netAmountIdr: string;
  paymentMethod?: string;
  /** Peridot ID app client id override (else server default mapping). */
  peridotAppClientId?: string;
}

export interface FiatIntent {
  intentId: string;
  /** DOKU Checkout URL — navigate with browser navigation only. */
  paymentUrl: string;
  /** Game list price, IDR minor units (policy §1.3 `grossIdr`). */
  grossIdr: string;
  /** Buyer gross-up total, IDR minor units. */
  totalIdr?: string;
  /** 10% marketplace split lines, IDR minor units (policy §1.3). */
  vaultCutIdr?: string;
  developerNetIdr?: string;
  transferFeeIdr?: string;
  /** Per-app fee, IDR minor units. */
  appFeeIdr: string;
  currency: "IDR";
  providerRef: string;
  /** Policy revision the intent was priced under. */
  policyRevision?: string;
  /**
   * Legacy aliases (deprecated, backend-kept for compatibility).
   * `netIdr` equals the list price; `feeIdr` is the summed rail fee.
   * Prefer `grossIdr` / `transferFeeIdr + appFeeIdr`.
   */
  netIdr?: string;
  feeIdr?: string;
}

export interface FiatSyncResponse {
  intentId: string;
  providerRef: string;
  status: FiatStatus;
  /** Mirrors purchase status once the backend confirms. */
  purchaseStatus?: "pending" | "completed" | "failed" | "refunded";
}

export function isFiatBlocked(quote: FiatQuote | null | undefined): {
  blocked: boolean;
  reason: string | null;
} {
  if (!quote) return { blocked: true, reason: "Quote unavailable. Try again." };
  // IDR-only MVP (policy ANT-519 §1): surface non-IDR quotes as blocked
  // instead of failing later at intent creation (backend 400s non-IDR).
  if (quote.currency !== "IDR") {
    return {
      blocked: true,
      reason: `Unsupported quote currency ${quote.currency} — IDR only in MVP.`,
    };
  }
  if (!quote.paymentMethods || quote.paymentMethods.length === 0) {
    return {
      blocked: true,
      reason:
        quote.emptyMethodsReason ??
        "No payment methods available for this purchase right now.",
    };
  }
  return { blocked: false, reason: null };
}
