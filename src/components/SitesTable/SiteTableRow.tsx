import type { Site } from "../../types";
import { getStatusHexColor } from "../../styles/theme";
import { formatDateStandard, getEffectiveDestructionDate } from "../../utils/format";
import { SiteTypeIcon, getSiteTypeLabel } from "../Icons/SiteTypeIcon";
import { useTheme } from "../../contexts/ThemeContext";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import type { CSSProperties } from "react";

interface SiteTableRowProps {
  site: Site;
  onSiteClick?: (site: Site) => void;
  onSiteHighlight?: (siteId: string | null) => void;
  highlightedSiteId?: string | null;
  variant: "compact" | "expanded";
  isColumnVisible: (columnName: string) => boolean;
  style?: CSSProperties; // For react-window positioning
}

/**
 * Individual table row component for virtual scrolling
 */
export function SiteTableRow({
  site,
  onSiteClick,
  onSiteHighlight,
  highlightedSiteId,
  variant,
  isColumnVisible,
  style,
}: SiteTableRowProps) {
  const { isDark } = useTheme();
  const t = useThemeClasses();

  // Get effective destruction date (with fallback to source assessment date)
  const effectiveDestructionDate = getEffectiveDestructionDate(site);

  return (
    <tr
      style={style}
      className={`transition-colors duration-150 border-b ${t.border.default} ${
        highlightedSiteId === site.id
          ? isDark
            ? "bg-green-900/40 ring-2 ring-[#009639] ring-inset"
            : "bg-green-50/60 ring-2 ring-[#009639] ring-inset"
          : `${t.bg.primary}/50 ${t.bg.hover}`
      }`}
      onClick={() => {
        onSiteHighlight?.(site.id);
      }}
    >
      {isColumnVisible("name") && (
        <td className={t.table.td}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSiteClick?.(site);
            }}
            className="text-left w-full hover:underline"
          >
            <div className="font-semibold text-base text-[#009639] hover:text-[#007b2f]">{site.name}</div>
            {site.nameArabic && (
              <div
                className={`${
                  variant === "compact" ? "text-xs" : "text-sm"
                } ${t.text.muted} mt-1`}
                dir="rtl"
              >
                {site.nameArabic}
              </div>
            )}
          </button>
        </td>
      )}
      {isColumnVisible("type") && (
        <td className={`${t.table.td} text-center`}>
          <span className="inline-flex items-center justify-center" title={getSiteTypeLabel(site.type)}>
            <SiteTypeIcon type={site.type} className={`w-5 h-5 ${t.icon.siteType}`} />
          </span>
        </td>
      )}
      {isColumnVisible("status") && (
        <td className={t.table.td}>
          <span
            className="font-semibold capitalize text-sm"
            style={{ color: getStatusHexColor(site.status) }}
          >
            {site.status.replace("-", " ")}
          </span>
        </td>
      )}
      {isColumnVisible("dateDestroyed") && (
        <td className={`${t.table.td} text-sm ${t.text.subheading}`}>
          {formatDateStandard(effectiveDestructionDate)}
        </td>
      )}
      {isColumnVisible("dateDestroyedIslamic") && (
        <td className={`${t.table.td} text-sm ${t.text.subheading}`}>
          {site.dateDestroyedIslamic || "N/A"}
        </td>
      )}
      {isColumnVisible("yearBuilt") && (
        <td className={`${t.table.td} text-sm ${t.text.subheading}`}>{site.yearBuilt}</td>
      )}
      {isColumnVisible("yearBuiltIslamic") && (
        <td className={`${t.table.td} text-sm ${t.text.subheading}`}>
          {site.yearBuiltIslamic || "N/A"}
        </td>
      )}
    </tr>
  );
}
