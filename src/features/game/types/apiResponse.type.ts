import { ApiResponse } from "@/core/api/types/response.type";
import { PaginatedData } from "@/core/api/types/pagination.type";
import { GameCard, GameBanner, Game } from "./game.type";

export type GamePublishedResponse = ApiResponse<PaginatedData<GameCard>>;
export type GameBannerResponse = ApiResponse<PaginatedData<GameBanner>>;
export type GameDetailResponse = ApiResponse<Game>;
