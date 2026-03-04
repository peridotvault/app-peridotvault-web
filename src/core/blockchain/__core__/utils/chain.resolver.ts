import { CHAIN_CONFIGS } from '@/shared/constants/chain'
import { ChainKey } from '@/shared/types/chain'

export function resolveChainExecution(chainKey: ChainKey) {
    const chain = CHAIN_CONFIGS[chainKey]

    if (!chain) {
        throw new Error(`Unknown chain key: ${chainKey}`)
    }

    return {
        chainId: chain.id,           // base | lisk | solana
        chainType: chain.type,       // evm | svm
        network: chain.network,      // mainnet | testnet
        chainKey: chain.key,
    }
}
