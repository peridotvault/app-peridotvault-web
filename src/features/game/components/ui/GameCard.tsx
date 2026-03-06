/* eslint-disable @next/next/no-img-element */
import {
  GameDistributionApi,
  ManifestApi,
  StorageRefApi,
} from "@/core/api/game.api.type";
import { EmbedLink } from "@/features/security/embed/embed.component";
import { IMAGE_LOADING } from "@/shared/constants/image";
import { getAssetUrl } from "@/shared/utils/helper.url";
import {
  faAndroid,
  faApple,
  faLinux,
  faWindows,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { urlGameDetail } from "../../configs/url.config";
import { MyGameItem } from "../../types/my-game.type";

type Props = {
  item?: MyGameItem;
  loading: boolean;
};

function normalizeUrl(value: string | undefined | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  if (trimmed.startsWith("www.")) {
    return `https://${trimmed}`;
  }

  if (/^[a-z0-9.-]+\.[a-z]{2,}(\/|$)/i.test(trimmed)) {
    return `https://${trimmed}`;
  }

  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  return getAssetUrl(trimmed);
}

function parseStorageRef(
  raw: ManifestApi["storageRef"]
): StorageRefApi | null {
  if (!raw) return null;
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw) as StorageRefApi;
      return parsed;
    } catch {
      return null;
    }
  }

  return raw;
}

function resolveManifestUrl(manifest: ManifestApi): string | null {
  const storageRef = parseStorageRef(manifest.storageRef);

  if (storageRef && "s3" in storageRef) {
    return normalizeUrl(storageRef.s3.basePath);
  }

  if (storageRef && "url" in storageRef) {
    return normalizeUrl(storageRef.url.url);
  }

  if (storageRef && "ipfs" in storageRef) {
    const cid = storageRef.ipfs.cid;
    const path = storageRef.ipfs.path?.replace(/^\/+/, "");
    return `https://ipfs.io/ipfs/${cid}${path ? `/${path}` : ""}`;
  }

  const listingUrl = normalizeUrl(manifest.listing);
  if (listingUrl) return listingUrl;

  return null;
}

function resolveNativeDownloadUrl(distributions: GameDistributionApi[]): string | null {
  for (const dist of distributions) {
    if (!("native" in dist)) continue;

    const manifests = dist.native.manifests ?? [];
    if (manifests.length === 0) continue;

    const preferredByVersion = dist.native.liveVersion
      ? manifests.find((m) => m.version === dist.native.liveVersion)
      : undefined;
    const preferredByStatus = manifests.find(
      (m) => (m.status ?? "").toLowerCase() === "live"
    );
    const fallbackLatest = manifests[manifests.length - 1];

    const picked = preferredByVersion ?? preferredByStatus ?? fallbackLatest;
    if (!picked) continue;

    const resolved = resolveManifestUrl(picked);
    if (resolved) return resolved;
  }

  return null;
}

function resolveWebPlayUrl(item: MyGameItem): string | null {
  const webDist = item.distributions.find((dist) => "web" in dist);
  const webUrl = webDist && "web" in webDist ? webDist.web.url : undefined;
  return normalizeUrl(webUrl ?? item.website_url);
}

function getPlatformIcons(distributions: GameDistributionApi[]): IconDefinition[] {
  const iconMap = new Map<string, IconDefinition>();

  for (const dist of distributions) {
    if ("web" in dist) {
      iconMap.set("web", faGlobe);
      continue;
    }

    if ("native" in dist) {
      const os = dist.native.os.toLowerCase();
      if (os.includes("win")) iconMap.set("windows", faWindows);
      if (os.includes("mac") || os.includes("osx") || os.includes("ios")) {
        iconMap.set("apple", faApple);
      }
      if (os.includes("linux")) iconMap.set("linux", faLinux);
      if (os.includes("android")) iconMap.set("android", faAndroid);
    }
  }

  return Array.from(iconMap.values());
}

