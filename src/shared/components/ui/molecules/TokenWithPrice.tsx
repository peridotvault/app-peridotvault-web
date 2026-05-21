import { ChainApi } from "@/core/api/chain.api.type";
import Image from "next/image";

type TokenMeta = {
  symbol: string;
  name: string;
  logo: string | null;
};

type Props = {
  chain: ChainApi | undefined;
  price: number | undefined;
  tokenMeta?: TokenMeta;
};

import { resolveNativeTokenInfo } from "@/shared/utils/token";
import { normalizeAssetUrl } from "@/shared/utils/helper.url";
import { OptimizedImage } from "@/shared/components/ui/atoms/OptimizedImage";

export const TokenWithPrice = ({ chain, price, tokenMeta }: Props) => {
  const nativeInfo = resolveNativeTokenInfo(chain?.caip_2_id);
  const symbol = tokenMeta?.symbol ?? chain?.native_symbol ?? nativeInfo.symbol;
  const name = tokenMeta?.name ?? chain?.name ?? nativeInfo.name;
  const icon = normalizeAssetUrl(tokenMeta?.logo ?? chain?.icon_url ?? nativeInfo.logo ?? "");

  return (
    <section className="flex justify-between">
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
            <div className="w-5 h-5 absolute bottom-0 right-0 rounded-md border border-background bg-background shadow-sm overflow-hidden">
              <div className="absolute inset-0.5">
                <OptimizedImage
                  src={chain.icon_url}
                  alt={chain.name + " Logo"}
                  fill
                  sizes="16px"
                  className="object-contain"
                />
              </div>
            </div>
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
