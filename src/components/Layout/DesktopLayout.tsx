import { lazy, Suspense, useState } from "react";
import type { GazaSite } from "../../types";
import { Input } from "../Form/Input";
import { FilterTag } from "../FilterBar/FilterTag";
import { formatLabel } from "../../utils/format";
import { SitesTable } from "../SitesTable";
import { SkeletonMap } from "../Loading/Skeleton";
import { useThemeClasses } from "../../hooks/useThemeClasses";

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
  const t = useThemeClasses();
  // State for satellite map sync with timeline
  const [syncMapToTimeline, setSyncMapToTimeline] = useState(false);

  return (
    <div className="hidden md:flex md:h-[calc(100vh-140px)] md:overflow-hidden relative">
      {/* Two-column layout - Fills remaining space */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Left Column - Sites Table (Resizable, black border like timeline) */}
        <aside
          className="flex-shrink-0 pl-6 pt-4 pb-4 relative flex flex-col z-10"
          style={{ width: `${tableWidth}px` }}
        >
          <SitesTable
            sites={filteredSites}
            onSiteClick={onSiteClick}
            onSiteHighlight={onSiteHighlight}
            highlightedSiteId={highlightedSiteId}
            onExpandTable={onExpandTable}
            visibleColumns={getVisibleColumns()}
          />

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

        {/* Center & Right - Filter bar, Maps side by side + Timeline below */}
        <div className="flex-1 min-w-0 pr-6 flex flex-col">
          {/* Filter bar - Horizontal component with compact padding */}
          <div className={`flex-shrink-0 mt-4 py-3 backdrop-blur-sm border-2 border-[#000000] rounded-lg shadow-xl relative z-[5] transition-colors duration-200 bg-white/90 dark:bg-[#000000]/90`}>
            <div className="flex items-start gap-4 px-3">
              {/* Left side - Filter controls */}
              <div className="flex-1 flex items-center gap-3 flex-wrap">
                {/* Filter Button */}
                <button
                  onClick={openFilterModal}
                  className="px-4 py-2 bg-[#009639] hover:bg-[#007b2f] text-white
                             rounded-lg shadow-md hover:shadow-lg
                             transition-all duration-200 font-semibold
                             active:scale-95 text-sm"
                >
                  Filters
                </button>

                {/* Search bar - inline */}
                <div className="relative flex-1 max-w-xs border border-[#000000] rounded-lg">
                  <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search sites..."
                    className="w-full pr-8 text-xs py-1 px-2 border-0"
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
                    className="px-3 py-1.5 bg-[#ed3039] hover:bg-[#d4202a] text-white
                               rounded-lg shadow-md hover:shadow-lg
                               transition-all duration-200 font-semibold
                               active:scale-95 text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Right side - Status legend and site count */}
              <div className="flex items-center gap-4">
                {/* Site count */}
                <span className={`text-xs font-medium whitespace-nowrap ${t.text.muted}`}>
                  Showing {filteredSites.length} of {totalSites} sites
                </span>

                {/* Status Legend (Color Key) */}
                <div className={`flex items-center gap-3 px-3 py-1.5 rounded-md border border-[#000000] ${t.bg.secondary}`}>
                  <span className={`text-xs font-semibold ${t.text.body}`}>Color Key:</span>
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: "#b91c1c" }}
                    />
                    <span className={`text-xs ${t.text.body}`}>Destroyed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: "#d97706" }}
                    />
                    <span className={`text-xs ${t.text.body}`}>Heavily Damaged</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: "#ca8a04" }}
                    />
                    <span className={`text-xs ${t.text.body}`}>Damaged</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Two maps side by side - Constrained height to leave room for timeline */}
          <div className="flex gap-4 min-h-0 pt-3" style={{ height: 'calc(100% - 270px)' }}>
            {/* Center - Heritage Map (Traditional/Satellite toggle) */}
            <div className="flex-1 min-w-0 h-full border-4 border-[#000000] rounded-lg shadow-xl overflow-hidden relative z-10">
              <Suspense fallback={<SkeletonMap />}>
                <HeritageMap
                  sites={filteredSites}
                  onSiteClick={onSiteClick}
                  highlightedSiteId={highlightedSiteId}
                  onSiteHighlight={onSiteHighlight}
                />
              </Suspense>
            </div>

            {/* Right - Site Detail View (Satellite only, zooms on selection) */}
            <div className="flex-1 min-w-0 h-full border-4 border-[#000000] rounded-lg shadow-xl overflow-hidden relative z-10">
              <Suspense fallback={<SkeletonMap />}>
                <SiteDetailView
                  sites={filteredSites}
                  highlightedSiteId={highlightedSiteId}
                  syncMapToTimeline={syncMapToTimeline}
                />
              </Suspense>
            </div>
          </div>

          {/* Timeline Scrubber - Fixed height at bottom */}
          <div className="mt-3 flex-shrink-0 h-[200px] relative z-10">
            <Suspense fallback={<SkeletonMap />}>
              <TimelineScrubber
                sites={filteredSites}
                onSyncMapChange={setSyncMapToTimeline}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
