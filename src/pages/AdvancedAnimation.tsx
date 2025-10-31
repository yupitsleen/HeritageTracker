import { lazy, Suspense, useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useThemeClasses } from "../hooks/useThemeClasses";
import { Modal } from "../components/Modal/Modal";
import { AppHeader } from "../components/Layout/AppHeader";
import { AppFooter } from "../components/Layout/AppFooter";
import { Button } from "../components/Button";
import { FilterBar } from "../components/FilterBar/FilterBar";
import { FilterTag } from "../components/FilterBar/FilterTag";
import { mockSites } from "../data/mockSites";
import { SkeletonMap } from "../components/Loading/Skeleton";
import { useWaybackReleases } from "../hooks/useWaybackReleases";
import { WaybackSlider } from "../components/AdvancedTimeline";
import { AnimationProvider } from "../contexts/AnimationContext";
import type { GazaSite } from "../types";
import type { FilterState } from "../types/filters";
import { createEmptyFilterState, isFilterStateEmpty } from "../types/filters";
import { formatLabel } from "../utils/format";
import { Z_INDEX } from "../constants/layout";
import { COLORS } from "../config/colorThemes";

// Lazy load the map, timeline, and modal components
// Note: About and Stats are now dedicated pages at /about and /stats for better performance
const SiteDetailView = lazy(() =>
  import("../components/Map/SiteDetailView").then((m) => ({ default: m.SiteDetailView }))
);
const TimelineScrubber = lazy(() =>
  import("../components/Timeline/TimelineScrubber").then((m) => ({ default: m.TimelineScrubber }))
);
const SiteDetailPanel = lazy(() =>
  import("../components/SiteDetail/SiteDetailPanel").then((m) => ({ default: m.SiteDetailPanel }))
);

/**
 * Advanced Animation Page
 * Full-screen satellite map with Wayback imagery (186 historical versions)
 * Timeline scrubber for site filtering
 * Reuses SiteDetailView and TimelineScrubber from home page
 */
