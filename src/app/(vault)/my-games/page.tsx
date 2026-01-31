"use client";

import { GameCard } from "@/features/game/components/ui/GameCard";
import { useMyGames } from "@/features/game/hooks/my-games.hook";

/* ======================================================
   PAGE — My Games
====================================================== */

export default function MyGames() {
  const { games, loading, errorMessage, errorCode, isEmpty } = useMyGames();

  /* =========================
     UI
  ========================= */
  if (isEmpty) {
    return (
      <section className="text-white/50 w-full h-full flex justify-center items-center py-20">
        {"You Don't Have Any Games in Your Library."}
      </section>
    );
  }

  if (!loading && errorMessage) {
    return (
      <section className="text-white/50 w-full h-full flex justify-center items-center py-20">
        {errorMessage} <span className="text-white/30">({errorCode})</span>
      </section>
    );
  }

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
    </main>
  );
}
