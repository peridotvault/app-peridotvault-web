// import { PeridotRegistryAbi } from "../abis/abi.registry";
// import type { ChainKey, EvmChainKey } from "@/shared/types/chain";


// const REGISTRY_ADDRESSES: Record<EvmChainKey, `0x${string}` | undefined> = {
//     "base-mainnet": "0x",
//     "base-testnet": "0xb44449094d7872d4ef52237d633c7ac55f207bdb",
//     "lisk-mainnet": "0x",
//     "lisk-testnet": "0x",
// };

// export function getPeridotRegistry(chainKey?: ChainKey) {
//     const resolvedKey = getEvmChainKey(chainKey);
//     const address = REGISTRY_ADDRESSES[resolvedKey] ?? DEFAULT_REGISTRY_ADDRESS;

//     return {
//         address,
//         abi: PeridotRegistryAbi,
//     } as const;
// }
