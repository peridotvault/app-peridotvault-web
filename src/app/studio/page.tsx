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

  // Recent games (last 5)
  const recentGames = [...games].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive rounded-lg p-6 text-center">
        <p className="text-destructive font-semibold">Error loading dashboard</p>
        <p className="text-sm text-muted-foreground mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's your studio overview.</p>
        </div>
        <Link href="/studio/games/new">
          <Button size="lg" className="gap-2">
            <FontAwesomeIcon icon={faPlus} />
            Create New Game
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Games"
          value={totalGames}
          icon={faGamepad}
          color="accent"
          trend={`+${draftGames} drafts`}
        />
        <StatCard
          title="Published"
          value={publishedGames}
          icon={faFileAlt}
          color="success"
          trend={`${draftGames} pending`}
        />
        <StatCard
          title="Total Views"
          value={totalViews}
          icon={faEye}
          color="info"
          trend="All time"
        />
        <StatCard
          title="Total Purchases"
          value={totalPurchases}
          icon={faShoppingCart}
          color="warning"
          trend="All time"
        />
      </div>

      {/* Recent Games */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Recent Games</h2>
          <Link href="/studio/games" className="text-sm text-accent hover:underline">
            View All →
          </Link>
        </div>

        {recentGames.length === 0 ? (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={faGamepad} className="text-4xl text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No games yet</p>
            <p className="text-sm text-muted-foreground mt-2">Create your first game to get started!</p>
            <Link href="/studio/games/new" className="inline-block mt-4">
              <Button>Create Game</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentGames.map((game) => (
              <Link
                key={game.id}
                href={`/studio/games/${game.id}`}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/40 hover:bg-muted/60 transition group"
              >
                <div className="flex items-center gap-4">
                  {game.coverVerticalImage ? (
                    <img
                      src={game.coverVerticalImage as string}
                      alt={game.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center">
                      <FontAwesomeIcon icon={faGamepad} className="text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-accent transition">
                      {game.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {game.status === "published" ? "Published" : "Draft"} •{" "}
                      {new Date(game.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faEye} />
                    {game.views || 0}
                  </div>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faShoppingCart} />
                    {game.purchases || 0}
                  </div>
                  {game.status === "draft" && (
                    <span className="px-2 py-1 bg-warning/20 text-warning rounded text-xs font-medium">
                      Draft
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionCard
            title="Create New Game"
            description="Start a new game project"
            icon={faPlus}
            href="/studio/games/new"
            color="accent"
          />
          <QuickActionCard
            title="View All Games"
            description="Manage your games"
            icon={faGamepad}
            href="/studio/games"
            color="info"
          />
          <QuickActionCard
            title="View Store"
            description="See your games live"
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
}: {
  title: string;
  value: number;
  icon: any;
  color: string;
  trend?: string;
}) {
  const colorClasses = {
    accent: "bg-accent/10 text-accent",
    success: "bg-success/10 text-success",
    info: "bg-info/10 text-info",
    warning: "bg-warning/10 text-warning",
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center`}>
          <FontAwesomeIcon icon={icon} className="text-xl" />
        </div>
        {trend && <span className="text-xs text-muted-foreground">{trend}</span>}
      </div>
      <h3 className="text-3xl font-bold text-foreground">{value}</h3>
      <p className="text-sm text-muted-foreground mt-1">{title}</p>
    </div>
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
    accent: "hover:border-accent/50 hover:bg-accent/5",
    success: "hover:border-success/50 hover:bg-success/5",
    info: "hover:border-info/50 hover:bg-info/5",
    warning: "hover:border-warning/50 hover:bg-warning/5",
  };

  return (
    <Link
      href={href}
      className={`p-4 rounded-lg border border-border transition ${colorClasses[color as keyof typeof colorClasses]}`}
    >
      <FontAwesomeIcon icon={icon} className="text-accent mb-3" />
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </Link>
  );
}
