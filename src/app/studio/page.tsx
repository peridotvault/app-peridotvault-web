"use client";

import { useMemo } from "react";
import { useUserGames } from "@/features/studio/hooks/useUserGames";
import { Button } from "@/shared/components/ui/Button";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { LoadingState } from "@/shared/components/ui/LoadingState";
import { ErrorMessage } from "@/shared/components/ui/ErrorMessage";
import { StudioGameCard } from "@/shared/components/studio/StudioGameCard";
import { StatCard } from "@/shared/components/studio/StatCard";
import { RECENT_GAMES_COUNT } from "@/features/studio/constants";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGamepad,
  faFileAlt,
  faEye,
  faShoppingCart,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

export default function StudioDashboardPage() {
  const { games, isLoading, error } = useUserGames();

  // Calculate statistics
  const totalGames = games.length;
  const publishedGames = games.filter((g) => g.status === "published").length;
  const draftGames = games.filter((g) => g.status === "draft").length;
  const totalViews = games.reduce((sum, g) => sum + (g.views || 0), 0);
  const totalPurchases = games.reduce((sum, g) => sum + (g.purchases || 0), 0);

  // Recent games (last 6) - memoized
  const recentGames = useMemo(
    () =>
      [...games]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, RECENT_GAMES_COUNT),
    [games]
  );

  if (isLoading) {
    return <LoadingState message="Loading dashboard..." />;
  }

  if (error) {
    return <ErrorMessage title="Error loading dashboard" message={error} />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header - Clean & Simple */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome to <span className="text-accent">Studio</span>
          </h1>
          <p className="text-muted-foreground mt-1">Manage your games and track your performance</p>
        </div>
        <Link href="/studio/games/new">
          <Button size="lg">Create New Game</Button>
        </Link>
      </div>

      {/* Statistics Cards - 2x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            title="Total Games"
            value={totalGames}
            icon={faGamepad}
            trend={`${draftGames} draft${draftGames !== 1 ? "s" : ""}`}
          />
          <StatCard
            title="Published"
            value={publishedGames}
            icon={faFileAlt}
            trend={`${draftGames} pending`}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            title="Total Views"
            value={totalViews}
            icon={faEye}
            trend="All time"
          />
          <StatCard
            title="Purchases"
            value={totalPurchases}
            icon={faShoppingCart}
            trend="All time"
          />
        </div>
      </div>

      {/* Recent Games - Card Grid */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Recent Games</h2>
            <p className="text-sm text-muted-foreground mt-1">Your recently updated games</p>
          </div>
          <Link href="/studio/games">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>

        {recentGames.length === 0 ? (
          <div className="text-center py-16 bg-muted/50 rounded-xl border-2 border-dashed border-border">
            <FontAwesomeIcon icon={faGamepad} className="text-4xl text-muted-foreground mb-4" />
            <p className="font-semibold text-foreground mb-2">No games yet</p>
            <p className="text-sm text-muted-foreground mb-6">Create your first game to get started!</p>
            <Link href="/studio/games/new">
              <Button>Create Your First Game</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentGames.map((game) => (
              <StudioGameCard key={game.id} game={game} variant="vertical" />
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions - Simplified */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-md">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground">Quick Actions</h2>
          <p className="text-sm text-muted-foreground mt-1">Common tasks and shortcuts</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionCard
            title="Create New Game"
            description="Start a new game project"
            icon={faPlus}
            href="/studio/games/new"
          />
          <QuickActionCard
            title="Manage Games"
            description="View and edit your games"
            icon={faGamepad}
            href="/studio/games"
          />
          <QuickActionCard
            title="View Store"
            description="See your games live on store"
            icon={faEye}
            href="/"
          />
        </div>
      </div>
    </div>
  );
}

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: IconDefinition;
  href: string;
}

function QuickActionCard({ title, description, icon, href }: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className="block p-6 rounded-xl border border-border bg-card hover:border-accent transition-all"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
          <FontAwesomeIcon icon={icon} className="text-xl" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Link>
  );
}
