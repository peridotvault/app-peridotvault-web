export type EvmChainId = "base" | "lisk";
export type SvmChainId = "solana";
export type ChainId = EvmChainId | SvmChainId;

export type ChainNetwork = "mainnet" | "testnet";

export type EvmChainKey =
  | "base-mainnet"
  | "base-testnet"
  | "lisk-mainnet"
  | "lisk-testnet";

export type SvmChainKey = "solana-mainnet" | "solana-testnet";

export type ChainKey = EvmChainKey | SvmChainKey;

export type ChainType = "evm" | "svm";

export interface ChainConfig {
    id: ChainId;
    type: ChainType;
    name: string;
    network: ChainNetwork;
    key: ChainKey;
    icon: string;
}
