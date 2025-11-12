import { useMemo } from "react";
import type { Site } from "../../types";
import { useTheme } from "../../contexts/ThemeContext";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import { useTranslation } from "../../contexts/LocaleContext";
import { useTableSort } from "../../hooks/useTableSort";
import { useTableScroll } from "../../hooks/useTableScroll";
import { useTableExport } from "../../hooks/useTableExport";
import { TableHeader } from "./TableHeader";
import { TableRow } from "./TableRow";
import { ExportControls } from "./ExportControls";
import { VirtualizedTableBody } from "./VirtualizedTableBody";
import { InfoIconWithTooltip } from "../Icons/InfoIconWithTooltip";

// Threshold for enabling virtual scrolling
const VIRTUAL_SCROLL_THRESHOLD = 100;

interface SitesTableDesktopProps {
  sites: Site[];
  onSiteClick?: (site: Site) => void;
  onSiteHighlight?: (siteId: string | null) => void;
  highlightedSiteId?: string | null;
  onExpandTable?: () => void;
  variant: "compact" | "expanded";
  visibleColumns?: string[]; // For resizable table - which columns to show
}

/**
 * Desktop table variant for heritage sites
 * Supports compact (sidebar) and expanded (modal) layouts
 *
 * Responsibilities:
 * - Layout and styling
 * - Column visibility logic
 * - Coordination of sub-components
 *
 * Extracted responsibilities:
 * - Sort logic → useTableSort hook
 * - Scroll behavior → useTableScroll hook
 * - Export logic → useTableExport hook
 * - Header rendering → TableHeader component
 * - Row rendering → TableRow component
 * - Export UI → ExportControls component
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
  const translate = useTranslation();

  // Sort logic
  const { sortField, sortDirection, handleSort, sortedSites } = useTableSort<Site>(sites, "dateDestroyed", "desc");

  // Scroll to highlighted row
  const { tableContainerRef, highlightedRowRef } = useTableScroll(highlightedSiteId);

  // Export functionality
  const { selectedExportFormat, setSelectedExportFormat, exportConfigs, handleExport } =
    useTableExport(sortedSites);

  // Helper to determine visible columns (memoized for performance)
  const visibleColumnsSet = useMemo(() => {
    // If visibleColumns not provided (modal), use variant logic
    if (!visibleColumns) {
      if (variant === "expanded") {
        // All columns visible in expanded mode
        return new Set(["type", "name", "status", "dateDestroyed", "dateDestroyedIslamic", "yearBuilt", "yearBuiltIslamic", "lastUpdated"]);
      }
      // Compact mode: only essential columns
      return new Set(["name", "status", "dateDestroyed"]);
    }

    // Use provided visible columns
    return new Set(visibleColumns);
  }, [variant, visibleColumns]);

  // Helper to check if column is visible
  const isColumnVisible = (columnName: string) => visibleColumnsSet.has(columnName);

  // Determine if we should use virtual scrolling
  const shouldUseVirtualScroll = sortedSites.length > VIRTUAL_SCROLL_THRESHOLD;

  return (
    <div
      className={`flex flex-col backdrop-blur-sm border ${t.border.primary} rounded shadow-lg transition-colors duration-200 ${isDark ? "bg-[#000000]/95" : "bg-white/95"}`}
      style={{ height: 'calc(100% - 4px)' }}
    >
      {/* Title section - sticky */}
      <div className={`sticky top-0 z-20 backdrop-blur-sm flex-shrink-0 shadow-sm rounded-t-lg transition-colors duration-200 ${isDark ? "bg-[#000000]/95" : "bg-white/95"}`}>
        <div className="px-2 pt-2 pb-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center gap-2 flex-1">
              <h2 className={`text-sm font-bold ${t.text.subheading}`}>{translate("table.heritageSites")}</h2>
              {onExpandTable && (
                <button
                  onClick={onExpandTable}
                  className="text-[#009639] hover:text-[#007b2f] p-1 transition-colors"
                  title={translate("table.expandTable")}
                  aria-label={translate("table.expandTable")}
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
              <InfoIconWithTooltip
                tooltip={translate("table.tooltip")}
              />
            </div>
            {variant === "expanded" && (
              <ExportControls
                selectedFormat={selectedExportFormat}
                onFormatChange={setSelectedExportFormat}
                onExport={handleExport}
                exportConfigs={exportConfigs}
              />
            )}
          </div>
        </div>
      </div>

      {/* Scrollable table with sticky headers */}
      <div className="flex-1 overflow-y-auto pb-2" ref={tableContainerRef}>
        {shouldUseVirtualScroll ? (
          // Virtual scrolling for 100+ sites
          <div>
            <table className={t.table.base}>
              <TableHeader
                visibleColumns={visibleColumnsSet}
                variant={variant}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
            </table>
            <VirtualizedTableBody
              sites={sortedSites}
              onSiteClick={onSiteClick}
              onSiteHighlight={onSiteHighlight}
              highlightedSiteId={highlightedSiteId}
              variant={variant}
              isColumnVisible={isColumnVisible}
            />
          </div>
        ) : (
          // Standard rendering for < 100 sites
          <table className={t.table.base}>
            <TableHeader
              visibleColumns={visibleColumnsSet}
              variant={variant}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <tbody>
              {sortedSites.map((site) => (
                <TableRow
                  key={site.id}
                  site={site}
                  isHighlighted={highlightedSiteId === site.id}
                  visibleColumns={visibleColumnsSet}
                  onSiteClick={onSiteClick}
                  onSiteHighlight={onSiteHighlight}
                  rowRef={highlightedSiteId === site.id ? highlightedRowRef : undefined}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
