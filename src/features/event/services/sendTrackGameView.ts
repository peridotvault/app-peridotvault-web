import { sendEvent } from "@/core/api/event.api";
import { GameEventApi } from "@/core/api/event.api.type";
import { GameEvent } from "../types/game-event.type";

export function sendTrackGameView({ game_id, source }: Omit<GameEvent, "event_type">) {
    const payload: GameEventApi = {
        game_id: game_id,
        event_type: "game_view",
        source,
    };

    sendEvent(payload);
}

