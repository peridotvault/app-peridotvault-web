import { ApiResponse } from "@/shared/types/api";
import { PaginatedData } from "@/shared/types/pagination";

export type ChainDataResponse = ApiResponse<PaginatedData<ChainData>>;

export type ChainData = Omit<Chain, "namespace" | "reference" | "rpc_urls" | "explorer_urls" | "created_at" | "updated_at">

export interface Chain {
    caip_2_id: string;
    namespace: string;
    reference: string;
    name: string;
    is_testnet: boolean;
    native_symbol: string;
    rpc_urls: string[];
    explorer_urls: string[];
    icon_url: string | null;
    created_at: Date;
    updated_at: Date | null;
}
