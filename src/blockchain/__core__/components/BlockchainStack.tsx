/* eslint-disable @next/next/no-img-element */
import { ChainType } from "@/features/game/types/game.type";

export const BlockchainStack = ({
  chain,
}: {
  chain: ChainType[] | undefined;
}) => {
  if (!chain) {
    return (
      <div className="flex -space-x-2 overflow-hidden">
        Not Support Any Chain
      </div>
    );
  }

  return (
    <div className="flex -space-x-2 overflow-hidden">
      {chain.map((item) => (
        <div
          key={item.caip_2_id}
          className="inline-block size-8 rounded-full ring-2 ring-gray-900 outline -outline-offset-1 outline-white/10 overflow-hidden p-1.5 bg-foreground"
        >
          <img
            src={item.icon_url}
            alt={item.name + " Image"}
            className="w-full h-full"
          />
        </div>
      ))}
    </div>
  );
};
