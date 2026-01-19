/* eslint-disable @typescript-eslint/no-explicit-any */
// peridotBridge.ts
type PeridotRequest = {
    target: "PERIDOT_CS";
    id: string;
    method: string;
    params?: any;
};

type PeridotResponse = {
    target: "PERIDOT_INPAGE";
    id: string;
    result?: any;
    error?: string;
};

function makeId() {
    // crypto.randomUUID() ada di browser modern
    return (globalThis.crypto?.randomUUID?.() ?? `id_${Date.now()}_${Math.random()}`);
}

export function peridotRequest<T = any>(
    method: string,
    params?: any,
    timeoutMs: number = 15_000
): Promise<T> {
    const id = makeId();

    return new Promise<T>((resolve, reject) => {
        const timer = window.setTimeout(() => {
            cleanup();
            reject(new Error(`Peridot request timeout: ${method}`));
        }, timeoutMs);

        function onMessage(ev: MessageEvent) {
            const msg: PeridotResponse = ev.data;
            if (!msg || msg.target !== "PERIDOT_INPAGE") return;
            if (msg.id !== id) return;

            cleanup();

            if (msg.error) reject(new Error(msg.error));
            else resolve(msg.result as T);
        }

        function cleanup() {
            window.clearTimeout(timer);
            window.removeEventListener("message", onMessage);
        }

        window.addEventListener("message", onMessage);

        const payload: PeridotRequest = { target: "PERIDOT_CS", id, method, params };
        window.postMessage(payload, "*");
    });
}
