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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading games...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive rounded-lg p-6 text-center">
        <p className="text-destructive font-semibold">Error loading games</p>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Games</h1>
          <p className="text-muted-foreground mt-1">Manage your game portfolio</p>
        </div>
        <Link href="/studio/games/new">
          <Button size="lg" className="gap-2">
            <FontAwesomeIcon icon={faPlus} />
            Create New Game
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2">
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
          className="px-4 py-2 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
        />
      </div>

      {/* Games Grid */}
      {filteredGames.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <FontAwesomeIcon icon={faGamepad} className="text-4xl text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {searchQuery ? "No games found matching your search" : "No games yet"}
          </p>
          {!searchQuery && filter === "all" && (
            <>
              <p className="text-sm text-muted-foreground mt-2">Create your first game to get started!</p>
              <Link href="/studio/games/new" className="inline-block mt-4">
                <Button>Create Game</Button>
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
      className={`px-4 py-2 rounded-md font-medium text-sm transition ${
        active
          ? "bg-accent text-white shadow-flat-sm"
          : "bg-muted text-muted-foreground hover:bg-muted/80"
      }`}
    >
      {children}
    </button>
  );
}

function GameCard({ game }: { game: any }) {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-flat-lg transition duration-200">
      {/* Cover Image */}
      <Link href={`/studio/games/${game.id}`}>
        <div className="aspect-video bg-muted relative overflow-hidden group">
          {game.coverHorizontalImage ? (
            <img
              src={game.coverHorizontalImage as string}
              alt={game.name}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FontAwesomeIcon icon={faFileAlt} className="text-4xl text-muted-foreground" />
            </div>
          )}
          {/* Status Badge */}
          <div className="absolute top-2 right-2">
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                game.status === "published"
                  ? "bg-success/90 text-white"
                  : "bg-warning/90 text-white"
              }`}
            >
              {game.status === "published" ? "Published" : "Draft"}
            </span>
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <Link href={`/studio/games/${game.id}`}>
          <h3 className="font-semibold text-foreground hover:text-accent transition truncate">
            {game.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{game.shortDescription}</p>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <FontAwesomeIcon icon={faEye} />
            {game.views || 0}
          </div>
          <div className="flex items-center gap-1">
            <FontAwesomeIcon icon={faFileAlt} />
            {game.purchases || 0}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <Link href={`/studio/games/${game.id}`} className="flex-1">
            <Button variant="secondary" size="sm" className="w-full gap-2">
              <FontAwesomeIcon icon={faEdit} />
              Edit
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="gap-2">
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </div>
      </div>
    </div>
  );
}
