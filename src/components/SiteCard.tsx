import type { GazaSite } from "../types";
import { components, cn } from "../styles/theme";
import { StatusBadge } from "./StatusBadge";
import { formatLabel } from "../utils/format";

interface SiteCardProps {
  site: GazaSite;
  onClick?: () => void;
}

/**
 * Reusable card component for displaying heritage site information
 * Used in: list view, map popups, search results, detail panels
 */
export function SiteCard({ site, onClick }: SiteCardProps) {
  return (
    <div
      className={cn(components.card.base, onClick && "cursor-pointer", components.card.hover)}
      onClick={onClick}
    >
      {/* Status Badge */}
      <StatusBadge status={site.status} />

      {/* Content */}
      <div className={components.card.padding}>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{site.name}</h3>
        {site.nameArabic && (
          <p className="text-gray-600 text-sm mb-3 text-right" dir="rtl">
            {site.nameArabic}
          </p>
        )}

        <div className="space-y-2 text-sm text-gray-600 mb-4">
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

        <p className="text-gray-700 text-sm line-clamp-3">{site.description}</p>

        {/* Verified By */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">Verified by:</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {site.verifiedBy.map((org) => (
              <span key={org} className={components.badge.primary}>
                {org}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
