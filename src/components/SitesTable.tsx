import { useState, useMemo } from "react";
import type { GazaSite } from "../types";
import { components, getStatusHexColor } from "../styles/theme";
import { useCalendar } from "../contexts/CalendarContext";
import { formatDateCompact, formatDateStandard, formatDateLong } from "../utils/format";

interface SitesTableProps {
  sites: GazaSite[];
  onSiteClick: (site: GazaSite) => void;
  onSiteHighlight?: (siteId: string | null) => void;
  highlightedSiteId?: string | null;
  onExpandTable?: () => void;
  variant?: "compact" | "expanded" | "mobile";
}

type SortField = "name" | "type" | "status" | "dateDestroyed";
type SortDirection = "asc" | "desc";

/**
 * Table view of heritage sites with click-to-view-details and sorting
 * Supports compact, expanded, and mobile accordion variants
 *
 * @variant compact - Desktop sidebar table (Name, Status, Destruction Date, Actions)
 * @variant expanded - Full modal table with all fields (Type, Islamic dates, Built dates)
 * @variant mobile - Accordion list for screens < 768px (Name/Type/Date collapsed, tap to expand for full details)
 *
 * Mobile features: Status shown via name color, sortable columns, sticky headers, inline detail expansion
 */
export function SitesTable({
  sites,
  onSiteClick,
  onSiteHighlight,
  highlightedSiteId,
  onExpandTable,
  variant = "compact",
}: SitesTableProps) {
  const [sortField, setSortField] = useState<SortField>("dateDestroyed");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const { calendarType } = useCalendar();

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if clicking same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Default to ascending for new field
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
    return (
      <span className="text-[#009639] ml-1">
        {sortDirection === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  // Mobile accordion variant
  if (variant === "mobile") {
    return (
      <div className="flex flex-col">
        {/* Non-sticky header - centered */}
        <div className="pb-3 mb-3 border-b-2 border-gray-300">
          <h2 className="text-lg font-bold text-gray-800 text-center">Heritage Sites</h2>
          <p className="text-xs text-gray-600 text-center">
            Showing {sortedSites.length} site{sortedSites.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Sticky column headers with sorting */}
        <div className="sticky top-[85px] bg-white z-40 border-b-2 border-gray-300 pb-2 mb-2 shadow-sm">
          <div className="grid grid-cols-[1fr_auto] gap-3 px-3 py-2">
            <div
              className="text-xs font-bold text-gray-700 uppercase cursor-pointer hover:text-gray-900 select-none flex items-center gap-1"
              onClick={() => handleSort("name")}
            >
              Site Name
              <SortIcon field="name" />
            </div>
            <div
              className="text-xs font-bold text-gray-700 uppercase whitespace-nowrap cursor-pointer hover:text-gray-900 select-none flex items-center gap-1"
              onClick={() => handleSort("dateDestroyed")}
            >
              Date
              <SortIcon field="dateDestroyed" />
            </div>
          </div>
        </div>

        {/* Mobile accordion table */}
        <div className="space-y-2">
          {sortedSites.map((site) => (
            <div
              key={site.id}
              className="border-2 border-gray-300 rounded-lg bg-white overflow-hidden"
            >
              {/* Collapsed row - clickable to expand */}
              <div
                className="grid grid-cols-[1fr_auto_auto] gap-3 p-3 items-center cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedRowId(expandedRowId === site.id ? null : site.id)}
              >
                {/* Site Name - color-coded by status */}
                <div className="min-w-0">
                  <div
                    className="font-semibold text-xs truncate"
                    style={{ color: getStatusHexColor(site.status) }}
                  >
                    {site.name}
                  </div>
                  {site.nameArabic && (
                    <div className="text-xs text-gray-600 truncate text-left" lang="ar">
                      {site.nameArabic}
                    </div>
                  )}
                </div>

                {/* Date */}
                <div className="text-xs text-gray-700 whitespace-nowrap">
                  {formatDateCompact(site.dateDestroyed)}
                </div>

                {/* Chevron indicator */}
                <div className="text-gray-400">
                  <svg
                    className={`w-4 h-4 transition-transform ${expandedRowId === site.id ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Expanded details - full site information */}
              {expandedRowId === site.id && (
                <div className="border-t-2 border-gray-200 p-4 bg-gray-50 space-y-3">
                  {/* Site Name (Full) */}
                  <div className="text-center">
                    <h3 className="font-bold text-base text-gray-900">{site.name}</h3>
                    {site.nameArabic && (
                      <p className="text-sm text-gray-700 mt-1">{site.nameArabic}</p>
                    )}
                  </div>

                  {/* Type */}
                  <div>
                    <span className="text-xs font-semibold text-gray-600 uppercase">Type:</span>
                    <p className="text-sm text-gray-900 capitalize">{site.type.replace("-", " ")}</p>
                  </div>

                  {/* Status */}
                  <div>
                    <span className="text-xs font-semibold text-gray-600 uppercase">Status:</span>
                    <p className="text-sm font-semibold capitalize" style={{ color: getStatusHexColor(site.status) }}>
                      {site.status.replace("-", " ")}
                    </p>
                  </div>

                  {/* Year Built */}
                  <div>
                    <span className="text-xs font-semibold text-gray-600 uppercase">Year Built:</span>
                    <p className="text-sm text-gray-900">{site.yearBuilt}</p>
                    {site.yearBuiltIslamic && (
                      <p className="text-xs text-gray-600">Islamic: {site.yearBuiltIslamic}</p>
                    )}
                  </div>

                  {/* Date Destroyed */}
                  <div>
                    <span className="text-xs font-semibold text-gray-600 uppercase">Date Destroyed:</span>
                    <p className="text-sm text-gray-900">
                      {formatDateLong(site.dateDestroyed)}
                    </p>
                    {site.dateDestroyedIslamic && (
                      <p className="text-xs text-gray-600">Islamic: {site.dateDestroyedIslamic}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <span className="text-xs font-semibold text-gray-600 uppercase">Description:</span>
                    <p className="text-sm text-gray-900 mt-1">{site.description}</p>
                  </div>

                  {/* Location */}
                  <div>
                    <span className="text-xs font-semibold text-gray-600 uppercase">Location:</span>
                    <p className="text-sm text-gray-900">{site.originalLocation}</p>
                    <p className="text-xs text-gray-600">
                      {site.coordinates[0].toFixed(6)}, {site.coordinates[1].toFixed(6)}
                    </p>
                  </div>

                  {/* Sources */}
                  {site.sources && site.sources.length > 0 && (
                    <div>
                      <span className="text-xs font-semibold text-gray-600 uppercase">Sources:</span>
                      <ul className="mt-1 space-y-1">
                        {site.sources.map((source, idx) => (
                          <li key={idx} className="text-sm">
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#009639] hover:underline"
                            >
                              {source.title}
                            </a>
                            {source.date && (
                              <span className="text-xs text-gray-600 ml-2">
                                ({new Date(source.date).toLocaleDateString()})
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Verified By */}
                  {site.verifiedBy && site.verifiedBy.length > 0 && (
                    <div>
                      <span className="text-xs font-semibold text-gray-600 uppercase">Verified By:</span>
                      <p className="text-sm text-gray-900">{site.verifiedBy.join(", ")}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Desktop variants (compact/expanded)
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="mb-4 flex-shrink-0 px-2 pt-4">
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-xl font-bold text-gray-800">Heritage Sites</h2>
          {onExpandTable && (
            <button
              onClick={onExpandTable}
              className="text-[#009639] hover:text-[#007b2f] p-1 transition-colors"
              title="Expand table to see all columns"
              aria-label="Expand table to see all columns"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <table className={components.table.base}>
          <thead className={components.table.header}>
            <tr>
              <th
                className={`${components.table.th} cursor-pointer hover:bg-gray-100 select-none`}
                onClick={() => handleSort("name")}
              >
                Site Name
                <SortIcon field="name" />
              </th>
              {variant === "expanded" && (
                <th
                  className={`${components.table.th} cursor-pointer hover:bg-gray-100 select-none`}
                  onClick={() => handleSort("type")}
                >
                  Type
                  <SortIcon field="type" />
                </th>
              )}
              <th
                className={`${components.table.th} cursor-pointer hover:bg-gray-100 select-none`}
                onClick={() => handleSort("status")}
              >
                Status
                <SortIcon field="status" />
              </th>
              <th
                className={`${components.table.th} cursor-pointer hover:bg-gray-100 select-none`}
                onClick={() => handleSort("dateDestroyed")}
              >
                {variant === "compact" ? "Destruction Date" : "Destruction Date (Gregorian)"}
                <SortIcon field="dateDestroyed" />
              </th>
              {variant === "expanded" && (
                <th className={components.table.th}>
                  Destruction Date (Islamic)
                </th>
              )}
              {variant === "expanded" && (
                <th className={components.table.th}>
                  Built (Gregorian)
                </th>
              )}
              {variant === "expanded" && (
                <th className={components.table.th}>
                  Built (Islamic)
                </th>
              )}
              <th className={components.table.th}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedSites.map((site) => (
              <tr
                key={site.id}
                className={`${components.table.row} ${
                  highlightedSiteId === site.id ? "ring-2 ring-black ring-inset" : ""
                }`}
                onClick={() => {
                  onSiteHighlight?.(site.id);
                }}
              >
                <td className={components.table.td}>
                  <div>
                    <div className="font-semibold text-gray-900">{site.name}</div>
                    {site.nameArabic && (
                      <div className={`${variant === "compact" ? "text-xs" : "text-sm"} text-gray-600 mt-1`} dir="rtl">
                        {site.nameArabic}
                      </div>
                    )}
                  </div>
                </td>
                {variant === "expanded" && (
                  <td className={components.table.td}>
                    <span className="capitalize">
                      {site.type.replace("-", " ")}
                    </span>
                  </td>
                )}
                <td className={components.table.td}>
                  <span
                    className="font-semibold capitalize text-sm"
                    style={{ color: getStatusHexColor(site.status) }}
                  >
                    {site.status.replace("-", " ")}
                  </span>
                </td>
                <td className={`${components.table.td} text-sm`}>
                  {variant === "compact" ? (
                    // Compact: Show date based on calendar toggle
                    site.dateDestroyed && calendarType === "islamic" && site.dateDestroyedIslamic
                      ? site.dateDestroyedIslamic
                      : formatDateStandard(site.dateDestroyed)
                  ) : (
                    // Expanded: Always show Gregorian date
                    formatDateStandard(site.dateDestroyed)
                  )}
                </td>
                {variant === "expanded" && (
                  <td className={`${components.table.td} text-sm`}>
                    {site.dateDestroyedIslamic || "N/A"}
                  </td>
                )}
                {variant === "expanded" && (
                  <td className={`${components.table.td} text-sm`}>
                    {site.yearBuilt}
                  </td>
                )}
                {variant === "expanded" && (
                  <td className={`${components.table.td} text-sm`}>
                    {site.yearBuiltIslamic || "N/A"}
                  </td>
                )}
                <td className={components.table.td}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSiteClick(site);
                    }}
                    className="text-[#009639] hover:text-[#007b2f] hover:underline font-medium text-sm"
                  >
                    See more
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
