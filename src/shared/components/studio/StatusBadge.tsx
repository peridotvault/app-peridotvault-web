import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo } from "react";

interface StatusBadgeProps {
  status: "published" | "draft";
  size?: "sm" | "md" | "lg";
}

export const StatusBadge = memo(function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
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
});
