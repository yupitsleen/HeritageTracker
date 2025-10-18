import { useState, useMemo } from "react";
import type { GazaSite } from "../../types";
import { getStatusHexColor } from "../../styles/theme";
import { formatDateCompact, formatDateLong } from "../../utils/format";
import { useThemeClasses } from "../../hooks/useThemeClasses";

interface SitesTableMobileProps {
  sites: GazaSite[];
}

type SortField = "name" | "dateDestroyed";
type SortDirection = "asc" | "desc";

/**
 * Mobile accordion variant of sites table
 * Features: Collapsible rows, status-colored names, sortable columns
 */
export function SitesTableMobile({ sites }: SitesTableMobileProps) {
  const t = useThemeClasses();
  const [sortField, setSortField] = useState<SortField>("dateDestroyed");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

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
      return <span className={`${t.icon.default} ml-1`}>↕</span>;
    }
    return <span className="text-[#009639] ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <div className="flex flex-col">
      {/* Non-sticky header - centered */}
      <div className={`pb-3 mb-3 border-b-2 ${t.border.subtle}`}>
        <h2 className={`text-lg font-bold ${t.text.subheading} text-center`}>Heritage Sites</h2>
        <p className={`text-xs ${t.text.muted} text-center`}>
          Showing {sortedSites.length} site{sortedSites.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Sticky column headers with sorting */}
      <div className={`sticky top-[85px] ${t.bg.primary} z-40 border-b-2 ${t.border.subtle} pb-2 mb-2 shadow-sm`}>
        <div className="grid grid-cols-[1fr_auto] gap-3 px-3 py-2">
          <div
            className={`text-xs font-bold ${t.text.body} uppercase cursor-pointer hover:${t.text.heading} select-none flex items-center gap-1`}
            onClick={() => handleSort("name")}
          >
            Site Name
            <SortIcon field="name" />
          </div>
          <div
            className={`text-xs font-bold ${t.text.body} uppercase whitespace-nowrap cursor-pointer hover:${t.text.heading} select-none flex items-center gap-1`}
            onClick={() => handleSort("dateDestroyed")}
          >
            Destruction Date
            <SortIcon field="dateDestroyed" />
          </div>
        </div>
      </div>

      {/* Mobile accordion table */}
      <div className="space-y-2">
        {sortedSites.map((site, index) => (
          <div
            key={site.id}
            className="border-2 border-[#fecaca] rounded-lg overflow-hidden"
            style={{ backgroundColor: index % 2 === 0 ? "#fee2e2" : "#ffffff" }}
          >
            {/* Collapsed row - clickable to expand */}
            <div
              className="grid grid-cols-[1fr_auto_auto] gap-3 p-3 items-center cursor-pointer hover:bg-[#fecaca]"
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
                  <div className={`text-xs ${t.text.muted} truncate text-left`} lang="ar">
                    {site.nameArabic}
                  </div>
                )}
              </div>

              {/* Date */}
              <div className={`text-xs ${t.text.body} whitespace-nowrap`}>
                {formatDateCompact(site.dateDestroyed)}
              </div>

              {/* Chevron indicator */}
              <div className={t.icon.default}>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    expandedRowId === site.id ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Expanded details - full site information */}
            {expandedRowId === site.id && (
              <div className={`border-t-2 ${t.border.default} p-4 ${t.bg.secondary} space-y-3`}>
                {/* Site Name (Full) */}
                <div className="text-center">
                  <h3 className={`font-bold text-base ${t.text.heading}`}>{site.name}</h3>
                  {site.nameArabic && (
                    <p className={`text-sm ${t.text.body} mt-1`}>{site.nameArabic}</p>
                  )}
                </div>

                {/* Type */}
                <div>
                  <span className={`text-xs font-semibold ${t.text.muted} uppercase`}>Type:</span>
                  <p className={`text-sm ${t.text.heading} capitalize`}>
                    {site.type.replace("-", " ")}
                  </p>
                </div>

                {/* Status */}
                <div>
                  <span className={`text-xs font-semibold ${t.text.muted} uppercase`}>Status:</span>
                  <p
                    className="text-sm font-semibold capitalize"
                    style={{ color: getStatusHexColor(site.status) }}
                  >
                    {site.status.replace("-", " ")}
                  </p>
                </div>

                {/* Year Built */}
                <div>
                  <span className={`text-xs font-semibold ${t.text.muted} uppercase`}>
                    Year Built:
                  </span>
                  <p className={`text-sm ${t.text.heading}`}>{site.yearBuilt}</p>
                  {site.yearBuiltIslamic && (
                    <p className={`text-xs ${t.text.muted}`}>Islamic: {site.yearBuiltIslamic}</p>
                  )}
                </div>

                {/* Date Destroyed */}
                <div>
                  <span className={`text-xs font-semibold ${t.text.muted} uppercase`}>
                    Date Destroyed:
                  </span>
                  <p className={`text-sm ${t.text.heading}`}>{formatDateLong(site.dateDestroyed)}</p>
                  {site.dateDestroyedIslamic && (
                    <p className={`text-xs ${t.text.muted}`}>Islamic: {site.dateDestroyedIslamic}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <span className={`text-xs font-semibold ${t.text.muted} uppercase`}>
                    Description:
                  </span>
                  <p className={`text-sm ${t.text.heading} mt-1`}>{site.description}</p>
                </div>

                {/* Coordinates */}
                <div>
                  <span className={`text-xs font-semibold ${t.text.muted} uppercase`}>
                    Coordinates:
                  </span>
                  <p className={`text-sm ${t.text.heading}`}>
                    {site.coordinates[0].toFixed(6)}, {site.coordinates[1].toFixed(6)}
                  </p>
                </div>

                {/* Sources */}
                {site.sources && site.sources.length > 0 && (
                  <div>
                    <span className={`text-xs font-semibold ${t.text.muted} uppercase`}>
                      Sources:
                    </span>
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
                            <span className={`text-xs ${t.text.muted} ml-2`}>
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
                    <span className={`text-xs font-semibold ${t.text.muted} uppercase`}>
                      Verified By:
                    </span>
                    <p className={`text-sm ${t.text.heading}`}>{site.verifiedBy.join(", ")}</p>
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
