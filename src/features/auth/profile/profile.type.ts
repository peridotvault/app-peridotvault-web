import { ApiResponse } from "@/shared/types/api";


export type ProfileUser = {
    id: string;
    username: string;
    email: string;
    profile_image: string | null;
    created_at: string;
    updated_at: string;
};

export type ProfileAccount = {
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

export type ProfileData = {
    user: ProfileUser;
    accounts: ProfileAccount[];
};

export type ProfileResponse = ApiResponse<ProfileData>;
