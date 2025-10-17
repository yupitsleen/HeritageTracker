import { useState, useMemo, useEffect, useRef } from "react";
import type { GazaSite } from "../../types";
import { components, getStatusHexColor } from "../../styles/theme";
import { formatDateStandard } from "../../utils/format";
import { downloadCSV } from "../../utils/csvExport";
import { Tooltip } from "../Tooltip";
import { TABLE_CONFIG } from "../../constants/layout";

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
  const [sortField, setSortField] = useState<SortField>("dateDestroyed");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const highlightedRowRef = useRef<HTMLTableRowElement>(null);

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
      return <span className="text-gray-400 ml-1">↕</span>;
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

  // Scroll to highlighted site when it changes
  useEffect(() => {
    if (!highlightedSiteId || !highlightedRowRef.current || !tableContainerRef.current) return;

    highlightedRowRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [highlightedSiteId]);

  return (
    <div className="flex flex-col bg-white/50 backdrop-blur-sm border-2 border-[#000000] rounded-lg shadow-xl" style={{ height: 'calc(100% - 4px)' }}>
      {/* Title section - sticky */}
      <div className="sticky top-0 z-20 bg-white/50 backdrop-blur-sm flex-shrink-0 shadow-sm rounded-t-lg">
        <div className="px-2 pt-4 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center gap-2 flex-1">
              <h2 className="text-xl font-bold text-gray-800">Heritage Sites</h2>
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
              <button
                onClick={() => downloadCSV(sortedSites)}
                className="flex items-center gap-2
                           px-4 py-2 bg-[#009639] hover:bg-[#007b2f] text-white
                           rounded-lg shadow-md hover:shadow-lg
                           transition-all duration-200 font-semibold
                           active:scale-95 text-sm"
                title="Export table data to CSV file"
                aria-label="Export to CSV"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Export CSV
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable table with sticky headers */}
      <div className="flex-1 overflow-y-auto pb-2" ref={tableContainerRef}>
        <table className={components.table.base}>
          <thead className="sticky top-0 z-10 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
            <tr>
              {isColumnVisible("name") && (
                <th
                  className="px-4 py-3 font-semibold cursor-pointer hover:bg-gray-700/50 select-none text-sm transition-colors duration-200"
                  onClick={() => handleSort("name")}
                >
                  Site Name
                  <SortIcon field="name" />
                </th>
              )}
              {isColumnVisible("type") && (
                <th
                  className="px-2 py-3 font-semibold cursor-pointer hover:bg-gray-700/50 select-none text-sm text-center transition-colors duration-200"
                  onClick={() => handleSort("type")}
                  style={{ width: `${TABLE_CONFIG.TYPE_COLUMN_WIDTH}px` }}
                >
                  Type
                  <SortIcon field="type" />
                </th>
              )}
              {isColumnVisible("status") && (
                <th
                  className="px-4 py-3 font-semibold cursor-pointer hover:bg-gray-700/50 select-none text-sm transition-colors duration-200"
                  onClick={() => handleSort("status")}
                >
                  Status
                  <SortIcon field="status" />
                </th>
              )}
              {isColumnVisible("dateDestroyed") && (
                <th
                  className="px-4 py-3 font-semibold cursor-pointer hover:bg-gray-700/50 select-none text-sm transition-colors duration-200"
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
                  className="px-4 py-3 font-semibold cursor-pointer hover:bg-gray-700/50 select-none text-sm transition-colors duration-200"
                  onClick={() => handleSort("dateDestroyedIslamic")}
                >
                  Destruction Date (Islamic)
                  <SortIcon field="dateDestroyedIslamic" />
                </th>
              )}
              {isColumnVisible("yearBuilt") && (
                <th
                  className="px-4 py-3 font-semibold cursor-pointer hover:bg-gray-700/50 select-none text-sm transition-colors duration-200"
                  onClick={() => handleSort("yearBuilt")}
                >
                  Built (Gregorian)
                  <SortIcon field="yearBuilt" />
                </th>
              )}
              {isColumnVisible("yearBuiltIslamic") && (
                <th
                  className="px-4 py-3 font-semibold cursor-pointer hover:bg-gray-700/50 select-none text-sm transition-colors duration-200"
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
                className={`border-b border-gray-100
                            hover:bg-gray-50/60 transition-colors duration-150
                            ${highlightedSiteId === site.id
                              ? "bg-green-50/60 ring-2 ring-[#009639] ring-inset"
                              : "bg-white/50"
                            }`}
                onClick={() => {
                  onSiteHighlight?.(site.id);
                }}
              >
                {isColumnVisible("name") && (
                  <td className={components.table.td}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSiteClick(site);
                      }}
                      className="text-left w-full hover:underline"
                    >
                      <div className="font-semibold text-[#009639] hover:text-[#007b2f]">{site.name}</div>
                      {site.nameArabic && (
                        <div
                          className={`${
                            variant === "compact" ? "text-xs" : "text-sm"
                          } text-gray-600 mt-1`}
                          dir="rtl"
                        >
                          {site.nameArabic}
                        </div>
                      )}
                    </button>
                  </td>
                )}
                {isColumnVisible("type") && (
                  <td className={`${components.table.td} text-center`}>
                    <Tooltip
                      content={site.type.replace("-", " ").split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    >
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700">
                        {site.type === "mosque" ? "🕌" :
                         site.type === "church" ? "⛪" :
                         site.type === "archaeological" ? "🏛️" :
                         site.type === "museum" ? "🏛️" :
                         site.type === "historic-building" ? "🏰" : site.type}
                      </span>
                    </Tooltip>
                  </td>
                )}
                {isColumnVisible("status") && (
                  <td className={components.table.td}>
                    <span
                      className="font-semibold capitalize text-sm"
                      style={{ color: getStatusHexColor(site.status) }}
                    >
                      {site.status.replace("-", " ")}
                    </span>
                  </td>
                )}
                {isColumnVisible("dateDestroyed") && (
                  <td className={`${components.table.td} text-sm`}>
                    {formatDateStandard(site.dateDestroyed)}
                  </td>
                )}
                {isColumnVisible("dateDestroyedIslamic") && (
                  <td className={`${components.table.td} text-sm`}>
                    {site.dateDestroyedIslamic || "N/A"}
                  </td>
                )}
                {isColumnVisible("yearBuilt") && (
                  <td className={`${components.table.td} text-sm`}>{site.yearBuilt}</td>
                )}
                {isColumnVisible("yearBuiltIslamic") && (
                  <td className={`${components.table.td} text-sm`}>
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
