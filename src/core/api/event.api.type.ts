import { GameIdApi } from "./game.api.type"

export type GameEventApi = {
    game_id: GameIdApi;
    event_type: string;
    source: string;
    /** Fulfillment rail (spec ANT-511 §3.1). Optional for back-compat. */
    payment_mode?: "onchain" | "fiat";
}
