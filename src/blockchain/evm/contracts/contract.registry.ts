import { PeridotRegistryAbi } from "../abis/abi.registry";
import type { ChainKey, EvmChainKey } from "@/shared/types/chain";
import { getEvmChainKey } from "../viem";

const DEFAULT_REGISTRY_ADDRESS =
    "0x1c01234773707382d909325b6df4616e6d511698" as const;

const REGISTRY_ADDRESSES: Record<EvmChainKey, `0x${string}` | undefined> = {
    "base-mainnet": process.env
        .NEXT_PUBLIC_REGISTRY_ADDRESS_BASE_MAINNET as `0x${string}` | undefined,
    "base-testnet": "0xb44449094d7872d4ef52237d633c7ac55f207bdb",
    "lisk-mainnet": process.env
        .NEXT_PUBLIC_REGISTRY_ADDRESS_LISK_MAINNET as `0x${string}` | undefined,
    "lisk-testnet": process.env
        .NEXT_PUBLIC_REGISTRY_ADDRESS_LISK_TESTNET as `0x${string}` | undefined,
};

export function getPeridotRegistry(chainKey?: ChainKey) {
    const resolvedKey = getEvmChainKey(chainKey);
    const address = REGISTRY_ADDRESSES[resolvedKey] ?? DEFAULT_REGISTRY_ADDRESS;

    return {
        address,
        abi: PeridotRegistryAbi,
    } as const;
}
