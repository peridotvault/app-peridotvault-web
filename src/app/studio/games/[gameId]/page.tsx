"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useGameById } from "@/features/studio/hooks/useUserGames";
import { useUpdateGame } from "@/features/studio/hooks/useUpdateGame";
import { Button } from "@/shared/components/ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEdit,
  faTrash,
  faSpinner,
  faEye,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function EditGamePage() {
  const router = useRouter();
  const params = useParams();
  const gameId = params.gameId as string;

  const { game, isLoading, error, refetch } = useGameById(gameId);
  const { updateExistingGame, isLoading: isUpdating } = useUpdateGame();

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  useEffect(() => {
    if (game) {
      setEditedName(game.name);
      setEditedDescription(game.description);
    }
  }, [game]);

  const handleSave = async () => {
    if (!game) return;

    const result = await updateExistingGame(gameId, {
      ...game,
      name: editedName,
      description: editedDescription,
    });

    if (result.success) {
      setIsEditing(false);
      refetch();
    }
  };

  const handlePublish = async () => {
    // Simple publish action - would call publishGame service
    if (!game) return;
    await updateExistingGame(gameId, { ...game, status: "published" });
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-accent mb-4" />
          <p className="text-muted-foreground">Loading game...</p>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="bg-destructive/10 border border-destructive rounded-lg p-6 text-center">
        <p className="text-destructive font-semibold">Error loading game</p>
        <p className="text-sm text-muted-foreground mt-2">{error || "Game not found"}</p>
        <Link href="/studio/games">
          <Button className="mt-4">Back to Games</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link href="/studio/games" className="text-sm text-muted-foreground hover:text-accent mb-4 inline-block">
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to My Games
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">Edit Game</h1>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                game.status === "published"
                  ? "bg-success/20 text-success"
                  : "bg-warning/20 text-warning"
              }`}
            >
              {game.status === "published" ? "Published" : "Draft"}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/`} target="_blank">
            <Button variant="outline" className="gap-2">
              <FontAwesomeIcon icon={faEye} />
              Preview
            </Button>
          </Link>
          {game.status === "draft" && (
            <Button onClick={handlePublish} className="gap-2" isLoading={isUpdating}>
              Publish
            </Button>
          )}
        </div>
      </div>

      {/* Game Info Card */}
      <div className="bg-card rounded-lg border border-border p-6 mb-6">
        <div className="flex items-start gap-6">
          {/* Cover Image */}
          <div className="w-48 aspect-[3/4] rounded-lg overflow-hidden bg-muted flex-shrink-0">
            {game.coverVerticalImage ? (
              <img
                src={game.coverVerticalImage as string}
                alt={game.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No Cover
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Game Name</label>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full mt-1 px-4 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Description</label>
                  <textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    rows={4}
                    className="w-full mt-1 px-4 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 resize-y"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} isLoading={isUpdating} className="gap-2">
                    <FontAwesomeIcon icon={faSave} />
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedName(game.name);
                      setEditedDescription(game.description);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">{game.name}</h2>
                <p className="text-muted-foreground mb-4">{game.description}</p>
                <div className="flex gap-2">
                  <Button onClick={() => setIsEditing(true)} className="gap-2">
                    <FontAwesomeIcon icon={faEdit} />
                    Edit Info
                  </Button>
                  <Button variant="danger" className="gap-2">
                    <FontAwesomeIcon icon={faTrash} />
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard title="Views" value={game.views || 0} />
        <StatCard title="Purchases" value={game.purchases || 0} />
        <StatCard
          title="Status"
          value={game.status === "published" ? "Published" : "Draft"}
        />
      </div>

      {/* Details */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4">Game Details</h3>
        <div className="space-y-3 text-sm">
          <DetailRow label="Price" value={`$${game.price.toFixed(2)}`} />
          <DetailRow label="Required Age" value={game.requiredAge ? String(game.requiredAge) : "All ages"} />
          <DetailRow
            label="Created"
            value={new Date(game.createdAt).toLocaleDateString()}
          />
          <DetailRow
            label="Last Updated"
            value={new Date(game.updatedAt).toLocaleDateString()}
          />
          {game.publishedAt && (
            <DetailRow
              label="Published"
              value={new Date(game.publishedAt).toLocaleDateString()}
            />
          )}
          <DetailRow
            label="Categories"
            value={game.categories.length ? game.categories.join(", ") : "None"}
          />
          <DetailRow label="Tags" value={game.tags.length ? game.tags.join(", ") : "None"} />
        </div>
      </div>

      {/* Note */}
      <div className="mt-6 p-4 bg-info/10 border border-info/30 rounded-lg">
        <p className="text-sm text-info">
          <strong>Note:</strong> This is a simplified edit page. Full editing capabilities for all
          fields (media, distribution, etc.) will be available in the complete tabbed form
          interface.
        </p>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string | undefined }) {
  if (!value) return null;
  return (
    <div className="flex justify-between py-2 border-b border-border/50">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
  );
}
