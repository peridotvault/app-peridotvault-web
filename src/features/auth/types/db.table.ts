export const AUTH_SESSION_TABLE = "auth_session" as const;

export type AuthSessionRow = {
    id: "session";
    accessToken: string;
    refreshToken: string;
    updatedAt: number;
};


