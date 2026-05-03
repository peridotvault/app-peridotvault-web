import { useState } from "react";
import { TokenWithPrice } from "@/shared/components/ui/molecules/TokenWithPrice";
import { GameOnChainPublish } from "../types/game.type";
import { ButtonWithSound } from "@/shared/components/ui/atoms/ButtonWithSound";
import { toastService } from "@/core/ui-system/toast/toast.service";
import { useModal } from "@/core/ui-system/modal/modal.store";
import { ChainApi } from "@/core/api/chain.api.type";
import { PurchaseService } from "../services/purchase.service";
import { resolveChainKeyFromMetadata } from "@/shared/utils/chain";
import Image from "next/image";
import { resolveNativeTokenInfo } from "@/shared/utils/token";

export const SelectPaymentToken = ({
  modalId,
  chainSupports,
  game_onchain_publishes,
  price,
}: {
  modalId: string;
  chainSupports: ChainApi[] | undefined;
  game_onchain_publishes: GameOnChainPublish[] | undefined;
  price: number | undefined;
}) => {
  const [isBuying, setIsBuying] = useState(false);
  const isFree = !price || price === 0;

  const handleBuyClick = async (item: GameOnChainPublish, free: boolean) => {
    if (isBuying) return;
    setIsBuying(true);
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

      await PurchaseService.buyGame({
        game_id: item.game_id,
        pgl1_address: item.pgl1_address,
        payment_token: free ? undefined : item.payment_token,
        chainKey,
      });

      toastService.success(free ? "Game claimed" : "Game purchased", {
        id,
        desc: "License minted",
      });
      useModal.getState().close(modalId);
    } catch (error) {
      toastService.error(free ? "Claim failed" : "Purchase failed", {
        id,
        desc: String(error),
      });
      useModal.getState().close(modalId);
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
      {game_onchain_publishes.map((item) => {
        const chain = chainSupports.find((c) => c.caip_2_id === item.caip_2_id);
        const nativeInfo = resolveNativeTokenInfo(item.caip_2_id);

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
                  src={chain?.icon_url ?? nativeInfo.logo}
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
            <TokenWithPrice chain={chain} price={price} />
          </ButtonWithSound>
        );
      })}
    </div>
  );
};
