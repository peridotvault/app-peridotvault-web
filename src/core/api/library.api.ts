import { http } from "@/shared/lib/http";
import {
  LibraryGameApi,
  GetLibraryQuery,
  PaginatedLibraryResponse,
} from "./library.api.type";
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
 * Get user game library.
 * Supports search by game name, sort, and pagination.
 */
export async function getMyLibraryApi(
  query: GetLibraryQuery = {}
): Promise<PaginatedLibraryResponse> {
  const params = new URLSearchParams();

  if (query.q) params.append("q", query.q);
  if (query.sort) params.append("sort", query.sort);
  if (query.page) params.append("page", query.page.toString());
  if (query.limit) params.append("limit", query.limit.toString());

  const res = await http.get<ApiResponseWithPagination<LibraryGameApi>>(
    `/api/library?${params.toString()}`
  );

  return {
    data: getPaginatedItems(res),
    meta: getPaginatedMeta(res),
  };
}

/**
 * Get a specific game from user library.
 */
export async function getLibraryGameApi(
  gameId: string
): Promise<ApiResponse<LibraryGameApi> | null> {
  try {
    const res = await http.get<ApiResponse<LibraryGameApi>>(
      `/api/library/${encodeURIComponent(gameId)}`
    );
    return res.data;
  } catch (error) {
    // Return null if 404 (not in library)
    if ((error as any)?.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Check if user has a game in their library.
 */
export async function isGameInLibraryApi(gameId: string): Promise<boolean> {
  const game = await getLibraryGameApi(gameId);
  return game !== null;
}
