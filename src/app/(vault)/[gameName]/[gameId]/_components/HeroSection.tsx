/* eslint-disable @next/next/no-img-element */
"use client";

import { ContainerPadding } from "@/shared/components/ui/ContainerPadding";

type Props = {
  bannerImage: string;
  gameName: string;
  categories: string[];
  price: number;
  tokenAddress: string | undefined;
};

export const HeroSection = ({ bannerImage, gameName, categories }: Props) => {
  return (
    <div className="relative w-full min-h-120 max-h-200 overflow-hidden bg-card">
      {bannerImage ? (
        <img
          src={bannerImage}
          alt={gameName}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-muted animate-pulse" />
      )}
      {/* <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" /> */}
      <ContainerPadding className="relative z-5 flex justify-end lg:justify-between lg:items-end max-lg:flex-col gap-6 py-8 h-full duration-300">
        <div className="flex flex-col gap-4 md:w-3/5">
          <span className="tracking-wide capitalize text-foreground">
            {categories.map((item, index) =>
              index == 0 ? item : " - " + item
            )}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            {gameName ?? "PeridotVault Game"}
          </h1>
        </div>
      </ContainerPadding>
    </div>
  );
};
