"use client";

import type { DistributionMode } from "@/features/game/types/web2.type";

/**
 * Distribution mode badge (spec ANT-511 §3.2 / ANT-513 studio item).
 * Shows which fulfillment rail a game uses. Renders nothing for the
 * default onchain mode unless `showOnchain` is set (keeps UI quiet
 * for the backward-compatible default).
 */
const MODE_STYLE: Record<DistributionMode, string> = {
  onchain: "bg-foreground/10 text-foreground",
  web2: "bg-emerald-500/15 text-emerald-400",
  both: "bg-sky-500/15 text-sky-400",
};

const MODE_LABEL: Record<DistributionMode, string> = {
  onchain: "Onchain",
  web2: "Web2 · Fiat",
  both: "Onchain + Fiat",
};

export function DistributionModeBadge({
  mode,
  showOnchain = false,
  className = "",
}: {
  mode: DistributionMode | undefined;
  showOnchain?: boolean;
  className?: string;
}) {
  const effective: DistributionMode = mode ?? "onchain";
  if (effective === "onchain" && !showOnchain) return null;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${MODE_STYLE[effective]} ${className}`}
      aria-label={`Distribution mode: ${MODE_LABEL[effective]}`}
      title={`Fulfillment rail: ${MODE_LABEL[effective]}`}
    >
      {MODE_LABEL[effective]}
    </span>
  );
}
