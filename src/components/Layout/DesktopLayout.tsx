import { lazy, Suspense, useCallback } from "react";
import type { GazaSite, FilterState } from "../../types";
import { Input } from "../Form/Input";
import { FilterTag } from "../FilterBar/FilterTag";
import { FilterBar } from "../FilterBar/FilterBar";
import { formatLabel } from "../../utils/format";
import { SitesTable } from "../SitesTable";
import { SkeletonMap } from "../Loading/Skeleton";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import { useTheme } from "../../contexts/ThemeContext";
import { useTranslation } from "../../contexts/LocaleContext";
import { COMPACT_FILTER_BAR } from "../../constants/compactDesign";
import { COLORS } from "../../config/colorThemes";

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
  // Filter state (grouped)
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  hasActiveFilters: boolean;
  clearAllFilters: () => void;

  // Site data
  filteredSites: GazaSite[];
  totalSites: number;
  sites: GazaSite[];

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

  // Default ranges for filters
  defaultDateRange?: {
    defaultStartDate: Date;
    defaultEndDate: Date;
  };
  defaultYearRange?: {
    defaultStartYear: string;
    defaultEndYear: string;
    defaultStartEra: "BCE" | "CE";
  };
}

/**
 * Desktop layout with filter bar, resizable table, dual maps, and timeline
 * Three-column layout: Table (left, resizable) | HeritageMap (center) | SiteDetailView (right) | Timeline (below both maps)
 */
export function DesktopLayout({
  filters,
  onFilterChange,
  hasActiveFilters,
  clearAllFilters,
  filteredSites,
  totalSites,
  sites,
  tableResize,
  onSiteClick,
  onSiteHighlight,
  highlightedSiteId,
  onExpandTable,
  defaultDateRange,
  defaultYearRange,
}: DesktopLayoutProps) {
  const t = useThemeClasses();
  const { isDark } = useTheme();
  const translate = useTranslation();

  // Memoized filter tag handlers to prevent unnecessary re-renders
  const handleRemoveType = useCallback((typeToRemove: GazaSite["type"]) => {
    onFilterChange({ selectedTypes: filters.selectedTypes.filter((t) => t !== typeToRemove) });
  }, [filters.selectedTypes, onFilterChange]);

  const handleRemoveStatus = useCallback((statusToRemove: GazaSite["status"]) => {
    onFilterChange({ selectedStatuses: filters.selectedStatuses.filter((s) => s !== statusToRemove) });
  }, [filters.selectedStatuses, onFilterChange]);

  const handleRemoveDateRange = useCallback(() => {
    onFilterChange({ destructionDateStart: null, destructionDateEnd: null });
  }, [onFilterChange]);

  const handleRemoveCreationYearRange = useCallback(() => {
    onFilterChange({ creationYearStart: null, creationYearEnd: null });
  }, [onFilterChange]);

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
            title={translate("aria.dragToResizeTable")}
            aria-label={translate("aria.resizeTable")}
          />
        </aside>

        {/* Center & Right - Filter bar, Maps side by side + Timeline below */}
        <div className="flex-1 min-w-0 pr-4 flex flex-col">
          {/* Filter bar - Horizontal layout with all filters inline */}
          <div className={`flex-shrink-0 mt-2 ${COMPACT_FILTER_BAR.padding} backdrop-blur-sm border ${t.border.primary} rounded shadow-lg relative z-[1001] transition-colors duration-200 ${isDark ? "bg-[#000000]/95" : "bg-white/95"}`}>
            <div className="flex flex-col gap-1.5">
              {/* Top row - Filter controls and buttons */}
              <div className="flex items-start gap-2">
                {/* FilterBar component with inline filters */}
                <div className="flex-1 min-w-0">
                  <FilterBar
                    filters={filters}
                    onFilterChange={onFilterChange}
                    sites={sites}
                    defaultDateRange={defaultDateRange}
                    defaultYearRange={defaultYearRange}
                  />
                </div>

                {/* Right side controls */}
                <div className="flex items-start gap-2 flex-shrink-0">
                  {/* Search bar - inline */}
                  <div className={`relative w-[180px] border ${t.border.primary} rounded ${COMPACT_FILTER_BAR.inputHeight}`}>
                    <Input
                      type="text"
                      value={filters.searchTerm}
                      onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
                      placeholder={translate("filters.searchPlaceholder")}
                      className={`w-full pr-6 ${COMPACT_FILTER_BAR.inputText} ${COMPACT_FILTER_BAR.inputPadding} border-0 h-full`}
                    />
                    {filters.searchTerm.trim().length > 0 && (
                      <button
                        onClick={() => onFilterChange({ searchTerm: "" })}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label={translate("aria.clearSearch")}
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
                      style={{
                        backgroundColor: COLORS.FLAG_RED,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = COLORS.FLAG_RED_HOVER)}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = COLORS.FLAG_RED)}
                      className={`${COMPACT_FILTER_BAR.buttonPadding} ${COMPACT_FILTER_BAR.inputHeight} text-white rounded shadow-md hover:shadow-lg transition-all duration-200 font-semibold active:scale-95 ${COMPACT_FILTER_BAR.inputText} border ${t.border.primary}`}
                    >
                      {translate("filters.clear")}
                    </button>
                  )}

                  {/* Site count */}
                  <span className={`text-[10px] font-medium whitespace-nowrap self-center ${t.text.muted}`}>
                    {filteredSites.length} / {totalSites}
                  </span>
                </div>
              </div>

              {/* Bottom row - Active filter tags (only if filters active) */}
              {hasActiveFilters && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {filters.selectedTypes.map((type) => (
                    <FilterTag
                      key={type}
                      label={formatLabel(type)}
                      onRemove={() => handleRemoveType(type)}
                      ariaLabel={`Remove ${type} filter`}
                    />
                  ))}
                  {filters.selectedStatuses.map((status) => (
                    <FilterTag
                      key={status}
                      label={formatLabel(status)}
                      onRemove={() => handleRemoveStatus(status)}
                      ariaLabel={`Remove ${status} filter`}
                    />
                  ))}
                  {/* Destruction date filter tag */}
                  {(filters.destructionDateStart || filters.destructionDateEnd) && (
                    <FilterTag
                      key="destruction-date"
                      label={`Date: ${filters.destructionDateStart?.toLocaleDateString() || '...'} - ${filters.destructionDateEnd?.toLocaleDateString() || '...'}`}
                      onRemove={handleRemoveDateRange}
                      ariaLabel="Remove destruction date filter"
                    />
                  )}
                  {/* Creation year filter tag */}
                  {(filters.creationYearStart || filters.creationYearEnd) && (
                    <FilterTag
                      key="creation-year"
                      label={`Built: ${filters.creationYearStart || '...'} - ${filters.creationYearEnd || '...'}`}
                      onRemove={handleRemoveCreationYearRange}
                      ariaLabel="Remove creation year filter"
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
                destructionDateStart={filters.destructionDateStart}
                destructionDateEnd={filters.destructionDateEnd}
                onDestructionDateStartChange={(date) => onFilterChange({ destructionDateStart: date })}
                onDestructionDateEndChange={(date) => onFilterChange({ destructionDateEnd: date })}
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
