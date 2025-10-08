import type { GazaSite } from "../types";
import { formatLabel } from "../utils/format";
import { cn } from "../styles/theme";

interface SiteMetadataProps {
  site: GazaSite;
  variant?: "compact" | "full";
  className?: string;
}

/**
 * Reusable component for displaying site metadata (Type, Built, Destroyed)
 * Used in: SiteCard, SitePopup, SiteDetailPanel
 */
export function SiteMetadata({
  site,
  variant = "compact",
  className,
}: SiteMetadataProps) {
  const textSize = variant === "compact" ? "text-xs" : "text-sm";

  return (
    <div className={cn("space-y-1 text-gray-600", textSize, className)}>
      <p>
        <span className="font-semibold">Type:</span> {formatLabel(site.type)}
      </p>
      <p>
        <span className="font-semibold">Built:</span> {site.yearBuilt}
      </p>
      {site.dateDestroyed && (
        <p>
          <span className="font-semibold">Destroyed:</span> {site.dateDestroyed}
        </p>
      )}
    </div>
  );
}
