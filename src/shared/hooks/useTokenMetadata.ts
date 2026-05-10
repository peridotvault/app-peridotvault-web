"use client";

import { useState, useEffect, useMemo, useRef } from "react";
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

  const tokenMints = useMemo(() => {
    const mints = new Set<string>();
    for (const publishes of publishesList) {
      const pub = publishes?.[0];
      if (!pub) continue;
      const token = pub.payment_token?.toLowerCase() ?? "";
      if (
        !token ||
        token === "native" ||
        token === EVM_ZERO ||
        token === NATIVE_SOL_MINT
      ) continue;
      // Only Solana tokens (base58, no 0x prefix)
      if (token.startsWith("0x")) continue;
      mints.add(token);
    }

    return [...mints].sort();
  }, [publishesList]);

  const tokenKey = tokenMints.join(",");

  useEffect(() => {
    if (tokenKey === prevKey.current || tokenMints.length === 0) {
      return;
    }
    prevKey.current = tokenKey;

    let cancelled = false;

    async function loadMetadata() {
      setIsLoading(true);

      try {
        const [onChainMeta, apiDeployments] = await Promise.all([
          resolveTokenMetadata(tokenMints),
          getTokenAssetDeployments().catch(() => []),
        ]);
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
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadMetadata();

    return () => { cancelled = true; };
  }, [tokenKey, tokenMints]);

  return { metadataMap, isLoading: tokenMints.length > 0 && isLoading };
}
