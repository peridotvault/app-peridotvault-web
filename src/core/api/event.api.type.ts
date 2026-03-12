import { GameIdApi } from "./game.api.type"

export type GameEventApi = {
    game_id: GameIdApi;
    event_type: string;
    source: string;
}
