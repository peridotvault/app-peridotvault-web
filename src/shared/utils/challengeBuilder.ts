import { Challange } from "../interfaces/challenge";

export function buildChallenge(domain: string): Challange {
    const issuedAt = new Date().toISOString();
    const expirationTime = new Date(Date.now() + 5 * 60_000).toISOString();

    const nonce = crypto.getRandomValues(new Uint8Array(16));
    const nonceHex = Array.from(nonce)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

    return {
        domain,
        uri: `https://${domain}`,
        nonce: nonceHex,
        issuedAt,
        expirationTime,
        version: "1" as const,
        // statement?: "..."
    };
}