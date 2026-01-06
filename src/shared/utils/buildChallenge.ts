export function buildChallenge(message: string): string {
    const issuedAt = new Date();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    return [
        message,
        `Issued At: ${issuedAt.toISOString()}`,
        `Expires At: ${expiresAt.toISOString()}`,
    ].join("\n");
}