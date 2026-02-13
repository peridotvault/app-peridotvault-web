/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import GameDetailPreview from "@/features/game/components/GameDetailPreview";
import { GameRelated } from "@/features/game/components/ui/GameRelated";
import { useGameDetail, useRelatedGame } from "@/features/game/hooks/game.hook";
import {
  ChainType,
  GameDistribution,
  GameOnChainPublish,
  GamePreview,
  NativeBuild,
} from "@/features/game/types/game.type";
import { PriceCoin } from "@/shared/components/ui/molecules/CoinWithAmmount";
import { ContainerPadding } from "@/shared/components/ContainerPadding";
import { TypographyH2 } from "@/shared/components/ui/atoms/TypographyH2";
import {
  STYLE_ROUNDED_CARD,
  SMALL_GRID,
  BUTTON_HIGHLIGHT_COLOR,
  STYLE_ROUNDED_BUTTON,
  BUTTON_COLOR,
} from "@/shared/constants/style";
import { getAssetUrl } from "@/shared/utils/helper.url";
import {
  faBookmark,
  faShirt,
  faShare,
  faFlag,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "next/navigation";
import { useState } from "react";
import { BlockchainStack } from "@/blockchain/__core__/components/BlockchainStack";
import igrs from "@/shared/assets/rating/igrs.json";
import { ButtonWithSound } from "@/shared/components/ui/atoms/ButtonWithSound";
import { getSupportedPlatforms } from "@/features/game/utils/platform.helper";
import { PLATFORM_ICON_MAP } from "@/features/game/constants/platform.const";
import { formatStorageFromMB } from "@/features/game/utils/storage.helper";
import { EvmPurchaseService } from "@/blockchain/evm/services/service.purchase";
import { toastService } from "@/shared/infra/toast/toast.service";
import { useModal } from "@/shared/infra/modal/modal.store";
import ModalShell from "@/shared/infra/modal/ModalShell";
import clsx from "clsx";
import { Share } from "@/shared/components/ui/organisms/Share";
import { SelectPaymentToken } from "@/features/game/components/SelectPaymentToken";

/* ======================================================
   PAGE — Game Detail
====================================================== */

export default function GameDetailPage(): React.ReactElement {
  /* =========================
     DATA SOURCES
  ========================= */
  const params = useParams();
  const raw = (params as any)?.gameId;
  const gameId = Array.isArray(raw) ? raw[0] : raw;

  const { game, isLoading, hasFetched, error } = useGameDetail({ gameId });
  const {
    games: relatedGames,
    isLoading: relatedIsLoading,
    error: relatedError,
  } = useRelatedGame({ gameId, limit: 15 });

  /* =========================
     GUARDS
  ========================= */

  if (!gameId) {
    return (
      <main className="flex justify-center py-24">
        <div className="max-w-180 text-center">
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
        <div className="max-w-180 text-center">
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
        <div className="max-w-180 text-center">
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
  const nativeDist = game.distributions.find(
    (d): d is { native: NativeBuild } => "native" in d,
  )?.native;

  // Platform list sederhana untuk About
  const availablePlatforms: string[] = [];
  if (webSpec) availablePlatforms.push("Web");
  if (distributions.some((d) => "native" in d)) {
    // Kamu bisa ganti jadi OS detail, ini minimal saja
    availablePlatforms.push("Native");
  }

  /* =========================
     UI
  ========================= */
  return (
    <main className="flex justify-center duration-300">
      <div className=" w-full flex flex-col gap-8 duration-300 ">
        <div className="flex flex-col gap-8">
          {/* ======================================================
          HERO — Featured & Banner Games
          ====================================================== */}
          <HeroSection
            bannerImage={getAssetUrl(game.banner_image)}
            gameName={game.name}
            categories={game.categories ?? []}
            price={game.price}
            tokenAddress={undefined}
          />

          {/* ======================================================
          SECTION — Game Glance
          ====================================================== */}
          <GameGlance
            coverHorizontalImage={getAssetUrl(game.cover_horizontal_image)}
            gameDescription={game.description}
            gameName={game.name}
            previews={game.previews}
            tags={game.tags}
          />
        </div>

        {/* ======================================================
          SECTION — SYSTEM REQUIREMENT
          ====================================================== */}
        <ContainerPadding className="flex gap-12 max-lg:flex-col">
          {/* left  */}
          <div className="max-lg:order-2 w-full">
            <SystemRequirement sysReq={nativeDist} />
          </div>

          {/* right  */}
          <DetailContent
            chainSupport={game.chains}
            game_onchain_publishes={game.game_onchain_publishes}
            platformSupport={getSupportedPlatforms(game.distributions)}
            releaseDateMs={game.release_date}
            requiredAge={game.required_age}
            price={game.price}
          />
        </ContainerPadding>

        {/* ======================================================
          SECTION — GAME RELATED
          ====================================================== */}
        {!relatedIsLoading && !relatedError && relatedGames && (
          <GameRelated games={relatedGames} />
        )}
        <div className="mb-4"></div>
      </div>
    </main>
  );

  /* =========================
     UI FUNCTIONS
  ========================= */
  function SystemRequirement({ sysReq }: { sysReq: NativeBuild | undefined }) {
    const list = [
      {
        title: "OS",
        description: sysReq ? sysReq.os : "Peridot",
      },
      {
        title: "CPU",
        description: sysReq ? sysReq.processor : "Peridot",
      },
      {
        title: "Memory",
        description: sysReq && formatStorageFromMB(sysReq.memory),
      },
      {
        title: "GPU",
        description: sysReq ? sysReq.graphics : "Peridot",
      },
      {
        title: "Storage",
        description: sysReq && formatStorageFromMB(sysReq.storage),
      },
    ];
    return (
      <section className="flex flex-col gap-4 w-full">
        <TypographyH2 text="System Requirements" />
        <div className={"bg-card p-10 " + STYLE_ROUNDED_CARD}>
          <dl className="grid grid-cols-2 gap-6">
            {list.map((item, index) => (
              <div className="flex flex-col gap-1" key={index}>
                <dt className="text-white/50">{item.title}</dt>
                <dd className="text-xl">{item.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    );
  }

  function HeroSection({
    bannerImage,
    gameName,
    categories,
  }: {
    bannerImage: string;
    gameName: string;
    categories: string[];
    price: number;
    tokenAddress: string | undefined;
  }) {
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
                index == 0 ? item : " - " + item,
              )}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              {gameName ?? "PeridotVault Game"}
            </h1>
          </div>
        </ContainerPadding>
      </div>
    );
  }

  function GameGlance({
    previews,
    coverHorizontalImage,
    gameName,
    gameDescription,
    tags,
  }: {
    previews: GamePreview[];
    coverHorizontalImage: string;
    gameName: string;
    gameDescription: string;
    tags: string[];
  }) {
    return (
      <ContainerPadding className="flex gap-12 max-lg:flex-col">
        {/* Previews */}
        <div className="overflow-hidden flex w-full">
          <GameDetailPreview
            items={
              previews.length
                ? previews
                : [
                    {
                      kind: "image" as const,
                      src: coverHorizontalImage,
                    },
                  ]
            }
          />
        </div>

        {/* Game Details */}
        <dl
          className={
            "flex flex-col justify-between gap-6 relative pb-6 w-full shrink-0 " +
            SMALL_GRID
          }
        >
          <div
            className={
              "absolute w-full h-full top-0 left-0 bg-linear-to-l from-card to-70% -z-1 " +
              STYLE_ROUNDED_CARD
            }
          />
          <div className="flex flex-col gap-6">
            <>
              {coverHorizontalImage ? (
                <img
                  src={coverHorizontalImage}
                  alt={"Cover game " + gameName}
                  className={
                    "w-full aspect-video object-cover " + STYLE_ROUNDED_CARD
                  }
                />
              ) : (
                <div
                  className={
                    "w-full aspect-video bg-muted animate-pulse" +
                    STYLE_ROUNDED_CARD
                  }
                />
              )}
            </>
            <div className="pr-6">
              <>
                <dt className="sr-only">Game Description</dt>
                <dd>{gameDescription}</dd>
              </>
            </div>
          </div>
          <div className="pr-6">
            <div className="flex flex-col gap-3">
              <dt className="text-muted-foreground">Tags</dt>
              <dd className="flex flex-wrap gap-3">
                {tags.map((item, index) => (
                  <span
                    key={index}
                    className="bg-foreground/15 py-1 px-2 rounded-lg capitalize"
                  >
                    {item}
                  </span>
                ))}
              </dd>
            </div>
          </div>
        </dl>
      </ContainerPadding>
    );
  }

  function DetailContent({
    chainSupport,
    platformSupport,
    releaseDateMs,
    requiredAge,
    game_onchain_publishes,
    price,
  }: {
    chainSupport: ChainType[] | undefined;
    game_onchain_publishes: Array<GameOnChainPublish> | undefined;
    platformSupport: Set<string>;
    releaseDateMs: number;
    requiredAge: number;
    price: number;
  }) {
    const releaseDate = new Date(releaseDateMs).toLocaleDateString();

    const [purchaseState] = useState<{
      status: "success" | "error";
      message: string;
    } | null>(null);

    function getAgeRating(requiredAge: number) {
      const sorted = [...igrs].sort((a, b) => a.age - b.age);

      return (
        sorted
          .slice()
          .reverse()
          .find((rating) => requiredAge >= rating.age) ?? sorted[0]
      );
    }

    const ageRating = getAgeRating(requiredAge);

    const openBuyNowModal = () =>
      useModal.getState().open((id) => (
        <ModalShell id={id}>
          <SelectPaymentToken
            chainSupports={game?.chains}
            game_onchain_publishes={game?.game_onchain_publishes}
            price={game?.price}
          />
        </ModalShell>
      ));

    const openShareModal = () =>
      useModal.getState().open((id) => (
        <ModalShell id={id}>
          <Share />
        </ModalShell>
      ));

    return (
      <dl className={"flex flex-col gap-4 w-full " + SMALL_GRID}>
        <div className={"flex flex-col gap-3 bg-card p-6" + STYLE_ROUNDED_CARD}>
          <PriceCoin amount={price} tokenCanister={""} textSize="xl" />
          {purchaseState ? (
            <span
              className={`text-sm font-medium ${
                purchaseState.status === "success"
                  ? "text-success"
                  : "text-destructive"
              }`}
            >
              {purchaseState.message}
            </span>
          ) : null}
          <div className="flex gap-4">
            <ButtonWithSound
              // onClick={handleBuyClick}
              onClick={openBuyNowModal}
              className={
                "w-full cursor-pointer " +
                BUTTON_HIGHLIGHT_COLOR +
                STYLE_ROUNDED_BUTTON
              }
            >
              Buy Now
            </ButtonWithSound>
            <ButtonWithSound
              disabled={true}
              className={
                "aspect-square shrink-0 opacity-20 cursor-not-allowed " +
                BUTTON_COLOR +
                STYLE_ROUNDED_BUTTON
              }
            >
              <FontAwesomeIcon icon={faBookmark} />
            </ButtonWithSound>
          </div>
          <ButtonWithSound
            disabled={true}
            className={
              "opacity-20 cursor-not-allowed " +
              BUTTON_COLOR +
              STYLE_ROUNDED_BUTTON
            }
          >
            <FontAwesomeIcon icon={faShirt} />
            <span>Market</span>
          </ButtonWithSound>
        </div>

        <div
          aria-label="Rating Age from Global Rating"
          className={"bg-card p-5 flex gap-4 " + STYLE_ROUNDED_CARD}
        >
          <div className="w-18 shrink-0 ">
            <img
              src={ageRating.imgUrl}
              alt={ageRating.title + " Image"}
              className="w-full object-contain"
            />
          </div>
          <div className="flex flex-col gap-2">
            <dt className="sr-only">Age</dt>
            <dd className="text-lg font-bold" aria-label={ageRating.title}>
              {ageRating.age + "+"}
            </dd>
            <hr className="border-white/20 mb-1" />
            <p className="text-sm text-foreground/50">
              {ageRating.description}
            </p>
          </div>
        </div>

        <table className="mb-4">
          <tbody>
            <tr className="border-b border-white/15 flex justify-between items-center w-full py-3">
              <td className="text-muted-foreground">Blockchains</td>
              <td className="flex gap-1 text-lg">
                <BlockchainStack chain={chainSupport} />
              </td>
            </tr>
            <tr className="border-b border-white/15 flex justify-between items-center w-full py-3">
              <td className="text-muted-foreground">Platform</td>
              <td className="flex gap-1 text-lg">
                {[...platformSupport].map((p, index) => (
                  <FontAwesomeIcon
                    key={"Platform " + index}
                    icon={PLATFORM_ICON_MAP[p]}
                  />
                ))}
              </td>
            </tr>
            <tr className="border-b border-white/15 flex justify-between w-full py-3">
              <td className="text-muted-foreground">
                <dt>Developer</dt>
              </td>
              <td>Antigane Studio</td>
            </tr>
            <tr className="border-b border-white/15 flex justify-between w-full py-3">
              <td className="text-muted-foreground">Publisher</td>
              <td>Antigane Inc</td>
            </tr>
            <tr className="border-b border-white/15 flex justify-between w-full py-3">
              <td className="text-muted-foreground">Release Date</td>
              <td>{releaseDate}</td>
            </tr>
            <tr className="border-b border-white/15 flex justify-between w-full py-3">
              <td className="text-muted-foreground">Website</td>
              <td>
                <a href="https://peridotvault.com" className="text-highlight">
                  https://peridotvault.com
                </a>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="grid grid-cols-2 gap-4">
          <ButtonWithSound
            onClick={openShareModal}
            className={clsx(
              "cursor-pointer",
              BUTTON_COLOR,
              STYLE_ROUNDED_BUTTON,
            )}
          >
            <FontAwesomeIcon icon={faShare} />
            <span>Share</span>
          </ButtonWithSound>
          <ButtonWithSound
            disabled={true}
            className={
              "opacity-20 cursor-not-allowed " +
              BUTTON_COLOR +
              STYLE_ROUNDED_BUTTON
            }
          >
            <FontAwesomeIcon icon={faFlag} />
            <span>Report</span>
          </ButtonWithSound>
        </div>
      </dl>
    );
  }
}
