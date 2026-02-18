/* eslint-disable @next/next/no-img-element */
"use client";

import { EmbedLink } from "@/features/security/embed/embed.component";
import { PriceCoin } from "@/shared/components/ui/molecules/CoinWithAmmount";
import { STYLE_ROUNDED_CARD } from "@/shared/constants/style";
import { getAssetUrl } from "@/shared/utils/helper.url";
import { urlGameDetail } from "../../configs/url.config";

export const GameHorizontalCard = ({
  gameId,
  gameName,
  imgUrl,
  price,
  tokenCanister,
  tokenSymbol,
  tokenDecimals,
  tokenLogo,
}: {
  gameId: string;
  gameName: string;
  imgUrl: string;
  price: number | string | bigint;
  tokenCanister?: string | null;
  tokenSymbol?: string;
  tokenDecimals?: number;
  tokenLogo?: string | null;
}) => {
  return (
    <EmbedLink
      href={urlGameDetail({
        name: gameName,
        game_id: gameId,
      })}
      className={`w-full group relative overflow-hidden  ${STYLE_ROUNDED_CARD}`}
    >
      <div className="w-full aspect-video bg-muted">
        {/* IMAGE */}
        <img
          src={getAssetUrl(imgUrl)}
          alt={gameName}
          draggable={false}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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
            <PriceCoin
              amount={price ?? 0}
              tokenCanister={tokenCanister}
              tokenSymbol={tokenSymbol}
              tokenDecimals={tokenDecimals}
              tokenLogo={tokenLogo}
              textSize="sm"
            />
          </div>
        </div>
      </div>
    </EmbedLink>
  );
};
