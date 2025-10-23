import { useState, useMemo, useEffect, useRef } from "react";
// import { FixedSizeList as List } from "react-window"; // Ready for future use when needed
import type { GazaSite } from "../../types";
import { getStatusHexColor } from "../../styles/theme";
import { formatDateStandard } from "../../utils/format";
import { Tooltip } from "../Tooltip";
import { TABLE_CONFIG } from "../../constants/layout";
import { SiteTypeIcon, getSiteTypeLabel } from "../Icons/SiteTypeIcon";
import { useTheme } from "../../contexts/ThemeContext";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import { Button } from "../Button";
import { COMPACT_TABLE } from "../../constants/compactDesign";
import { exportSites, getExportConfigs } from "../../config/exportFormats";
import type { ExportFormatId } from "../../types/export";

interface SitesTableDesktopProps {
  sites: GazaSite[];
  onSiteClick: (site: GazaSite) => void;
  onSiteHighlight?: (siteId: string | null) => void;
  highlightedSiteId?: string | null;
  onExpandTable?: () => void;
  variant: "compact" | "expanded";
  visibleColumns?: string[]; // For resizable table - which columns to show
}

type SortField =
  | "name"
  | "type"
  | "status"
  | "dateDestroyed"
  | "dateDestroyedIslamic"
  | "yearBuilt"
  | "yearBuiltIslamic";
type SortDirection = "asc" | "desc";

/**
 * Desktop table variant for heritage sites
 * Supports compact (sidebar) and expanded (modal) layouts
 */
