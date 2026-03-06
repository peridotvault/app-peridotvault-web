import { PeridotRegistryAbi } from "../abis/abi.registry";
import type { ChainKey, EvmChainKey } from "@/shared/types/chain";
import { getEvmChainKey } from "../viem";
import { getAddress, isAddress } from "viem";

const REGISTRY_ADDRESSES: Record<EvmChainKey, `0x${string}` | undefined> = {
    "base-mainnet": process.env
        .NEXT_PUBLIC_REGISTRY_ADDRESS_BASE_MAINNET as `0x${string}` | undefined,
    "base-testnet": process.env
        .NEXT_PUBLIC_REGISTRY_ADDRESS_BASE_TESTNET as `0x${string}` | undefined,
    "lisk-mainnet": process.env
        .NEXT_PUBLIC_REGISTRY_ADDRESS_LISK_MAINNET as `0x${string}` | undefined,
    "lisk-testnet": process.env
        .NEXT_PUBLIC_REGISTRY_ADDRESS_LISK_TESTNET as `0x${string}` | undefined,
};

export function getPeridotRegistry(chainKey?: ChainKey) {
    const resolvedKey = getEvmChainKey(chainKey);
    const configuredAddress = REGISTRY_ADDRESSES[resolvedKey];

    if (!configuredAddress) {
        throw new Error(`EVM_REGISTRY_NOT_CONFIGURED:${resolvedKey}`);
    }

    if (!isAddress(configuredAddress)) {
        throw new Error(`EVM_INVALID_REGISTRY_ADDRESS:${resolvedKey}`);
    }

    const address = getAddress(configuredAddress);

    return {
        address,
        abi: PeridotRegistryAbi,
    } as const;
}
