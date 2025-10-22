import { lazy, Suspense, useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useThemeClasses } from "../hooks/useThemeClasses";
import { Button } from "../components/Button";
import { mockSites } from "../data/mockSites";
import { SkeletonMap } from "../components/Loading/Skeleton";
import { useWaybackReleases } from "../hooks/useWaybackReleases";
import { WaybackSlider } from "../components/AdvancedTimeline";
import { AnimationProvider } from "../contexts/AnimationContext";
import type { GazaSite } from "../types";

// Lazy load the map and timeline components
const SiteDetailView = lazy(() =>
  import("../components/Map/SiteDetailView").then((m) => ({ default: m.SiteDetailView }))
);
const TimelineScrubber = lazy(() =>
  import("../components/Timeline/TimelineScrubber").then((m) => ({ default: m.TimelineScrubber }))
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
  const navigate = useNavigate();

  // Fetch Wayback releases
  const { releases, isLoading, error } = useWaybackReleases();

  // Wayback state
  const [currentReleaseIndex, setCurrentReleaseIndex] = useState(0);

  // Site filtering state
  const [highlightedSiteId, setHighlightedSiteId] = useState<string | null>(null);
  const [destructionDateStart, setDestructionDateStart] = useState<Date | null>(null);
  const [destructionDateEnd, setDestructionDateEnd] = useState<Date | null>(null);

  // Sync Map toggle - when enabled, clicking timeline dots syncs map to nearest Wayback release
  const [syncMapOnDotClick, setSyncMapOnDotClick] = useState(false);

  // Get current release
  const currentRelease = releases.length > 0 ? releases[currentReleaseIndex] : null;

  /**
   * Find the latest Wayback release that occurred BEFORE (or on) the destruction date
   * This shows the satellite imagery from right before the site was destroyed
   */
  const findNearestWaybackRelease = useCallback(
    (targetDate: Date): number => {
      if (releases.length === 0) return 0;

      const targetTime = targetDate.getTime();
      let nearestIndex = 0;

      // Find the LATEST release that occurred BEFORE or ON the target date
      // We iterate through all releases and keep updating to the latest one that's still before/on target
      for (let i = 0; i < releases.length; i++) {
        const releaseTime = new Date(releases[i].releaseDate).getTime();

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
              onClick={() => navigate("/")}
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

          {/* Right: Info */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
            {isLoading && "Loading..."}
            {error && "Error"}
            {!isLoading && !error && `${releases.length} Imagery Versions | ${mockSites.length} Sites`}
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
          <div className={`flex-1 flex items-center justify-center rounded border-2 ${isDark ? "border-white bg-black/50" : "border-black bg-white/50"} shadow-xl`}>
            <div className="text-center">
              <div className={`text-xl mb-2 ${t.text.heading}`}>Loading Wayback Archive...</div>
              <div className={`text-sm ${t.text.muted}`}>Fetching 186 historical imagery versions...</div>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className={`flex-1 flex items-center justify-center rounded border-2 ${isDark ? "border-white bg-black/50" : "border-black bg-white/50"} shadow-xl`}>
            <div className="text-center">
              <div className="text-xl font-bold mb-2 text-red-600">Error Loading Archive</div>
              <div className={`text-sm mb-4 ${t.text.muted}`}>{error}</div>
              <Button onClick={() => window.location.reload()} variant="primary" size="sm">
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Success state - Map + Wayback controls */}
        {!isLoading && !error && releases.length > 0 && (
          <>
            {/* Full-screen satellite map with Wayback imagery */}
            <div
              className={`flex-1 min-h-0 border-2 ${
                isDark ? "border-white" : "border-black"
              } rounded shadow-xl overflow-hidden`}
            >
              <Suspense fallback={<SkeletonMap />}>
                <SiteDetailView
                  sites={mockSites}
                  highlightedSiteId={highlightedSiteId}
                  customTileUrl={currentRelease?.tileUrl}
                  customMaxZoom={currentRelease?.maxZoom}
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

            {/* Timeline Scrubber - Site filtering with Sync Map toggle */}
            <div className="flex-shrink-0">
              {/* Sync Map toggle for Advanced Animation page */}
              <div className="mb-1 flex items-center justify-end">
                <Button
                  onClick={() => setSyncMapOnDotClick(!syncMapOnDotClick)}
                  variant={syncMapOnDotClick ? "primary" : "secondary"}
                  size="xs"
                  aria-label={syncMapOnDotClick ? "Disable map sync on dot click" : "Enable map sync on dot click"}
                  title="When enabled, clicking timeline dots syncs satellite map to nearest Wayback release"
                >
                  {syncMapOnDotClick ? "✓" : ""} Sync Map
                </Button>
              </div>

              <div className="h-[100px]">
                {/* Wrap in AnimationProvider outside Suspense to prevent remounting */}
                <AnimationProvider sites={mockSites}>
                  <Suspense fallback={<SkeletonMap />}>
                    <TimelineScrubber
                      sites={mockSites}
                      destructionDateStart={destructionDateStart}
                      destructionDateEnd={destructionDateEnd}
                      onDestructionDateStartChange={setDestructionDateStart}
                      onDestructionDateEndChange={setDestructionDateEnd}
                      highlightedSiteId={highlightedSiteId}
                      onSiteHighlight={handleSiteHighlight}
                    />
                  </Suspense>
                </AnimationProvider>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
