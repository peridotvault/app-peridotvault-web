import { ApiResponse } from "@/shared/types/api";

export type VerifyRequest = {
    signature: string;   // "0x..."
    message: string;
    address: string;     // "0x..."
    accountType: "evm" | "solana" | "icp" | string; // extend nanti
};

export type VerifyUser = {
    id: string;
    username: string;
    email: string;
    profile_image: string | null;
    created_at: string;
    updated_at: string;
};

export type VerifyAccount = {
    id: number;
    user_id: string;
    account_id: string;
    is_primary: boolean;
    created_at: string;
    updated_at: string;
    account_types: {
        id: number;
        curve_id: number;
        code: string;
    };
};

export type VerifyData = {
    token: string;
    refreshToken: string;
    expiresAt: string;
    user: VerifyUser;
    account: VerifyAccount;
    accounts: VerifyAccount[];
};

export type VerifyResponse = ApiResponse<VerifyData>;
