import { resolveChainExecution } from '@/core/blockchain/__core__/utils/chain.resolver'
import { EvmPurchaseService } from '@/core/blockchain/evm/services/service.purchase'
import { useChainStore } from '@/shared/states/chain.store'
// import { SvmPurchaseService } from '@/features/blockchain/svm/services/service.purchase'

export class PurchaseService {
    static async buyGame(input: { pgc1_address: `0x${string}`, payment_token: `0x${string}` }) {
        const { chainKey } = useChainStore.getState()

        const resolved = resolveChainExecution(chainKey)

        switch (resolved.chainType) {
            case 'evm':
                return EvmPurchaseService.buyGame(input)
            //   case 'svm':
            //     return SvmPurchaseService.buyGame(input, resolved)
            default:
                throw new Error('Unsupported chain type')
        }
    }
}
