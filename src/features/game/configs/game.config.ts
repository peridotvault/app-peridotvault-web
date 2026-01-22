import { PeridotRegistryAbi } from "@/features/blockchain/evm/abis/abi.registry";



export const PERIDOT_REGISTRY = {
    address: "0x1c01234773707382d909325b6df4616e6d511698" as const,
    abi: PeridotRegistryAbi,
} as const;

export const PGC1_LICENSE_ID = BigInt(1);
