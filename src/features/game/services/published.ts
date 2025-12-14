import { http } from "@/shared/lib/http";
import { GamePublishedResponse } from "../interfaces/published";


export async function getPublishedGames(params?: {
    page?: number;
    limit?: number;
    category?: string;
}): Promise<GamePublishedResponse> {
    const res = await http.get<GamePublishedResponse>("/api/games", {
        params,
    });

    return res.data;
}
