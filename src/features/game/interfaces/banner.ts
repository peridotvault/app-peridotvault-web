import { ApiResponse } from "@/shared/types/api";
import { PaginatedData } from "@/shared/types/pagination";

export type GameBannerResponse = ApiResponse<PaginatedData<GameBanner>>;

export interface GameBanner {
    game_id: string,
    name: string,
    description: string,
    banner_image: string,
}