import { resolveChainExecution } from "@/core/blockchain/__core__/utils/chain.resolver";
import { BuyGameInput } from "@/core/blockchain/__core__/types/purchase.type";
import { EvmPurchaseService } from "@/core/blockchain/evm/services/service.purchase";
import { SvmPurchaseService } from "@/core/blockchain/svm/services/service.purchase";
import { useChainStore } from "@/shared/states/chain.store";

export class PurchaseService {
  static async buyGame(input: BuyGameInput) {
    const selectedChainKey = input.chainKey ?? useChainStore.getState().chainKey;
    const resolved = resolveChainExecution(selectedChainKey);

    switch (resolved.chainType) {
      case "evm":
        return EvmPurchaseService.buyGame({
          ...input,
          chainKey: resolved.chainKey,
        });
      case "svm":
        return SvmPurchaseService.buyGame({
          ...input,
          chainKey: resolved.chainKey,
        });
      default:
        throw new Error("Unsupported chain type");
    }
  }
}
