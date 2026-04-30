"use client";

import { GameCard } from "@/features/game/components/ui/GameCard";
import { useMyGames } from "@/features/game/hooks/useMyGames";
import { useAuthStore } from "@/features/auth/_store/auth.store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGamepad, faLock } from "@fortawesome/free-solid-svg-icons";

/* ======================================================
   PAGE — My Games (Protected)
   ====================================================== */

export default function MyGames() {
  const authStatus = useAuthStore((s) => s.status);
  const { games, loading, errorMessage, errorCode, isEmpty } = useMyGames();

  // Show login prompt if not authenticated
  if (authStatus === "anonymous") {
    return (
      <main className="max-w-400 w-full mx-auto p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <FontAwesomeIcon icon={faLock} className="text-3xl text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold mb-2">Access Your Game Library</h1>
            <p className="text-muted-foreground max-w-md">
              Connect your wallet to view and manage your purchased games. Your library is tied to your wallet address.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-lg">
            <FontAwesomeIcon icon={faGamepad} className="text-primary" />
            <span>Click the Connect button in the top right to get started</span>
          </div>
        </div>
      </main>
    );
  }

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
      <section className="grid gap-4">
        {games.length > 0
          ? games.map((item) => {
              return <GameCard key={item.game_id} item={item} loading={loading} />;
            })
          : Array.from({ length: 10 }).map((_, index) => {
              return <GameCard key={index} loading={loading} />;
            })}
      </section>
    </main>
  );
}
