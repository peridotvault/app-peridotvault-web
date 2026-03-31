let audioCtx: AudioContext | null = null;
let clickBuffer: AudioBuffer | null = null;
let loadingPromise: Promise<void> | null = null;

function getAudioContext(): AudioContext {
    if (!audioCtx) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const AC = (window.AudioContext || (window as any).webkitAudioContext);
        audioCtx = new AC();
    }
    return audioCtx!;
}

export async function preloadClickSound(url: string) {
    const ctx = getAudioContext();

    // kalau sudah pernah decode, skip
    if (clickBuffer) return;

    // lagi loading? tunggu yang sudah ada
    if (loadingPromise) return loadingPromise;

    loadingPromise = (async () => {
        try {
            const res = await fetch(url);
            const arr = await res.arrayBuffer();
            clickBuffer = await ctx.decodeAudioData(arr);
        } catch (err) {
            console.error("Failed to preload click sound", err);
            loadingPromise = null;
        }
    })();

    return loadingPromise;
}

/**
 * Pre-init context on first interaction to avoid delay on first click
 */
export function initAudioContext() {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
        void ctx.resume();
    }
}

export function playClickBuffer(volume: number) {
    const ctx = getAudioContext();

    // Sync check for resume if suspended (async fallback if needed)
    if (ctx.state === 'suspended') {
        void ctx.resume();
    }

    if (!clickBuffer) return;

    const src = ctx.createBufferSource();
    const gain = ctx.createGain();

    src.buffer = clickBuffer;
    gain.gain.value = volume;

    src.connect(gain);
    gain.connect(ctx.destination);

    // start secepat mungkin
    src.start(ctx.currentTime);
}

