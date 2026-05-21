"use client";

import { EmbedLink } from "@/features/security/embed/embed.component";
import { PriceCoin } from "@/shared/components/ui/molecules/CoinWithAmmount";
import { resolveGamePaymentToken, resolveNativeTokenInfo } from "@/shared/utils/token";
import { STYLE_ROUNDED_CARD } from "@/shared/constants/style";
import { urlGameDetail } from "../../configs/url.config";
import { OptimizedImage } from "@/shared/components/ui/atoms/OptimizedImage";

import { ChainApi } from "@/core/api/chain.api.type";
import { GameOnChainPublish } from "@/features/game/types/game.type";

export const GameHorizontalCard = ({
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
  const resolved = resolveGamePaymentToken(
    gameOnChainPublishes,
    chain?.[0]?.caip_2_id,
    tokenLookup,
  );

  return (
    <EmbedLink
      href={urlGameDetail({
        name: gameName,
        game_id: gameId,
      })}
      onClick={onClick}
      className={`w-full group relative overflow-hidden  ${STYLE_ROUNDED_CARD}`}
    >
      <div className="w-full aspect-video bg-muted relative">
        <OptimizedImage
          src={imgUrl}
          alt={gameName}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          draggable={false}
        />
      </div>
      {/* =========================
            SMOOTH GRADIENT BLUR
        ========================= */}
      <div
        className="
            pointer-events-none
            absolute inset-x-0 -bottom-2
            h-4/7
            backdrop-blur-lg
          "
        style={{
          WebkitMaskImage:
            "linear-gradient(to top, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
          maskImage:
            "linear-gradient(to top, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.70), rgba(0,0,0,0))",
        }}
      />

      {/* CONTENT */}
      <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col gap-2">
        <p className="font-medium text-white line-clamp-1">{gameName}</p>
        <div className="flex justify-end">
          <div className="bg-card/40 px-3 py-1 rounded-lg">
            {(() => {
              const native = resolveNativeTokenInfo(chain?.[0]?.caip_2_id);
              return (
                <PriceCoin
                  amount={price ?? 0}
                  tokenCanister={tokenCanister}
                  tokenSymbol={
                    tokenSymbol ??
                    resolved.symbol ??
                    chain?.[0]?.native_symbol ??
                    native.symbol
                  }
                  tokenDecimals={tokenDecimals ?? resolved.decimals}
                  tokenLogo={
                    tokenLogo ??
                    resolved.logo ??
                    chain?.[0]?.icon_url ??
                    native.logo
                  }
                  textSize="sm"
                />
              );
            })()}
          </div>
        </div>
      </div>
    </EmbedLink>
  );
};
