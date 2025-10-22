import { lazy, Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useThemeClasses } from "../hooks/useThemeClasses";
import { Button } from "../components/Button";
import { mockSites } from "../data/mockSites";
import { SkeletonMap } from "../components/Loading/Skeleton";

// Lazy load the map and timeline components
const SiteDetailView = lazy(() =>
  import("../components/Map/SiteDetailView").then((m) => ({ default: m.SiteDetailView }))
);
const TimelineScrubber = lazy(() =>
  import("../components/Timeline/TimelineScrubber").then((m) => ({ default: m.TimelineScrubber }))
);

/**
 * Advanced Animation Page
 * Full-screen satellite map with timeline scrubber
 * Reuses the same components as the home page for consistency
 */
export function AdvancedAnimation() {
  const { isDark } = useTheme();
  const t = useThemeClasses();
  const navigate = useNavigate();

  // Local state for filtering and selection
  const [highlightedSiteId, setHighlightedSiteId] = useState<string | null>(null);
  const [destructionDateStart, setDestructionDateStart] = useState<Date | null>(null);
  const [destructionDateEnd, setDestructionDateEnd] = useState<Date | null>(null);

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
            {mockSites.length} Sites | Historical Imagery
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

      {/* Main content - Full screen satellite map + timeline */}
      <main className="h-[calc(100vh-58px)] p-4 flex flex-col gap-2">
        {/* Full-screen satellite map */}
        <div
          className={`flex-1 min-h-0 border-2 ${
            isDark ? "border-white" : "border-black"
          } rounded shadow-xl overflow-hidden`}
        >
          <Suspense fallback={<SkeletonMap />}>
            <SiteDetailView
              sites={mockSites}
              highlightedSiteId={highlightedSiteId}
            />
          </Suspense>
        </div>

        {/* Timeline Scrubber - Same as home page */}
        <div className="flex-shrink-0 h-[100px]">
          <Suspense fallback={<SkeletonMap />}>
            <TimelineScrubber
              sites={mockSites}
              destructionDateStart={destructionDateStart}
              destructionDateEnd={destructionDateEnd}
              onDestructionDateStartChange={setDestructionDateStart}
              onDestructionDateEndChange={setDestructionDateEnd}
              highlightedSiteId={highlightedSiteId}
              onSiteHighlight={setHighlightedSiteId}
            />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
