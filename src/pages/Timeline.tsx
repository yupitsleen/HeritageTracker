import { lazy, Suspense, useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useThemeClasses } from "../hooks/useThemeClasses";
import { Modal } from "../components/Modal/Modal";
import { AppHeader } from "../components/Layout/AppHeader";
import { AppFooter } from "../components/Layout/AppFooter";
import { Button } from "../components/Button";
import { FilterBar } from "../components/FilterBar/FilterBar";
import { mockSites } from "../data/mockSites";
import { SkeletonMap } from "../components/Loading/Skeleton";
import { useWaybackReleases } from "../hooks/useWaybackReleases";
import { WaybackSlider } from "../components/AdvancedTimeline";
import { AnimationProvider } from "../contexts/AnimationContext";
import type { GazaSite } from "../types";
import type { FilterState } from "../types/filters";
import { createEmptyFilterState } from "../types/filters";
import { Z_INDEX } from "../constants/layout";
import { COLORS } from "../config/colorThemes";

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
  const [selectedSite, setSelectedSite] = useState<GazaSite | null>(null);

  // Sync Map toggle - when enabled, clicking timeline dots syncs map to nearest Wayback release
  // Default to ON for better user experience on Advanced Timeline page
  const [syncMapOnDotClick, setSyncMapOnDotClick] = useState(true);

  // Comparison Mode toggle - when enabled, shows two maps side-by-side
  // Default to OFF for standard single-map view
  const [comparisonModeEnabled, setComparisonModeEnabled] = useState(false);

  // Before release index for comparison mode (earlier imagery)
  const [beforeReleaseIndex, setBeforeReleaseIndex] = useState(0);

  // Modal states for footer and help
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Get current release (for "after" imagery or single map mode)
  const currentRelease = releases.length > 0 ? releases[currentReleaseIndex] : null;

  // Get before release (for "before" imagery in comparison mode)
  const beforeRelease = releases.length > 0 ? releases[beforeReleaseIndex] : null;

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

      // Destruction date filter
      if (filters.destructionDateStart && site.dateDestroyed) {
        const destructionDate = new Date(site.dateDestroyed);
        if (destructionDate < filters.destructionDateStart) {
          return false;
        }
      }

      if (filters.destructionDateEnd && site.dateDestroyed) {
        const destructionDate = new Date(site.dateDestroyed);
        if (destructionDate > filters.destructionDateEnd) {
          return false;
        }
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
   * Find the nearest Wayback release that occurred BEFORE the destruction date
   * This shows the satellite imagery from before the site was destroyed
   *
   * @param targetDate - The destruction date to search for
   * @returns Index of the nearest release before destruction, or 0 if none found
   * @throws Never throws - returns 0 for invalid inputs
   */
  const findNearestWaybackReleaseBeforeDestruction = useCallback(
    (targetDate: Date): number => {
      // Guard: Empty releases array
      if (releases.length === 0) return 0;

      // Guard: Invalid date
      if (!targetDate || isNaN(targetDate.getTime())) {
        console.warn('findNearestWaybackReleaseBeforeDestruction: Invalid target date provided, using first release');
        return 0;
      }

      const targetTime = targetDate.getTime();
      let nearestIndex = 0;

      // Find the LATEST release that occurred BEFORE the target date
      // We iterate through all releases in reverse and return the first one before the target
      for (let i = releases.length - 1; i >= 0; i--) {
        const releaseDate = new Date(releases[i].releaseDate);

        // Guard: Invalid release date
        if (isNaN(releaseDate.getTime())) {
          console.warn(`findNearestWaybackReleaseBeforeDestruction: Invalid release date at index ${i}, skipping`);
          continue;
        }

        const releaseTime = releaseDate.getTime();

        // Return the first release that's before the target date
        if (releaseTime < targetTime) {
          nearestIndex = i;
          break;
        }
      }

      return nearestIndex;
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
   * In comparison mode, also sets the "before" imagery
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

          // Set "after" imagery (post-destruction)
          const nearestReleaseIndex = findNearestWaybackRelease(destructionDate);
          setCurrentReleaseIndex(nearestReleaseIndex);

          // If comparison mode is enabled, also set "before" imagery (pre-destruction)
          if (comparisonModeEnabled) {
            const beforeReleaseIdx = findNearestWaybackReleaseBeforeDestruction(destructionDate);
            setBeforeReleaseIndex(beforeReleaseIdx);
          }
        }
      }
    },
    [findNearestWaybackRelease, findNearestWaybackReleaseBeforeDestruction, filteredSites, comparisonModeEnabled]
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
            <div
              className={`flex-shrink-0 mb-2 p-2 backdrop-blur-sm border ${t.border.primary} rounded shadow-lg relative transition-colors duration-200 ${isDark ? "bg-[#000000]/95" : "bg-white/95"}`}
              style={{ zIndex: Z_INDEX.CONTENT }}
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
                    beforeTileUrl={beforeRelease?.tileUrl || ""}
                    afterTileUrl={currentRelease?.tileUrl || ""}
                    beforeMaxZoom={beforeRelease?.maxZoom || 19}
                    afterMaxZoom={currentRelease?.maxZoom || 19}
                    beforeDateLabel={beforeRelease?.releaseDate}
                    afterDateLabel={currentRelease?.releaseDate}
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
          <h2 className={`text-2xl font-bold mb-4 ${t.text.heading}`}>How to Use Satellite Timeline</h2>

          <div className={`space-y-4 ${t.text.body}`}>
            <section>
              <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Overview</h3>
              <p className="text-sm">
                The Satellite Timeline provides access to 150+ historical satellite imagery versions from
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
              <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Comparison Mode</h3>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li><strong>Toggle:</strong> Click "Comparison Mode" button above the timeline to enable side-by-side view</li>
                <li><strong>Two Maps:</strong> View "before" imagery (left) and "after" imagery (right) simultaneously</li>
                <li><strong>Yellow Scrubber:</strong> Controls the "before" date (appears below timeline with yellow tooltip)</li>
                <li><strong>Green Scrubber:</strong> Controls the "after" date (above timeline with green tooltip)</li>
                <li><strong>Click Timeline:</strong> Moves the closest scrubber to that date</li>
                <li><strong>Auto-Sync:</strong> When clicking site dots with sync enabled, automatically sets before/after imagery around the destruction date</li>
                <li>Perfect for comparing satellite imagery before and after destruction events</li>
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
