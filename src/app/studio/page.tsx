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
  faArrowRight,
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
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-accent/10 to-transparent p-6 rounded-lg">
        <div>
          <h1 className="text-4xl font-bold text-foreground">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
              Studio
            </span>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Manage your games and track your performance
          </p>
        </div>
        <Link href="/studio/games/new">
          <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-shadow">
            <FontAwesomeIcon icon={faPlus} />
            Create New Game
          </Button>
        </Link>
      </div>

      {/* Statistics Cards - 2x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            title="Total Games"
            value={totalGames}
            icon={faGamepad}
            color="accent"
            trend={`${draftGames} draft${draftGames !== 1 ? "s" : ""}`}
            highlight
          />
          <StatCard
            title="Published"
            value={publishedGames}
            icon={faFileAlt}
            color="success"
            trend={`${draftGames} pending`}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            title="Total Views"
            value={totalViews}
            icon={faEye}
            color="info"
            trend="All time"
          />
          <StatCard
            title="Purchases"
            value={totalPurchases}
            icon={faShoppingCart}
            color="warning"
            trend="All time"
          />
        </div>
      </div>

      {/* Recent Games - Card Grid */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Recent Games</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Your recently updated games
            </p>
          </div>
          <Link href="/studio/games">
            <Button variant="outline" size="sm" className="gap-2">
              View All
              <FontAwesomeIcon icon={faArrowRight} size="sm" />
            </Button>
          </Link>
        </div>

        {recentGames.length === 0 ? (
          <div className="text-center py-16 bg-muted/30 rounded-lg border-2 border-dashed border-border">
            <FontAwesomeIcon icon={faGamepad} className="text-5xl text-muted-foreground mb-4" />
            <p className="text-foreground font-semibold text-lg mb-2">No games yet</p>
            <p className="text-sm text-muted-foreground mb-6">
              Create your first game to get started!
            </p>
            <Link href="/studio/games/new">
              <Button className="gap-2">
                <FontAwesomeIcon icon={faPlus} />
                Create Your First Game
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions - Enhanced */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">Quick Actions</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Common tasks and shortcuts
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionCard
            title="Create New Game"
            description="Start a new game project"
            icon={faPlus}
            href="/studio/games/new"
            color="accent"
          />
          <QuickActionCard
            title="Manage Games"
            description="View and edit your games"
            icon={faGamepad}
            href="/studio/games"
            color="info"
          />
          <QuickActionCard
            title="View Store"
            description="See your games live on store"
            icon={faEye}
            href="/"
            color="success"
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
  color,
  trend,
  highlight = false,
}: {
  title: string;
  value: number;
  icon: any;
  color: string;
  trend?: string;
  highlight?: boolean;
}) {
  const colorClasses = {
    accent: "bg-gradient-to-br from-accent/20 to-accent/10 text-accent border-accent/20",
    success: "bg-gradient-to-br from-success/20 to-success/10 text-success border-success/20",
    info: "bg-gradient-to-br from-info/20 to-info/10 text-info border-info/20",
    warning: "bg-gradient-to-br from-warning/20 to-warning/10 text-warning border-warning/20",
  };

  return (
    <div
      className={`relative bg-card rounded-xl border p-5 hover:shadow-lg transition-all duration-300 ${highlight ? "border-accent/30 shadow-md" : "border-border"
        }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-14 h-14 rounded-xl ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center border`}
        >
          <FontAwesomeIcon icon={icon} className="text-2xl" />
        </div>
        {trend && (
          <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-4xl font-bold text-foreground mb-1">{value}</h3>
      <p className="text-sm text-muted-foreground font-medium">{title}</p>
    </div>
  );
}

function GameCard({ game }: { game: any }) {
  return (
    <Link
      href={`/studio/games/${game.id}`}
      className="group block bg-muted/20 hover:bg-muted/40 rounded-xl border border-border hover:border-accent/30 transition-all duration-300 overflow-hidden"
    >
      {/* Cover Image */}
      <div className="aspect-[3/4] bg-muted relative overflow-hidden">
        {game.coverVerticalImage ? (
          <img
            src={game.coverVerticalImage as string}
            alt={game.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/50 to-muted/30">
            <FontAwesomeIcon icon={faGamepad} className="text-5xl text-muted-foreground/50" />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-sm ${game.status === "published"
              ? "bg-success/90 text-white shadow-lg"
              : "bg-warning/90 text-white shadow-lg"
              }`}
          >
            {game.status === "published" ? "Published" : "Draft"}
          </span>
        </div>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Game Info */}
      <div className="p-4">
        <h3 className="font-bold text-foreground text-lg mb-2 line-clamp-1 group-hover:text-accent transition-colors">
          {game.name}
        </h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1.5">
            <FontAwesomeIcon icon={faEye} className="text-xs" />
            <span>{game.views || 0}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FontAwesomeIcon icon={faShoppingCart} className="text-xs" />
            <span>{game.purchases || 0}</span>
          </div>
          <span className="text-xs">
            {new Date(game.updatedAt).toLocaleDateString()}
          </span>
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
  color,
}: {
  title: string;
  description: string;
  icon: any;
  href: string;
  color: string;
}) {
  const colorClasses = {
    accent: "hover:border-accent hover:shadow-accent/20 group-hover:bg-accent/5",
    success: "hover:border-success hover:shadow-success/20 group-hover:bg-success/5",
    info: "hover:border-info hover:shadow-info/20 group-hover:bg-info/5",
    warning: "hover:border-warning hover:shadow-warning/20 group-hover:bg-warning/5",
  };

  const iconBgClasses = {
    accent: "bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white",
    success: "bg-success/10 text-success group-hover:bg-success group-hover:text-white",
    info: "bg-info/10 text-info group-hover:bg-info group-hover:text-white",
    warning: "bg-warning/10 text-warning group-hover:bg-warning group-hover:text-white",
  };

  return (
    <Link
      href={href}
      className={`group relative p-5 rounded-xl border-2 border-border transition-all duration-300 hover:shadow-lg ${colorClasses[color as keyof typeof colorClasses]}`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-xl ${iconBgClasses[color as keyof typeof iconBgClasses]} flex items-center justify-center transition-all duration-300`}
        >
          <FontAwesomeIcon icon={icon} className="text-xl" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-foreground text-base mb-1 group-hover:text-accent transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <FontAwesomeIcon
          icon={faArrowRight}
          className="text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all duration-300 mt-1"
        />
      </div>
    </Link>
  );
}
