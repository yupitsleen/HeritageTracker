import { lazy, Suspense, useState, useCallback, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useThemeClasses } from "../hooks/useThemeClasses";
import { useFilteredSites } from "../hooks/useFilteredSites";
import { useDefaultFilterRanges } from "../hooks/useDefaultFilterRanges";
import { Modal } from "../components/Modal/Modal";
import { AppHeader } from "../components/Layout/AppHeader";
import { AppFooter } from "../components/Layout/AppFooter";
import { Button } from "../components/Button";
import { FilterBar } from "../components/FilterBar/FilterBar";
import { TimelineHelpModal } from "../components/Help";
import { mockSites } from "../data/mockSites";
import { SkeletonMap } from "../components/Loading/Skeleton";
import { useWaybackReleases } from "../hooks/useWaybackReleases";
import { WaybackSlider } from "../components/AdvancedTimeline";
import { AnimationProvider } from "../contexts/AnimationContext";
import type { GazaSite } from "../types";
import type { FilterState } from "../types/filters";
import { createEmptyFilterState } from "../types/filters";
import type { ComparisonInterval } from "../types/waybackTimelineTypes";
import { DEFAULT_COMPARISON_INTERVAL } from "../config/comparisonIntervals";
import { calculateBeforeDate, findClosestReleaseIndex } from "../utils/intervalCalculations";
import { Z_INDEX } from "../constants/layout";
import { PalestinianFlagTriangle } from "../components/Decorative";

// Lazy load the map, timeline, and modal components
// Note: About and Stats are now dedicated pages at /about and /stats for better performance
const SiteDetailView = lazy(() =>
  import("../components/Map/SiteDetailView").then((m) => ({ default: m.SiteDetailView }))
);
const ComparisonMapView = lazy(() =>
  import("../components/Map/ComparisonMapView").then((m) => ({ default: m.ComparisonMapView }))
);
const TimelineScrubber = lazy(() =>
  import("../components/Timeline/TimelineScrubber").then((m) => ({ default: m.TimelineScrubber }))
);
const SiteDetailPanel = lazy(() =>
  import("../components/SiteDetail/SiteDetailPanel").then((m) => ({ default: m.SiteDetailPanel }))
);

/**
 * Timeline Page
 * Full-screen satellite map with Wayback imagery (186 historical versions)
 * Timeline scrubber for site filtering
 * Reuses SiteDetailView and TimelineScrubber from home page
 */
