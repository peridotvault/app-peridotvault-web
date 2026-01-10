import { PeridotRegistryAbi } from "../abis/abi.registry";


export const REGISTRY_ADDRESS = "0xYourRegistryAddressHere" as const;

export const PERIDOT_REGISTRY = {
    address: REGISTRY_ADDRESS,
    abi: PeridotRegistryAbi,
} as const;
