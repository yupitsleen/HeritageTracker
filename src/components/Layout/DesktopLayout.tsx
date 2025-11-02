import { lazy, Suspense } from "react";
import type { GazaSite, FilterState } from "../../types";
import { FilterBar } from "../FilterBar/FilterBar";
import { SitesTable } from "../SitesTable";
import { SkeletonMap } from "../Loading/Skeleton";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import { useTheme } from "../../contexts/ThemeContext";
import { useTranslation } from "../../contexts/LocaleContext";
import { Z_INDEX } from "../../constants/layout";

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

/** Filter-related props grouped together */
interface FilterProps {
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  hasActiveFilters: boolean;
  onClearAll: () => void;
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

/** Site data props grouped together */
interface SiteDataProps {
  sites: GazaSite[];
  filteredSites: GazaSite[];
  totalSites: number;
}

/** Table resize state props grouped together */
interface TableResizeProps {
  width: number;
  isResizing: boolean;
  handleResizeStart: () => void;
  getVisibleColumns: () => string[];
}

/** Site interaction props grouped together */
interface SiteInteractionProps {
  highlightedSiteId: string | null;
  onSiteClick: (site: GazaSite) => void;
  onSiteHighlight: (siteId: string | null) => void;
  onExpandTable: () => void;
}

interface DesktopLayoutProps {
  filterProps: FilterProps;
  siteData: SiteDataProps;
  tableResize: TableResizeProps;
  siteInteraction: SiteInteractionProps;
}

/**
 * Desktop layout with filter bar, resizable table, dual maps, and timeline
 * Three-column layout: Table (left, resizable) | HeritageMap (center) | SiteDetailView (right) | Timeline (below both maps)
 */
export function DesktopLayout({
  filterProps,
  siteData,
  tableResize,
  siteInteraction,
}: DesktopLayoutProps) {
  const t = useThemeClasses();
  const { isDark } = useTheme();
  const translate = useTranslation();

  // Destructure grouped props for easier access
  const { filters, onFilterChange, onClearAll, defaultDateRange, defaultYearRange } = filterProps;
  const { sites, filteredSites, totalSites } = siteData;
  const { highlightedSiteId, onSiteClick, onSiteHighlight, onExpandTable } = siteInteraction;

  return (
    <div className="hidden md:flex md:flex-col md:h-[calc(100vh-65px)] md:overflow-hidden relative" dir="ltr">
      {/* dir="ltr" keeps spatial layout consistent (table left, maps right) regardless of language */}

      {/* Filter bar - Full width at top */}
      <div
        className={`flex-shrink-0 mx-4 mt-2 p-2 backdrop-blur-sm border ${t.border.primary} rounded shadow-lg relative transition-colors duration-200 ${isDark ? "bg-[#000000]/95" : "bg-white/95"}`}
        style={{ zIndex: Z_INDEX.CONTENT }}
      >
        {/* Unified FilterBar with search, filters, and actions */}
        <FilterBar
          filters={filters}
          onFilterChange={onFilterChange}
          sites={sites}
          defaultDateRange={defaultDateRange}
          defaultYearRange={defaultYearRange}
          showActions={true}
          totalSites={totalSites}
          filteredSites={filteredSites.length}
          onClearAll={onClearAll}
        />
      </div>

      {/* Three-column layout: Table | Map | SiteDetailView (all same height) */}
      <div className="flex gap-2 flex-1 min-h-0 px-4 pt-2">
        {/* Left Column - Sites Table (Resizable) */}
        <aside
          className="flex-shrink-0 relative flex flex-col z-10"
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
            className={`absolute top-0 right-0 w-2 h-full cursor-col-resize z-20 hover:bg-[#ed3039] hover:bg-opacity-30 transition-colors ${
              tableResize.isResizing ? "bg-[#ed3039] bg-opacity-50" : ""
            }`}
            onMouseDown={tableResize.handleResizeStart}
            title={translate("aria.dragToResizeTable")}
            aria-label={translate("aria.resizeTable")}
          />
        </aside>

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

      {/* Timeline Scrubber - Full width at bottom, mb-6 to clear fixed footer */}
      <div className="mx-4 mt-1.5 mb-6 flex-shrink-0 h-[100px] relative z-10">
        <Suspense fallback={<SkeletonMap />}>
          <TimelineScrubber
            sites={filteredSites}
            highlightedSiteId={highlightedSiteId}
            onSiteHighlight={onSiteHighlight}
            advancedMode={{
              syncMapOnDotClick: false,
              showNavigation: true, // Show Previous/Next buttons
              hidePlayControls: false, // Show Play/Pause/Speed controls
              // No onSyncMapToggle - hides "Sync Map" button on Dashboard
            }}
          />
        </Suspense>
      </div>
    </div>
  );
}
