import { http } from "@/shared/lib/http";
import {
  CreatePurchaseRequest,
  CompletePurchaseRequest,
  Purchase,
  PurchaseStats,
  GetPurchasesQuery,
  PaginatedPurchasesResponse,
} from "./purchase.api.type";
import { ApiResponse, ApiResponseWithPagination } from "./types/response.type";

function getPaginatedItems<T>(res: { data?: ApiResponseWithPagination<T> }): T[] {
  return res.data?.data?.data ?? [];
}

function getPaginatedMeta<T>(res: { data?: ApiResponseWithPagination<T> }) {
  return {
    total: res.data?.data?.total ?? 0,
    page: res.data?.data?.page ?? 1,
    limit: res.data?.data?.limit ?? 10,
    totalPages: res.data?.data?.totalPages ?? 1,
  };
}

/**
 * Create a purchase record with pending status.
 * Called after payment initiation.
 */
export async function createPurchaseApi(
  request: CreatePurchaseRequest
): Promise<ApiResponse<Purchase>> {
  const res = await http.post<ApiResponse<Purchase>>("/api/purchases", request);
  return res.data;
}

/**
 * Update purchase status to completed.
 * Called when payment is confirmed on-chain.
 */
export async function completePurchaseApi(
  gameId: string,
  request: CompletePurchaseRequest
): Promise<ApiResponse<Purchase>> {
  const res = await http.put<ApiResponse<Purchase>>(
    `/api/purchases/${encodeURIComponent(gameId)}/complete`,
    request
  );
  return res.data;
}

/**
 * Get all purchases made by the authenticated user.
 * Supports search by game name, filter by status, date range, sort, and pagination.
 */
export async function getMyPurchasesApi(
  query: GetPurchasesQuery = {}
): Promise<PaginatedPurchasesResponse> {
  const params = new URLSearchParams();

  if (query.q) params.append("q", query.q);
  if (query.status) params.append("status", query.status);
  if (query.sort) params.append("sort", query.sort);
  if (query.dateFrom) params.append("date_from", query.dateFrom);
  if (query.dateTo) params.append("date_to", query.dateTo);
  if (query.page) params.append("page", query.page.toString());
  if (query.limit) params.append("limit", query.limit.toString());

  const res = await http.get<ApiResponseWithPagination<Purchase>>(
    `/api/purchases?${params.toString()}`
  );

  return {
    data: getPaginatedItems(res),
    meta: getPaginatedMeta(res),
  };
}

/**
 * Get purchase record for a specific game if user has purchased it.
 */
export async function getPurchaseByGameIdApi(
  gameId: string
): Promise<ApiResponse<Purchase> | null> {
  try {
    const res = await http.get<ApiResponse<Purchase>>(
      `/api/purchases/${encodeURIComponent(gameId)}`
    );
    return res.data;
  } catch (error) {
    // Return null if 404 (not purchased)
    if ((error as any)?.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Check if user has purchased a specific game.
 */
export async function hasPurchasedGameApi(gameId: string): Promise<boolean> {
  const purchase = await getPurchaseByGameIdApi(gameId);
  return purchase !== null && purchase.data?.status === "completed";
}

/**
 * Get purchase stats for a game (for owners/developers).
 */
export async function getPurchaseStatsApi(
  gameId: string
): Promise<ApiResponse<PurchaseStats> | null> {
  try {
    const res = await http.get<ApiResponse<PurchaseStats>>(
      `/api/purchases/games/${encodeURIComponent(gameId)}/stats`
    );
    return res.data;
  } catch (error) {
    console.error("[PurchaseAPI] Failed to fetch purchase stats:", error);
    return null;
  }
}

// Legacy function - kept for backwards compatibility
export async function postGamePurchaseApi(): Promise<never> {
  throw new Error(
    "postGamePurchaseApi is deprecated. Use createPurchaseApi and completePurchaseApi instead."
  );
}
