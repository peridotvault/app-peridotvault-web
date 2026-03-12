export type GameEvent = {
    game_id: string;
    event_type: SourceType;
    source: string;
}

export type SourceType = "homepage" | "category" | "search" | "collection" | "banner" | "top_games" | "other" | "detail_related";
