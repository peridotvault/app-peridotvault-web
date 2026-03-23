import { TokenWithPrice } from "@/shared/components/ui/molecules/TokenWithPrice";
import { GameOnChainPublish } from "../types/game.type";
import { ButtonWithSound } from "@/shared/components/ui/atoms/ButtonWithSound";
import { toastService } from "@/core/ui-system/toast/toast.service";
import { useModal } from "@/core/ui-system/modal/modal.store";
import { ChainApi } from "@/core/api/chain.api.type";
import { PurchaseService } from "../services/purchase.service";
import { resolveChainKeyFromMetadata } from "@/shared/utils/chain";

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
  const handleBuyClick = async (item: GameOnChainPublish) => {
    const id = toastService.loading("Buying Game...");
    try {
      if (game_onchain_publishes) {
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
          pgc1_address: item.pgc1_address,
          payment_token: item.payment_token,
          chainKey,
        });
      }
      toastService.success("Game purchased", {
        id,
        desc: "License minted",
      });
      useModal.getState().close(modalId);
    } catch (error) {
      toastService.error("Purchase failed", {
        id,
        desc: String(error),
      });
      useModal.getState().close(modalId);
      console.error(error);
    }
  };

  if (!chainSupports || !game_onchain_publishes) {
    return <div>No Payments</div>;
  }

  return (
    <div className="w-110 flex flex-col gap-1 p-4">
      <h2 className="text-lg pl-2 pt-2 mb-3">Select Payment Token</h2>
      {game_onchain_publishes.map((item) => {
        const chain = chainSupports.find((c) => c.caip_2_id === item.caip_2_id);
        return (
          <ButtonWithSound
            key={item.id}
            onClick={() => handleBuyClick(item)}
            className="hover:bg-foreground/5 cursor-pointer p-2 rounded-xl duration-300"
          >
            <TokenWithPrice chain={chain} price={price} />
          </ButtonWithSound>
        );
      })}
    </div>
  );
};
