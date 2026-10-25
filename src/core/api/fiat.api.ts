import { http } from "@/shared/lib/http";
import type {
  FiatIntent,
  FiatIntentRequest,
  FiatQuote,
  FiatQuoteRequest,
  FiatSyncResponse,
} from "./fiat.api.type";
import type { ApiResponse } from "./types/response.type";

/**
 * Fiat purchase API client (spec ANT-511 §5).
 * PeridotVault API owns these routes; unwrap the shared ApiResponse envelope.
 */
export async function getFiatQuoteApi(
  request: FiatQuoteRequest,
): Promise<ApiResponse<FiatQuote>> {
  const res = await http.post<ApiResponse<FiatQuote>>(
    "/api/v1/purchases/quote",
    request,
  );
  return res.data;
}

export async function createFiatIntentApi(
  request: FiatIntentRequest,
): Promise<ApiResponse<FiatIntent>> {
  const res = await http.post<ApiResponse<FiatIntent>>(
    "/api/v1/purchases/fiat-intent",
    request,
  );
  return res.data;
}

/**
 * Corroborate a fiat payment on return from DOKU Checkout.
 * Webhooks may lag — the storefront polls this after redirect (spec §3.4).
 */
export async function syncFiatIntentApi(
  intentId: string,
): Promise<ApiResponse<FiatSyncResponse>> {
  const res = await http.get<ApiResponse<FiatSyncResponse>>(
    `/api/v1/purchases/fiat/${encodeURIComponent(intentId)}/sync`,
  );
  return res.data;
}
