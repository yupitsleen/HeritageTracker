import { lazy, Suspense, useCallback } from "react";
import type { GazaSite, FilterState } from "../../types";
import { Input } from "../Form/Input";
import { FilterTag } from "../FilterBar/FilterTag";
import { formatLabel } from "../../utils/format";
import { SitesTable } from "../SitesTable";
import { SkeletonMap } from "../Loading/Skeleton";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import { useTheme } from "../../contexts/ThemeContext";
import { COMPACT_FILTER_BAR } from "../../constants/compactDesign";

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

// Partial filter state for display-only (no creationYear filters used in DesktopLayout)
type DesktopFilters = Pick<FilterState, "selectedTypes" | "selectedStatuses" | "searchTerm" | "destructionDateStart" | "destructionDateEnd">;

interface DesktopLayoutProps {
  // Filter state (grouped)
  filters: DesktopFilters;
  setSelectedTypes: (types: Array<GazaSite["type"]>) => void;
  setSelectedStatuses: (statuses: Array<GazaSite["status"]>) => void;
  setSearchTerm: (term: string) => void;
  setDestructionDateStart: (date: Date | null) => void;
  setDestructionDateEnd: (date: Date | null) => void;
  hasActiveFilters: boolean;
  clearAllFilters: () => void;
  openFilterModal: () => void;

  // Site data
  filteredSites: GazaSite[];
  totalSites: number;

  // Table props (grouped)
  tableResize: {
    width: number;
    isResizing: boolean;
    handleResizeStart: () => void;
    getVisibleColumns: () => string[];
  };

