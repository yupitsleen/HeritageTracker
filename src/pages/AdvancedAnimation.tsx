import { lazy, Suspense, useState, useCallback, useRef, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useThemeClasses } from "../hooks/useThemeClasses";
import { Modal } from "../components/Modal/Modal";
import { AppHeader } from "../components/Layout/AppHeader";
import { AppFooter } from "../components/Layout/AppFooter";
import { Button } from "../components/Button";
import { mockSites } from "../data/mockSites";
import { SkeletonMap } from "../components/Loading/Skeleton";
import { useWaybackReleases } from "../hooks/useWaybackReleases";
import { WaybackSlider } from "../components/AdvancedTimeline";
import { AnimationProvider } from "../contexts/AnimationContext";
import type { GazaSite } from "../types";

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

  /**
   * Find the latest Wayback release that occurred BEFORE (or on) the destruction date
   * This shows the satellite imagery from right before the site was destroyed
   *
   * @param targetDate - The destruction date to search for
   * @returns Index of the nearest release, or 0 if no releases available
   * @throws Never throws - returns 0 for invalid inputs
   */
  const findNearestWaybackRelease = useCallback(
    (targetDate: Date): number => {
      // Guard: Empty releases array
      if (releases.length === 0) return 0;

      // Guard: Invalid date
      if (!targetDate || isNaN(targetDate.getTime())) {
        console.warn('findNearestWaybackRelease: Invalid target date provided, using first release');
        return 0;
      }

      const targetTime = targetDate.getTime();
      let nearestIndex = 0;

      // Find the LATEST release that occurred BEFORE or ON the target date
      // We iterate through all releases and keep updating to the latest one that's still before/on target
      for (let i = 0; i < releases.length; i++) {
        const releaseDate = new Date(releases[i].releaseDate);

        // Guard: Invalid release date
        if (isNaN(releaseDate.getTime())) {
          console.warn(`findNearestWaybackRelease: Invalid release date at index ${i}, skipping`);
          continue;
        }

        const releaseTime = releaseDate.getTime();

        // Only consider releases that are before or on the target date
        if (releaseTime <= targetTime) {
          nearestIndex = i; // This is valid, keep it
        } else {
          // We've passed the target date, stop looking
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
   *
   * @param siteId - ID of the selected site, or null to deselect
   */
  const handleSiteHighlight = useCallback(
    (siteId: string | null) => {
      setHighlightedSiteId(siteId);

      // If sync is enabled and a site is selected, find and show the nearest Wayback release
      // Use ref to get current value without recreating callback
      if (syncMapOnDotClickRef.current && siteId) {
        const site = mockSites.find((s: GazaSite) => s.id === siteId);
        if (site?.dateDestroyed) {
          const destructionDate = new Date(site.dateDestroyed);
          const nearestReleaseIndex = findNearestWaybackRelease(destructionDate);
          setCurrentReleaseIndex(nearestReleaseIndex);
        }
      }
    },
    [findNearestWaybackRelease]
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
          background: isDark ? '#8b2a30' : '#ed3039',
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
          <AnimationProvider sites={mockSites}>
            {/* Full-screen satellite map with Wayback imagery */}
            <div
              className={`flex-1 min-h-0 ${t.border.primary2} rounded shadow-xl overflow-hidden`}
            >
              <Suspense fallback={<SkeletonMap />}>
                <SiteDetailView
                  sites={mockSites}
                  highlightedSiteId={highlightedSiteId}
                  customTileUrl={currentRelease?.tileUrl}
                  customMaxZoom={currentRelease?.maxZoom}
                  onSiteClick={setSelectedSite}
                />
              </Suspense>
            </div>

            {/* Wayback Release Slider - Visual timeline with year markers */}
            <div className="flex-shrink-0">
              <WaybackSlider
                releases={releases}
                currentIndex={currentReleaseIndex}
                onIndexChange={setCurrentReleaseIndex}
                totalSites={mockSites.length}
              />
            </div>

            {/* Timeline Scrubber - Site filtering with advanced mode sync */}
            <div className="flex-shrink-0 min-h-[100px]">
              <Suspense fallback={<SkeletonMap />}>
                <TimelineScrubber
                  key="advanced-timeline-scrubber"
                  sites={mockSites}
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
        zIndex={10000}
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

      {/* Donate Modal */}
      <Modal isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        zIndex={10001}
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