export function Timeline() {
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

  // Get default filter ranges (calculated once from all sites)
  const { dateRange: defaultDateRange, yearRange: defaultYearRange } = useDefaultFilterRanges(mockSites);

  // Site filtering state
  const [highlightedSiteId, setHighlightedSiteId] = useState<string | null>(null);
  const [selectedSite, setSelectedSite] = useState<GazaSite | null>(null);

  // Sync Map toggle - when enabled, clicking timeline dots syncs map to nearest Wayback release
  // Default to ON for better user experience on Advanced Timeline page
  const [syncMapOnDotClick, setSyncMapOnDotClick] = useState(true);

  // Comparison Mode toggle - when enabled, shows two maps side-by-side
  // Default to OFF for standard single-map view
  const [comparisonModeEnabled, setComparisonModeEnabled] = useState(false);

  // Before release index for comparison mode (earlier imagery)
  const [beforeReleaseIndex, setBeforeReleaseIndex] = useState(0);

  // Comparison interval - controls time gap between before/after imagery
  const [comparisonInterval, setComparisonInterval] = useState<ComparisonInterval>(
    DEFAULT_COMPARISON_INTERVAL
  );

  // Modal states for footer and help
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Get current release (for "after" imagery or single map mode)
  const currentRelease = releases.length > 0 ? releases[currentReleaseIndex] : null;

  // Get before release (for "before" imagery in comparison mode)
  const beforeRelease = releases.length > 0 ? releases[beforeReleaseIndex] : null;

  // Apply filters to sites using shared hook
  const { filteredSites } = useFilteredSites(mockSites, filters);

  // Filter handlers
  const handleFilterChange = useCallback((updates: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  }, []);

  const clearAllFilters = () => {
    setFilters(createEmptyFilterState());
  };

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
   * Handle site selection from timeline
   * When sync is enabled, automatically finds and displays the Wayback imagery
   * from right before the site was destroyed
   * In comparison mode, also sets the "before" imagery
   *
   * @param siteId - ID of the selected site, or null to deselect
   */
  const handleSiteHighlight = useCallback(
    (siteId: string | null) => {
      setHighlightedSiteId(siteId);

      // If sync is enabled and a site is selected, find and show the nearest Wayback release
      if (syncMapOnDotClick && siteId) {
        const site = filteredSites.find((s: GazaSite) => s.id === siteId);
        if (site?.dateDestroyed) {
          const destructionDate = new Date(site.dateDestroyed);

          // Set "after" imagery (post-destruction)
          const nearestReleaseIndex = findNearestWaybackRelease(destructionDate);
          setCurrentReleaseIndex(nearestReleaseIndex);

          // If comparison mode is enabled, also set "before" imagery using interval
          if (comparisonModeEnabled) {
            // Calculate "before" date based on selected interval
            const beforeDate = calculateBeforeDate(
              destructionDate,
              comparisonInterval,
              releases
            );

            // Find the closest Wayback release to the calculated "before" date
            const beforeReleaseIdx = findClosestReleaseIndex(releases, beforeDate);
            setBeforeReleaseIndex(beforeReleaseIdx);
          }
        }
      }
    },
    [
      syncMapOnDotClick,
      comparisonModeEnabled,
      comparisonInterval,
      findNearestWaybackRelease,
      filteredSites,
      releases,
    ]
  );

  /**

  /**
   * Reset wayback sliders to initial positions
   * Green slider (after) goes to last release (most recent)
   * Yellow slider (before) goes to first release (earliest)
   */
  const handleWaybackReset = useCallback(() => {
    if (releases.length > 0) {
      setCurrentReleaseIndex(releases.length - 1); // Most recent
      setBeforeReleaseIndex(0); // Earliest
    }
  }, [releases]);

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
      <PalestinianFlagTriangle width={800} zIndex={0} />

      {/* Header - shared across all pages */}
      <AppHeader onOpenHelp={() => setIsHelpOpen(true)} />

      {/* Main content */}
      {/* Relative positioning creates stacking context above z-0 triangle */}
      {/* pb-8 adds bottom padding to prevent footer overlap */}
      <main className="h-[calc(100vh-58px)] p-4 pb-8 flex flex-col gap-2 relative">
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
            <div
              className={`flex-shrink-0 mb-2 p-2 backdrop-blur-sm border ${t.border.primary} rounded shadow-lg relative transition-colors duration-200 ${isDark ? "bg-[#000000]/95" : "bg-white/95"}`}
              style={{ zIndex: Z_INDEX.FILTER_BAR }}
            >
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
            </div>

            {/* Full-screen satellite map with Wayback imagery */}
            <div
              className={`flex-1 min-h-0 ${comparisonModeEnabled ? '' : `${t.border.primary2} rounded shadow-xl overflow-hidden`} relative z-10`}
            >
              <Suspense fallback={<SkeletonMap />}>
                {comparisonModeEnabled ? (
                  <ComparisonMapView
                    sites={filteredSites}
                    highlightedSiteId={highlightedSiteId}
                    before={{
                      tileUrl: beforeRelease?.tileUrl || "",
                      maxZoom: beforeRelease?.maxZoom || 19,
                      dateLabel: beforeRelease?.releaseDate,
                    }}
                    after={{
                      tileUrl: currentRelease?.tileUrl || "",
                      maxZoom: currentRelease?.maxZoom || 19,
                      dateLabel: currentRelease?.releaseDate,
                    }}
                    onSiteClick={setSelectedSite}
                  />
                ) : (
                  <SiteDetailView
                    sites={filteredSites}
                    highlightedSiteId={highlightedSiteId}
                    customTileUrl={currentRelease?.tileUrl}
                    customMaxZoom={currentRelease?.maxZoom}
                    dateLabel={currentRelease?.releaseDate}
                    onSiteClick={setSelectedSite}
                    comparisonModeActive={false}
                  />
                )}
              </Suspense>
            </div>

            {/* Wayback Release Slider - Visual timeline with year markers */}
            <div className="flex-shrink-0 relative z-10">
              <WaybackSlider
                releases={releases}
                currentIndex={currentReleaseIndex}
                onIndexChange={setCurrentReleaseIndex}
                totalSites={filteredSites.length}
                comparisonMode={comparisonModeEnabled}
                beforeIndex={beforeReleaseIndex}
                onBeforeIndexChange={setBeforeReleaseIndex}
                onComparisonModeToggle={() => setComparisonModeEnabled(!comparisonModeEnabled)}
                comparisonInterval={comparisonInterval}
                onIntervalChange={setComparisonInterval}
                syncMapVersion={syncMapOnDotClick}
                onSyncMapVersionToggle={() => setSyncMapOnDotClick(!syncMapOnDotClick)}
              />
            </div>

            {/* Timeline Scrubber - Site filtering with advanced mode sync */}
            <div className="flex-shrink-0 min-h-[100px] relative z-10">
              <Suspense fallback={<SkeletonMap />}>
                <TimelineScrubber
                  key="advanced-timeline-scrubber"
                  sites={filteredSites}
                  highlightedSiteId={highlightedSiteId}
                  onSiteHighlight={handleSiteHighlight}
                  advancedMode={{
                    syncMapOnDotClick,
                    showNavigation: true, // Show Previous/Next buttons
                    hidePlayControls: true, // Hide Play/Pause/Speed controls on Advanced Timeline page
                    onReset: handleWaybackReset, // Reset wayback sliders to initial positions
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
        <TimelineHelpModal />
      </Modal>

      {/* Footer - Desktop only */}
      <AppFooter
        
        isMobile={false}
      />
    </div>
  );
}
