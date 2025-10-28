import { lazy, Suspense, useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MoonIcon, SunIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../contexts/ThemeContext";
import { useThemeClasses } from "../hooks/useThemeClasses";
import { useTranslation } from "../contexts/LocaleContext";
import { Button } from "../components/Button";
import { IconButton } from "../components/Button/IconButton";
import { LanguageSelector } from "../components/LanguageSelector";
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
  const translate = useTranslation();
  const navigate = useNavigate();

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
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
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
        className={`sticky top-0 z-[10] transition-colors duration-200 ${
          isDark ? "bg-gray-900 opacity-95" : "bg-[#000000] opacity-90"
        }`}
        dir="ltr"
      >
        {/* dir="ltr" keeps navigation and utility controls in consistent positions */}
        <div className="max-w-full px-4 py-2 relative">
          {/* Left: Back button */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Button
              onClick={handleBackClick}
              variant="ghost"
              size="sm"
              lightText
              className="flex items-center gap-1.5"
            >
              <span className="text-base">&larr;</span>
              {translate("advancedTimeline.backToMain")}
            </Button>
          </div>

          {/* Center: Title */}
          <h1 className="text-lg font-bold text-[#fefefe] text-center">
            {translate("advancedTimeline.title")}
          </h1>

          {/* Right: Help + Language + Dark mode toggle + Info */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {/* Help Button */}
            <IconButton
              icon={<QuestionMarkCircleIcon className="w-4 h-4" />}
              onClick={() => setIsHelpOpen(true)}
              ariaLabel="How to use this page"
              title="How to use this page"
            />

            {/* Language Selector - Dropdown showing all registered locales */}
            <LanguageSelector />

            {/* Dark Mode Toggle */}
            <IconButton
              icon={isDark ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
              onClick={toggleTheme}
              ariaLabel={isDark ? "Switch to light mode" : "Switch to dark mode"}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            />

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

      {/* Help Modal */}
      <Modal
        isOpen={isHelpOpen}
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
        onOpenDonate={() => setIsDonateOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        isMobile={false}
      />
    </div>
  );
}
