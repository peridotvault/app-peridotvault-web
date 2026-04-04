/* eslint-disable @next/next/no-img-element */
import { ChainApi } from "@/core/api/chain.api.type";
import Image from "next/image";

type Props = {
  chain: ChainApi | undefined;
  price: number | undefined;
};

import { resolveNativeTokenInfo } from "@/shared/utils/token";

export const TokenWithPrice = ({ chain, price }: Props) => {
  const nativeInfo = resolveNativeTokenInfo(chain?.caip_2_id);
  const symbol = chain?.native_symbol || nativeInfo.symbol;
  const name = chain?.name || nativeInfo.name;
  const icon = chain?.icon_url || nativeInfo.logo;

  return (
    <section className="flex justify-between">
      {/* Token Image  */}
      <div className="flex gap-2 items-center">
        <div className="relative">
          <Image
            src={icon}
            alt={symbol + " Logo"}
            width={520}
            height={520}
            className="w-12 h-12 aspect-square rounded-full object-cover"
          />
          {chain?.icon_url && (
            <img
              src={chain.icon_url}
              alt={chain.name + " Logo"}
              width={520}
              height={520}
              className="w-5 h-5 aspect-square rounded-md absolute bottom-0 right-0 border border-background bg-background shadow-sm"
            />
          )}
        </div>

        <div className="flex flex-col items-start">
          <h3 className="font-medium text-lg line-clamp-1 leading-snug lowercase first-letter:uppercase">
            {symbol}
          </h3>
          <span className="text-sm text-label leading-snug lowercase first-letter:uppercase">
            {name}
          </span>
        </div>
      </div>

      {/* Token Price  */}
      {price ? (
        <div className="flex gap-1 items-center text-lg">
          <span>{price}</span>
          <span className="text-label uppercase">
            {symbol}
          </span>
        </div>
      ) : (
        <span className="flex gap-1 items-center text-lg pr-2">Free</span>
      )}
    </section>
  );
};
