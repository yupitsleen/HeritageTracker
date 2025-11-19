import { lazy, Suspense } from "react";
import type { Site, FilterState } from "../../types";
import { FilterBar } from "../FilterBar/FilterBar";
import { SitesTable } from "../SitesTable";
import { SkeletonMap } from "../Loading/Skeleton";
import { useThemeClasses } from "../../hooks/useThemeClasses";
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
  sites: Site[];
  filteredSites: Site[];
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
  onSiteClick: (site: Site) => void;
  onSiteHighlight: (siteId: string | null) => void;
  onExpandTable: () => void;
}

/** Timeline settings props grouped together */
interface TimelineSettingsProps {
  showUnknownDestructionDates: boolean;
  onShowUnknownDestructionDatesChange: (show: boolean) => void;
}

interface DesktopLayoutProps {
  filterProps: FilterProps;
  siteData: SiteDataProps;
  tableResize: TableResizeProps;
  siteInteraction: SiteInteractionProps;
  timelineSettings: TimelineSettingsProps;
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
  timelineSettings,
}: DesktopLayoutProps) {
  const t = useThemeClasses();
  const translate = useTranslation();

  // Destructure grouped props for easier access
  const { filters, onFilterChange, onClearAll, defaultDateRange, defaultYearRange } = filterProps;
  const { sites, filteredSites, totalSites } = siteData;
  const { highlightedSiteId, onSiteClick, onSiteHighlight, onExpandTable } = siteInteraction;
  const { showUnknownDestructionDates, onShowUnknownDestructionDatesChange } = timelineSettings;

  return (
    <div className="hidden md:flex md:flex-col md:h-[calc(100vh-65px)] md:overflow-hidden relative" dir="ltr">
      {/* dir="ltr" keeps spatial layout consistent (table left, maps right) regardless of language */}

      {/* Filter bar - Full width at top */}
      <div
        className={`flex-shrink-0 mx-4 mt-2 p-2 backdrop-blur-sm ${t.border.primary} rounded shadow-lg relative transition-colors duration-200 bg-[#000000]/95`}
        style={{ zIndex: Z_INDEX.FILTER_BAR }}
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
          className="flex-shrink-0 relative flex flex-col"
          style={{ width: `${tableResize.width}px`, zIndex: Z_INDEX.CONTENT }}
        >
          <SitesTable
            sites={filteredSites}
            onSiteHighlight={onSiteHighlight}
            highlightedSiteId={highlightedSiteId}
            onExpandTable={onExpandTable}
            visibleColumns={tableResize.getVisibleColumns()}
          />

          {/* Resize handle */}
          <div
            className={`absolute top-0 right-0 w-2 h-full cursor-col-resize hover:bg-[#ed3039] hover:bg-opacity-30 transition-colors ${
              tableResize.isResizing ? "bg-[#ed3039] bg-opacity-50" : ""
            }`}
            style={{ zIndex: Z_INDEX.TABLE_HEADER }}
            onMouseDown={tableResize.handleResizeStart}
            title={translate("aria.dragToResizeTable")}
            aria-label={translate("aria.resizeTable")}
          />
        </aside>

        {/* Center - Heritage Map (Traditional/Satellite toggle) */}
        <div
          className={`flex-1 min-w-0 h-full ${t.border.primary} rounded shadow-lg overflow-hidden relative`}
          style={{ zIndex: Z_INDEX.CONTENT }}
        >
          <Suspense fallback={<SkeletonMap />}>
            <HeritageMap
              sites={filteredSites}
              onSiteClick={onSiteClick}
              highlightedSiteId={highlightedSiteId}
              onSiteHighlight={onSiteHighlight}
              disableAutoCentering={true}
            />
          </Suspense>
        </div>

        {/* Right - Site Detail View (Satellite only, zooms on selection) */}
        <div
          className={`flex-1 min-w-0 h-full ${t.border.primary} rounded shadow-lg overflow-hidden relative`}
          style={{ zIndex: Z_INDEX.CONTENT }}
        >
          <Suspense fallback={<SkeletonMap />}>
            <SiteDetailView
              sites={filteredSites}
              highlightedSiteId={highlightedSiteId}
            />
          </Suspense>
        </div>
      </div>

      {/* Timeline Scrubber - Full width at bottom, mb-6 to clear fixed footer */}
      <div
        className="mx-4 mt-1.5 mb-6 flex-shrink-0 h-[100px] relative"
        style={{ zIndex: Z_INDEX.CONTENT }}
      >
        <Suspense fallback={<SkeletonMap />}>
          <TimelineScrubber
            sites={filteredSites}
            highlightedSiteId={highlightedSiteId}
            onSiteHighlight={onSiteHighlight}
            showUnknownDestructionDates={showUnknownDestructionDates}
            onShowUnknownDestructionDatesChange={onShowUnknownDestructionDatesChange}
            advancedMode={{
              syncMapOnDotClick: false,
              showNavigation: true, // Show Previous/Next buttons
              hidePlayControls: false, // Show Play/Pause/Speed controls
              hideMapSettings: true, // Hide Zoom to Site and Show Map Markers (moved to right map)
              // No onSyncMapToggle - hides "Sync Map" button on Dashboard
            }}
          />
        </Suspense>
      </div>
    </div>
  );
}
