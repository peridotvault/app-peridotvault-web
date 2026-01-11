import { PeridotRegistryAbi } from "../abis/abi.registry";


export const REGISTRY_ADDRESS = "0x1c01234773707382d909325b6df4616e6d511698" as const;

export const PERIDOT_REGISTRY = {
    address: REGISTRY_ADDRESS,
    abi: PeridotRegistryAbi,
} as const;
