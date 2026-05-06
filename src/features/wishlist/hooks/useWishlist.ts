"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  addToWishlistApi,
  removeFromWishlistApi,
  getWishlistStatusApi,
  getWishlistCountApi,
  getWishlistApi,
} from "@/core/api/wishlist.api";
import { getGameDetailApi } from "@/core/api/game.api";
import { GameDetailApi } from "@/core/api/game.api.type";
import { WishlistItem } from "@/core/api/wishlist.api.type";

function unwrapData<T>(res: Record<string, unknown>, key: string, fallback: T): T {
  if (res.data != null && typeof res.data === "object" && key in (res.data as object)) {
    return (res.data as Record<string, unknown>)[key] as T;
  }
  if (key in res) {
    return res[key] as T;
  }
  return fallback;
}

export function useWishlistStatus(gameId: string | undefined) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (!gameId) return;

    let mounted = true;

    (async () => {
      try {
        setIsLoading(true);
        const res = await getWishlistStatusApi(gameId);
        if (!mounted) return;
        const val = unwrapData<boolean>(res as unknown as Record<string, unknown>, "is_wishlisted", false);
        setIsWishlisted(val);
        setHasChecked(true);
      } catch {
        if (!mounted) return;
        setHasChecked(true);
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [gameId]);

  const toggle = useCallback(async () => {
    if (!gameId || isLoading) return;

    setIsLoading(true);
    const wasWishlisted = isWishlisted;

    try {
      if (wasWishlisted) {
        await removeFromWishlistApi(gameId);
        setIsWishlisted(false);
      } else {
        await addToWishlistApi(gameId);
        setIsWishlisted(true);
      }
    } catch {
      setIsWishlisted(wasWishlisted);
    } finally {
      setIsLoading(false);
    }
  }, [gameId, isLoading, isWishlisted]);

  return { isWishlisted, isLoading: isLoading && !hasChecked, isToggling: isLoading && hasChecked, hasChecked, toggle };
}

export function useWishlistCount(gameId: string | undefined) {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const refetch = useCallback(() => {
    if (!gameId) return;

    let mounted = true;

    (async () => {
      try {
        setIsLoading(true);
        const res = await getWishlistCountApi(gameId);
        if (!mounted) return;
        setCount(unwrapData<number>(res as unknown as Record<string, unknown>, "count", 0));
      } catch {
        // public endpoint — ignore errors silently
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [gameId]);

  useEffect(() => {
    const cleanup = refetch();
    return cleanup;
  }, [refetch]);

  return { count, isLoading, refetch };
}

export function useWishlistWithCount(gameId: string | undefined) {
  const status = useWishlistStatus(gameId);
  const { count, isLoading: countLoading, refetch: refetchCount } = useWishlistCount(gameId);

  const toggle = useCallback(async () => {
    await status.toggle();
    refetchCount();
  }, [status, refetchCount]);

  return {
    isWishlisted: status.isWishlisted,
    isLoading: status.isLoading,
    isToggling: status.isToggling,
    hasChecked: status.hasChecked,
    toggle,
    count,
    countLoading,
  };
}

export type WishlistGameItem = Pick<
  GameDetailApi,
  | "game_id"
  | "name"
  | "cover_vertical_image"
  | "cover_horizontal_image"
  | "price"
  | "description"
  | "release_date"
  | "website_url"
  | "categories"
  | "game_onchain_publishes"
> & {
  wishlisted_at: string;
};

export function useWishlist(params?: { page?: number; limit?: number }) {
  const [items, setItems] = useState<WishlistGameItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const page = params?.page ?? 1;
  const limit = params?.limit ?? 15;

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getWishlistApi({ page, limit });
        if (!mounted) return;

        const list: WishlistItem[] = (res.data as unknown as WishlistItem[]) ?? [];
        setTotal(list.length);

        if (list.length === 0) {
          setItems([]);
          return;
        }

        const gameIds = list.map((item) => item.game_id);

        const details = await Promise.allSettled(
          gameIds.map(async (gameId) => {
            const detail = await getGameDetailApi(gameId);
            return { gameId, detail };
          })
        );

        if (!mounted) return;

        const detailMap = new Map<string, GameDetailApi>();
        for (const result of details) {
          if (result.status === "fulfilled") {
            detailMap.set(result.value.gameId, result.value.detail);
          }
        }

        const merged: WishlistGameItem[] = list.map((item) => {
          const detail = detailMap.get(item.game_id);
          return {
            game_id: item.game_id,
            name: detail?.name ?? "Unknown Game",
            cover_vertical_image: detail?.cover_vertical_image ?? "",
            cover_horizontal_image: detail?.cover_horizontal_image ?? "",
            price: detail?.price ?? 0,
            description: detail?.description ?? "",
            release_date: detail?.release_date ?? 0,
            website_url: detail?.website_url,
            categories: detail?.categories ?? [],
            game_onchain_publishes: detail?.game_onchain_publishes,
            wishlisted_at: item.created_at,
          };
        });

        setItems(merged);
      } catch (e) {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : "Failed to load wishlist");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [page, limit]);

  const isEmpty = useMemo(
    () => !loading && !error && items.length === 0,
    [loading, error, items]
  );

  return { items, total, loading, error, isEmpty };
}
