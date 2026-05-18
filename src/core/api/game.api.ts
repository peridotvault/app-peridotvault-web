import { http } from "@/shared/lib/http";
import { GameApi, GameBannerApi, GameDetailApi, GameSortApi, GameTopApi } from "./game.api.type";
import { ApiResponse, ApiResponseV1, ApiResponseWithPagination } from "./types/response.type";
import type { GameBanner } from "@/features/game/types/game.type";

function getPaginatedItems<T>(res: { data?: ApiResponseWithPagination<T> }): T[] {
    return (res.data?.data as unknown as T[]) ?? [];
}

export async function getGamesApi(params?: {
    q?: string;
    category_id?: string;
    tag_ids?: string;
    sort?: GameSortApi;
    price_min?: number;
    price_max?: number;
    page?: number;
    limit?: number;
}): Promise<Array<GameApi>> {
    const res = await http.get<ApiResponseWithPagination<GameApi>>("/api/v1/games", {
        params,
    });

    return getPaginatedItems(res);
}

export async function getTopGamesApi(): Promise<GameTopApi[]> {
    const res = await http.get<ApiResponse<GameTopApi[]>>("/api/v1/games/top-games");

    return res.data.data ?? [];
}

export async function getBannerGamesApi(params?: {
    page?: number;
    limit?: number;
}): Promise<GameBanner[]> {
    const res = await http.get<ApiResponseV1<GameBannerApi[]>>("/api/v1/games/banners", {
        params,
    });

    return (res.data.data ?? []).map((item) => ({
        game_id: item.game_id,
        name: item.title,
        description: item.description,
        banner_image: item.banner_image,
    }));
}

export async function getGameMetadataApi(gameId: string, params?: {
    page?: number;
    limit?: number;
    category?: string;
}): Promise<GameDetailApi> {
  const res = await http.get<ApiResponse<GameDetailApi>>(`/api/v1/games/${gameId}/metadata`, {
      params,
    });

    return res.data.data;
  }

  export async function getGameRelatedApi(gameId: string, params?: {
    limit?: number;
  }): Promise<GameApi[]> {
    const res = await http.get<ApiResponseWithPagination<GameApi>>(`/api/v1/games/${gameId}/related`, {
      params,
    });

    return getPaginatedItems(res);
  }

  export async function getGameDetailApi(gameId: string, params?: {
    page?: number;
    limit?: number;
    category?: string;
  }): Promise<GameDetailApi> {
    const res = await http.get<ApiResponse<GameDetailApi>>(`/api/v1/games/${gameId}`, {
      params,
    });

    return res.data.data;
}



