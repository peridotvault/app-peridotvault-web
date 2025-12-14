import { ApiResponse } from "@/shared/interfaces/api";
import { Category } from "@/shared/interfaces/category";
import { PaginatedData } from "@/shared/interfaces/pagination";

export type GamePublishedResponse = ApiResponse<PaginatedData<GameCard>>;

export interface GameCard {
    game_id: string,
    name: string,
    price: number,
    cover_vertical_image: string,
    categories: Category[];
}

