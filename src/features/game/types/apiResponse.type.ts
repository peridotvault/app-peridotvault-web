import { ApiResponse } from "@/shared/types/api";
import { PaginatedData } from "@/shared/types/pagination";
import { GameCard, GameBanner, Game } from "./game.type";

export type GamePublishedResponse = ApiResponse<PaginatedData<GameCard>>;
export type GameBannerResponse = ApiResponse<PaginatedData<GameBanner>>;
export type GameDetailResponse = ApiResponse<Game>;
