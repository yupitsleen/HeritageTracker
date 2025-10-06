import type { GazaSite } from "../types";
import { getStatusColor, cn } from "../styles/theme";
import { formatLabel } from "../utils/format";

interface StatusBadgeProps {
  status: GazaSite["status"];
  className?: string;
}

/**
 * Reusable status badge component showing damage level
 * Used in: SiteCard, HeritageMap popups, and detail panels
 */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <div
      className={cn(
        getStatusColor(status),
        "px-4 py-2 text-sm font-semibold text-white",
        className
      )}
    >
      {formatLabel(status).toUpperCase()}
    </div>
  );
}
