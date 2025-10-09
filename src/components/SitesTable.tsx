import { useState, useMemo } from "react";
import type { GazaSite } from "../types";
import { components, getStatusHexColor } from "../styles/theme";
import { useCalendar } from "../contexts/CalendarContext";

interface SitesTableProps {
  sites: GazaSite[];
  onSiteClick: (site: GazaSite) => void;
  onSiteHighlight?: (siteId: string | null) => void;
  highlightedSiteId?: string | null;
  onExpandTable?: () => void;
  variant?: "compact" | "expanded";
}

type SortField = "name" | "type" | "status" | "dateDestroyed";
type SortDirection = "asc" | "desc";

/**
 * Table view of heritage sites with click-to-view-details and sorting
 * Supports compact (3 columns) and expanded (all columns) variants
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
      <span className="text-[#16a34a] ml-1">
        {sortDirection === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  return (
    <div className="h-full flex flex-col border-2 border-gray-300 rounded-lg bg-white shadow-sm">
      <div className="mb-4 flex-shrink-0 px-2 pt-4">
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-xl font-bold text-gray-800">Heritage Sites</h2>
          {onExpandTable && (
            <button
              onClick={onExpandTable}
              className="text-[#16a34a] hover:text-[#15803d] p-1 transition-colors"
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
                {variant === "compact" ? "Destroyed" : "Destroyed (Gregorian)"}
                <SortIcon field="dateDestroyed" />
              </th>
              {variant === "expanded" && (
                <th className={components.table.th}>
                  Destroyed (Islamic)
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
              {variant === "expanded" && (
                <th className={components.table.th}>
                  Actions
                </th>
              )}
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
                  {variant === "compact" ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSiteClick(site);
                      }}
                      className="text-left w-full hover:text-[#15803d] transition-colors"
                    >
                      <div className="font-semibold text-gray-900 hover:underline">{site.name}</div>
                      {site.nameArabic && (
                        <div className="text-xs text-gray-600 mt-1" dir="rtl">
                          {site.nameArabic}
                        </div>
                      )}
                    </button>
                  ) : (
                    <div>
                      <div className="font-semibold text-gray-900">{site.name}</div>
                      {site.nameArabic && (
                        <div className="text-sm text-gray-600 mt-1" dir="rtl">
                          {site.nameArabic}
                        </div>
                      )}
                    </div>
                  )}
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
                    site.dateDestroyed ? (
                      calendarType === "islamic" && site.dateDestroyedIslamic
                        ? site.dateDestroyedIslamic
                        : new Date(site.dateDestroyed).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                    ) : (
                      "N/A"
                    )
                  ) : (
                    // Expanded: Always show Gregorian date
                    site.dateDestroyed ? (
                      new Date(site.dateDestroyed).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    ) : (
                      "N/A"
                    )
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
                {variant === "expanded" && (
                  <td className={components.table.td}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSiteClick(site);
                      }}
                      className="text-[#16a34a] hover:text-[#15803d] hover:underline font-medium text-sm"
                    >
                      See more
                    </button>
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
