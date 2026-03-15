import { http } from "@/shared/lib/http";
import { GameApi, GameDetailApi, GameSortApi, GameTopApi } from "./game.api.type";
import { ApiResponse, ApiResponseWithPagination } from "./types/response.type";

function getPaginatedItems<T>(res: { data?: ApiResponseWithPagination<T> }): T[] {
    return res.data?.data?.data ?? [];
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
    const res = await http.get<ApiResponseWithPagination<GameApi>>("/api/games", {
        params,
    });

    return getPaginatedItems(res);
}

export async function getTopGamesApi(): Promise<GameTopApi[]> {
    const res = await http.get<ApiResponse<GameTopApi[]>>("/api/games/top-games");

    return res.data.data ?? [];
}

export async function getBannerGamesApi(params?: {
    page?: number;
    limit?: number;
}): Promise<GameApi[]> {
    const res = await http.get<ApiResponseWithPagination<GameApi>>("/api/games/banners", {
        params,
    });

    return getPaginatedItems(res);
}

export async function getGameMetadataApi(gameId: string, params?: {
    page?: number;
    limit?: number;
    category?: string;
}): Promise<GameDetailApi> {
    const res = await http.get<ApiResponse<GameDetailApi>>(`/api/games/${gameId}/metadata`, {
        params,
    });

    return res.data.data;
}

export async function getGameRelatedApi(gameId: string, params?: {
    limit?: number;
}): Promise<GameApi[]> {
    const res = await http.get<ApiResponseWithPagination<GameApi>>(`/api/games/${gameId}/related`, {
        params,
    });

    return getPaginatedItems(res);
}

export async function getGameDetailApi(gameId: string, params?: {
    page?: number;
    limit?: number;
    category?: string;
}): Promise<GameDetailApi> {
    const res = await http.get<ApiResponse<GameDetailApi>>(`/api/games/${gameId}`, {
        params,
    });

    return res.data.data;
}



