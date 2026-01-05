/* eslint-disable @typescript-eslint/no-explicit-any */

import { buildChallenge } from "../utils/challengeBuilder";

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

export interface SignatureResponse {
    signature: string;
    publicKey: string;
    signedMessage: string;
}

export async function signMessage(message: string): Promise<SignatureResponse> {
    const peridot = (window as any).peridotwallet;
    const domain = window.location.host;
    const challange = buildChallenge(domain);

    if (!peridot?.master?.isPeridotWallet) {
        throw new Error("PeridotWallet extension not detected");
    }

    const bytes = new TextEncoder().encode(message);
    const res = await peridot.master.signMessage(bytes, challange);

    const signature =
        res?.signature ?? res?.signatureBase64 ?? res?.signatureHex;
    const publicKey =
        res?.publicKey ?? res?.publicKeyBase64 ?? res?.publicKeyBase58;
    const signedMessage =
        res?.signedMessage?.data ?? res?.signedMessage ?? undefined;

    if (!signature) {
        throw new Error("signMessage did not return a signature");
    }

    return {
        signature,
        publicKey: publicKey || "",
        signedMessage,
    };
}

