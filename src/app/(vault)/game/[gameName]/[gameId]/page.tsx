/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import GameDetailPreview from "@/features/game/components/GameDetailPreview";
import { GameRelated } from "@/features/game/components/ui/GameRelated";
import { useGameDetail, useRelatedGame } from "@/features/game/hooks/game.hook";
import {
  GameDistribution,
  GameOnChainPublish,
  GamePreview,
  NativeBuild,
  WebBuild,
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
import { OptimizedImage } from "@/shared/components/ui/atoms/OptimizedImage";
import {
  faShirt,
  faShare,
  faFlag,
  faLock,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { BlockchainStack } from "@/core/blockchain/__core__/components/BlockchainStack";
import igrs from "@/shared/assets/rating/igrs.json";
import { ButtonWithSound } from "@/shared/components/ui/atoms/ButtonWithSound";
import { getSupportedPlatforms } from "@/features/game/utils/platform.helper";
import { PLATFORM_ICON_MAP } from "@/features/game/constants/platform.const";
import { formatStorageFromMB } from "@/features/game/utils/storage.helper";
import { useModal } from "@/core/ui-system/modal/modal.store";
import ModalShell from "@/core/ui-system/modal/ModalShell";
import clsx from "clsx";
import { Share } from "@/shared/components/ui/organisms/Share";
import { SelectPaymentToken } from "@/features/game/components/SelectPaymentToken";
import { resolveGamePaymentToken } from "@/shared/utils/token";
import { ChainApi } from "@/core/api/chain.api.type";
import { hasPurchasedGameApi } from "@/core/api/purchase.api";
import { useTokenMetadata } from "@/shared/hooks/useTokenMetadata";
import { useGamePaymentOptions } from "@/shared/hooks/useGamePaymentOptions";
import { useAuthStore } from "@/features/auth/_store/auth.store";
import { useWishlistWithCount } from "@/features/wishlist/hooks/useWishlist";
import { compactCount } from "@/shared/utils/number";

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
  const { metadataMap } = useTokenMetadata(
    game?.game_onchain_publishes ? [game.game_onchain_publishes] : [],
  );
  const { tokenMetadataMap } = useGamePaymentOptions(gameId);

  const mergedTokenLookup = new Map<
    string,
    { symbol: string; decimals: number }
  >();
  if (metadataMap) {
    for (const [k, v] of metadataMap) mergedTokenLookup.set(k, v);
  }
  for (const [k, v] of tokenMetadataMap) {
    mergedTokenLookup.set(k, { symbol: v.symbol, decimals: v.decimals });
  }

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

  // Distributions — collect all platform builds
  const distributions: GameDistribution[] = game.distributions ?? [];

  interface PlatformBuild {
    key: string;
    label: string;
    build: NativeBuild | WebBuild;
    os?: string;
  }

  const platformBuilds: PlatformBuild[] = [];
  for (const dist of distributions) {
    if ("web" in dist) {
      platformBuilds.push({ key: "web", label: "Web", build: dist.web });
    }
    if ("native" in dist) {
      const native = dist.native;
      const os = native.os.toLowerCase();
      if (os.includes("win")) {
        platformBuilds.push({ key: "windows", label: "Windows", build: native, os: native.os });
      } else if (os.includes("mac") || os.includes("osx")) {
        platformBuilds.push({ key: "macos", label: "macOS", build: native, os: native.os });
      } else if (os.includes("linux")) {
        platformBuilds.push({ key: "linux", label: "Linux", build: native, os: native.os });
      } else {
        platformBuilds.push({ key: "other", label: native.os, build: native, os: native.os });
      }
    }
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
            bannerImage={game.banner_image}
            gameName={game.name}
            categories={game.categories ?? []}
            price={game.price}
            tokenAddress={undefined}
          />

          {/* ======================================================
          SECTION — Game Glance
          ====================================================== */}
          <GameGlance
            coverHorizontalImage={game.cover_horizontal_image}
            gameDescription={game.description}
            gameName={game.name}
            previews={game.previews ?? []}
            tags={game.tags ?? []}
          />
        </div>

        {/* ======================================================
          SECTION — SYSTEM REQUIREMENT
          ====================================================== */}
        <ContainerPadding className="flex gap-12 max-lg:flex-col">
          {/* left  */}
          <div className="max-lg:order-2 w-full">
            <SystemRequirement platformBuilds={platformBuilds} />
          </div>

          {/* right  */}
          <DetailContent
            chainSupport={game.chains}
            game_onchain_publishes={game.game_onchain_publishes}
            platformSupport={getSupportedPlatforms(game.distributions)}
            releaseDateMs={game.release_date}
            requiredAge={game.required_age}
            price={game.price}
            website_url={game.website_url}
            gameId={gameId}
            gameOnChainPublishes={game.game_onchain_publishes}
            tokenLookup={mergedTokenLookup}
          />
        </ContainerPadding>

        {/* ======================================================
          SECTION — GAME RELATED
          ====================================================== */}
        {!relatedIsLoading && !relatedError && relatedGames && (
          <GameRelated games={relatedGames} tokenLookup={mergedTokenLookup} />
        )}
        <div className="mb-4"></div>
      </div>
    </main>
  );

  /* =========================
     UI FUNCTIONS
  ========================= */
  function SystemRequirement({
    platformBuilds,
  }: {
    platformBuilds: PlatformBuild[];
  }) {
    const [activeTab, setActiveTab] = useState(0);

    if (platformBuilds.length === 0) return null;

    const current = platformBuilds[activeTab] ?? platformBuilds[0];
    const build = current.build;

    const isWeb = "url" in build;
    const specs = isWeb
      ? [
          { title: "Platform", description: "Web Browser" },
          { title: "CPU", description: build.processor || "-" },
          { title: "Memory", description: formatStorageFromMB(build.memory) },
          { title: "GPU", description: build.graphics || "-" },
          { title: "Storage", description: formatStorageFromMB(build.storage) },
        ]
      : [
          { title: "OS", description: (build as NativeBuild).os || "-" },
          { title: "CPU", description: (build as NativeBuild).processor || "-" },
          { title: "Memory", description: formatStorageFromMB(build.memory) },
          { title: "GPU", description: (build as NativeBuild).graphics || "-" },
          { title: "Storage", description: formatStorageFromMB(build.storage) },
        ];

    return (
      <section className="flex flex-col gap-4 w-full">
        <TypographyH2 text="System Requirements" />

        {/* Platform Tabs */}
        {platformBuilds.length > 1 && (
          <div className="flex gap-1">
            {platformBuilds.map((pb, idx) => (
              <button
                key={pb.key}
                onClick={() => setActiveTab(idx)}
                className={clsx(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150",
                  idx === activeTab
                    ? "bg-foreground/15 text-foreground"
                    : "text-foreground/50 hover:text-foreground/80 hover:bg-foreground/5"
                )}
              >
                <FontAwesomeIcon
                  icon={PLATFORM_ICON_MAP[pb.key] ?? faFlag}
                  className="w-4 h-4"
                />
                {pb.label}
              </button>
            ))}
          </div>
        )}

        {/* Specs Grid */}
        <div className={"bg-card p-10 " + STYLE_ROUNDED_CARD}>
          <dl className="grid grid-cols-2 gap-6">
            {specs.map((item, index) => (
              <div className="flex flex-col gap-1" key={index}>
                <dt className="text-white/50">{item.title}</dt>
                <dd className="text-xl">{item.description}</dd>
              </div>
            ))}
          </dl>
          {build.additionalNotes && (
            <p className="mt-6 text-sm text-foreground/50 border-t border-white/10 pt-4">
              {build.additionalNotes}
            </p>
          )}
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
        <OptimizedImage
          src={bannerImage}
          alt={gameName}
          fill
          sizes="100vw"
          priority
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
    previews?: GamePreview[];
    coverHorizontalImage: string;
    gameName: string;
    gameDescription: string;
    tags?: string[];
  }) {
    const safePreviews = previews ?? [];
    const safeTags = tags ?? [];

    return (
      <ContainerPadding className="flex gap-12 max-lg:flex-col">
        {/* Previews */}
        <div className="overflow-hidden flex w-full">
          <GameDetailPreview
            items={
              safePreviews.length
                ? safePreviews
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
                  <div className={"w-full aspect-video relative rounded-2xl overflow-hidden"}>
                    <OptimizedImage
                      src={coverHorizontalImage}
                      alt={"Cover game " + gameName}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className={
                      "w-full aspect-video bg-muted animate-pulse rounded-2xl"
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
                {safeTags.map((item, index) => (
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
    price,
    website_url,
    gameId,
    gameOnChainPublishes,
    tokenLookup,
  }: {
    chainSupport: ChainApi[] | undefined;
    game_onchain_publishes: Array<GameOnChainPublish> | undefined;
    platformSupport: Set<string>;
    releaseDateMs: number;
    requiredAge: number;
    price: number;
    website_url?: string;
    gameId: string;
    gameOnChainPublishes?: GameOnChainPublish[];
    tokenLookup: Map<string, { symbol: string; decimals: number }>;
  }) {
    const releaseDate = new Date(releaseDateMs).toLocaleDateString();

    const [isOwned, setIsOwned] = useState(false);
    const [checkingOwnership, setCheckingOwnership] = useState(true);

    const { isWishlisted, isToggling, toggle: toggleWishlist, count: wishlistCount } = useWishlistWithCount(gameId);

    useEffect(() => {
      if (gameId) {
        hasPurchasedGameApi(gameId).then((owned) => {
          setIsOwned(owned);
          setCheckingOwnership(false);
        }).catch(() => {
          setCheckingOwnership(false);
        });
      }
    }, [gameId]);

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

    const openBuyNowModal = () => {
      const isAuth = useAuthStore.getState().status === "authenticated";

      if (!isAuth) {
        useModal.getState().open((id) => (
          <ModalShell id={id}>
            <div className="w-110 flex flex-col items-center gap-6 p-8 text-center">
              <FontAwesomeIcon
                icon={faLock}
                className="text-4xl text-muted-foreground"
              />
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold">Login Required</h2>
                <p className="text-muted-foreground">
                  Please connect your wallet to purchase this game. Use the
                  Connect button in the top right corner.
                </p>
              </div>
            </div>
          </ModalShell>
        ));
        return;
      }

      useModal.getState().open((id) => (
        <ModalShell id={id}>
          <SelectPaymentToken
            modalId={id}
            chainSupports={game?.chains}
            game_onchain_publishes={game?.game_onchain_publishes}
            price={game?.price}
            tokenMetadataMap={
              (() => {
                const map = new Map<
                  string,
                  {
                    symbol: string;
                    name: string;
                    logo: string | null;
                    paymentOptionId?: number;
                  }
                >();
                for (const [k, v] of metadataMap) {
                  map.set(k, { symbol: v.symbol, name: v.symbol, logo: null });
                }
                for (const [k, v] of tokenMetadataMap) {
                  map.set(k, {
                    symbol: v.symbol,
                    name: v.name,
                    logo: v.iconUrl,
                    paymentOptionId: v.paymentOptionId,
                  });
                }
                return map;
              })()
            }
          />
        </ModalShell>
      ));
    };

    const openShareModal = () =>
      useModal.getState().open((id) => (
        <ModalShell id={id}>
          <Share />
        </ModalShell>
      ));

    return (
      <dl className={"flex flex-col gap-4 w-full " + SMALL_GRID}>
        <div className={"flex flex-col gap-3 bg-card p-6" + STYLE_ROUNDED_CARD}>
          {(() => {
            const publish = gameOnChainPublishes?.[0];
            const apiMeta =
              publish?.payment_token
                ? tokenMetadataMap.get(
                    publish.payment_token.toLowerCase(),
                  )
                : undefined;
            const token = resolveGamePaymentToken(
              gameOnChainPublishes,
              chainSupport?.[0]?.caip_2_id,
              tokenLookup,
            );
            return (
              <PriceCoin
                amount={price}
                tokenCanister={""}
                tokenSymbol={token.symbol}
                tokenDecimals={token.decimals}
                tokenLogo={apiMeta?.iconUrl ?? token.logo}
                textSize="xl"
              />
            );
          })()}
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
            {isOwned ? (
              <ButtonWithSound
                disabled
                className={
                  "w-full cursor-not-allowed opacity-50 " +
                  BUTTON_HIGHLIGHT_COLOR +
                  STYLE_ROUNDED_BUTTON
                }
              >
                Game Owned
              </ButtonWithSound>
            ) : (
              <ButtonWithSound
                onClick={openBuyNowModal}
                disabled={checkingOwnership}
                className={
                  "w-full cursor-pointer " +
                  BUTTON_HIGHLIGHT_COLOR +
                  STYLE_ROUNDED_BUTTON
                }
              >
                Buy Now
              </ButtonWithSound>
            )}
            <ButtonWithSound
              onClick={toggleWishlist}
              disabled={isToggling}
              className={
                "aspect-4/3 shrink-0 flex items-center justify-center gap-1.5 px-3 " +
                (isWishlisted
                  ? "bg-accent/20 text-accent hover:bg-accent/30"
                  : "opacity-60 hover:opacity-100") +
                " cursor-pointer " +
                BUTTON_COLOR +
                STYLE_ROUNDED_BUTTON
              }
            >
              <FontAwesomeIcon
                icon={faStar}
                className={isToggling ? "animate-spin text-sm" : "text-lg"}
              />
              {wishlistCount > 0 && !isWishlisted && (
                <span className="text-sm font-medium text-muted-foreground">
                  {compactCount(wishlistCount)}
                </span>
              )}
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
          <div className="w-18 shrink-0 relative aspect-square">
            <OptimizedImage
              src={ageRating.imgUrl}
              alt={ageRating.title + " Image"}
              fill
              sizes="72px"
              className="object-contain"
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
            {website_url && (
              <tr className="border-b border-white/15 flex justify-between w-full py-3">
                <td className="text-muted-foreground">Website</td>
                <td>
                  <a
                    href={website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-highlight"
                  >
                    {website_url}
                  </a>
                </td>
              </tr>
            )}
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
