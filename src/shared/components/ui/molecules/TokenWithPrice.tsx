/* eslint-disable @next/next/no-img-element */
import { ChainType } from "@/features/game/types/game.type";
import Image from "next/image";

type Props = {
  chain: ChainType | undefined;
  price: number | undefined;
};

export const TokenWithPrice = ({ chain, price }: Props) => {
  return (
    <section className="flex justify-between">
      {/* Token Image  */}
      <div className="flex gap-2 items-center">
        <div className="relative">
          <Image
            src="/images/token/idrx.jpeg"
            alt="IDRX Logo"
            width={520}
            height={520}
            className="w-12 h-12 aspect-square rounded-full"
          />
          <img
            src={chain?.icon_url}
            alt={chain?.name + " Logo"}
            width={520}
            height={520}
            className="w-5 h-5 aspect-square rounded-md absolute bottom-0 right-0 border border-background bg-background"
          />
        </div>

        <div className="flex flex-col items-start">
          <h3 className="font-medium text-lg line-clamp-1 leading-snug">
            IDRX
          </h3>
          <span className="text-sm text-label leading-snug">base</span>
        </div>
      </div>

      {/* Token Price  */}
      {price ? (
        <div className="flex gap-1 items-center text-lg">
          <span>{price}</span>
          <span className="text-label">IDRX</span>
        </div>
      ) : (
        <span className="flex gap-1 items-center text-lg pr-2">Free</span>
      )}
    </section>
  );
};
