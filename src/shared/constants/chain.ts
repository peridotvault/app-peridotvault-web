import { ChainConfig, ChainKey, ChainNetwork } from "../types/chain";

export const CHAIN_LIST: ChainConfig[] = [
    {
        id: "lisk",
        type: "evm",
        name: "Lisk Mainnet",
        network: "mainnet",
        key: "lisk-mainnet",
        icon: "/images/chains/lisk.svg",
    },
    {
        id: "lisk",
        type: "evm",
        name: "Lisk Sepolia",
        network: "testnet",
        key: "lisk-testnet",
        icon: "/images/chains/lisk.svg",
    },
    {
        id: "base",
        type: "evm",
        name: "Base Mainnet",
        network: "mainnet",
        key: "base-mainnet",
        icon: "/images/chains/base.svg",
    },
    {
        id: "base",
        type: "evm",
        name: "Base Sepolia",
        network: "testnet",
        key: "base-testnet",
        icon: "/images/chains/base.svg",
    },
    {
        id: "solana",
        type: "svm",
        name: "Solana Mainnet",
        network: "mainnet",
        key: "solana-mainnet",
        icon: "/images/chains/solana.svg",
    },
    {
        id: "solana",
        type: "svm",
        name: "Solana Devnet",
        network: "testnet",
        key: "solana-testnet",
        icon: "/images/chains/solana.svg",
    },
];

export const CHAIN_CONFIGS = CHAIN_LIST.reduce(
    (acc, chain) => {
        acc[chain.key] = chain;
        return acc;
    },
    {} as Record<ChainKey, ChainConfig>
);

export const CHAINS_BY_NETWORK: Record<ChainNetwork, ChainConfig[]> = {
    mainnet: CHAIN_LIST.filter((chain) => chain.network === "mainnet"),
    testnet: CHAIN_LIST.filter((chain) => chain.network === "testnet"),
};

export const CHAIN_OPTIONS = CHAIN_LIST.map((chain) => ({
    value: chain.key,
    label: chain.name,
    imageUrl: chain.icon,
}));

export const CHAIN_OPTIONS_BY_NETWORK: Record<ChainNetwork, typeof CHAIN_OPTIONS> = {
    mainnet: CHAIN_OPTIONS.filter((option) =>
        CHAIN_CONFIGS[option.value].network === "mainnet"
    ),
    testnet: CHAIN_OPTIONS.filter((option) =>
        CHAIN_CONFIGS[option.value].network === "testnet"
    ),
};

export const DEFAULT_CHAIN_KEYS: Record<ChainNetwork, ChainKey> = {
    mainnet: "base-mainnet",
    testnet: "base-testnet",
};

export const DEFAULT_CHAIN_KEY: ChainKey = DEFAULT_CHAIN_KEYS.testnet;

export function getChainKeyForNetwork(
    currentKey: ChainKey | undefined,
    network: ChainNetwork
): ChainKey {
    if (currentKey) {
        const current = CHAIN_CONFIGS[currentKey];
        if (current?.network === network) return currentKey;
        if (current) {
            const sameChainKey = `${current.id}-${network}` as ChainKey;
            if (sameChainKey in CHAIN_CONFIGS) return sameChainKey;
        }
    }

    return DEFAULT_CHAIN_KEYS[network];
}
