import type { GazaSite } from "../../types";
import { StatusBadge } from "../StatusBadge";
import { formatLabel } from "../../utils/format";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import { useLocale } from "../../contexts/LocaleContext";

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
  const { getLabel, localeConfig } = useLocale();
  const isRTL = localeConfig.direction === "rtl";

  return (
    <div
      className={`p-1.5 max-h-[250px] overflow-y-auto ${t.bg.primary} ${t.text.heading}`}
      dir={localeConfig.direction}
    >
      {/* Status Badge */}
      <StatusBadge status={site.status} className="text-[10px] px-1.5 py-0.5 rounded mb-1" />

      {/* Site Info */}
      <h3 className={`text-sm font-bold mb-0.5 leading-tight ${t.text.heading}`}>{site.name}</h3>
      {site.nameArabic && (
        <p className={`text-[10px] mb-1 leading-tight ${t.text.muted} ${isRTL ? "" : "text-right"}`}>
          {site.nameArabic}
        </p>
      )}

      <div className={`text-[10px] space-y-0.5 ${t.text.muted}`}>
        <p className="leading-tight">
          <span className="font-semibold">{getLabel("Type:", "النوع:")} </span>
          {formatLabel(site.type)}
        </p>
        <p className="leading-tight">
          <span className="font-semibold">{getLabel("Built:", "بُني:")} </span>
          {site.yearBuilt}
        </p>
        {site.dateDestroyed && (
          <p className="leading-tight">
            <span className="font-semibold">{getLabel("Destroyed:", "دُمر:")} </span>
            {site.dateDestroyed}
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
      <div className={`flex ${isRTL ? "justify-start" : "justify-end"}`}>
        <button
          onClick={onViewMore}
          className={`px-2 py-1 text-[10px] font-semibold rounded transition-all duration-200 active:scale-95 text-[#009639] hover:text-white bg-transparent ${t.flag.greenHover} border border-[#009639]`}
        >
          {isRTL ? `← ${getLabel("See More", "المزيد")}` : `${getLabel("See More", "المزيد")} →`}
        </button>
      </div>
    </div>
  );
}
