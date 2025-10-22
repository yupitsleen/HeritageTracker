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
 * Ultra-compact design to match modal content reduction
 * Supports dark mode
 */
export function SitePopup({ site, onViewMore }: SitePopupProps) {
  const t = useThemeClasses();

  return (
    <div className={`p-1.5 max-h-[250px] overflow-y-auto ${t.bg.primary} ${t.text.heading}`}>
      {/* Status Badge */}
      <StatusBadge status={site.status} className="text-[10px] px-1.5 py-0.5 rounded mb-1" />

      {/* Site Info */}
      <h3 className={`text-sm font-bold mb-0.5 leading-tight ${t.text.heading}`}>{site.name}</h3>
      {site.nameArabic && (
        <p className={`text-[10px] mb-1 text-right leading-tight ${t.text.muted}`} dir="rtl">
          {site.nameArabic}
        </p>
      )}

      <div className={`text-[10px] space-y-0.5 ${t.text.muted}`}>
        <p className="leading-tight">
          <span className="font-semibold">Type:</span> {formatLabel(site.type)}
        </p>
        <p className="leading-tight">
          <span className="font-semibold">Built:</span> {site.yearBuilt}
        </p>
        {site.dateDestroyed && (
          <p className="leading-tight">
            <span className="font-semibold">Destroyed:</span> {site.dateDestroyed}
          </p>
        )}
      </div>

      {/* Truncated description - only first 80 chars */}
      <p className={`text-[10px] mt-1 mb-1.5 leading-tight ${t.text.body}`}>
        {site.description.length > 80
          ? `${site.description.substring(0, 80)}...`
          : site.description}
      </p>

      {/* See More Button */}
      <div className="flex justify-end">
        <button
          onClick={onViewMore}
          className={`px-2 py-1 text-[10px] font-semibold rounded transition-all duration-200 active:scale-95 text-[#009639] hover:text-white bg-transparent ${t.flag.greenHover} border border-[#009639]`}
        >
          See More →
        </button>
      </div>
    </div>
  );
}
