export type AuthSessionRow = {
    id: "session";
    token: string;          // access token
    refresh_token: string;   // refresh token
    expires_at?: string;     // ISO string dari backend

    account_id: string;          // 0x...
    account_type: string;      // "evm"
    message?: string;         // optional
    updated_at: number;
};


