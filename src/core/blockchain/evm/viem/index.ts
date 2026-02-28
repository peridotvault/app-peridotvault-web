
import { createPublicClient, http, type PublicClient } from "viem";
import { base, baseSepolia, lisk, liskSepolia, type Chain } from "viem/chains";
import { DEFAULT_CHAIN_KEY } from "@/shared/constants/chain";
import { useChainStore } from "@/shared/states/chain.store";
import type { ChainKey, EvmChainKey } from "@/shared/types/chain";

type EvmChainConfig = {
    chain: Chain;
    rpcUrl?: string;
};

const EVM_CHAIN_CONFIGS: Record<EvmChainKey, EvmChainConfig> = {
    "base-mainnet": {
        chain: base,
        rpcUrl: process.env.NEXT_PUBLIC_RPC_URL_BASE_MAINNET,
    },
    "base-testnet": {
        chain: baseSepolia,
        rpcUrl: process.env.NEXT_PUBLIC_RPC_URL_BASE_TESTNET,
    },
    "lisk-mainnet": {
        chain: lisk,
        rpcUrl: process.env.NEXT_PUBLIC_RPC_URL_LISK_MAINNET,
    },
    "lisk-testnet": {
        chain: liskSepolia,
        rpcUrl: process.env.NEXT_PUBLIC_RPC_URL_LISK_TESTNET,
    },
};

const clientCache = new Map<EvmChainKey, PublicClient>();

export function getEvmChainKey(chainKey?: ChainKey): EvmChainKey {
    const selected = chainKey ?? useChainStore.getState().chainKey ?? DEFAULT_CHAIN_KEY;

    if (selected.startsWith("solana-")) {
        throw new Error("EVM_UNSUPPORTED_CHAIN");
    }

    return selected as EvmChainKey;
}

export function getEvmPublicClient(chainKey?: ChainKey) {
    const resolvedKey = getEvmChainKey(chainKey);
    const cached = clientCache.get(resolvedKey);
    if (cached) return cached;

    const config = EVM_CHAIN_CONFIGS[resolvedKey];
    const rpcUrl = config.rpcUrl ?? config.chain.rpcUrls.default.http[0];

    const client = createPublicClient({
        chain: config.chain,
        transport: http(rpcUrl),
    });

    clientCache.set(resolvedKey, client);
    return client;
}
