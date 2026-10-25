/**
 * Fiat purchase API contract types (spec ANT-511 §5 — Contract-first).
 *
 * Backend endpoints (peridotvault-api owns them; may 404 until shipped):
 * - POST /v1/purchases/quote       {gameId, payment_mode} -> FiatQuote
 * - POST /v1/purchases/fiat-intent {gameId, netAmountIdr, paymentMethod?} -> FiatIntent
 * - POST /v1/purchases/fiat-confirm + POST /v1/webhooks/peridot-fiat (server-side)
 * - GET  /v1/purchases/fiat/:intentId/sync (return polling via syncTransaction)
 *
 * All money fields are strings; currency is explicit (`IDR`).
 */

export type FiatStatus = "pending" | "success" | "failed" | "cancelled";

export interface FiatQuoteRequest {
  gameId: string;
  payment_mode: "fiat";
}

export interface FiatQuote {
  /** Net amount credited, IDR minor units, as string. */
  amountIdr: string;
  /** Total transfer fee (Peridot fee + PPN + gateway fee + PPN), IDR minor units. */
  transferFeeIdr: string;
  /** Per-app fee, IDR minor units. */
  appFeeIdr: string;
  /** Gross charged to buyer, IDR minor units. */
  totalIdr: string;
  currency: "IDR";
  /** Empty => checkout must be blocked with a reason (spec §3.4). */
  paymentMethods: string[];
  /** Human-readable reason when paymentMethods is empty. */
  emptyMethodsReason?: string;
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
  grossIdr: string;
  feeIdr: string;
  netIdr: string;
  currency: "IDR";
  providerRef: string;
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
