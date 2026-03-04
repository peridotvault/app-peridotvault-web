import {
    base,
    baseSepolia,
    lisk,
    liskSepolia,
    type Chain,
} from 'viem/chains'
import type { ChainKey } from '@/shared/types/chain'

export function getViemChain(chainKey?: ChainKey): Chain {
    switch (chainKey) {
        case 'base-mainnet':
            return base
        case 'base-testnet':
            return baseSepolia
        case 'lisk-mainnet':
            return lisk
        case 'lisk-testnet':
            return liskSepolia
        default:
            // fallback aman
            return baseSepolia
    }
}
