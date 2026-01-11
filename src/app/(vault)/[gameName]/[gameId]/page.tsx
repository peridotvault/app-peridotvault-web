/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useParams } from "next/navigation";

import { useGameDetail } from "@/features/game/detail/detail.hook";
import { HeroSection } from "./_components/HeroSection";
import { ContainerPadding } from "@/shared/components/ui/ContainerPadding";
import { DetailContent } from "./_components/DetailContent";
import { GameGlance } from "./_components/GameGlance";
import { SystemRequirement } from "./_components/SystemRequirement";
import { GameDistribution } from "@/features/game/published/distribution.type";
import { getAssetUrl } from "@/shared/utils/helper.url";

export default function GameDetailPage(): React.ReactElement {
  const params = useParams();
  const raw = (params as any)?.gameId;
  const gameId = Array.isArray(raw) ? raw[0] : raw;

  const { game, isLoading, hasFetched, error } = useGameDetail({ gameId });

  // ====== Guards awal (tidak ada hook di bawah sini) ======

  if (!gameId) {
    return (
      <main className="flex justify-center py-24">
        <div className="max-w-[720px] text-center">
          <h1 className="text-3xl font-semibold mb-4">Invalid game URL</h1>
          <p className="text-muted-foreground">
            The game identifier in the URL is missing or invalid.
          </p>
        </div>
      </main>
    );
  }

  if (isLoading || !hasFetched) {
    return (
      <main className="flex justify-center py-24">
        <div className="max-w-[720px] text-center">
          <h1 className="text-2xl font-semibold mb-4">Loading game…</h1>
          <p className="text-muted-foreground">
            Please wait while we load the game details.
          </p>
        </div>
      </main>
    );
  }

  if (error || !game) {
    console.log("err");
    // console.error(error);
    return (
      <main className="flex justify-center py-24">
        <div className="max-w-[720px] text-center">
          <h1 className="text-3xl font-semibold mb-4">Game not found</h1>
          <p className="text-muted-foreground">
            We could not find the game you are looking for. It might be
            unpublished or removed from the catalog.
          </p>
        </div>
      </main>
    );
  }

  // Distributions
  const distributions: GameDistribution[] = game.distributions ?? [];

  // Cari distribusi web (kalau ada)
  const webDist = distributions.find((d) => "web" in d);
  const webSpec = webDist && "web" in webDist ? webDist.web : undefined;

  // Platform list sederhana untuk About
  const availablePlatforms: string[] = [];
  if (webSpec) availablePlatforms.push("Web");
  if (distributions.some((d) => "native" in d)) {
    // Kamu bisa ganti jadi OS detail, ini minimal saja
    availablePlatforms.push("Native");
  }

  // ============================== UI ===============================

  return (
    <main className="flex justify-center duration-300">
      <div className=" w-full flex flex-col gap-8 duration-300 ">
        <div className="flex flex-col gap-8">
          {/* Hero */}
          <HeroSection
            bannerImage={getAssetUrl(game.banner_image)}
            gameName={game.name}
            categories={game.categories ?? []}
            price={game.price}
            tokenAddress={undefined}
          />

          {/* Game Glance  */}
          <GameGlance
            coverHorizontalImage={getAssetUrl(game.cover_horizontal_image)}
            gameDescription={game.description}
            gameName={game.name}
            previews={game.previews}
            tags={game.tags}
          />
        </div>

        <ContainerPadding className="flex gap-12 max-lg:flex-col">
          {/* left  */}
          <div className="max-lg:order-2">
            <SystemRequirement />
          </div>

          {/* right  */}
          <DetailContent />
        </ContainerPadding>
        <div className="mb-4"></div>
      </div>
    </main>
  );
}
