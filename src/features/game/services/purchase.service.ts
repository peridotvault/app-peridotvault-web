import { resolveChainExecution } from "@/core/blockchain/__core__/utils/chain.resolver";
import { BuyGameInput } from "@/core/blockchain/__core__/types/purchase.type";
import { EvmPurchaseService } from "@/core/blockchain/evm/services/service.purchase";
import { SvmPurchaseService } from "@/core/blockchain/svm/services/service.purchase";
import { useChainStore } from "@/shared/states/chain.store";
import {
  createPurchaseApi,
  completePurchaseApi,
} from "@/core/api/purchase.api";

export interface BuyGameResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

export class PurchaseService {
  static async buyGame(input: BuyGameInput): Promise<BuyGameResult> {
    const selectedChainKey = input.chainKey ?? useChainStore.getState().chainKey;
    const resolved = resolveChainExecution(selectedChainKey);
    const isFree = !input.payment_token;

    // Step 1: Create pending purchase record via API
    let pendingTxHash: string;
    try {
      pendingTxHash = `pending_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 15)}`;

      await createPurchaseApi({
        gameId: input.game_id,
        purchasePrice: "0",
        paymentToken: input.payment_token ?? "free",
        paymentTokenId: 1,
        transactionHash: pendingTxHash,
      });

      console.log("[PurchaseService] Pending record created");
    } catch (error) {
      console.error("[PurchaseService] Failed to create pending purchase:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create purchase record",
      };
    }

    // Step 2: Execute blockchain transaction
    let transactionHash: string;
    try {
      switch (resolved.chainType) {
        case "evm": {
          if (isFree) throw new Error("Free games not supported on EVM");
          const hash = await EvmPurchaseService.buyGame({
            ...input,
            chainKey: resolved.chainKey,
          });
          transactionHash = hash;
          break;
        }
        case "svm": {
          const signature = await SvmPurchaseService.buyGame({
            ...input,
            chainKey: resolved.chainKey,
          });
          transactionHash = signature;
          break;
        }
        default:
          throw new Error("Unsupported chain type");
      }
      console.log("[PurchaseService] Chain transaction successful:", transactionHash);
    } catch (error) {
      console.error("[PurchaseService] Chain transaction failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Blockchain transaction failed",
      };
    }

    // Step 3: Complete purchase via API
    try {
      await completePurchaseApi(input.game_id, {
        gameId: input.game_id,
        transactionHash,
      });
      console.log("[PurchaseService] Purchase completed");
      return { success: true, transactionHash };
    } catch (error) {
      console.error("[PurchaseService] Failed to complete:", error);
      return {
        success: true,
        transactionHash,
        error: "On-chain success but backend update failed. Please refresh your library.",
      };
    }
  }
}
