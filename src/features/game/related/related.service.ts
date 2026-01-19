import { http } from "@/shared/lib/http";
import { GamePublishedResponse } from "../published/published.type";



export async function getGameRelated(gameId: string, params?: {
    limit?: number;
}): Promise<GamePublishedResponse> {
    const res = await http.get<GamePublishedResponse>(`/api/games/${gameId}/related`, {
        params,
    });

    return res.data;
}
