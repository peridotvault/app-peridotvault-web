export const AUTH_SESSION_TABLE = "auth_session" as const;

export type AuthSessionRow = {
    id: "session";
    token: string;          // access token
    refreshToken: string;   // refresh token
    expiresAt?: string;     // ISO string dari backend

    accountId: string;          // 0x...
    accountType: string;      // "evm"
    message?: string;         // optional
    updatedAt: number;
};

