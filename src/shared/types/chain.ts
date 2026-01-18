export type ChainId =
    | "ethereum"
    | "base"
    | "lisk"
    | "solana";

export type ChainType = "evm" | "svm";

export interface ChainConfig {
    id: ChainId;
    type: ChainType;
    name: string;
    icon: string;
}
