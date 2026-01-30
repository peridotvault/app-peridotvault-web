export type ChainId = "base" | "lisk" | "solana";

export type ChainNetwork = "mainnet" | "testnet";

export type ChainKey = `${ChainId}-${ChainNetwork}`;

export type EvmChainKey = Exclude<ChainKey, "solana-mainnet" | "solana-testnet">;

export type SvmChainKey = Exclude<ChainKey, EvmChainKey>;

export type ChainType = "evm" | "svm";

export interface ChainConfig {
    id: ChainId;
    type: ChainType;
    name: string;
    network: ChainNetwork;
    key: ChainKey;
    icon: string;
}
