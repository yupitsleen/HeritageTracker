import { lazy, Suspense } from "react";
import type { GazaSite } from "../../types";
import { cn, components } from "../../styles/theme";
import { Input } from "../Form/Input";
import { FilterTag } from "../FilterBar/FilterTag";
import { formatLabel } from "../../utils/format";
import { SitesTable } from "../SitesTable";
import { StatusLegend } from "../Map/StatusLegend";

// Lazy load heavy components
const HeritageMap = lazy(() =>
  import("../Map/HeritageMap").then((m) => ({ default: m.HeritageMap }))
);
const SiteDetailView = lazy(() =>
  import("../Map/SiteDetailView").then((m) => ({ default: m.SiteDetailView }))
);
const TimelineScrubber = lazy(() =>
  import("../Timeline/TimelineScrubber").then((m) => ({ default: m.TimelineScrubber }))
);

interface DesktopLayoutProps {
  // Filter state
  selectedTypes: Array<GazaSite["type"]>;
  selectedStatuses: Array<GazaSite["status"]>;
  searchTerm: string;
  setSelectedTypes: (types: Array<GazaSite["type"]>) => void;
  setSelectedStatuses: (statuses: Array<GazaSite["status"]>) => void;
  setSearchTerm: (term: string) => void;
  hasActiveFilters: boolean;
  clearAllFilters: () => void;
  openFilterModal: () => void;

  // Site data
  filteredSites: GazaSite[];
  totalSites: number;

  // Table props
  tableWidth: number;
  isResizing: boolean;
  handleResizeStart: () => void;
  getVisibleColumns: () => string[];
  onSiteClick: (site: GazaSite) => void;
  onSiteHighlight: (siteId: string | null) => void;
  highlightedSiteId: string | null;
  onExpandTable: () => void;
}

/**
 * Desktop layout with filter bar, resizable table, dual maps, and timeline
 * Three-column layout: Table (left, resizable) | HeritageMap (center) | SiteDetailView (right) | Timeline (below both maps)
 */
export function DesktopLayout({
  selectedTypes,
  selectedStatuses,
  searchTerm,
  setSelectedTypes,
  setSelectedStatuses,
  setSearchTerm,
  hasActiveFilters,
  clearAllFilters,
  openFilterModal,
  filteredSites,
  totalSites,
  tableWidth,
  isResizing,
  handleResizeStart,
  getVisibleColumns,
  onSiteClick,
  onSiteHighlight,
  highlightedSiteId,
  onExpandTable,
}: DesktopLayoutProps) {
  return (
    <div className="hidden md:block">
      {/* Filter bar with search, tags, and clear button */}
      <div className={cn(components.container.base, "pt-2 pb-1")}>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Filter Button */}
          <button
            onClick={openFilterModal}
            className="px-4 py-2 bg-[#009639] hover:bg-[#007b2f] text-white rounded-md transition-colors text-sm font-medium"
          >
            Filters
          </button>

          {/* Search bar - inline */}
          <div className="relative flex-1 max-w-xs">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search sites..."
              className="w-full pr-8 text-xs py-1 px-2"
            />
            {searchTerm.trim().length > 0 && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear search"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Active filter tags */}
          {selectedTypes.map((type) => (
            <FilterTag
              key={type}
              label={formatLabel(type)}
              onRemove={() => setSelectedTypes(selectedTypes.filter((t) => t !== type))}
              ariaLabel={`Remove ${type} filter`}
            />
          ))}
          {selectedStatuses.map((status) => (
            <FilterTag
              key={status}
              label={formatLabel(status)}
              onRemove={() =>
                setSelectedStatuses(selectedStatuses.filter((s) => s !== status))
              }
              ariaLabel={`Remove ${status} filter`}
            />
          ))}

          {/* Clear button */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="px-3 py-1.5 bg-[#ed3039] text-[#fefefe] rounded-md hover:bg-[#d4202a] transition-colors text-xs font-medium"
            >
              Clear
            </button>
          )}

          {/* Site count */}
          <span className="text-xs font-medium text-gray-600 ml-auto">
            Showing {filteredSites.length} of {totalSites} sites
          </span>
        </div>
      </div>

      {/* Three-column layout below FilterBar - Table | Heritage Map | Detail View */}
      <div className="flex gap-4">
        {/* Left Column - Sites Table (Resizable, RED outline with white inner border) */}
        <aside
          className="flex-shrink-0 pl-6 pt-3 relative"
          style={{ width: `${tableWidth}px` }}
        >
          <div className="border-4 border-[#ed3039] rounded-lg sticky top-[120px] max-h-[calc(100vh-120px)] overflow-y-auto z-10">
            <div className="border-2 border-white rounded-lg h-full overflow-y-auto">
              <SitesTable
                sites={filteredSites}
                onSiteClick={onSiteClick}
                onSiteHighlight={onSiteHighlight}
                highlightedSiteId={highlightedSiteId}
                onExpandTable={onExpandTable}
                visibleColumns={getVisibleColumns()}
              />
            </div>
          </div>

          {/* Resize handle */}
          <div
            className={`absolute top-3 right-0 w-2 h-full cursor-col-resize z-20 hover:bg-[#ed3039] hover:bg-opacity-30 transition-colors ${
              isResizing ? "bg-[#ed3039] bg-opacity-50" : ""
            }`}
            onMouseDown={handleResizeStart}
            title="Drag to resize table"
            aria-label="Resize table"
          />
        </aside>

        {/* Center & Right - Maps side by side + Timeline below */}
        <div className="flex-1 min-w-0 pr-6 pt-3">
          <div className="w-full sticky top-[120px]">
            <StatusLegend />

            {/* Two maps side by side */}
            <div className="flex gap-4">
              {/* Center - Heritage Map (Traditional/Satellite toggle) */}
              <div className="flex-1">
                <Suspense
                  fallback={
                    <div className="h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-gray-600 text-sm">Loading map...</div>
                    </div>
                  }
                >
                  <HeritageMap
                    sites={filteredSites}
                    onSiteClick={onSiteClick}
                    highlightedSiteId={highlightedSiteId}
                    onSiteHighlight={onSiteHighlight}
                  />
                </Suspense>
              </div>

              {/* Right - Site Detail View (Satellite only, zooms on selection) */}
              <div className="flex-1">
                <Suspense
                  fallback={
                    <div className="h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-gray-600 text-sm">Loading detail view...</div>
                    </div>
                  }
                >
                  <SiteDetailView
                    sites={filteredSites}
                    highlightedSiteId={highlightedSiteId}
                  />
                </Suspense>
              </div>
            </div>

            {/* Timeline Scrubber - Below both maps */}
            <div className="mt-4">
              <Suspense
                fallback={
                  <div className="h-[80px] bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-gray-600 text-sm">Loading timeline...</div>
                  </div>
                }
              >
                <TimelineScrubber sites={filteredSites} />
              </Suspense>
            </div>
          </div>

          {/* Spacer to allow table scrolling */}
          <div className="h-[200px]"></div>
        </div>
      </div>
    </div>
  );
}
