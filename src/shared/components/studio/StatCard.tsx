import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo } from "react";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface StatCardProps {
  title: string;
  value: number;
  icon: IconDefinition;
  trend?: string;
}

export const StatCard = memo(function StatCard({ title, value, icon, trend }: StatCardProps) {
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
});
