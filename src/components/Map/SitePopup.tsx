import type { GazaSite } from "../../types";
import { StatusBadge } from "../StatusBadge";
import { formatLabel } from "../../utils/format";

interface SitePopupProps {
  site: GazaSite;
  onViewMore: () => void;
}

/**
 * Popup content for heritage site markers
 * Displays summary information with "See More" button
 */
export function SitePopup({ site, onViewMore }: SitePopupProps) {
  return (
    <div className="p-2 max-h-[350px] overflow-y-auto">
      {/* Status Badge */}
      <StatusBadge status={site.status} className="text-xs px-2 py-1 rounded mb-2" />

      {/* Site Info */}
      <h3 className="font-bold text-gray-900 mb-1">{site.name}</h3>
      {site.nameArabic && (
        <p className="text-gray-600 text-xs mb-2 text-right" dir="rtl">
          {site.nameArabic}
        </p>
      )}

      <div className="text-xs text-gray-600 space-y-1">
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

      <p className="text-xs text-gray-700 mt-2 mb-3">{site.description}</p>

      {/* See More Button */}
      <div className="flex justify-end">
        <button
          onClick={onViewMore}
          className="px-3 py-1.5 text-xs text-[#009639] hover:text-white bg-transparent hover:bg-[#009639] border border-[#009639] rounded-lg font-semibold transition-all duration-200 active:scale-95"
        >
          See More →
        </button>
      </div>
    </div>
  );
}
