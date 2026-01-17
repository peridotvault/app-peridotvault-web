/* eslint-disable @next/next/no-img-element */
"use client";

import { PriceCoin } from "./CoinWithAmmount";
import { formatTitle } from "../utils/formatUrl";
import { getAssetUrl } from "../utils/helper.url";
import { EmbedLink } from "@/features/security/embed/embed.component";

export const VerticalCard = ({
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
      href={`/${formatTitle(gameName)}/${gameId}`}
      className="w-full max-w-[250px] group relative overflow-hidden  rounded-xl"
    >
      <div className="w-full aspect-3/4 bg-muted">
        {/* IMAGE */}
        <img
          src={getAssetUrl(imgUrl)}
          alt={gameName}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      {/* =========================
            SMOOTH GRADIENT BLUR
        ========================= */}
      <div
        className="
            pointer-events-none
            absolute inset-x-0 bottom-0
            h-1/2
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

      {/* CONTENT */}
      <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col gap-2">
        <p className="font-medium text-white line-clamp-2">{gameName}</p>
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
