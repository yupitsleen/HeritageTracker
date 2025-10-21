import { useEffect, useCallback, useMemo } from "react";
import { useWayback } from "../../contexts/WaybackContext";
import { useTheme } from "../../contexts/ThemeContext";
import { NavigationControls } from "./NavigationControls";
import type { GazaSite } from "../../types";

/**
 * Find the closest Wayback release index for a given date
 */
function findClosestReleaseIndex(releases: Array<{ releaseDate: string }>, targetDate: string): number {
  const targetTime = new Date(targetDate).getTime();
  let closestIndex = 0;
  let minDiff = Math.abs(new Date(releases[0].releaseDate).getTime() - targetTime);

  for (let i = 1; i < releases.length; i++) {
    const diff = Math.abs(new Date(releases[i].releaseDate).getTime() - targetTime);
    if (diff < minDiff) {
      minDiff = diff;
      closestIndex = i;
    }
  }

  return closestIndex;
}

interface WaybackSliderProps {
  sites?: GazaSite[];
  showEventMarkers?: boolean;
}

/**
 * WaybackSlider - Timeline slider for scrubbing through Wayback releases
 * Simpler than TimelineScrubber - uses HTML range input instead of D3
 * Better suited for discrete releases (150+) vs continuous date range
 *
 * Optional: Display destruction event markers on timeline
 */
export function WaybackSlider({ sites = [], showEventMarkers = true }: WaybackSliderProps = {}) {
  const { releases, currentIndex, setIndex } = useWayback();
  const { isDark } = useTheme();

  const currentRelease = releases[currentIndex];
  const startRelease = releases[0];
  const endRelease = releases[releases.length - 1];

  // Calculate event marker positions
  const eventMarkers = useMemo(() => {
    if (!showEventMarkers || sites.length === 0 || releases.length === 0) {
      return [];
    }

    // Get all destruction events
    const destructionEvents = sites
      .filter((site) => site.dateDestroyed)
      .map((site) => ({
        siteId: site.id,
        siteName: site.name,
        date: site.dateDestroyed!,
        status: site.status,
      }));

    // Map each event to a timeline position
    return destructionEvents.map((event) => {
      const releaseIndex = findClosestReleaseIndex(releases, event.date);
      const position = (releaseIndex / (releases.length - 1)) * 100;

      return {
        ...event,
        releaseIndex,
        position,
      };
    });
  }, [sites, releases, showEventMarkers]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't interfere with typing in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          setIndex(Math.max(0, currentIndex - 1));
          break;
        case 'ArrowRight':
          e.preventDefault();
          setIndex(Math.min(releases.length - 1, currentIndex + 1));
          break;
        case 'Home':
          e.preventDefault();
          setIndex(0);
          break;
        case 'End':
          e.preventDefault();
          setIndex(releases.length - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, releases.length, setIndex]);

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setIndex(Number(e.target.value));
  }, [setIndex]);

  if (releases.length === 0) {
    return null;
  }

  return (
    <div className={`p-4 ${isDark ? "bg-black/70" : "bg-white/70"}`}>
      {/* Date labels */}
      <div className="flex justify-between items-center text-xs mb-2">
        <span className={isDark ? "text-gray-400" : "text-gray-600"}>
          {startRelease?.label}
        </span>
        <div className="text-center">
          <div className={`text-lg font-bold ${isDark ? "text-white" : "text-black"}`}>
            {currentRelease?.label}
          </div>
          <div className={isDark ? "text-gray-400" : "text-gray-600"}>
            Version {currentIndex + 1} of {releases.length}
          </div>
        </div>
        <span className={isDark ? "text-gray-400" : "text-gray-600"}>
          {endRelease?.label}
        </span>
      </div>

      {/* Slider with event markers */}
      <div className="relative">
        {/* Event markers layer - positioned above slider */}
        {showEventMarkers && eventMarkers.length > 0 && (
          <div className="absolute -top-6 left-0 right-0 h-6 pointer-events-none">
            {eventMarkers.map((marker, i) => (
              <div
                key={`${marker.siteId}-${i}`}
                className="absolute group pointer-events-auto"
                style={{ left: `${marker.position}%` }}
                title={`${marker.siteName} - ${marker.date}`}
              >
                {/* Vertical line */}
                <div className="absolute w-0.5 h-6 bg-[#ed3039] -translate-x-1/2" />

                {/* Tooltip on hover */}
                <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[2000] whitespace-nowrap ${
                  isDark ? "bg-gray-900 text-white" : "bg-white text-black"
                } px-2 py-1 rounded text-xs border-2 ${isDark ? "border-white" : "border-black"} shadow-xl`}>
                  <div className="font-bold">{marker.siteName}</div>
                  <div className={isDark ? "text-gray-400" : "text-gray-600"}>{marker.date}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Slider input */}
        <input
          type="range"
          min={0}
          max={releases.length - 1}
          value={currentIndex}
          onChange={handleSliderChange}
          className={`w-full h-2 rounded-lg appearance-none cursor-pointer
                     ${isDark ? "bg-gray-700" : "bg-gray-300"}
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-4
                     [&::-webkit-slider-thumb]:h-4
                     [&::-webkit-slider-thumb]:bg-[#009639]
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-webkit-slider-thumb]:shadow-md
                     [&::-moz-range-thumb]:w-4
                     [&::-moz-range-thumb]:h-4
                     [&::-moz-range-thumb]:bg-[#009639]
                     [&::-moz-range-thumb]:rounded-full
                     [&::-moz-range-thumb]:cursor-pointer
                     [&::-moz-range-thumb]:border-0
                     [&::-moz-range-thumb]:shadow-md`}
          aria-label="Wayback imagery version slider"
          aria-valuemin={0}
          aria-valuemax={releases.length - 1}
          aria-valuenow={currentIndex}
          aria-valuetext={`${currentRelease?.label}, version ${currentIndex + 1} of ${releases.length}`}
        />
      </div>

      {/* Navigation buttons */}
      <div className="mt-4">
        <NavigationControls />
      </div>

      {/* Keyboard shortcuts hint */}
      <div className={`text-xs text-center mt-3 ${isDark ? "text-gray-500" : "text-gray-600"}`}>
        <kbd className={`px-1.5 py-0.5 ${isDark ? "bg-gray-700" : "bg-gray-200"} rounded`}>←/→</kbd> Navigate
        {' • '}
        <kbd className={`px-1.5 py-0.5 ${isDark ? "bg-gray-700" : "bg-gray-200"} rounded`}>Home/End</kbd> Jump
      </div>
    </div>
  );
}
