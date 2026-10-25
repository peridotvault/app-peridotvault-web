export type GameEvent = {
    game_id: string;
    event_type: SourceType;
    source: string;
    /**
     * Fulfillment rail that produced this event (spec ANT-511 §3.1:
     * analytics events carry `payment_mode`). Optional for back-compat.
     */
    payment_mode?: "onchain" | "fiat";
}

export type SourceType = "homepage" | "category" | "search" | "collection" | "banner" | "top_games" | "other" | "detail_related";
