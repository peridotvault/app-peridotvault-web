"use client";

import { useState } from "react";
import { useUserGames } from "@/features/studio/hooks/useUserGames";
import { Button } from "@/shared/components/ui/Button";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGamepad,
  faEdit,
  faTrash,
  faEye,
  faPlus,
  faFileAlt,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

type FilterType = "all" | "published" | "drafts";

export default function MyGamesPage() {
  const { games, isLoading, error, refetch } = useUserGames();
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter games
  const filteredGames = games.filter((game) => {
    const matchesFilter = filter === "all" || game.status === filter;
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading games...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive rounded-lg p-8 text-center">
        <p className="text-destructive font-semibold text-lg">Error loading games</p>
        <p className="text-sm text-muted-foreground mt-2">{error}</p>
        <Button onClick={() => refetch()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-accent/10 to-transparent p-6 rounded-lg">
        <div>
          <h1 className="text-4xl font-bold text-foreground">
            My{" "}
            <span className="bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
              Games
            </span>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Manage your game portfolio
          </p>
        </div>
        <Link href="/studio/games/new">
          <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-shadow">
            <FontAwesomeIcon icon={faPlus} />
            Create New Game
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-3">
          <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
            All ({games.length})
          </FilterButton>
          <FilterButton active={filter === "published"} onClick={() => setFilter("published")}>
            Published ({games.filter((g) => g.status === "published").length})
          </FilterButton>
          <FilterButton active={filter === "drafts"} onClick={() => setFilter("drafts")}>
            Drafts ({games.filter((g) => g.status === "draft").length})
          </FilterButton>
        </div>
        <input
          type="text"
          placeholder="Search games..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 w-full sm:w-auto"
        />
      </div>

      {/* Games Grid */}
      {filteredGames.length === 0 ? (
        <div className="text-center py-16 bg-muted/30 rounded-lg border-2 border-dashed border-border">
          <FontAwesomeIcon icon={faGamepad} className="text-5xl text-muted-foreground mb-4" />
          <p className="text-foreground font-semibold text-lg mb-2">
            {searchQuery ? "No games found" : "No games yet"}
          </p>
          {!searchQuery && filter === "all" && (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                Create your first game to get started!
              </p>
              <Link href="/studio/games/new">
                <Button className="gap-2">
                  <FontAwesomeIcon icon={faPlus} />
                  Create Your First Game
                </Button>
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
        active
          ? "bg-accent text-white shadow-md"
          : "bg-muted text-muted-foreground hover:bg-muted/80"
      }`}
    >
      {children}
    </button>
  );
}

function GameCard({ game }: { game: any }) {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
      {/* Cover Image */}
      <Link href={`/studio/games/${game.id}`}>
        <div className="aspect-video bg-muted relative overflow-hidden">
          {game.coverHorizontalImage ? (
            <img
              src={game.coverHorizontalImage as string}
              alt={game.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/50 to-muted/30">
              <FontAwesomeIcon icon={faFileAlt} className="text-5xl text-muted-foreground/50" />
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <span
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-sm shadow-lg ${
                game.status === "published"
                  ? "bg-success/90 text-white"
                  : "bg-warning/90 text-white"
              }`}
            >
              {game.status === "published" ? "Published" : "Draft"}
            </span>
          </div>

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>

      {/* Info */}
      <div className="p-5">
        <Link href={`/studio/games/${game.id}`}>
          <h3 className="font-bold text-foreground text-lg mb-2 line-clamp-1 group-hover:text-accent transition-colors">
            {game.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{game.shortDescription}</p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5">
            <FontAwesomeIcon icon={faEye} className="text-xs" />
            <span>{game.views || 0}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FontAwesomeIcon icon={faFileAlt} className="text-xs" />
            <span>{game.purchases || 0}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link href={`/studio/games/${game.id}`} className="flex-1">
            <Button variant="secondary" size="md" className="w-full gap-2">
              <FontAwesomeIcon icon={faEdit} />
              Edit
            </Button>
          </Link>
          <Button variant="outline" size="md" className="gap-2">
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </div>
      </div>
    </div>
  );
}
