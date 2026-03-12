"use client";

import { sendEvent } from "@/core/api/event.api";
import { GameEventApi } from "@/core/api/event.api.type";
import { useEffect, useRef } from "react";
import { GameEvent } from "../types/game-event.type";

export function useTrackGameView({ game_id, source }: Omit<GameEvent, "event_type">) {
    const sentRef = useRef(false);

    useEffect(() => {
        if (!game_id) return;

        if (sentRef.current) return;

        const payload: GameEventApi = {
            game_id: game_id,
            event_type: "game_view",
            source,
        };

        sendEvent(payload);

        sentRef.current = true;
    }, [game_id, source]);
}

