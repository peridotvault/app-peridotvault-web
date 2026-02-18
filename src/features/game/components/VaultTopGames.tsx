"use client";

import React from "react";
import { EmbedLink } from "@/features/security/embed/embed.component";
import Image from "next/image";
import { IMAGE_LOADING } from "@/shared/constants/image";
import { getAssetUrl } from "@/shared/utils/helper.url";
import { STYLE_ROUNDED_CARD } from "@/shared/constants/style";
import { TypographyH2 } from "@/shared/components/ui/atoms/TypographyH2";
import { GameCard } from "../types/game.type";
import { CarouselWrapper } from "@/shared/components/ui/organisms/CarouselWrapper";
import { urlGameDetail } from "../configs/url.config";

type Props = {
  className?: string; // optional: untuk -mt overlap dari parent
  games: GameCard[];
  isLoading: boolean;
  isError?: string | null;
};

export const VaultTopGames: React.FC<Props> = ({
  className = "",
  games,
  isLoading,
  isError,
}) => {
  const getCoverSrc = (src: string | null | undefined) => {
    if (!src) return IMAGE_LOADING;
    return getAssetUrl(src);
  };

  return (
    <section className={"flex justify-center w-full px-6 " + className}>
      <div className="flex flex-col gap-3 w-full items-center">
        <div className="flex max-w-7xl mx-auto w-full">
          <TypographyH2 text="Top Games This Month" />
        </div>
        {/* contents  */}
        {isLoading || isError ? (
          <div className="grid grid-cols-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="bg-muted w-full aspect-video"></div>
            ))}
          </div>
        ) : (
          <CarouselWrapper
            items={games}
            pageSize={3}
            renderItem={(item, idx) => (
              <EmbedLink
                key={idx}
                href={urlGameDetail({
                  name: item.name,
                  game_id: item.game_id,
                })}
                className="w-full aspect-video relative overflow-hidden flex justify-end"
              >
                <span className="text-[10rem] font-bold absolute left-2 bottom-16 z-5">
                  {idx + 1}
                </span>
                <div
                  className={`h-full w-full bg-muted ${STYLE_ROUNDED_CARD} overflow-hidden relative`}
                >
                  <Image
                    src={getCoverSrc(item.cover_horizontal_image)}
                    alt={item.name + " Cover Image"}
                    className="w-full h-full object-cover"
                    width={720}
                    height={1080}
                  />
                  <div className="bg-linear-to-r from-black/50 absolute left-0 top-0 h-full w-full"></div>
                </div>
              </EmbedLink>
            )}
          />
        )}
      </div>
    </section>
  );
};
