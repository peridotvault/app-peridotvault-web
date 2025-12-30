import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faShoppingCart, faEdit, faTrash, faGamepad, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { memo } from "react";

interface StudioGame {
  id: string;
  name: string;
  shortDescription?: string;
  coverVerticalImage?: string | File | null;
  coverHorizontalImage?: string | File | null;
  status: "published" | "draft";
  views: number;
  purchases: number;
  updatedAt: string;
}

interface StudioGameCardProps {
  game: StudioGame;
  variant?: "vertical" | "horizontal";
  showActions?: boolean;
  onEdit?: (gameId: string) => void;
  onDelete?: (gameId: string) => void;
}

export const StudioGameCard = memo(function StudioGameCard({
  game,
  variant = "vertical",
  showActions = false,
  onEdit,
  onDelete,
}: StudioGameCardProps) {
  const aspectRatio = variant === "vertical" ? "aspect-[3/4]" : "aspect-video";
  const coverImage = variant === "vertical" ? game.coverVerticalImage : game.coverHorizontalImage;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden hover:border-accent transition-all group">
      {/* Cover Image */}
      <Link href={`/studio/games/${game.id}`}>
        <div className={`${aspectRatio} bg-muted relative overflow-hidden`}>
          {coverImage ? (
            <img
              src={coverImage as string}
              alt={game.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FontAwesomeIcon
                icon={variant === "vertical" ? faGamepad : faFileAlt}
                className="text-5xl text-muted-foreground/30"
              />
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <StatusBadge status={game.status} />
          </div>
        </div>
      </Link>

      {/* Game Info */}
      <div className="p-5">
        <Link href={`/studio/games/${game.id}`}>
          <h3 className="font-semibold text-foreground text-lg mb-2 line-clamp-1">{game.name}</h3>
        </Link>

        {variant === "horizontal" && game.shortDescription && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{game.shortDescription}</p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5">
            <FontAwesomeIcon icon={faEye} className="text-xs" />
            <span>{game.views || 0}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FontAwesomeIcon icon={faShoppingCart} className="text-xs" />
            <span>{game.purchases || 0}</span>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-3">
            {onEdit && (
              <button
                onClick={() => onEdit(game.id)}
                className="flex-1 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground font-medium text-sm transition-colors flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faEdit} />
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(game.id)}
                className="px-4 py-2 rounded-lg border border-border hover:border-destructive text-muted-foreground hover:text-destructive transition-colors"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

interface StatusBadgeProps {
  status: "published" | "draft";
  size?: "sm" | "md" | "lg";
}

function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  };

  return (
    <span
      className={`rounded-lg font-semibold ${
        status === "published"
          ? "bg-success/90 text-white"
          : "bg-warning/90 text-white"
      } ${sizeClasses[size]}`}
    >
      {status === "published" ? "Published" : "Draft"}
    </span>
  );
}
