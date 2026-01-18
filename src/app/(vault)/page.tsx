"use client";

import { VerticalCard } from "@/shared/components/VerticalCard";
import { IMAGE_LOADING } from "@/shared/constants/image";
import { VaultCarousel } from "./_components/VaultCarousel";
import { VaultTopGames } from "./_components/TopGames";
import { usePublishedGames } from "@/features/game/published/published.hook";
import { useGetCategories } from "@/shared/hooks/useCategories";
import { useTopGames } from "@/features/game/top/top.hook";
import { useBannerGames } from "@/features/game/banner/banner.hook";
import { CarouselWrapper } from "@/shared/components/CarouselWrapper";
import { CategorySection } from "./_components/CategorySection";
import { faLeaf, faPuzzlePiece } from "@fortawesome/free-solid-svg-icons";
import { HeaderWithIcon } from "./_components/HeaderWithIcon";

export default function Vault() {
  const { games: publishedGames } = usePublishedGames();
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

      {/* Section 1  */}
      <VaultCarousel
        items={bannerGames}
        isLoading={isLoadingCarousel}
        isError={errorBanner}
      />

      {/* ✅ section 3  */}
      <VaultTopGames
        games={topGames}
        isLoading={isLoadingTopGames}
        isError={errorTopGames}
      />

      {/* ✅ section 3  */}
      <section className="flex justify-center w-full px-10">
        <div className="flex flex-col gap-3 w-full items-center">
          <div className="flex max-w-7xl mx-auto w-full">
            <HeaderWithIcon
              icon={faLeaf}
              text="New on PeridotVault"
              iconColor="text-green-200"
            />
          </div>
          {/* contents  */}
          <CarouselWrapper
            items={publishedGames}
            pageSize={5}
            renderItem={(item, index) => (
              <VerticalCard
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

      {/* section 4  */}
      <CategorySection categories={categories} />

      {/* section 5  */}
      <section className="flex justify-center w-full px-10">
        <div className="flex flex-col gap-6 w-full max-w-7xl">
          <HeaderWithIcon
            icon={faPuzzlePiece}
            text="All Games"
            iconColor="text-highlight"
          />
          {/* contents  */}
          <div className="grid grid-cols-5 max-xl:grid-cols-4 max-md:grid-cols-3 max-sm:grid-cols-2 gap-6">
            {publishedGames?.map((item, idx) => (
              <VerticalCard
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
}
