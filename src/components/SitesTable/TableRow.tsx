import type { GazaSite } from "../../types";
import { getStatusHexColor } from "../../styles/theme";
import { formatDateStandard, translateStatus, getSiteDisplayNames } from "../../utils/format";
import { Tooltip } from "../Tooltip";
import { SiteTypeIcon, getSiteTypeLabel } from "../Icons/SiteTypeIcon";
import { useTheme } from "../../contexts/ThemeContext";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import { useLocale, useTranslation } from "../../contexts/LocaleContext";
import { COMPACT_TABLE } from "../../constants/compactDesign";

interface TableRowProps {
  site: GazaSite;
  isHighlighted: boolean;
  visibleColumns: Set<string>;
  onSiteClick: (site: GazaSite) => void;
  onSiteHighlight?: (siteId: string | null) => void;
  rowRef?: React.RefObject<HTMLTableRowElement | null>;
}

/**
 * Individual table row for a heritage site
 * Handles cell rendering based on visible columns
 */
export function TableRow({
  site,
  isHighlighted,
  visibleColumns,
  onSiteClick,
  onSiteHighlight,
  rowRef,
}: TableRowProps) {
  const { isDark } = useTheme();
  const t = useThemeClasses();
  const translate = useTranslation();
  const { localeConfig } = useLocale();
  const isRTL = localeConfig.direction === "rtl";

  // Get display names based on text direction (RTL vs LTR)
  const { primary, secondary, primaryDir, secondaryDir } = getSiteDisplayNames(site, isRTL);

  return (
    <tr
      ref={rowRef}
      className={`transition-colors duration-150 border-b ${t.border.default} ${
        isHighlighted
          ? isDark
            ? "bg-green-900/40 ring-2 ring-[#009639] ring-inset"
            : "bg-green-50/60 ring-2 ring-[#009639] ring-inset"
          : `${t.bg.primary}/50 ${t.bg.hover}`
      }`}
      onClick={() => {
        onSiteHighlight?.(site.id);
      }}
    >
      {visibleColumns.has("type") && (
        <td className={`${COMPACT_TABLE.cellX} ${COMPACT_TABLE.cellY} text-center`}>
          <Tooltip content={getSiteTypeLabel(site.type)}>
            <span className="inline-flex items-center justify-center">
              <SiteTypeIcon type={site.type} className={`w-4 h-4 ${t.text.body}`} />
            </span>
          </Tooltip>
        </td>
      )}
      {visibleColumns.has("name") && (
        <td className={`pl-2 pr-1 ${COMPACT_TABLE.cellY}`}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSiteClick(site);
            }}
            className="text-left w-full hover:underline"
          >
            <div
              className={`font-semibold ${COMPACT_TABLE.text} text-[#009639] hover:text-[#007b2f]`}
              dir={primaryDir}
            >
              {primary}
            </div>
            {secondary && (
              <div
                className={`text-[10px] ${t.text.muted} mt-0.5`}
                dir={secondaryDir}
              >
                {secondary}
              </div>
            )}
          </button>
        </td>
      )}
      {visibleColumns.has("status") && (
        <td className={`${COMPACT_TABLE.cellX} ${COMPACT_TABLE.cellY}`}>
          <span
            className={`font-semibold ${COMPACT_TABLE.text}`}
            style={{ color: getStatusHexColor(site.status) }}
          >
            {translateStatus(translate, site.status)}
          </span>
        </td>
      )}
      {visibleColumns.has("dateDestroyed") && (
        <td className={`${COMPACT_TABLE.cellX} ${COMPACT_TABLE.cellY} ${COMPACT_TABLE.text} ${t.text.subheading}`}>
          {formatDateStandard(site.dateDestroyed)}
        </td>
      )}
      {visibleColumns.has("dateDestroyedIslamic") && (
        <td className={`${COMPACT_TABLE.cellX} ${COMPACT_TABLE.cellY} ${COMPACT_TABLE.text} ${t.text.subheading}`}>
          {site.dateDestroyedIslamic || "N/A"}
        </td>
      )}
      {visibleColumns.has("yearBuilt") && (
        <td className={`${COMPACT_TABLE.cellX} ${COMPACT_TABLE.cellY} ${COMPACT_TABLE.text} ${t.text.subheading}`}>{site.yearBuilt}</td>
      )}
      {visibleColumns.has("yearBuiltIslamic") && (
        <td className={`${COMPACT_TABLE.cellX} ${COMPACT_TABLE.cellY} ${COMPACT_TABLE.text} ${t.text.subheading}`}>
          {site.yearBuiltIslamic || "N/A"}
        </td>
      )}
    </tr>
  );
}
