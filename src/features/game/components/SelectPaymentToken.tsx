import { useState, useCallback } from "react";
import { TokenWithPrice } from "@/shared/components/ui/molecules/TokenWithPrice";
import { GameOnChainPublish } from "../types/game.type";
import { ButtonWithSound } from "@/shared/components/ui/atoms/ButtonWithSound";
import { toastService } from "@/core/ui-system/toast/toast.service";
import { useModal } from "@/core/ui-system/modal/modal.store";
import { ChainApi } from "@/core/api/chain.api.type";
import { PurchaseService, BuyGameStep } from "../services/purchase.service";
import { resolveChainKeyFromMetadata } from "@/shared/utils/chain";
import Image from "next/image";
import { resolveNativeTokenInfo } from "@/shared/utils/token";
import { Stepper, Step } from "@/shared/components/ui/molecules/Stepper";
import { authRepo } from "@/core/db/repositories/auth.repo";
import { hasPurchasedGameApi } from "@/core/api/purchase.api";

export const SelectPaymentToken = ({
  modalId,
  chainSupports,
  game_onchain_publishes,
  price,
  tokenMetadataMap,
}: {
  modalId: string;
  chainSupports: ChainApi[] | undefined;
  game_onchain_publishes: GameOnChainPublish[] | undefined;
  price: number | undefined;
  tokenMetadataMap?: Map<
    string,
    { symbol: string; name: string; logo: string | null }
  >;
}) => {
  const [isBuying, setIsBuying] = useState(false);
  const [purchaseSteps, setPurchaseSteps] = useState<Step[]>([
    { label: "Create Purchase Record", status: "pending" },
    { label: "Blockchain Transaction", status: "pending" },
    { label: "Confirm Purchase", status: "pending" },
  ]);
  const isFree = !price || price === 0;

  const updateStep = useCallback((stepIndex: number, status: Step["status"], description?: string) => {
    setPurchaseSteps((prev) =>
      prev.map((s, i) => {
        if (i < stepIndex) return { ...s, status: "completed" };
        if (i === stepIndex) return { ...s, status, description };
        return s;
      })
    );
  }, []);

  const resetSteps = useCallback(() => {
    setPurchaseSteps([
      { label: "Create Purchase Record", status: "pending" },
      { label: "Blockchain Transaction", status: "pending" },
      { label: "Confirm Purchase", status: "pending" },
    ]);
  }, []);

  const handleBuyClick = async (item: GameOnChainPublish, free: boolean) => {
    if (isBuying) return;

    const session = await authRepo.getSession();
    if (!session) {
      toastService.error("Login Required", {
        desc: "Please log in to your account before purchasing a game.",
      });
      return;
    }

    const alreadyPurchased = await hasPurchasedGameApi(item.game_id);
    if (alreadyPurchased) {
      toastService.success("Already Purchased", {
        desc: "You already own this game. Find it in your Library.",
      });
      useModal.getState().close(modalId);
      return;
    }

    setIsBuying(true);
    resetSteps();

    const label = free ? "Claiming Game..." : "Buying Game...";
    const id = toastService.loading(label);

    try {
      const chain = chainSupports?.find((c) => c.caip_2_id === item.caip_2_id);
      const chainKey = resolveChainKeyFromMetadata({
        caip2Id: item.caip_2_id,
        name: chain?.name,
        isTestnet: chain?.is_testnet,
      });

      if (!chainKey) {
        throw new Error(
          `Unable to resolve chain for publish ${item.id} (${item.caip_2_id ?? "unknown"})`,
        );
      }

      const result = await PurchaseService.buyGame(
        {
          game_id: item.game_id,
          pgl1_address: item.pgl1_address,
          payment_token: free ? undefined : item.payment_token,
          chainKey,
        },
        (step, message) => {
          switch (step) {
            case "pending":
              updateStep(0, "active", message);
              break;
            case "blockchain":
              updateStep(1, "active", message);
              break;
            case "confirming":
              updateStep(2, "active", message);
              break;
            case "completed":
              updateStep(2, "completed");
              break;
            case "error":
              // error will be handled by the catch block
              break;
          }
        }
      );

      if (!result.success) {
        throw new Error(result.error || "Purchase failed");
      }

      if (result.error) {
        // On-chain success but backend update failed
        toastService.success(free ? "Game claimed on-chain" : "Game purchased on-chain", {
          id,
          desc: result.error,
        });
      } else {
        toastService.success(free ? "Game claimed" : "Game purchased", {
          id,
          desc: "License minted",
        });
      }
      useModal.getState().close(modalId);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      const isAlreadyOwned = errorMsg.toLowerCase().includes("already owned") ||
        errorMsg.toLowerCase().includes("already purchased");

      if (!isAlreadyOwned) {
        // Mark current active step as error
        setPurchaseSteps((prev) => {
          const activeIndex = prev.findIndex((s) => s.status === "active");
          if (activeIndex >= 0) {
            return prev.map((s, i) =>
              i === activeIndex ? { ...s, status: "error", description: errorMsg } : s
            );
          }
          return prev;
        });

        toastService.error(free ? "Claim failed" : "Purchase failed", {
          id,
          desc: errorMsg,
        });
      } else {
        toastService.success("Already Owned", {
          id,
          desc: "You already own this game.",
        });
      }
      console.error(error);
    } finally {
      setIsBuying(false);
    }
  };

  if (!chainSupports || !game_onchain_publishes) {
    return <div>No Payments</div>;
  }

  return (
    <div className="w-110 flex flex-col gap-1 p-4">
      <h2 className="text-lg pl-2 pt-2 mb-3">
        {isFree ? "Select Blockchain" : "Select Payment Token"}
      </h2>

      {isBuying && (
        <div className="mb-4 p-4 rounded-xl bg-card border border-border">
          <Stepper steps={purchaseSteps} />
        </div>
      )}

      {game_onchain_publishes.map((item) => {
        const chain = chainSupports.find((c) => c.caip_2_id === item.caip_2_id);
        const nativeInfo = resolveNativeTokenInfo(item.caip_2_id);
        const tokenMeta = tokenMetadataMap?.get(
          item.payment_token?.toLowerCase() ?? "",
        );

        if (isFree) {
          return (
            <ButtonWithSound
              key={item.id}
              onClick={() => handleBuyClick(item, true)}
              disabled={isBuying}
              className="hover:bg-foreground/5 cursor-pointer p-2 rounded-xl duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex gap-2 items-center w-full">
                <Image
                  src={tokenMeta?.logo ?? chain?.icon_url ?? nativeInfo.logo}
                  alt={chain?.name ?? nativeInfo.name}
                  width={520}
                  height={520}
                  className="w-12 h-12 aspect-square rounded-full object-cover"
                />
                <div className="flex flex-col items-start">
                  <h3 className="font-medium text-lg line-clamp-1 leading-snug lowercase first-letter:uppercase">
                    {chain?.name ?? nativeInfo.name}
                  </h3>
                  <span className="text-sm text-label">Free</span>
                </div>
              </div>
            </ButtonWithSound>
          );
        }

        return (
          <ButtonWithSound
            key={item.id}
            onClick={() => handleBuyClick(item, false)}
            disabled={isBuying}
            className="hover:bg-foreground/5 cursor-pointer p-2 rounded-xl duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <TokenWithPrice
              chain={chain}
              price={price}
              tokenMeta={
                tokenMeta
                  ? {
                      symbol: tokenMeta.symbol,
                      name: tokenMeta.name,
                      logo: tokenMeta.logo,
                    }
                  : undefined
              }
            />
          </ButtonWithSound>
        );
      })}
    </div>
  );
};