export const GameCard = ({ item, loading }: Props) => {
  const isSkeleton = loading || !item;

  const gameName = item?.name ?? "Peridot Game";
  const gameDescription =
    item?.description ?? "Your owned game metadata will appear here.";
  const coverSrc =
    item?.cover_horizontal_image || item?.cover_vertical_image
      ? getAssetUrl(item.cover_horizontal_image || item.cover_vertical_image)
      : IMAGE_LOADING;

  const releaseDate =
    item && item.release_date > 0
      ? new Date(
          item.release_date > 1_000_000_000_000
            ? item.release_date
            : item.release_date * 1000
        ).toLocaleDateString()
      : "Unknown";

  const webPlayUrl = item ? resolveWebPlayUrl(item) : null;
  const nativeDownloadUrl = item
    ? resolveNativeDownloadUrl(item.distributions)
    : null;

  const canPlay = Boolean(webPlayUrl) && Boolean(item?.active);
  const canDownload = Boolean(nativeDownloadUrl) && Boolean(item?.active);

  const actions: Array<{ label: "Play" | "Download"; href: string }> = [];
  if (canPlay && webPlayUrl) actions.push({ label: "Play", href: webPlayUrl });
  if (canDownload && nativeDownloadUrl) {
    actions.push({ label: "Download", href: nativeDownloadUrl });
  }

  const platformIcons = item ? getPlatformIcons(item.distributions) : [];

  return (
    <div
      className={`flex justify-between items-center gap-4 bg-card hover:bg-surface h-50 relative overflow-hidden rounded-2xl duration-300 p-5 ${
        isSkeleton ? "animate-pulse" : ""
      }`}
    >
      <div className="flex gap-4 h-full items-center relative min-w-0">
        {isSkeleton ? (
          <div className="aspect-3/4 md:aspect-video h-full rounded-2xl bg-muted" />
        ) : (
          <EmbedLink
            href={urlGameDetail({
              name: item.name,
              game_id: item.game_id,
            })}
            className="aspect-3/4 md:aspect-video h-full rounded-2xl overflow-hidden shrink-0"
          >
            <img
              src={coverSrc}
              alt={`${gameName} Cover`}
              className="w-full h-full object-cover"
            />
          </EmbedLink>
        )}

        <div className="flex flex-col gap-2 h-full justify-between py-2 min-w-0">
          <div className="flex flex-col gap-2 min-w-0">
            <h2 className="text-xl md:text-2xl font-medium line-clamp-2">
              {gameName}
            </h2>

            <span
              aria-label="Game Description"
              className="text-white/50 max-w-150 line-clamp-2"
            >
              {gameDescription}
            </span>
          </div>

          {!isSkeleton && item && (
            <div className="text-white/40 text-sm flex flex-col">
              <span>
                PGC1: {item.pgc1_address.slice(0, 8)}…
                {item.pgc1_address.slice(-4)}
              </span>
              <span>Release: {releaseDate}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col h-full justify-between">
        <div className="flex flex-col items-end gap-2">
          {isSkeleton ? (
            <button
              className="py-3 px-6 rounded-lg bg-muted text-muted-foreground"
              disabled
            >
              Download
            </button>
          ) : actions.length > 0 ? (
            actions.map((action) => (
              <a
                key={`${item?.game_id}-${action.label}`}
                href={action.href}
                target="_blank"
                rel="noreferrer noopener"
                className="py-3 px-6 rounded-lg bg-accent text-center min-w-28"
              >
                {action.label}
              </a>
            ))
          ) : (
            <button
              className="py-3 px-6 rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
              disabled
            >
              Unavailable
            </button>
          )}
        </div>

        {!isSkeleton && platformIcons.length > 0 ? (
          <div className="flex justify-end gap-3 text-2xl">
            {platformIcons.map((icon, index) => (
              <FontAwesomeIcon key={`platform-${index}`} icon={icon} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};
