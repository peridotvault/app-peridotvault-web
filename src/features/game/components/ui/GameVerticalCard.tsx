/* eslint-disable @next/next/no-img-element */
"use client";

import { BlockchainStack } from "@/core/blockchain/__core__/components/BlockchainStack";
import { EmbedLink } from "@/features/security/embed/embed.component";
import { PriceCoin } from "@/shared/components/ui/molecules/CoinWithAmmount";
import { resolveGamePaymentToken } from "@/shared/utils/token";
import { STYLE_ROUNDED_CARD } from "@/shared/constants/style";
import { getAssetUrl } from "@/shared/utils/helper.url";
import { urlGameDetail } from "../../configs/url.config";
import { ChainApi } from "@/core/api/chain.api.type";
import { GameOnChainPublish } from "@/features/game/types/game.type";

export const GameVerticalCard = ({
  gameId,
  gameName,
  imgUrl,
  price,
  tokenCanister,
  tokenSymbol,
  tokenDecimals,
  tokenLogo,
  chain,
  gameOnChainPublishes,
  tokenLookup,
  onClick,
}: {
  gameId: string;
  gameName: string;
  imgUrl: string;
  price: number | string | bigint;
  tokenCanister?: string | null;
  tokenSymbol?: string;
  tokenDecimals?: number;
  tokenLogo?: string | null;
  chain: ChainApi[] | undefined;
  gameOnChainPublishes?: GameOnChainPublish[];
  tokenLookup?: Map<string, { symbol: string; decimals: number }>;
  onClick?: () => void;
}) => {
  const resolved = resolveGamePaymentToken(gameOnChainPublishes, chain?.[0]?.caip_2_id, tokenLookup);

  return (
    <EmbedLink
      href={urlGameDetail({
        name: gameName,
        game_id: gameId,
      })}
      onClick={onClick}
      className={`w-full group relative overflow-hidden  ${STYLE_ROUNDED_CARD}`}
    >
      <div className="w-full aspect-3/4 bg-muted">
        <img
          src={getAssetUrl(imgUrl)}
          alt={gameName}
          draggable={false}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div
        className="
            pointer-events-none
            absolute inset-x-0 -bottom-2
            h-4/7
            backdrop-blur-lg
          "
        style={{
          WebkitMaskImage:
            "linear-gradient(to top, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 100%)",
          maskImage:
            "linear-gradient(to top, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.50), rgba(0,0,0,0))",
        }}
      />

      <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col gap-2">
        <p className="font-medium text-white line-clamp-2">{gameName}</p>
        <div className="flex justify-between items-center">
          <BlockchainStack chain={chain} />
          <div className="bg-card/40 px-3 py-1 rounded-lg">
            <PriceCoin
              amount={price ?? 0}
              tokenCanister={tokenCanister}
              tokenSymbol={tokenSymbol ?? resolved.symbol}
              tokenDecimals={tokenDecimals ?? resolved.decimals}
              tokenLogo={tokenLogo ?? resolved.logo}
              textSize="sm"
            />
          </div>
        </div>
      </div>
    </EmbedLink>
  );
};
