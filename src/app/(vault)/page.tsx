/* eslint-disable @next/next/no-img-element */
"use client";

import { IMAGE_LOADING } from "@/shared/constants/image";
import { TypographyH2 } from "@/shared/components/ui/atoms/TypographyH2";
import { Category } from "@/features/game/types/category.type";
import { STYLE_ROUNDED_CARD } from "@/shared/constants/style";

import { VaultCarousel } from "../../features/game/components/VaultCarousel";
import { VaultTopGames } from "../../features/game/components/VaultTopGames";
import { GameVerticalCard } from "@/features/game/components/ui/GameVerticalCard";

import { useGetCategories } from "@/features/game/hooks/category.hook";
import {
  useBannerGames,
  usePublishedGames,
  useTopGames,
} from "@/features/game/hooks/game.hook";
import { CarouselWrapper } from "@/shared/components/ui/organisms/CarouselWrapper";

/* ======================================================
   PAGE — Vault (Main Discovery Page)
====================================================== */

export default function Vault() {
  /* =========================
     DATA SOURCES
  ========================= */
  const { games: publishedGames } = usePublishedGames({ page: 1, limit: 30 });

  const {
    games: bannerGames,
    isLoading: isLoadingCarousel,
    error: errorBanner,
  } = useBannerGames();

  const {
    games: topGames,
    isLoading: isLoadingTopGames,
    error: errorTopGames,
  } = useTopGames();

  const { categories } = useGetCategories();

  return (
    <main className="flex flex-col items-center gap-10">
      <h1 className="sr-only">Search your Favorite Games in PeridotVault</h1>

      {/* ======================================================
         HERO — Featured & Banner Games
      ====================================================== */}
      <VaultCarousel
        items={bannerGames}
        isLoading={isLoadingCarousel}
        isError={errorBanner}
      />

      {/* ======================================================
         SECTION — Top Games (Highlights)
      ====================================================== */}
      <VaultTopGames
        games={topGames}
        isLoading={isLoadingTopGames}
        isError={errorTopGames}
      />

      {/* ======================================================
         SECTION — New on PeridotVault (Latest Releases)
      ====================================================== */}
      <section className="flex justify-center w-full px-10">
        <div className="flex flex-col gap-3 w-full items-center">
          <div className="flex max-w-7xl mx-auto w-full">
            <TypographyH2 text="New on PeridotVault" />
          </div>
          {/* contents  */}
          <CarouselWrapper
            items={publishedGames}
            pageSize={5}
            renderItem={(item, index) => (
              <GameVerticalCard
                key={index}
                gameId={item.game_id}
                gameName={item.name}
                imgUrl={item.cover_vertical_image ?? IMAGE_LOADING}
                price={item.price ?? 0}
              />
            )}
          />
        </div>
      </section>

      {/* ======================================================
         SECTION — Browse by Category
      ====================================================== */}
      <CategorySection categories={categories} />

      {/* ======================================================
         SECTION — All Games (Full Catalog)
      ====================================================== */}
      <section className="flex justify-center w-full px-10">
        <div className="flex flex-col gap-6 w-full max-w-7xl">
          <TypographyH2 text="All Games" />
          {/* contents  */}
          <div className="grid grid-cols-5 max-xl:grid-cols-4 max-md:grid-cols-3 max-sm:grid-cols-2 gap-6">
            {publishedGames?.map((item, idx) => (
              <GameVerticalCard
                key={idx}
                gameId={item.game_id}
                gameName={item.name}
                imgUrl={item.cover_vertical_image ?? IMAGE_LOADING}
                price={item.price ?? 0}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="mb-8"></div>
    </main>
  );

  function CategorySection({ categories }: { categories: Category[] }) {
    return (
      <section className="flex justify-center w-full px-10">
        <div className="flex flex-col gap-3 w-full items-center">
          <div className="flex max-w-7xl mx-auto w-full">
            <TypographyH2 text="Favorite Categories" />
          </div>
          {/* contents  */}
          <CarouselWrapper
            items={categories}
            pageSize={4}
            renderItem={(item) => (
              <div
                key={item.category_id}
                className={`w-full aspect-square ${STYLE_ROUNDED_CARD} bg-muted overflow-hidden bg-linear-to-t from-black relative duration-300 flex items-end font-medium p-6 text-xl group cursor-pointer`}
              >
                <img
                  src={item.cover_image || IMAGE_LOADING}
                  alt={item.name + " Image"}
                  className="w-full h-full object-cover absolute top-0 left-0 opacity-80 duration-300 group-hover:scale-105"
                />
                <span className="z-5 bg-card/70 px-3 py-1 rounded-lg">
                  {item.name}
                </span>
              </div>
            )}
          />
        </div>
      </section>
    );
  }
}
