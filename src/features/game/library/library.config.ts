import { PeridotRegistryAbi } from "@/shared/chains/evm/abis/abi.registry";



export const PERIDOT_REGISTRY = {
    address: "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512" as const,
    abi: PeridotRegistryAbi,
} as const;