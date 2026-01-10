"use client";

/* eslint-disable @next/next/no-img-element */
import {
  getMyGamesForSession,
  isLibraryErrorCode,
  type MyGameItem,
  type LibraryErrorCode,
  LIBRARY_ERROR_CODES,
} from "@/features/game/library/library.service";
import { IMAGE_LOADING } from "@/shared/constants/image";
import { useEffect, useMemo, useState } from "react";

type GridItem =
  | { kind: "skeleton"; key: number }
  | { kind: "game"; data: MyGameItem };

export default function MyGames() {
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

        if (!mounted) return;
        setGames(my);
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

  const items: GridItem[] = useMemo(() => {
    if (loading)
      return Array.from({ length: 5 }, (_, i) => ({
        kind: "skeleton",
        key: i,
      }));
    return games.map((g) => ({ kind: "game", data: g }));
  }, [loading, games]);

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

  return (
    <main className="max-w-400 w-full mx-auto p-8 flex flex-col gap-8">
      <section>
        <h1 className="text-4xl font-medium">My Games</h1>
      </section>

      <section className="grid grid-cols-4">
        {items.map((item) => {
          const key = item.kind === "skeleton" ? item.key : item.data.gameId;

          return (
            <div
              key={key}
              className="flex flex-col gap-4 hover:bg-white/5 rounded-2xl duration-300 px-3 py-5"
            >
              <img
                src={IMAGE_LOADING}
                alt="Game Cover Image"
                className="aspect-video w-full rounded-2xl"
              />

              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-medium line-clamp-2">
                  {item.kind === "skeleton"
                    ? "Peridot Game"
                    : `Game ${item.data.gameId.slice(0, 10)}…`}
                </h2>

                <span aria-label="Game Studio" className="text-white/50">
                  {item.kind === "skeleton"
                    ? "Antigane"
                    : `Publisher: ${item.data.publisher.slice(0, 10)}…`}
                </span>

                {item.kind === "game" && (
                  <span className="text-white/40 text-sm">
                    {item.data.active ? "Active" : "Inactive"} · PGC1:{" "}
                    {item.data.pgc1.slice(0, 10)}…
                  </span>
                )}
              </div>

              <div>
                <button
                  className="bg-accent py-2 px-4 cursor-pointer rounded-lg disabled:opacity-50"
                  disabled={item.kind === "skeleton" || !item.data.active}
                  onClick={() => {
                    if (item.kind === "skeleton") return;
                    console.log("Download:", item.data.gameId);
                  }}
                >
                  Download
                </button>
              </div>
            </div>
          );
        })}
      </section>

      {!loading && errorMessage && (
        <section className="text-white/50">
          {errorMessage} <span className="text-white/30">({errorCode})</span>
        </section>
      )}

      {!loading && !errorMessage && games.length === 0 && (
        <section className="text-white/50">
          Tidak ada game yang terdeteksi di wallet ini.
        </section>
      )}
    </main>
  );
}
