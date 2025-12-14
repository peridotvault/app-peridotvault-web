import { ApiResponse } from "@/shared/interfaces/api";
import { PaginatedData } from "@/shared/interfaces/pagination";

export type GameBannerResponse = ApiResponse<PaginatedData<GameBanner>>;

export interface GameBanner {
    game_id: string,
    name: string,
    description: string,
    banner_image: string,
}