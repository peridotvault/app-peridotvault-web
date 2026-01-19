"use client";

import { GameCard } from "@/features/game/components/ui/GameCard";
import {
  MyGameItem,
  LibraryErrorCode,
  getMyGamesForSession,
  isLibraryErrorCode,
  LIBRARY_ERROR_CODES,
} from "@/features/game/services/library.service";
import { useState, useEffect, useMemo } from "react";

/* ======================================================
   PAGE — My Games
====================================================== */

export default function MyGames() {
  /* =========================
     DATA SOURCES
  ========================= */
  const [games, setGames] = useState<MyGameItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorCode, setErrorCode] = useState<LibraryErrorCode | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setErrorCode(null);

        const my = await getMyGamesForSession({ fromBlock: BigInt(0) });
        console.log("My Games:", my);

        setGames(my);
        if (!mounted) return;
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
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const errorMessage = useMemo(() => {
    if (!errorCode) return null;

    switch (errorCode) {
      case LIBRARY_ERROR_CODES.MissingSession:
        return "Please sign in to view your library.";
      case LIBRARY_ERROR_CODES.UnsupportedAccountType:
        return "Your account type is not supported for EVM games.";
      case LIBRARY_ERROR_CODES.InvalidAccount:
        return "Invalid wallet address found in your session.";
      case LIBRARY_ERROR_CODES.RpcFailed:
      default:
        return "Failed to load your library from the chain.";
    }
  }, [errorCode]);

  /* =========================
     UI
  ========================= */
  return (
    <main className="max-w-400 w-full mx-auto p-8 flex flex-col gap-8">
      {/* ======================================================
         HERO — Featured & Banner Games
      ====================================================== */}
      <section>
        <h1 className="text-4xl font-medium">My Games</h1>
      </section>

      {/* ======================================================
         SECTION — My Games
      ====================================================== */}
      <section className="grid grid-cols-4">
        {games.length > 0
          ? games.map((item, index) => {
              return <GameCard key={index} item={item} loading={loading} />;
            })
          : Array.from({ length: 5 }).map((_, index) => {
              return <GameCard key={index} loading={loading} />;
            })}
      </section>

      {!loading && errorMessage && (
        <section className="text-white/50">
          {errorMessage} <span className="text-white/30">({errorCode})</span>
        </section>
      )}

      {!loading && !errorMessage && games.length === 0 && (
        <section className="text-white/50">
          {"You Don't Have Any Games in Your Library."}
        </section>
      )}
    </main>
  );
}
