import { lazy, Suspense, useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../contexts/ThemeContext";
import { useThemeClasses } from "../hooks/useThemeClasses";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal/Modal";
import { AppFooter } from "../components/Layout/AppFooter";
import { mockSites } from "../data/mockSites";
import { SkeletonMap } from "../components/Loading/Skeleton";
import { useWaybackReleases } from "../hooks/useWaybackReleases";
import { WaybackSlider } from "../components/AdvancedTimeline";
import { AnimationProvider } from "../contexts/AnimationContext";
import type { GazaSite } from "../types";

// Lazy load the map, timeline, and modal components
const SiteDetailView = lazy(() =>
  import("../components/Map/SiteDetailView").then((m) => ({ default: m.SiteDetailView }))
);
const TimelineScrubber = lazy(() =>
  import("../components/Timeline/TimelineScrubber").then((m) => ({ default: m.TimelineScrubber }))
);
const SiteDetailPanel = lazy(() =>
  import("../components/SiteDetail/SiteDetailPanel").then((m) => ({ default: m.SiteDetailPanel }))
);
const About = lazy(() => import("../components/About/About").then(m => ({ default: m.About })));
const StatsDashboard = lazy(() => import("../components/Stats/StatsDashboard").then(m => ({ default: m.StatsDashboard })));
const DonateModal = lazy(() => import("../components/Donate/DonateModal").then(m => ({ default: m.DonateModal })));

/**
 * Advanced Animation Page
 * Full-screen satellite map with Wayback imagery (186 historical versions)
 * Timeline scrubber for site filtering
 * Reuses SiteDetailView and TimelineScrubber from home page
 */
export function AdvancedAnimation() {
  const { isDark, toggleTheme } = useTheme();
  const t = useThemeClasses();
  const navigate = useNavigate();

  // Fetch Wayback releases
  const { releases, isLoading, error } = useWaybackReleases();

  // Wayback state
  const [currentReleaseIndex, setCurrentReleaseIndex] = useState(0);

  // Site filtering state
  const [highlightedSiteId, setHighlightedSiteId] = useState<string | null>(null);
  const [destructionDateStart, setDestructionDateStart] = useState<Date | null>(null);
  const [destructionDateEnd, setDestructionDateEnd] = useState<Date | null>(null);
  const [selectedSite, setSelectedSite] = useState<GazaSite | null>(null);

  // Sync Map toggle - when enabled, clicking timeline dots syncs map to nearest Wayback release
  const [syncMapOnDotClick, setSyncMapOnDotClick] = useState(false);

  // Modal states for footer
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

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
   * Navigate back to home page
   */
  const handleBackClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

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
      {/* Header with back button */}
      <header
        className={`sticky top-0 z-[5] transition-colors duration-200 ${
          isDark ? "bg-gray-900 opacity-95" : "bg-[#000000] opacity-90"
        }`}
      >
        <div className="max-w-full px-4 py-2 relative">
          {/* Left: Back button */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Button
              onClick={handleBackClick}
              variant="ghost"
              size="sm"
              className="flex items-center gap-1.5"
            >
              <span className="text-base">&larr;</span>
              Back
            </Button>
          </div>

          {/* Center: Title */}
          <h1 className="text-lg font-bold text-[#fefefe] text-center">
            Advanced Satellite Timeline
          </h1>

          {/* Right: Dark mode toggle + Info */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-1.5 rounded shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 ${
                isDark
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-200 hover:text-white"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
              }`}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <SunIcon className="w-4 h-4" />
              ) : (
                <MoonIcon className="w-4 h-4" />
              )}
            </button>

            {/* Info text */}
            <div className="text-xs text-gray-400">
              {isLoading && "Loading..."}
              {error && "Error"}
              {!isLoading && !error && `${releases.length} Imagery Versions | ${mockSites.length} Sites`}
            </div>
          </div>
        </div>

        {/* Flag-colored horizontal line */}
        <div className="flex h-1">
          <div className="flex-1 bg-[#ed3039]"></div>
          <div className="flex-1 bg-[#000000]"></div>
          <div className="flex-1 bg-[#ed3039]"></div>
          <div className="flex-1 bg-[#009639]"></div>
        </div>
      </header>

      {/* Main content */}
      <main className="h-[calc(100vh-58px)] p-4 flex flex-col gap-2">
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

      {/* Statistics Modal */}
      <Modal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        zIndex={10001}
      >
        <Suspense
          fallback={
            <div className={`p-8 text-center ${t.layout.loadingText}`}>
              <div>Loading statistics...</div>
            </div>
          }
        >
          <StatsDashboard sites={mockSites} />
        </Suspense>
      </Modal>

      {/* About Modal */}
      <Modal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        zIndex={10001}
      >
        <Suspense
          fallback={
            <div className={`p-8 text-center ${t.layout.loadingText}`}>
              <div>Loading about...</div>
            </div>
          }
        >
          <About />
        </Suspense>
      </Modal>

      {/* Donate Modal */}
      <Modal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        zIndex={10001}
      >
        <Suspense
          fallback={
            <div className={`p-8 text-center ${t.layout.loadingText}`}>
              <div>Loading...</div>
            </div>
          }
        >
          <DonateModal />
        </Suspense>
      </Modal>

      {/* Footer - Desktop only */}
      <AppFooter
        onOpenDonate={() => setIsDonateOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        isMobile={false}
      />
    </div>
  );
}
