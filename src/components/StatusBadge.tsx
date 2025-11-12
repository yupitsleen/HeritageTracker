import type { Site } from "../types";
import { getStatusColor, cn } from "../styles/theme";
import { useTranslation } from "../contexts/LocaleContext";

interface StatusBadgeProps {
  status: Site["status"];
  className?: string;
}

/**
 * Reusable status badge component showing damage level
 * Used in: SiteCard, HeritageMap popups, and detail panels
 * Now supports i18n for status labels
 */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  const t = useTranslation();

  // Map status values to translation keys (kebab-case to camelCase)
  const statusKeyMap: Record<Site["status"], string> = {
    destroyed: "siteStatus.destroyed",
    "heavily-damaged": "siteStatus.heavilyDamaged",
    damaged: "siteStatus.damaged",
  };

  return (
    <div
      className={cn(
        getStatusColor(status),
        "px-4 py-2 text-sm font-semibold text-white",
        className
      )}
    >
      {t(statusKeyMap[status] as "siteStatus.destroyed" | "siteStatus.heavilyDamaged" | "siteStatus.damaged").toUpperCase()}
    </div>
  );
}
