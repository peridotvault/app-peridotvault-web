"use client";

import { useState, useEffect, useRef } from "react";
import { resolveTokenMetadata, type TokenMetadata } from "@/core/blockchain/svm/services/token-metadata.service";
import { getTokenAssetDeployments } from "@/core/api/token-asset.api";
import { EVM_ZERO } from "@/shared/utils/token";
import type { GameOnChainPublishLike } from "@/shared/utils/token";

const NATIVE_SOL_MINT = "11111111111111111111111111111111";

/**
 * Collects all non-native Solana payment tokens from game publishes,
 * batch-reads their Metaplex metadata from on-chain, and falls back
 * to the API token deployments for EVM tokens or unknown mints.
 */
export function useTokenMetadata(
  publishesList: (GameOnChainPublishLike[] | undefined)[],
): {
  metadataMap: Map<string, TokenMetadata>;
  isLoading: boolean;
} {
  const [metadataMap, setMetadataMap] = useState<Map<string, TokenMetadata>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const prevKey = useRef("");

  useEffect(() => {
    const mints = new Set<string>();
    for (const publishes of publishesList) {
      const pub = publishes?.[0];
      if (!pub) continue;
      const token = pub.payment_token?.toLowerCase() ?? "";
      if (
        !token ||
        token === "native" ||
        token === EVM_ZERO ||
        token === "11111111111111111111111111111111"
      ) continue;
      // Only Solana tokens (base58, no 0x prefix)
      if (token.startsWith("0x")) continue;
      mints.add(token);
    }

    const key = [...mints].sort().join(",");
    if (key === prevKey.current || mints.size === 0) {
      if (mints.size === 0) setIsLoading(false);
      return;
    }
    prevKey.current = key;

    let cancelled = false;
    setIsLoading(true);

    Promise.all([
      resolveTokenMetadata([...mints]),
      getTokenAssetDeployments().catch(() => []),
    ]).then(([onChainMeta, apiDeployments]) => {
      if (cancelled) return;
      const map = new Map<string, TokenMetadata>();

      // On-chain metadata first
      for (const [mint, meta] of onChainMeta) {
        map.set(mint, meta);
      }

      // API deployments as fallback for EVM or unknown mints
      for (const d of apiDeployments) {
        const addr = d.address.toLowerCase();
        if (!map.has(addr)) {
          map.set(addr, {
            symbol: d.token_asset.symbol,
            name: d.token_asset.name,
            decimals: d.token_asset.decimals,
          });
        }
      }

      setMetadataMap(map);
      setIsLoading(false);
    }).catch(() => {
      if (!cancelled) setIsLoading(false);
    });

    return () => { cancelled = true; };
  }, [publishesList]);

  return { metadataMap, isLoading };
}
