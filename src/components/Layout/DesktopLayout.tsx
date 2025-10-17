import { lazy, Suspense } from "react";
import type { GazaSite } from "../../types";
import { Input } from "../Form/Input";
import { FilterTag } from "../FilterBar/FilterTag";
import { formatLabel } from "../../utils/format";
import { SitesTable } from "../SitesTable";

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
    <div className="hidden md:flex md:flex-col md:h-[calc(100vh-140px)] md:overflow-hidden">
      {/* Filter bar - Horizontal component with proper padding */}
      <div className="flex-shrink-0 px-6 pt-4 pb-3 bg-white border-b border-gray-200">
        <div className="flex items-start gap-4">
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
            <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
              Showing {filteredSites.length} of {totalSites} sites
            </span>

            {/* Status Legend (Color Key) */}
            <div className="flex items-center gap-3 px-3 py-1.5 bg-gray-50 rounded-md border border-gray-200">
              <span className="text-xs font-semibold text-gray-700">Color Key:</span>
              <div className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: "#b91c1c" }}
                />
                <span className="text-xs text-gray-700">Destroyed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: "#d97706" }}
                />
                <span className="text-xs text-gray-700">Heavily Damaged</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: "#ca8a04" }}
                />
                <span className="text-xs text-gray-700">Damaged</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Three-column layout - Fills remaining space */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Left Column - Sites Table (Resizable, RED outline with white inner border) */}
        <aside
          className="flex-shrink-0 pl-6 pt-3 pb-3 relative flex flex-col"
          style={{ width: `${tableWidth}px` }}
        >
          <div className="border-4 border-[#ed3039] rounded-lg overflow-hidden flex-1 flex flex-col z-10">
            <div className="border-2 border-white rounded-lg flex-1 overflow-y-auto">
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
        <div className="flex-1 min-w-0 pr-6 pt-3 pb-3 flex flex-col">
          {/* Two maps side by side - Constrained height to leave room for timeline */}
          <div className="flex gap-4 min-h-0" style={{ height: 'calc(100% - 220px)' }}>
            {/* Center - Heritage Map (Traditional/Satellite toggle) */}
            <div className="flex-1 min-w-0 h-full">
              <Suspense
                fallback={
                  <div className="h-full bg-gray-100 rounded-lg flex items-center justify-center">
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
            <div className="flex-1 min-w-0 h-full">
              <Suspense
                fallback={
                  <div className="h-full bg-gray-100 rounded-lg flex items-center justify-center">
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

          {/* Timeline Scrubber - Fixed height at bottom */}
          <div className="mt-3 flex-shrink-0 h-[200px]">
            <Suspense
              fallback={
                <div className="h-full bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-gray-600 text-sm">Loading timeline...</div>
                </div>
              }
            >
              <TimelineScrubber sites={filteredSites} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
