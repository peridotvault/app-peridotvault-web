import { Category } from "./category.type";

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
    previews: GamePreview[]
    distributions: GameDistribution[],
}

export type GameDistribution =
    | { web: WebDistribution }
    | { native: NativeDistribution };


export interface WebDistribution {
    url: string,
    memory: number,
    graphics: string,
    additionalNotes: string,
    storage: number,
    processor: string,
}

export interface NativeDistribution {
    os: string;
    memory: number;
    graphics: string;
    additionalNotes: string;
    storage: number;
    processor: string;
}

/* ======================================================
   BANNER
====================================================== */
export interface GameBanner {
    game_id: string,
    name: string,
    description: string,
    banner_image: string,
}

/* ======================================================
   MEDIA
====================================================== */
export type GamePreview =
    | { kind: 'image'; src: string }
    | { kind: 'video'; src: string };

/* ======================================================
   PUBLISHED
====================================================== */
export interface GameCard {
    game_id: string,
    name: string,
    price: number,
    cover_vertical_image: string,
    cover_horizontal_image: string,
    categories: Category[];
}
