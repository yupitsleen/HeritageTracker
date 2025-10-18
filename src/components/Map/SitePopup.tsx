import type { GazaSite } from "../../types";
import { StatusBadge } from "../StatusBadge";
import { formatLabel } from "../../utils/format";
import { useThemeClasses } from "../../hooks/useThemeClasses";

interface SitePopupProps {
  site: GazaSite;
  onViewMore: () => void;
}

/**
 * Popup content for heritage site markers
 * Displays summary information with "See More" button
 * Supports dark mode
 */
export function SitePopup({ site, onViewMore }: SitePopupProps) {
  const t = useThemeClasses();

  return (
    <div className={`p-2 max-h-[350px] overflow-y-auto ${t.bg.primary} ${t.text.heading}`}>
      {/* Status Badge */}
      <StatusBadge status={site.status} className="text-xs px-2 py-1 rounded mb-2" />

      {/* Site Info */}
      <h3 className={`font-bold mb-1 ${t.text.heading}`}>{site.name}</h3>
      {site.nameArabic && (
        <p className={`text-xs mb-2 text-right ${t.text.muted}`} dir="rtl">
          {site.nameArabic}
        </p>
      )}

      <div className={`text-xs space-y-1 ${t.text.muted}`}>
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

      <p className={`text-xs mt-2 mb-3 ${t.text.body}`}>{site.description}</p>

      {/* See More Button */}
      <div className="flex justify-end">
        <button
          onClick={onViewMore}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 active:scale-95 text-[#009639] hover:text-white bg-transparent ${t.flag.greenHover} border border-[#009639]`}
        >
          See More →
        </button>
      </div>
    </div>
  );
}
