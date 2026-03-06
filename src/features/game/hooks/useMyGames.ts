"use client";

import { getGameDetailApi } from "@/core/api/game.api";
import { GameDetailApi } from "@/core/api/game.api.type";
import {
  LibraryErrorCode,
  getMyGamesForSession,
  isLibraryErrorCode,
  LIBRARY_ERROR_CODES,
} from "@/features/library/services/library.service";
import { useChainStore } from "@/shared/states/chain.store";
import { useEffect, useMemo, useState } from "react";
import { MyGameItem } from "../types/my-game.type";

type UseMyGamesResult = {
  games: MyGameItem[];
  loading: boolean;
  errorCode: LibraryErrorCode | null;
  errorMessage: string | null;
  isEmpty: boolean;
  reload: () => void;
};

export function useMyGames(): UseMyGamesResult {
  const chain = useChainStore((state) => state.chainKey);

  const [games, setGames] = useState<MyGameItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorCode, setErrorCode] = useState<LibraryErrorCode | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setErrorCode(null);

        const ownedGames = await getMyGamesForSession();

        if (ownedGames.length === 0) {
          if (!mounted) return;
          setGames([]);
          return;
        }

        const uniqueGameIds = Array.from(
          new Set(ownedGames.map((item) => item.gameId))
        );

        const detailMap = new Map<string, GameDetailApi>();

        const details = await Promise.allSettled(
          uniqueGameIds.map(async (gameId) => {
            const detail = await getGameDetailApi(gameId);
            return { gameId, detail };
          })
        );

        let detailSuccessCount = 0;
        for (const result of details) {
          if (result.status !== "fulfilled") continue;
          detailSuccessCount += 1;
          detailMap.set(result.value.gameId, result.value.detail);
        }

        if (detailSuccessCount === 0) {
          throw new Error(LIBRARY_ERROR_CODES.RpcFailed);
        }

        const mergedGames: MyGameItem[] = ownedGames.map((owned) => {
          const detail = detailMap.get(owned.gameId);

          return {
            game_id: owned.gameId,
            name: detail?.name ?? "Unknown Game",
            description:
              detail?.description ??
              "This game is owned, but its metadata could not be loaded.",
            cover_vertical_image: detail?.cover_vertical_image ?? "",
            cover_horizontal_image: detail?.cover_horizontal_image ?? "",
            release_date: detail?.release_date ?? 0,
            website_url: detail?.website_url,
            distributions: detail?.distributions ?? [],
            active: owned.active,
            pgc1_address: owned.pgc1,
            publisher: owned.publisher,
            created_at: owned.createdAt,
            metadata_uri: owned.metadataUri,
          };
        });

        if (!mounted) return;
        setGames(mergedGames);
      } catch (error) {
        if (!mounted) return;

        const message = error instanceof Error ? error.message : "";
        const code = isLibraryErrorCode(message)
          ? message
          : LIBRARY_ERROR_CODES.RpcFailed;

        setErrorCode(code);
        setGames([]);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [chain, nonce]);

  const errorMessage = useMemo(() => {
    if (!errorCode) return null;

    switch (errorCode) {
      case LIBRARY_ERROR_CODES.MissingSession:
        return "Please sign in to view your games.";
      case LIBRARY_ERROR_CODES.UnsupportedAccountType:
        return "Your account type is not supported for this games view.";
      case LIBRARY_ERROR_CODES.UnsupportedChain:
        return "Selected chain does not support your game library.";
      case LIBRARY_ERROR_CODES.InvalidAccount:
        return "Invalid wallet address found in your session.";
      case LIBRARY_ERROR_CODES.RpcFailed:
      default:
        return "Failed to load your games.";
    }
  }, [errorCode]);

  return {
    games,
    loading,
    errorCode,
    errorMessage,
    isEmpty: !loading && !errorCode && games.length === 0,
    reload: () => setNonce((n) => n + 1),
  };
}
