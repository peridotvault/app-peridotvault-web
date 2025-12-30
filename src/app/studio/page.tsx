"use client";

import { useUserGames } from "@/features/studio/hooks/useUserGames";
import { Button } from "@/shared/components/ui/Button";
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

  // Recent games (last 6)
  const recentGames = [...games]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive rounded-lg p-8 text-center">
        <p className="text-destructive font-semibold text-lg">Error loading dashboard</p>
        <p className="text-sm text-muted-foreground mt-2">{error}</p>
      </div>
    );
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
            <Button variant="outline" size="sm">View All</Button>
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
              <GameCard key={game.id} game={game} />
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

function StatCard({
  title,
  value,
  icon,
  trend,
}: {
  title: string;
  value: number;
  icon: any;
  trend?: string;
}) {
  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-md">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
          <FontAwesomeIcon icon={icon} className="text-xl" />
        </div>
        {trend && (
          <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
            {trend}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
      <p className="text-sm text-muted-foreground font-medium">{title}</p>
    </div>
  );
}

function GameCard({ game }: { game: any }) {
  return (
    <Link
      href={`/studio/games/${game.id}`}
      className="block rounded-xl border border-border bg-card overflow-hidden hover:border-accent transition-all"
    >
      {/* Cover Image */}
      <div className="aspect-[3/4] bg-muted relative overflow-hidden">
        {game.coverVerticalImage ? (
          <img
            src={game.coverVerticalImage as string}
            alt={game.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FontAwesomeIcon icon={faGamepad} className="text-5xl text-muted-foreground/30" />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              game.status === "published"
                ? "bg-success/90 text-white"
                : "bg-warning/90 text-white"
            }`}
          >
            {game.status === "published" ? "Published" : "Draft"}
          </span>
        </div>
      </div>

      {/* Game Info */}
      <div className="p-5">
        <h3 className="font-semibold text-foreground text-lg mb-3 line-clamp-1">{game.name}</h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <FontAwesomeIcon icon={faEye} className="text-xs" />
            <span>{game.views || 0}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FontAwesomeIcon icon={faShoppingCart} className="text-xs" />
            <span>{game.purchases || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function QuickActionCard({
  title,
  description,
  icon,
  href,
}: {
  title: string;
  description: string;
  icon: any;
  href: string;
}) {
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
