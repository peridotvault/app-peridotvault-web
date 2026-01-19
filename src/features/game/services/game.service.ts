import { http } from "@/shared/lib/http";
import { GameBannerResponse, GamePublishedResponse, GameDetailResponse } from "../types/apiResponse.type";

export async function getBannerGames(params?: {
    page?: number;
    limit?: number;
    category?: string;
}): Promise<GameBannerResponse> {
    const res = await http.get<GameBannerResponse>("/api/games/banners", {
        params,
    });

    return res.data;
}

export async function getTopGames(): Promise<GamePublishedResponse> {
    const res = await http.get<GamePublishedResponse>("/api/games/top-games");

    return res.data;
}

export async function getGameRelated(gameId: string, params?: {
    limit?: number;
}): Promise<GamePublishedResponse> {
    const res = await http.get<GamePublishedResponse>(`/api/games/${gameId}/related`, {
        params,
    });

    return res.data;
}

export async function getPublishedGames(params?: {
    page?: number;
    limit?: number;
    category_id?: string;
}): Promise<GamePublishedResponse> {
    const res = await http.get<GamePublishedResponse>("/api/games", {
        params,
    });

    return res.data;
}

export async function getGameDetail(gameId: string, params?: {
    page?: number;
    limit?: number;
    category?: string;
}): Promise<GameDetailResponse> {
    const res = await http.get<GameDetailResponse>(`/api/games/${gameId}`, {
        params,
    });

    return res.data;
}
