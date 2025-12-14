import { http } from "@/shared/lib/http";
import { GamePublishedResponse } from "../interfaces/published";

export async function getTopGames(): Promise<GamePublishedResponse> {
    const res = await http.get<GamePublishedResponse>("/api/games/top-games");

    return res.data;
}
