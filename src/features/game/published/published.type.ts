import { ApiResponse } from "@/shared/types/api";
import { Category } from "@/shared/types/category";
import { PaginatedData } from "@/shared/types/pagination";

export type GamePublishedResponse = ApiResponse<PaginatedData<GameCard>>;

export interface GameCard {
    game_id: string,
    name: string,
    price: number,
    cover_vertical_image: string,
    cover_horizontal_image: string,
    categories: Category[];
}

