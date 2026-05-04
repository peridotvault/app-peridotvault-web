import { resolveChainExecution } from "@/core/blockchain/__core__/utils/chain.resolver";
import { BuyGameInput } from "@/core/blockchain/__core__/types/purchase.type";
import { EvmPurchaseService } from "@/core/blockchain/evm/services/service.purchase";
import { SvmPurchaseService } from "@/core/blockchain/svm/services/service.purchase";
import { useChainStore } from "@/shared/states/chain.store";
import {
  createPurchaseApi,
  completePurchaseApi,
  getPurchaseByGameIdApi,
} from "@/core/api/purchase.api";
import { isAxiosError } from "axios";

const EVM_ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const SOL_WRAPPED_MINT = "So11111111111111111111111111111111111111112";

export type BuyGameStep =
  | "pending"
  | "blockchain"
  | "confirming"
  | "completed"
  | "error";

export interface BuyGameResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

export class PurchaseService {
  static async buyGame(
    input: BuyGameInput,
    onStep?: (step: BuyGameStep, message?: string) => void
  ): Promise<BuyGameResult> {
    const selectedChainKey = input.chainKey ?? useChainStore.getState().chainKey;
    const resolved = resolveChainExecution(selectedChainKey);
    const isFree = !input.payment_token;

    // Step 1: Create pending purchase record via API
    let pendingTxHash: string;
    try {
      onStep?.("pending", "Creating purchase record...");
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

      const status = isAxiosError(error) ? error.response?.status : undefined;

      if (status === 409) {
        const existing = await getPurchaseByGameIdApi(input.game_id).catch(() => null);

        if (existing?.data?.status === "completed") {
          return { success: false, error: "Game already purchased. Find it in your Library." };
        }

        if (existing?.data?.status === "pending") {
          pendingTxHash =
            existing.data.transactionHash ||
            `pending_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
          console.log("[PurchaseService] Existing pending purchase found, continuing to blockchain step");
          // fall through to Step 2
        } else {
          return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create purchase record",
          };
        }
      } else {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to create purchase record",
        };
      }
    }

    // Step 2: Execute blockchain transaction
    let transactionHash: string;
    try {
      onStep?.("blockchain", isFree ? "Claiming game on blockchain..." : "Processing payment on blockchain...");
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
          const normalizedToken = normalizeSvmPaymentToken(input.payment_token);
          const signature = await SvmPurchaseService.buyGame({
            ...input,
            payment_token: normalizedToken,
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
      const errorMsg = error instanceof Error ? error.message : "Blockchain transaction failed";

      if (errorMsg.toLowerCase().includes("already owned") || errorMsg.toLowerCase().includes("already own")) {
        const existingPurchase = await getPurchaseByGameIdApi(input.game_id);

        if (existingPurchase?.data?.status === "completed") {
          return {
            success: false,
            error: errorMsg,
          };
        }

        try {
          onStep?.("confirming", "Syncing purchase record from blockchain...");
          await completePurchaseApi(input.game_id, {
            gameId: input.game_id,
            transactionHash: pendingTxHash,
            pendingTransactionHash: pendingTxHash,
          });

          onStep?.("completed");
          console.log("[PurchaseService] Purchase record synced after recovery");
          return { success: true, transactionHash: pendingTxHash };
        } catch (syncError) {
          console.error("[PurchaseService] Sync recovery failed:", syncError);
          return {
            success: false,
            error: "Game already owned on-chain but purchase record sync failed. Please contact support.",
          };
        }
      }

      return {
        success: false,
        error: errorMsg,
      };
    }

    // Step 3: Complete purchase via API
    try {
      onStep?.("confirming", "Confirming purchase...");
      const response = await completePurchaseApi(input.game_id, {
        gameId: input.game_id,
        transactionHash,
        pendingTransactionHash: pendingTxHash,
      });

      if (!response.success) {
        throw new Error(response.error || "Backend failed to complete purchase");
      }

      onStep?.("completed");
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

function normalizeSvmPaymentToken(token?: string): string | undefined {
  if (!token || token === "native" || token === EVM_ZERO_ADDRESS) {
    return SOL_WRAPPED_MINT;
  }
  return token;
}
