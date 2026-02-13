import { TokenWithPrice } from "@/shared/components/ui/molecules/TokenWithPrice";
import { ChainType, GameOnChainPublish } from "../types/game.type";
import { ButtonWithSound } from "@/shared/components/ui/atoms/ButtonWithSound";
import { toastService } from "@/shared/infra/toast/toast.service";
import { EvmPurchaseService } from "@/blockchain/evm/services/service.purchase";
import { useModal } from "@/shared/infra/modal/modal.store";

export const SelectPaymentToken = ({
  modalId,
  chainSupports,
  game_onchain_publishes,
  price,
}: {
  modalId: string;
  chainSupports: ChainType[] | undefined;
  game_onchain_publishes: GameOnChainPublish[] | undefined;
  price: number | undefined;
}) => {
  const handleBuyClick = async ({
    pgc1_address,
    payment_token,
  }: {
    pgc1_address: `0x${string}`;
    payment_token: `0x${string}`;
  }) => {
    const id = toastService.loading("Buying Game...");
    try {
      if (game_onchain_publishes) {
        await EvmPurchaseService.buyGame({
          pgc1_address: pgc1_address,
          payment_token: payment_token,
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
      {game_onchain_publishes.map((item, index) => {
        const chain = chainSupports.find((c) => c.caip_2_id === item.caip_2_id);
        return (
          <ButtonWithSound
            key={index}
            onClick={() =>
              handleBuyClick({
                payment_token: item.payment_token,
                pgc1_address: item.pgc1_address,
              })
            }
            className="hover:bg-foreground/5 cursor-pointer p-2 rounded-xl duration-300"
          >
            <TokenWithPrice chain={chain} price={price} />
          </ButtonWithSound>
        );
      })}
    </div>
  );
};
