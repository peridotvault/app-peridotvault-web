"use client";

import { useState } from "react";
import { useUserGames } from "@/features/studio/hooks/useUserGames";
import { Button } from "@/shared/components/ui/Button";
import { LoadingState } from "@/shared/components/ui/LoadingState";
import { ErrorMessage } from "@/shared/components/ui/ErrorMessage";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGamepad,
  faEdit,
  faTrash,
  faEye,
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
    return <LoadingState message="Loading games..." />;
  }

  if (error) {
    return <ErrorMessage title="Error loading games" message={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header - Clean & Simple */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            My <span className="text-accent">Games</span>
          </h1>
          <p className="text-muted-foreground mt-1">Manage your game portfolio</p>
        </div>
        <Link href="/studio/games/new">
          <Button size="lg">Create New Game</Button>
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
        <div className="text-center py-16 bg-muted/50 rounded-xl border-2 border-dashed border-border">
          <FontAwesomeIcon icon={faGamepad} className="text-4xl text-muted-foreground mb-4" />
          <p className="font-semibold text-foreground mb-2">
            {searchQuery ? "No games found" : "No games yet"}
          </p>
          {!searchQuery && filter === "all" && (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                Create your first game to get started!
              </p>
              <Link href="/studio/games/new">
                <Button>Create Your First Game</Button>
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <GameCardWithActions
              key={game.id}
              game={game}
              onEdit={(gameId) => (window.location.href = `/studio/games/${gameId}`)}
              onDelete={(gameId) => {
                // TODO: Implement delete functionality
                console.log("Delete game:", gameId);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function FilterButton({ active, onClick, children }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
        active
          ? "bg-accent text-white"
          : "bg-muted/50 text-muted-foreground hover:bg-muted"
      }`}
    >
      {children}
    </button>
  );
}

interface GameCardWithActionsProps {
  game: {
    id: string;
    name: string;
    shortDescription?: string;
    coverHorizontalImage?: string | File | null;
    coverVerticalImage?: string | File | null;
    status: "published" | "draft";
    views: number;
    purchases: number;
    updatedAt: string;
  };
  onEdit: (gameId: string) => void;
  onDelete: (gameId: string) => void;
}

function GameCardWithActions({ game, onEdit, onDelete }: GameCardWithActionsProps) {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden hover:border-accent transition-all group">
      {/* Cover Image */}
      <div className="aspect-video bg-muted relative overflow-hidden">
        {game.coverHorizontalImage ? (
          <img
            src={game.coverHorizontalImage as string}
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

      {/* Info */}
      <div className="p-5">
        <h3 className="font-semibold text-foreground text-lg mb-2 line-clamp-1">{game.name}</h3>
        {game.shortDescription && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{game.shortDescription}</p>
        )}

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
          <button
            onClick={() => onEdit(game.id)}
            className="flex-1 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground font-medium text-sm transition-colors flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faEdit} />
            Edit
          </button>
          <button
            onClick={() => onDelete(game.id)}
            className="px-4 py-2 rounded-lg border border-border hover:border-destructive text-muted-foreground hover:text-destructive transition-colors"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    </div>
  );
}
