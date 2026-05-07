import { http } from "@/shared/lib/http";
import { ApiResponse } from "./types/response.type";
import {
  WishlistToggleResponse,
  WishlistStatusResponse,
  WishlistCountResponse,
  WishlistItem,
} from "./wishlist.api.type";

export async function addToWishlistApi(
  gameId: string
): Promise<ApiResponse<WishlistToggleResponse>> {
  const res = await http.post<ApiResponse<WishlistToggleResponse>>(
    `/api/v1/wishlist/${encodeURIComponent(gameId)}`
  );
  return res.data;
}

export async function removeFromWishlistApi(
  gameId: string
): Promise<ApiResponse<WishlistToggleResponse>> {
  const res = await http.delete<ApiResponse<WishlistToggleResponse>>(
    `/api/v1/wishlist/${encodeURIComponent(gameId)}`
  );
  return res.data;
}

export async function getWishlistStatusApi(
  gameId: string
): Promise<ApiResponse<WishlistStatusResponse>> {
  const res = await http.get<ApiResponse<WishlistStatusResponse>>(
    `/api/v1/wishlist/${encodeURIComponent(gameId)}/status`
  );
  return res.data;
}

export async function getWishlistCountApi(
  gameId: string
): Promise<ApiResponse<WishlistCountResponse>> {
  const res = await http.get<ApiResponse<WishlistCountResponse>>(
    `/api/v1/wishlist/${encodeURIComponent(gameId)}/count`
  );
  return res.data;
}

export async function getWishlistApi(params?: {
  page?: number;
  limit?: number;
}): Promise<ApiResponse<WishlistItem[]>> {
  const res = await http.get<ApiResponse<WishlistItem[]>>(
    "/api/v1/wishlist",
    { params }
  );
  return res.data;
}
