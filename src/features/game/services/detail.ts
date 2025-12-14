import { http } from "@/shared/lib/http";
import { GameDetailResponse } from "../interfaces/game";


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
