export type ChainApi = {
    caip_2_id: string;
    name: string;
    native_symbol: string;
    icon_url: string;
    is_testnet: boolean;
}

export type ChainDetailsApi = {
    caip_2_id: string;
    reference: string;

    namespace: string;
    name: string;
    native_symbol: string;
    icon_url: string;
    is_testnet: boolean;

    rpc_urls: Array<string>;
    explorer_urls: Array<string>;

    created_at: string;
    updated_at: string;
}


export type NetworkTypeApi = "testnet" | "mainnet" | "all" | null;
