import { http } from "@/shared/lib/http";
import { GameBannerResponse } from "./banner.type";

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
