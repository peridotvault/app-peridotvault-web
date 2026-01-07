/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";

import { useGameDetail } from "@/features/game/hooks/useGameDetail";
import { PriceCoin } from "@/shared/components/CoinWithAmmount";
import { TypographyH2 } from "@/shared/components/ui/TypographyH2";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { GameDistribution } from "@/features/game/interfaces/distribution";
import CarouselPreview from "./_components/CarouselPreview";

// Row sederhana untuk tabel About
function KRow({ label, value }: { label: string; value?: React.ReactNode }) {
  if (!value) return null;
  return (
    <tr>
      <th className="py-2 pr-4 align-top font-semibold text-muted-foreground w-40">
        {label}
      </th>
      <td className="py-2">{value}</td>
    </tr>
  );
}

export default function GameDetailPage(): React.ReactElement {
  const params = useParams();
  const raw = (params as any)?.gameId;
  const gameId = Array.isArray(raw) ? raw[0] : raw;

  const { game, isLoading, hasFetched, error } = useGameDetail({ gameId });

  const [buying, setBuying] = useState(false);
  const [purchaseState] = useState<{
    status: "success" | "error";
    message: string;
  } | null>(null);

  const handleBuyClick = async () => {
    setBuying(true);
    setTimeout(() => {
      setBuying(false);
    }, 800);
  };

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

  // ========= Derived values dari `game` =========

  const bannerImage =
    game.banner_image ||
    game.cover_horizontal_image ||
    game.cover_vertical_image;

  const coverImage =
    game.cover_vertical_image ||
    game.cover_horizontal_image ||
    game.banner_image;

  const categories = game.categories ?? [];
  const categoryNames = categories
    .map((c) => (c as any).name ?? "")
    .filter(Boolean);

  const rawPrice = game.price ?? 0;
  const priceIsFree = rawPrice === 0;
  const tokenCanister: string | undefined = undefined;

  const previews = game.previews ?? [];
  const releaseDateValue = game.release_date
    ? new Date(game.release_date).toLocaleDateString()
    : undefined;

  const website: string | undefined = undefined; // belum ada di tipe Game
  const tags = game.tags ?? [];

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
      <div className="max-w-400 w-full flex flex-col gap-10 duration-300 px-6 sm:px-8 md:px-12">
        {/* Hero */}
        <section className="relative w-full min-h-120 overflow-hidden shadow-flat-lg">
          {bannerImage ? (
            <img
              src={bannerImage}
              alt={game.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-muted" />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
          <div className="relative z-5 flex flex-col md:flex-row gap-6 justify-between items-end px-8 md:px-12 py-10 h-full">
            <div className="flex flex-col gap-4 md:w-3/5">
              <div className="flex flex-wrap gap-2 text-sm">
                {categoryNames.map((item) => (
                  <span
                    key={item}
                    className="bg-white/10 px-4 py-1 rounded-full border border-white/10 uppercase tracking-wide text-foreground backdrop-blur-sm font-semibold"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                {game.name ?? "PeridotVault Game"}
              </h1>
            </div>
            <div className="flex flex-col md:flex-row gap-4 items-center md:w-2/5 justify-end">
              <PriceCoin
                amount={rawPrice}
                tokenCanister={tokenCanister}
                textSize="lg"
              />
              <button
                type="button"
                className={`px-10 font-semibold py-2 rounded-md bg-accent transition ${
                  buying
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:shadow-flat-lg"
                }`}
                onClick={handleBuyClick}
                disabled={buying}
              >
                {buying ? "Processing…" : priceIsFree ? "Purchase" : "Buy Now"}
              </button>
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
            </div>
          </div>
        </section>

        {/* Body */}
        <div className="grid gap-12 lg:grid-cols-[3fr_1.25fr]">
          <div className="flex flex-col gap-12">
            {/* Previews */}
            <section className="overflow-hidden">
              <CarouselPreview
                items={
                  previews.length
                    ? previews
                    : [
                        {
                          kind: "image" as const,
                          src: coverImage,
                        },
                      ]
                }
              />
            </section>

            {/* About */}
            <section className="space-y-6">
              <div className="space-y-3">
                <TypographyH2 text="About" />
                <p>
                  {game.description ||
                    "No description available for this game."}
                </p>
              </div>
              <table className="w-full text-sm md:text-base">
                <tbody>
                  <KRow label="Released" value={releaseDateValue} />
                  <KRow
                    label="Website"
                    value={
                      website ? (
                        <a
                          href={website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline inline-flex items-center gap-2"
                        >
                          <FontAwesomeIcon icon={faGlobe} />
                          {website}
                        </a>
                      ) : undefined
                    }
                  />
                  <KRow
                    label="Supported Platforms"
                    value={
                      availablePlatforms.length
                        ? availablePlatforms.join(", ")
                        : undefined
                    }
                  />
                  <KRow
                    label="Tags"
                    value={
                      tags.length
                        ? tags.map((t) => `#${t}`).join(" ")
                        : undefined
                    }
                  />
                </tbody>
              </table>
            </section>

            {/* Hardware requirements */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <TypographyH2 text="Hardware Requirements" />
              </div>
              <div className="grid gap-4">
                {webSpec ? (
                  <div className="rounded-lg border bg-muted/40 p-4 space-y-2">
                    <h3 className="font-semibold mb-2">Web</h3>
                    <ul className="text-sm space-y-1">
                      <li>
                        <span className="font-semibold">URL:</span>{" "}
                        <a
                          href={webSpec.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline"
                        >
                          {webSpec.url}
                        </a>
                      </li>
                      <li>
                        <span className="font-semibold">Processor:</span>{" "}
                        {webSpec.processor}
                      </li>
                      <li>
                        <span className="font-semibold">Graphics:</span>{" "}
                        {webSpec.graphics}
                      </li>
                      <li>
                        <span className="font-semibold">Memory:</span>{" "}
                        {webSpec.memory} GB
                      </li>
                      <li>
                        <span className="font-semibold">Storage:</span>{" "}
                        {webSpec.storage} GB
                      </li>
                      {webSpec.additionalNotes && (
                        <li>
                          <span className="font-semibold">Notes:</span>{" "}
                          {webSpec.additionalNotes}
                        </li>
                      )}
                    </ul>
                  </div>
                ) : (
                  <p>
                    Hardware information will appear here once configured for
                    this game.
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-8">
            <div className="rounded-lg shadow-arise-sm p-6 space-y-6">
              <div className="flex gap-4">
                {game.cover_horizontal_image ? (
                  <img
                    src={game.cover_horizontal_image}
                    alt={game.name}
                    className="w-full aspect-video object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full aspect-video rounded-md bg-muted" />
                )}
              </div>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faAngleRight} />
                  <span>
                    Required age:{" "}
                    {game.required_age != null ? game.required_age : "All ages"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faAngleRight} />
                  <span>Total purchased: N/A</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
        <div className="mb-4"></div>
      </div>
    </main>
  );
}
