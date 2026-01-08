import { GameDistribution } from "./distribution"
import { GamePriview } from "./media"
import { ApiResponse } from "@/shared/types/api"

export type GameDetailResponse = ApiResponse<Game>;

export interface Game {
    game_id: string,
    name: string,
    description: string,
    required_age: number,
    price: number,
    cover_vertical_image: string,
    cover_horizontal_image: string,
    banner_image: string,
    is_published: boolean,
    release_date: number,
    draft_status: string,
    created_at: string,
    updated_at: string,
    categories: string[],
    tags: string[],
    previews: GamePriview[]
    distributions: GameDistribution[],
}