export function SitesTableDesktop({
  sites,
  onSiteClick,
  onSiteHighlight,
  highlightedSiteId,
  onExpandTable,
  variant,
  visibleColumns,
}: SitesTableDesktopProps) {
  const { isDark } = useTheme();
  const t = useThemeClasses();
  const [sortField, setSortField] = useState<SortField>("dateDestroyed");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedExportFormat, setSelectedExportFormat] = useState<ExportFormatId>("csv");
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const highlightedRowRef = useRef<HTMLTableRowElement>(null);

  // Get available export formats
  const exportConfigs = useMemo(() => getExportConfigs(), []);

  // Handle export with selected format
  const handleExport = () => {
    exportSites({
      format: selectedExportFormat,
      sites: sortedSites,
    });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedSites = useMemo(() => {
    const sorted = [...sites].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "type":
          aValue = a.type;
          bValue = b.type;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "dateDestroyed":
          aValue = a.dateDestroyed ? new Date(a.dateDestroyed).getTime() : 0;
          bValue = b.dateDestroyed ? new Date(b.dateDestroyed).getTime() : 0;
          break;
        case "dateDestroyedIslamic":
          aValue = a.dateDestroyedIslamic || "zzz";
          bValue = b.dateDestroyedIslamic || "zzz";
          break;
        case "yearBuilt":
          aValue = a.yearBuilt || "zzz";
          bValue = b.yearBuilt || "zzz";
          break;
        case "yearBuiltIslamic":
          aValue = a.yearBuiltIslamic || "zzz";
          bValue = b.yearBuiltIslamic || "zzz";
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [sites, sortField, sortDirection]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <span className={`ml-1 ${t.icon.default}`}>↕</span>;
    }
    return <span className="text-[#009639] ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>;
  };

  // Helper to check if column should be visible (for resizable table)
  const isColumnVisible = (columnName: string): boolean => {
    // If visibleColumns not provided (modal), use variant logic
    if (!visibleColumns) {
      return (
        variant === "expanded" ||
        columnName === "name" ||
        columnName === "status" ||
        columnName === "dateDestroyed"
      );
    }
    return visibleColumns.includes(columnName);
  };

  // Virtual scrolling: Ready but not yet implemented in JSX
  // Infrastructure is in place (SiteTableRow.tsx, VirtualizedTableBody.tsx)
  // When site count exceeds 50, virtual scrolling can be enabled
  // Standard rendering is used when site count < threshold for optimal performance
  // Note for future: When implementing, replace tbody.map with VirtualizedTableBody component

  // Scroll to highlighted site when it changes
  useEffect(() => {
    if (!highlightedSiteId || !highlightedRowRef.current || !tableContainerRef.current) return;

    highlightedRowRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [highlightedSiteId]);

  return (
    <div className={`flex flex-col backdrop-blur-sm border ${t.border.primary} rounded shadow-lg transition-colors duration-200 ${isDark ? "bg-[#000000]/95" : "bg-white/95"}`} style={{ height: 'calc(100% - 4px)' }}>
      {/* Title section - sticky */}
      <div className={`sticky top-0 z-20 backdrop-blur-sm flex-shrink-0 shadow-sm rounded-t-lg transition-colors duration-200 ${isDark ? "bg-[#000000]/95" : "bg-white/95"}`}>
        <div className="px-2 pt-2 pb-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center gap-2 flex-1">
              <h2 className={`text-sm font-bold ${t.text.subheading}`}>Heritage Sites</h2>
              {onExpandTable && (
                <button
                  onClick={onExpandTable}
                  className="text-[#009639] hover:text-[#007b2f] p-1 transition-colors"
                  title="Expand table to see all columns"
                  aria-label="Expand table to see all columns"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                    />
                  </svg>
                </button>
              )}
            </div>
            {variant === "expanded" && (
              <div className="flex items-center gap-2 mr-12">
                <select
                  value={selectedExportFormat}
                  onChange={(e) => setSelectedExportFormat(e.target.value as ExportFormatId)}
                  className={`px-2 py-1 text-[10px] rounded border ${t.border.default} ${t.bg.primary} ${t.text.body} focus:outline-none focus:ring-1 focus:ring-[#009639] transition-colors duration-200`}
                  title="Select export format"
                  aria-label="Select export format"
                >
                  {exportConfigs.map((config) => (
                    <option key={config.id} value={config.id}>
                      {config.icon} {config.label}
                    </option>
                  ))}
                </select>
                <Button
                  onClick={handleExport}
                  variant="primary"
                  size="xs"
                  title={`Export table data to ${exportConfigs.find(c => c.id === selectedExportFormat)?.label} file`}
                  aria-label={`Export to ${exportConfigs.find(c => c.id === selectedExportFormat)?.label}`}
                  icon={
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  }
                >
                  Export
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable table with sticky headers */}
      <div className="flex-1 overflow-y-auto pb-2" ref={tableContainerRef}>
        <table className={t.table.base}>
          <thead className="sticky top-0 z-10 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
            <tr>
              {isColumnVisible("type") && (
                <th
                  className={`${COMPACT_TABLE.headerX} ${COMPACT_TABLE.headerY} ${COMPACT_TABLE.headerText} cursor-pointer select-none text-center transition-colors duration-200 hover:bg-gray-700/30`}
                  onClick={() => handleSort("type")}
                  style={{ width: `${TABLE_CONFIG.TYPE_COLUMN_WIDTH}px` }}
                >
                  Type
                  <SortIcon field="type" />
                </th>
              )}
              {isColumnVisible("name") && (
                <th
                  className={`pl-2 pr-1 ${COMPACT_TABLE.headerY} ${COMPACT_TABLE.headerText} cursor-pointer select-none transition-colors duration-200 hover:bg-gray-700/30`}
                  onClick={() => handleSort("name")}
                  style={{ width: variant === "compact" ? "200px" : "auto", maxWidth: variant === "compact" ? "200px" : "none" }}
                >
                  Site Name
                  <SortIcon field="name" />
                </th>
              )}
              {isColumnVisible("status") && (
                <th
                  className={`${COMPACT_TABLE.headerX} ${COMPACT_TABLE.headerY} ${COMPACT_TABLE.headerText} cursor-pointer select-none transition-colors duration-200 hover:bg-gray-700/30`}
                  onClick={() => handleSort("status")}
                >
                  Status
                  <SortIcon field="status" />
                </th>
              )}
              {isColumnVisible("dateDestroyed") && (
                <th
                  className={`${COMPACT_TABLE.headerX} ${COMPACT_TABLE.headerY} ${COMPACT_TABLE.headerText} cursor-pointer select-none transition-colors duration-200 hover:bg-gray-700/30`}
                  onClick={() => handleSort("dateDestroyed")}
                >
                  {visibleColumns
                    ? "Destruction Date"
                    : variant === "compact"
                      ? "Destruction Date"
                      : "Destruction Date (Gregorian)"}
                  <SortIcon field="dateDestroyed" />
                </th>
              )}
              {isColumnVisible("dateDestroyedIslamic") && (
                <th
                  className={`${COMPACT_TABLE.headerX} ${COMPACT_TABLE.headerY} ${COMPACT_TABLE.headerText} cursor-pointer select-none transition-colors duration-200 hover:bg-gray-700/30`}
                  onClick={() => handleSort("dateDestroyedIslamic")}
                >
                  Destruction Date (Islamic)
                  <SortIcon field="dateDestroyedIslamic" />
                </th>
              )}
              {isColumnVisible("yearBuilt") && (
                <th
                  className={`${COMPACT_TABLE.headerX} ${COMPACT_TABLE.headerY} ${COMPACT_TABLE.headerText} cursor-pointer select-none transition-colors duration-200 hover:bg-gray-700/30`}
                  onClick={() => handleSort("yearBuilt")}
                >
                  Built (Gregorian)
                  <SortIcon field="yearBuilt" />
                </th>
              )}
              {isColumnVisible("yearBuiltIslamic") && (
                <th
                  className={`${COMPACT_TABLE.headerX} ${COMPACT_TABLE.headerY} ${COMPACT_TABLE.headerText} cursor-pointer select-none transition-colors duration-200 hover:bg-gray-700/30`}
                  onClick={() => handleSort("yearBuiltIslamic")}
                >
                  Built (Islamic)
                  <SortIcon field="yearBuiltIslamic" />
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedSites.map((site) => (
              <tr
                key={site.id}
                ref={highlightedSiteId === site.id ? highlightedRowRef : null}
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
                {isColumnVisible("type") && (
                  <td className={`${COMPACT_TABLE.cellX} ${COMPACT_TABLE.cellY} text-center`}>
                    <Tooltip content={getSiteTypeLabel(site.type)}>
                      <span className="inline-flex items-center justify-center">
                        <SiteTypeIcon type={site.type} className={`w-4 h-4 ${t.text.body}`} />
                      </span>
                    </Tooltip>
                  </td>
                )}
                {isColumnVisible("name") && (
                  <td className={`pl-2 pr-1 ${COMPACT_TABLE.cellY}`}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSiteClick(site);
                      }}
                      className="text-left w-full hover:underline"
                    >
                      <div className={`font-semibold ${COMPACT_TABLE.text} text-[#009639] hover:text-[#007b2f]`}>{site.name}</div>
                      {site.nameArabic && (
                        <div
                          className={`text-[10px] ${t.text.muted} mt-0.5`}
                          dir="rtl"
                        >
                          {site.nameArabic}
                        </div>
                      )}
                    </button>
                  </td>
                )}
                {isColumnVisible("status") && (
                  <td className={`${COMPACT_TABLE.cellX} ${COMPACT_TABLE.cellY}`}>
                    <span
                      className={`font-semibold capitalize ${COMPACT_TABLE.text}`}
                      style={{ color: getStatusHexColor(site.status) }}
                    >
                      {site.status.replace("-", " ")}
                    </span>
                  </td>
                )}
                {isColumnVisible("dateDestroyed") && (
                  <td className={`${COMPACT_TABLE.cellX} ${COMPACT_TABLE.cellY} ${COMPACT_TABLE.text} ${t.text.subheading}`}>
                    {formatDateStandard(site.dateDestroyed)}
                  </td>
                )}
                {isColumnVisible("dateDestroyedIslamic") && (
                  <td className={`${COMPACT_TABLE.cellX} ${COMPACT_TABLE.cellY} ${COMPACT_TABLE.text} ${t.text.subheading}`}>
                    {site.dateDestroyedIslamic || "N/A"}
                  </td>
                )}
                {isColumnVisible("yearBuilt") && (
                  <td className={`${COMPACT_TABLE.cellX} ${COMPACT_TABLE.cellY} ${COMPACT_TABLE.text} ${t.text.subheading}`}>{site.yearBuilt}</td>
                )}
                {isColumnVisible("yearBuiltIslamic") && (
                  <td className={`${COMPACT_TABLE.cellX} ${COMPACT_TABLE.cellY} ${COMPACT_TABLE.text} ${t.text.subheading}`}>
                    {site.yearBuiltIslamic || "N/A"}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
