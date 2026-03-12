import { http } from "@/shared/lib/http";
import { GameEventApi } from "./event.api.type";

export function sendEvent(params?: GameEventApi): void {
    if (!params) return;

    http.post("/api/game-activities", params).catch((err) => {
        console.error("sendEvent error:", err);
    });
}
