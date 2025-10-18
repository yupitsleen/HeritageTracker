import type { GazaSite } from "../../types";
import { StatusBadge } from "../StatusBadge";
import { formatLabel } from "../../utils/format";
import { useTheme } from "../../contexts/ThemeContext";

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
  const { isDark } = useTheme();

  return (
    <div className={`p-2 max-h-[350px] overflow-y-auto ${
      isDark ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
    }`}>
      {/* Status Badge */}
      <StatusBadge status={site.status} className="text-xs px-2 py-1 rounded mb-2" />

      {/* Site Info */}
      <h3 className={`font-bold mb-1 ${isDark ? "text-gray-100" : "text-gray-900"}`}>{site.name}</h3>
      {site.nameArabic && (
        <p className={`text-xs mb-2 text-right ${isDark ? "text-gray-400" : "text-gray-600"}`} dir="rtl">
          {site.nameArabic}
        </p>
      )}

      <div className={`text-xs space-y-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
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

      <p className={`text-xs mt-2 mb-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{site.description}</p>

      {/* See More Button */}
      <div className="flex justify-end">
        <button
          onClick={onViewMore}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 active:scale-95 ${
            isDark
              ? "text-[#2d5a38] hover:text-white bg-transparent hover:bg-[#2d5a38] border border-[#2d5a38]"
              : "text-[#009639] hover:text-white bg-transparent hover:bg-[#009639] border border-[#009639]"
          }`}
        >
          See More →
        </button>
      </div>
    </div>
  );
}
