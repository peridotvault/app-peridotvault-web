"use client";

import { useState, useEffect } from "react";
import { getGamePaymentOptionsApi } from "@/core/api/token-asset.api";
import { normalizeAssetUrl } from "@/shared/utils/helper.url";

export type TokenMeta = {
  symbol: string;
  decimals: number;
  name: string;
  iconUrl: string | null;
};

export function useGamePaymentOptionsBatch(gameIds: string[]) {
  const [metaByGame, setMetaByGame] = useState<
    Map<string, Map<string, TokenMeta>>
  >(new Map());

  const key = gameIds.length > 0 ? gameIds.join(",") : "";

  useEffect(() => {
    if (!key) return;

    let cancelled = false;

    (async () => {
      const map = new Map<string, Map<string, TokenMeta>>();

      const results = await Promise.allSettled(
        gameIds.map(async (id) => {
          const options = await getGamePaymentOptionsApi(id, "published");
          return { gameId: id, options };
        }),
      );

      if (cancelled) return;

      for (const result of results) {
        if (result.status !== "fulfilled") continue;
        const { gameId, options } = result.value;
        if (!options.length) continue;

        const tokenMap = new Map<string, TokenMeta>();
        for (const opt of options) {
          const td = opt.token_deployment;
          if (td?.address && td?.token_asset) {
            tokenMap.set(td.address.toLowerCase(), {
              symbol: td.token_asset.symbol,
              decimals: td.token_asset.decimals,
              name: td.token_asset.name,
              iconUrl: normalizeAssetUrl(td.token_asset.icon_url),
            });
          }
        }
        map.set(gameId, tokenMap);
      }

      if (!cancelled) setMetaByGame(map);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { metaByGame };
}