export function AdvancedAnimation() {
  const { isDark } = useTheme();
  const t = useThemeClasses();

  // Fetch Wayback releases
  const { releases, isLoading, error } = useWaybackReleases();

  // Wayback state - will be set to most recent release once loaded
  const [currentReleaseIndex, setCurrentReleaseIndex] = useState(0);

  // Set initial release to most recent (last in array) when releases are loaded
  useEffect(() => {
    if (releases.length > 0 && currentReleaseIndex === 0) {
      // Only set on initial load (when still at index 0)
      setCurrentReleaseIndex(releases.length - 1);
    }
  }, [releases, currentReleaseIndex]);

  // Filter state
  const [filters, setFilters] = useState<FilterState>(createEmptyFilterState());

  // Pre-compute default date ranges ONCE at page level (not on every filter change)
  const defaultDateRange = useMemo(() => {
    const destructionDates = mockSites
      .filter(site => site.dateDestroyed)
      .map(site => new Date(site.dateDestroyed!));

    if (destructionDates.length === 0) {
      return {
        defaultStartDate: new Date("2023-10-07"),
        defaultEndDate: new Date(),
      };
    }

    const timestamps = destructionDates.map(d => d.getTime());
    return {
      defaultStartDate: new Date(Math.min(...timestamps)),
      defaultEndDate: new Date(Math.max(...timestamps)),
    };
  }, []); // Empty deps - only calculate once

  const defaultYearRange = useMemo(() => {
    const creationYears = mockSites
      .filter(site => site.yearBuilt)
      .map(site => {
        const match = site.yearBuilt?.match(/^(?:BCE\s+)?(-?\d+)/);
        return match ? parseInt(match[1], 10) * (site.yearBuilt?.startsWith('BCE') ? -1 : 1) : null;
      })
      .filter((year): year is number => year !== null);

    if (creationYears.length === 0) {
      return {
        defaultStartYear: "",
        defaultEndYear: new Date().getFullYear().toString(),
        defaultStartEra: "CE" as const,
      };
    }

    const minYear = Math.min(...creationYears);
    const maxYear = Math.max(...creationYears);

    const formatYear = (year: number): string => {
      if (year < 0) return Math.abs(year).toString();
      return year.toString();
    };

    return {
      defaultStartYear: formatYear(minYear),
      defaultEndYear: formatYear(maxYear),
      defaultStartEra: minYear < 0 ? ("BCE" as const) : ("CE" as const),
    };
  }, []); // Empty deps - only calculate once

  // Site filtering state
  const [highlightedSiteId, setHighlightedSiteId] = useState<string | null>(null);
  const [destructionDateStart, setDestructionDateStart] = useState<Date | null>(null);
  const [destructionDateEnd, setDestructionDateEnd] = useState<Date | null>(null);
  const [selectedSite, setSelectedSite] = useState<GazaSite | null>(null);

  // Sync Map toggle - when enabled, clicking timeline dots syncs map to nearest Wayback release
  // Default to ON for better user experience on Advanced Timeline page
  const [syncMapOnDotClick, setSyncMapOnDotClick] = useState(true);

  // Modal states for footer and help
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Get current release
  const currentRelease = releases.length > 0 ? releases[currentReleaseIndex] : null;

  // Apply filters to sites (memoized for performance)
  const filteredSites = useMemo(() => {
    return mockSites.filter(site => {
      // Type filter
      if (filters.selectedTypes.length > 0 && !filters.selectedTypes.includes(site.type)) {
        return false;
      }

      // Status filter
      if (filters.selectedStatuses.length > 0 && !filters.selectedStatuses.includes(site.status)) {
        return false;
      }

      // Search filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesName = site.name.toLowerCase().includes(searchLower);
        const matchesArabicName = site.nameArabic?.toLowerCase().includes(searchLower);
        if (!matchesName && !matchesArabicName) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  // Filter handlers
  const handleFilterChange = useCallback((updates: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  }, []);

  const clearAllFilters = () => {
    setFilters(createEmptyFilterState());
  };

  const hasActiveFilters = !isFilterStateEmpty(filters);

  // Memoized filter tag handlers to prevent unnecessary re-renders
  const handleRemoveType = useCallback((typeToRemove: GazaSite["type"]) => {
    setFilters(prev => ({
      ...prev,
      selectedTypes: prev.selectedTypes.filter((t) => t !== typeToRemove)
    }));
  }, []);

  const handleRemoveStatus = useCallback((statusToRemove: GazaSite["status"]) => {
    setFilters(prev => ({
      ...prev,
      selectedStatuses: prev.selectedStatuses.filter((s) => s !== statusToRemove)
    }));
  }, []);

  const handleRemoveDestructionDateRange = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      destructionDateStart: null,
      destructionDateEnd: null
    }));
  }, []);

  const handleRemoveCreationYearRange = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      creationYearStart: null,
      creationYearEnd: null
    }));
  }, []);

  /**
   * Find the earliest Wayback release that occurred AFTER the destruction date
   * This shows the satellite imagery from right after the site was destroyed
   *
   * @param targetDate - The destruction date to search for
   * @returns Index of the nearest release, or last release if no releases available after
   * @throws Never throws - returns last release index for invalid inputs
   */
  const findNearestWaybackRelease = useCallback(
    (targetDate: Date): number => {
      // Guard: Empty releases array
      if (releases.length === 0) return 0;

      // Guard: Invalid date
      if (!targetDate || isNaN(targetDate.getTime())) {
        console.warn('findNearestWaybackRelease: Invalid target date provided, using last release');
        return releases.length - 1;
      }

      const targetTime = targetDate.getTime();

      // Find the EARLIEST release that occurred AFTER the target date
      // We iterate through all releases and return the first one after the target
      for (let i = 0; i < releases.length; i++) {
        const releaseDate = new Date(releases[i].releaseDate);

        // Guard: Invalid release date
        if (isNaN(releaseDate.getTime())) {
          console.warn(`findNearestWaybackRelease: Invalid release date at index ${i}, skipping`);
          continue;
        }

        const releaseTime = releaseDate.getTime();

        // Return the first release that's after the target date
        if (releaseTime > targetTime) {
          return i;
        }
      }

      // If no release found after the target date, return the last release
      // This handles cases where the destruction happened after the last imagery
      return releases.length - 1;

    },
    [releases]
  );

  /**
   * Handle timeline dot click - highlight site and optionally sync map
   * Using useRef to avoid recreating this callback when syncMapOnDotClick changes
   */
  const syncMapOnDotClickRef = useRef(syncMapOnDotClick);
  useEffect(() => {
    syncMapOnDotClickRef.current = syncMapOnDotClick;
  }, [syncMapOnDotClick]);

  /**
   * Handle site selection from timeline
   * When sync is enabled, automatically finds and displays the Wayback imagery
   * from right before the site was destroyed
   *
   * @param siteId - ID of the selected site, or null to deselect
   */
  const handleSiteHighlight = useCallback(
    (siteId: string | null) => {
      setHighlightedSiteId(siteId);

      // If sync is enabled and a site is selected, find and show the nearest Wayback release
      // Use ref to get current value without recreating callback
      if (syncMapOnDotClickRef.current && siteId) {
        const site = filteredSites.find((s: GazaSite) => s.id === siteId);
        if (site?.dateDestroyed) {
          const destructionDate = new Date(site.dateDestroyed);
          const nearestReleaseIndex = findNearestWaybackRelease(destructionDate);
          setCurrentReleaseIndex(nearestReleaseIndex);
        }
      }
    },
    [findNearestWaybackRelease, filteredSites]
  );

  /**

  /**
   * Reload page to retry loading Wayback releases
   */
  const handleRetryClick = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <div
      data-theme={isDark ? "dark" : "light"}
      className={`min-h-screen relative transition-colors duration-200 ${t.layout.appBackground}`}
    >
      {/* Palestinian Flag Red Triangle - Background Element */}
      {/* Z-index 0 to stay behind all content */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-0 opacity-50 transition-colors duration-200"
        style={{
          width: '800px',
          height: '100vh',
          background: isDark ? COLORS.FLAG_RED_DARK : COLORS.FLAG_RED,
          clipPath: 'polygon(0 0, 0 100%, 800px 50%)',
        }}
        aria-hidden="true"
      />

      {/* Header - shared across all pages */}
      <AppHeader onOpenHelp={() => setIsHelpOpen(true)} />

      {/* Main content */}
      {/* Relative positioning creates stacking context above z-0 triangle */}
      <main className="h-[calc(100vh-58px)] p-4 flex flex-col gap-2 relative">
        {/* Loading state */}
        {isLoading && (
          <div className={`flex-1 flex items-center justify-center rounded ${t.border.primary2} ${t.containerBg.semiTransparent} shadow-xl`}>
            <div className="text-center">
              <div className={`text-xl mb-2 ${t.text.heading}`}>Loading Wayback Archive...</div>
              <div className={`text-sm ${t.text.muted}`}>Fetching 186 historical imagery versions...</div>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className={`flex-1 flex items-center justify-center rounded ${t.border.primary2} ${t.containerBg.semiTransparent} shadow-xl`}>
            <div className="text-center">
              <div className="text-xl font-bold mb-2 text-red-600">Error Loading Archive</div>
              <div className={`text-sm mb-4 ${t.text.muted}`}>{error}</div>
              <Button onClick={handleRetryClick} variant="primary" size="sm">
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Success state - Map + Wayback controls */}
        {!isLoading && !error && releases.length > 0 && (
          <AnimationProvider sites={filteredSites}>
            {/* Filter Bar Container */}
            <div className={`flex-shrink-0 ${t.containerBg.semiTransparent} shadow-md mb-2 px-4 rounded relative z-[1001]`}>
              <div className="p-4 flex flex-col gap-3">
                {/* Unified FilterBar with search, filters, and actions */}
                <FilterBar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  sites={mockSites}
                  defaultDateRange={defaultDateRange}
                  defaultYearRange={defaultYearRange}
                  showActions={true}
                  totalSites={mockSites.length}
                  filteredSites={filteredSites.length}
                  onClearAll={clearAllFilters}
                />

                {/* Active filter tags (only if filters active) */}
                {hasActiveFilters && (
                  <div className="flex items-center gap-2 flex-wrap">
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
                        label={`Destroyed: ${filters.destructionDateStart?.toLocaleDateString() || '...'} - ${filters.destructionDateEnd?.toLocaleDateString() || '...'}`}
                        onRemove={handleRemoveDestructionDateRange}
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

            {/* Full-screen satellite map with Wayback imagery */}
            <div
              className={`flex-1 min-h-0 ${t.border.primary2} rounded shadow-xl overflow-hidden relative z-10`}
            >
              <Suspense fallback={<SkeletonMap />}>
                <SiteDetailView
                  sites={filteredSites}
                  highlightedSiteId={highlightedSiteId}
                  customTileUrl={currentRelease?.tileUrl}
                  customMaxZoom={currentRelease?.maxZoom}
                  onSiteClick={setSelectedSite}
                />
              </Suspense>
            </div>

            {/* Wayback Release Slider - Visual timeline with year markers */}
            <div className="flex-shrink-0 relative z-10">
              <WaybackSlider
                releases={releases}
                currentIndex={currentReleaseIndex}
                onIndexChange={setCurrentReleaseIndex}
                totalSites={filteredSites.length}
              />
            </div>

            {/* Timeline Scrubber - Site filtering with advanced mode sync */}
            <div className="flex-shrink-0 min-h-[100px] relative z-10">
              <Suspense fallback={<SkeletonMap />}>
                <TimelineScrubber
                  key="advanced-timeline-scrubber"
                  sites={filteredSites}
                  destructionDateStart={destructionDateStart}
                  destructionDateEnd={destructionDateEnd}
                  onDestructionDateStartChange={setDestructionDateStart}
                  onDestructionDateEndChange={setDestructionDateEnd}
                  highlightedSiteId={highlightedSiteId}
                  onSiteHighlight={handleSiteHighlight}
                  advancedMode={{
                    syncMapOnDotClick,
                    onSyncMapToggle: () => setSyncMapOnDotClick(!syncMapOnDotClick),
                  }}
                />
              </Suspense>
            </div>
          </AnimationProvider>
        )}
      </main>

      {/* Site Detail Modal */}
      <Modal
        isOpen={selectedSite !== null}
        onClose={() => setSelectedSite(null)}
        zIndex={Z_INDEX.MODAL}
      >
        {selectedSite && (
          <Suspense
            fallback={
              <div className="flex items-center justify-center p-8">
                <div className={`text-lg ${t.text.muted}`}>Loading site details...</div>
              </div>
            }
          >
            <SiteDetailPanel site={selectedSite} />
          </Suspense>
        )}
      </Modal>


      {/* Help Modal */}
      <Modal isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        zIndex={Z_INDEX.MODAL_DROPDOWN}
      >
        <div className="p-6">
          <h2 className={`text-2xl font-bold mb-4 ${t.text.heading}`}>How to Use Advanced Satellite Timeline</h2>

          <div className={`space-y-4 ${t.text.body}`}>
            <section>
              <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Overview</h3>
              <p className="text-sm">
                The Advanced Satellite Timeline provides access to 150+ historical satellite imagery versions from
                ESRI Wayback (2014-2025). This specialized view lets you see how the landscape has changed over time,
                with precise timestamps for each satellite image capture.
              </p>
            </section>

            <section>
              <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Satellite Map</h3>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Full-screen satellite view showing the entire region</li>
                <li>Click on site markers to view detailed information</li>
                <li>Markers update to match the currently selected satellite imagery date</li>
                <li>Red markers indicate sites that were destroyed before or on the displayed date</li>
              </ul>
            </section>

            <section>
              <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Wayback Timeline Slider</h3>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li><strong>Year Markers:</strong> Vertical labels (2014-2025) mark each calendar year</li>
                <li><strong>Gray Lines:</strong> Each line represents one satellite imagery capture date (150+ total)</li>
                <li><strong>Red Dots:</strong> Show when sites were destroyed (vertically stacked for visibility)</li>
                <li><strong>Green Scrubber:</strong> Drag to view different dates, tooltip shows current date</li>
                <li>Click anywhere on the timeline to jump to that date</li>
              </ul>
            </section>

            <section>
              <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Navigation Controls</h3>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li><strong>Reset:</strong> Return to the first imagery version (2014)</li>
                <li><strong>Previous (⏮):</strong> Go to the previous year marker</li>
                <li><strong>Play/Pause (▶/⏸):</strong> Automatically advance through time</li>
                <li><strong>Next (⏭):</strong> Jump to the next year marker</li>
              </ul>
            </section>

            <section>
              <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Site Timeline (Bottom)</h3>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Shows destruction events for all heritage sites</li>
                <li>Click a red dot to highlight the site on the map</li>
                <li>Highlighted sites show with a black dot and enlarged marker</li>
                <li>Use the "Sync map on dot click" toggle to automatically jump to the destruction date in Wayback imagery</li>
              </ul>
            </section>

            <section>
              <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Tips</h3>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Compare satellite imagery before and after destruction events</li>
                <li>Watch seasonal changes in the landscape over the years</li>
                <li>Notice the density of gray lines - ESRI updates imagery more frequently in recent years</li>
                <li>Use the footer links to access Statistics, About, and donation information</li>
              </ul>
            </section>
          </div>
        </div>
      </Modal>

      {/* Footer - Desktop only */}
      <AppFooter
        
        isMobile={false}
      />
    </div>
  );
}