  // Site interaction
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
  filters,
  setSelectedTypes,
  setSelectedStatuses,
  setSearchTerm,
  setDestructionDateStart,
  setDestructionDateEnd,
  hasActiveFilters,
  clearAllFilters,
  openFilterModal,
  filteredSites,
  totalSites,
  tableResize,
  onSiteClick,
  onSiteHighlight,
  highlightedSiteId,
  onExpandTable,
}: DesktopLayoutProps) {
  const t = useThemeClasses();
  const { isDark } = useTheme();

  // Destructure filters for easier access
  const { selectedTypes, selectedStatuses, searchTerm, destructionDateStart, destructionDateEnd } = filters;

  // Memoized filter tag handlers to prevent unnecessary re-renders
  const handleRemoveType = useCallback((typeToRemove: GazaSite["type"]) => {
    setSelectedTypes(selectedTypes.filter((t) => t !== typeToRemove));
  }, [selectedTypes, setSelectedTypes]);

  const handleRemoveStatus = useCallback((statusToRemove: GazaSite["status"]) => {
    setSelectedStatuses(selectedStatuses.filter((s) => s !== statusToRemove));
  }, [selectedStatuses, setSelectedStatuses]);

  const handleRemoveDateRange = useCallback(() => {
    setDestructionDateStart(null);
    setDestructionDateEnd(null);
  }, [setDestructionDateStart, setDestructionDateEnd]);

  return (
    <div className="hidden md:flex md:h-[calc(100vh-65px)] md:overflow-hidden relative" dir="ltr">
      {/* Two-column layout - Fills remaining space */}
      {/* dir="ltr" keeps spatial layout consistent (table left, maps right) regardless of language */}
      <div className="flex gap-2 flex-1 min-h-0">
        {/* Left Column - Sites Table (Resizable, black border like timeline) */}
        <aside
          className="flex-shrink-0 pl-4 pt-2 pb-2 relative flex flex-col z-10"
          style={{ width: `${tableResize.width}px` }}
        >
          <SitesTable
            sites={filteredSites}
            onSiteClick={onSiteClick}
            onSiteHighlight={onSiteHighlight}
            highlightedSiteId={highlightedSiteId}
            onExpandTable={onExpandTable}
            visibleColumns={tableResize.getVisibleColumns()}
          />

          {/* Resize handle */}
          <div
            className={`absolute top-3 right-0 w-2 h-full cursor-col-resize z-20 hover:bg-[#ed3039] hover:bg-opacity-30 transition-colors ${
              tableResize.isResizing ? "bg-[#ed3039] bg-opacity-50" : ""
            }`}
            onMouseDown={tableResize.handleResizeStart}
            title="Drag to resize table"
            aria-label="Resize table"
          />
        </aside>

        {/* Center & Right - Filter bar, Maps side by side + Timeline below */}
        <div className="flex-1 min-w-0 pr-4 flex flex-col">
          {/* Filter bar - Compact horizontal single-row layout */}
          <div className={`flex-shrink-0 mt-2 ${COMPACT_FILTER_BAR.padding} backdrop-blur-sm border ${t.border.primary} rounded shadow-lg relative z-[5] transition-colors duration-200 ${isDark ? "bg-[#000000]/95" : "bg-white/95"}`}>
            <div className="flex flex-col gap-1.5">
              {/* Top row - Filter controls and legend (single horizontal row) */}
              <div className="flex items-center gap-2">
                {/* Left side - Filter controls */}
                <div className="flex items-center gap-2">
                  {/* Filter Button */}
                  <button
                    onClick={openFilterModal}
                    className={`${COMPACT_FILTER_BAR.buttonPadding} ${COMPACT_FILTER_BAR.inputHeight} bg-[#009639] hover:bg-[#007b2f] text-white rounded shadow-md hover:shadow-lg transition-all duration-200 font-semibold active:scale-95 ${COMPACT_FILTER_BAR.inputText} border ${t.border.primary}`}
                  >
                    Filters
                  </button>

                  {/* Search bar - inline */}
                  <div className={`relative flex-1 max-w-[200px] border ${t.border.primary} rounded ${COMPACT_FILTER_BAR.inputHeight}`}>
                    <Input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search..."
                      className={`w-full pr-6 ${COMPACT_FILTER_BAR.inputText} ${COMPACT_FILTER_BAR.inputPadding} border-0 h-full`}
                    />
                    {searchTerm.trim().length > 0 && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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

                  {/* Clear button */}
                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className={`${COMPACT_FILTER_BAR.buttonPadding} ${COMPACT_FILTER_BAR.inputHeight} bg-[#ed3039] hover:bg-[#d4202a] text-white rounded shadow-md hover:shadow-lg transition-all duration-200 font-semibold active:scale-95 ${COMPACT_FILTER_BAR.inputText} border ${t.border.primary}`}
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Center/Right - Site count and Status legend (Color Key) - All inline */}
                <div className="flex items-center gap-3 ml-auto">
                  {/* Site count */}
                  <span className={`text-[10px] font-medium whitespace-nowrap ${t.text.muted}`}>
                    {filteredSites.length} / {totalSites}
                  </span>

                  {/* Status Legend (Color Key) - Ultra compact */}
                  <div className={`flex items-center gap-2 px-2 py-0.5 rounded border ${t.border.primary} ${t.bg.secondary}`}>
                    <span className={`text-[10px] font-semibold ${t.text.body}`}>Key:</span>
                    <div className="flex items-center gap-1">
                      <div
                        className="w-2.5 h-2.5 rounded-full border border-white"
                        style={{ backgroundColor: "#b91c1c" }}
                      />
                      <span className={`text-[10px] ${t.text.body}`}>Destroyed</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div
                        className="w-2.5 h-2.5 rounded-full border border-white"
                        style={{ backgroundColor: "#d97706" }}
                      />
                      <span className={`text-[10px] ${t.text.body}`}>Heavy</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div
                        className="w-2.5 h-2.5 rounded-full border border-white"
                        style={{ backgroundColor: "#ca8a04" }}
                      />
                      <span className={`text-[10px] ${t.text.body}`}>Damaged</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom row - Active filter tags (only if filters active) */}
              {hasActiveFilters && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {selectedTypes.map((type) => (
                    <FilterTag
                      key={type}
                      label={formatLabel(type)}
                      onRemove={() => handleRemoveType(type)}
                      ariaLabel={`Remove ${type} filter`}
                    />
                  ))}
                  {selectedStatuses.map((status) => (
                    <FilterTag
                      key={status}
                      label={formatLabel(status)}
                      onRemove={() => handleRemoveStatus(status)}
                      ariaLabel={`Remove ${status} filter`}
                    />
                  ))}
                  {/* Destruction date filter tag */}
                  {(destructionDateStart || destructionDateEnd) && (
                    <FilterTag
                      key="destruction-date"
                      label={`Date: ${destructionDateStart?.toLocaleDateString() || '...'} - ${destructionDateEnd?.toLocaleDateString() || '...'}`}
                      onRemove={handleRemoveDateRange}
                      ariaLabel="Remove destruction date filter"
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Two maps side by side - Constrained height to leave room for timeline + footer */}
          <div className="flex gap-2 min-h-0 pt-2" style={{ height: 'calc(100% - 185px)' }}>
            {/* Center - Heritage Map (Traditional/Satellite toggle) */}
            <div className={`flex-1 min-w-0 h-full border ${t.border.primary} rounded shadow-lg overflow-hidden relative z-10`}>
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
            <div className={`flex-1 min-w-0 h-full border ${t.border.primary} rounded shadow-lg overflow-hidden relative z-10`}>
              <Suspense fallback={<SkeletonMap />}>
                <SiteDetailView
                  sites={filteredSites}
                  highlightedSiteId={highlightedSiteId}
                />
              </Suspense>
            </div>
          </div>

          {/* Timeline Scrubber - Fixed height at bottom, mb-6 to clear fixed footer */}
          <div className="mt-1.5 mb-6 flex-shrink-0 h-[100px] relative z-10">
            <Suspense fallback={<SkeletonMap />}>
              <TimelineScrubber
                sites={filteredSites}
                destructionDateStart={destructionDateStart}
                destructionDateEnd={destructionDateEnd}
                onDestructionDateStartChange={setDestructionDateStart}
                onDestructionDateEndChange={setDestructionDateEnd}
                highlightedSiteId={highlightedSiteId}
                onSiteHighlight={onSiteHighlight}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
