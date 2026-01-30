/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import GameDetailPreview from "@/features/game/components/GameDetailPreview";
import { GameRelated } from "@/features/game/components/ui/GameRelated";
import { useGameDetail, useRelatedGame } from "@/features/game/hooks/game.hook";
import { GameDistribution, GamePreview } from "@/features/game/types/game.type";
import { PriceCoin } from "@/shared/components/CoinWithAmmount";
import { ContainerPadding } from "@/shared/components/ui/ContainerPadding";
import { TypographyH2 } from "@/shared/components/ui/TypographyH2";
import {
  STYLE_ROUNDED_CARD,
  SMALL_GRID,
  BUTTON_HIGHLIGHT_COLOR,
  STYLE_ROUNDED_BUTTON,
  BUTTON_COLOR,
} from "@/shared/constants/style";
import { CHAIN_CONFIGS } from "@/shared/constants/chain";
import { getAssetUrl } from "@/shared/utils/helper.url";
import {
  faBookmark,
  faShirt,
  faShare,
  faFlag,
} from "@fortawesome/free-solid-svg-icons";
import {
  faApple,
  faLinux,
  faWindows,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "next/navigation";
import { useState } from "react";
import { BlockchainStack } from "@/blockchain/__core__/components/BlockchainStack";
import { ChainConfig } from "@/shared/types/chain";

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
          <div className="max-lg:order-2">
            <SystemRequirement />
          </div>

          {/* right  */}
          <DetailContent />
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
  function SystemRequirement() {
    const list = [
      {
        title: "OS",
        description: "Windows 10",
      },
      {
        title: "CPU",
        description: "Intel Core i5-4430 / AMD FX-6300",
      },
      {
        title: "Memory",
        description: "8 GB RAM",
      },
      {
        title: "GPU",
        description: "NVIDIA GeForce GTX 960 2GB / AMD Radeon R7 370 2GB",
      },
      {
        title: "Storage",
        description: "60 GB",
      },
    ];
    return (
      <section className="flex flex-col gap-4">
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

  function DetailContent() {
    const [buying, setBuying] = useState(false);
    const chainSupport: ChainConfig[] = [
      CHAIN_CONFIGS["base-testnet"],
      CHAIN_CONFIGS["lisk-testnet"],
      CHAIN_CONFIGS["solana-testnet"],
    ];

    const handleBuyClick = async () => {
      setBuying(true);
      setTimeout(() => {
        setBuying(false);
      }, 800);
    };

    const [purchaseState] = useState<{
      status: "success" | "error";
      message: string;
    } | null>(null);

    return (
      <dl className={"flex flex-col gap-4 w-full " + SMALL_GRID}>
        <div className={"flex flex-col gap-3 bg-card p-6" + STYLE_ROUNDED_CARD}>
          <PriceCoin amount={10000000000} tokenCanister={""} textSize="xl" />
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
            <button
              onClick={handleBuyClick}
              disabled={buying}
              className={
                "w-full cursor-pointer " +
                BUTTON_HIGHLIGHT_COLOR +
                STYLE_ROUNDED_BUTTON
              }
            >
              Buy Now
            </button>
            <button
              className={
                "aspect-square shrink-0 cursor-pointer " +
                BUTTON_COLOR +
                STYLE_ROUNDED_BUTTON
              }
            >
              <FontAwesomeIcon icon={faBookmark} />
            </button>
          </div>
          <button
            className={"cursor-pointer " + BUTTON_COLOR + STYLE_ROUNDED_BUTTON}
          >
            <FontAwesomeIcon icon={faShirt} />
            <span>Market</span>
          </button>
        </div>

        <div
          aria-label="Rating Age from Global Rating"
          className={"bg-card p-5 flex gap-4 " + STYLE_ROUNDED_CARD}
        >
          <div className="w-18 shrink-0">
            <img
              src="https://www.globalratings.com/images/ratings-guide/Generic_3_48.png"
              alt=""
              className="w-full object-contain"
            />
          </div>
          <div className="flex flex-col gap-2">
            <dt className="sr-only">Age</dt>
            <dd className="text-lg font-bold" aria-label="More than 7+">
              7+
            </dd>
            <hr className="border-white/20 mb-1" />
            <p className="text-sm text-foreground/50">
              Violence involving fantasy characters and/or non-graphic violence
              involving
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
                <FontAwesomeIcon icon={faApple} />
                <FontAwesomeIcon icon={faWindows} />
                <FontAwesomeIcon icon={faLinux} />
              </td>
            </tr>
            <tr className="border-b border-white/15 flex justify-between w-full py-3">
              <td className="text-muted-foreground">
                <dt>Developer</dt>
              </td>
              <td>VOID Interactive</td>
            </tr>
            <tr className="border-b border-white/15 flex justify-between w-full py-3">
              <td className="text-muted-foreground">Publisher</td>
              <td>VOID Interactive</td>
            </tr>
            <tr className="border-b border-white/15 flex justify-between w-full py-3">
              <td className="text-muted-foreground">Release Date</td>
              <td>12/13/23</td>
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
          <button
            className={"cursor-pointer " + BUTTON_COLOR + STYLE_ROUNDED_BUTTON}
          >
            <FontAwesomeIcon icon={faShare} />
            <span>Share</span>
          </button>
          <button
            className={"cursor-pointer " + BUTTON_COLOR + STYLE_ROUNDED_BUTTON}
          >
            <FontAwesomeIcon icon={faFlag} />
            <span>Report</span>
          </button>
        </div>
      </dl>
    );
  }
}
