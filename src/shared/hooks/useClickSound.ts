import { useEffect, useCallback } from "react";
import { useSoundStore } from "../states/sound.store";
import { preloadClickSound, playClickBuffer } from "../utils/soundEngine";

export function useClickSound(url: string, volume: number) {
    const enabled = useSoundStore((s) => s.enabled);

    // preload sekali di mount
    useEffect(() => {
        // kita nggak nunggu di sini, cukup trigger preload
        void preloadClickSound(url);
    }, [url]);

    return useCallback(() => {
        if (!enabled) return;
        
        // playClickBuffer sekarang sync (kecuali resume yang fire-and-forget)
        playClickBuffer(volume);
    }, [enabled, volume]);
}
