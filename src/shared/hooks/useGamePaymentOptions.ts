"use client";

import { useState, useEffect, useMemo } from "react";
import {
  getGamePaymentOptionsApi,
  GamePaymentOption,
} from "@/core/api/token-asset.api";

export function useGamePaymentOptions(gameId: string | undefined) {
  const [options, setOptions] = useState<GamePaymentOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!gameId) return;

    let cancelled = false;

    (async () => {
      try {
        setIsLoading(true);
        const data = await getGamePaymentOptionsApi(gameId, "published");
        if (!cancelled) setOptions(data);
      } catch {
        // silently ignore
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [gameId]);

  const tokenMetadataMap = useMemo(() => {
    const map = new Map<
      string,
      {
        symbol: string;
        decimals: number;
        name: string;
        iconUrl: string | null;
        paymentOptionId: number;
      }
    >();
    for (const opt of options) {
      const td = opt.token_deployment;
      if (td?.address && td?.token_asset) {
        map.set(td.address.toLowerCase(), {
          symbol: td.token_asset.symbol,
          decimals: td.token_asset.decimals,
          name: td.token_asset.name,
          iconUrl: td.token_asset.icon_url,
          paymentOptionId: opt.id,
        });
      }
    }
    return map;
  }, [options]);

  return { options, isLoading, tokenMetadataMap };
}
