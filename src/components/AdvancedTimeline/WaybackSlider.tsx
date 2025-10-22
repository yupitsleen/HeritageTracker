import { useEffect, useCallback, useMemo } from "react";
import { useWayback } from "../../contexts/WaybackContext";
import { useTheme } from "../../contexts/ThemeContext";
import { NavigationControls } from "./NavigationControls";
import { groupEventsByRelease } from "../../utils/waybackMarkers";
import { WAYBACK_TIMELINE } from "../../constants/wayback";
import { useYearMarkers } from "../../hooks/useYearMarkers";
import type { GazaSite } from "../../types";

interface WaybackSliderProps {
  sites?: GazaSite[];
  showEventMarkers?: boolean;
  highlightedSiteId?: string | null;
  showSiteMarkers?: boolean;
  onToggleSiteMarkers?: (show: boolean) => void;
}

/**
 * WaybackSlider - Timeline slider for scrubbing through Wayback releases
 * Simpler than TimelineScrubber - uses HTML range input instead of D3
 * Better suited for discrete releases (many versions) vs continuous date range
 *
 * Optional: Display destruction event markers on timeline
 */
export function WaybackSlider({
  sites = [],
  showEventMarkers = true,
  highlightedSiteId = null,
  showSiteMarkers = true,
  onToggleSiteMarkers
}: WaybackSliderProps) {
  const { releases, currentIndex, setIndex } = useWayback();
  const { isDark } = useTheme();

  const currentRelease = releases[currentIndex];
  const startRelease = releases[0];
  const endRelease = releases[releases.length - 1];

  // Calculate positions for gray Wayback release markers
  const waybackReleaseMarkers = useMemo(() => {
    if (releases.length === 0) return { majorMarkers: [], minorMarkers: [] };

    const majorMarkers: Array<{ releaseNum: number; date: string; label: string; position: number; isMajor: boolean }> = [];
    const minorMarkers: Array<{ releaseNum: number; date: string; label: string; position: number; isMajor: boolean }> = [];

    for (let i = 0; i < releases.length; i++) {
      const position = (i / (releases.length - 1)) * 100;
      const marker = {
        releaseNum: releases[i].releaseNum,
        date: releases[i].releaseDate,
        label: releases[i].label,
        position,
        isMajor: i % WAYBACK_TIMELINE.MAJOR_MARKER_INTERVAL === 0,
      };

      if (marker.isMajor) {
        majorMarkers.push(marker);
      } else {
        minorMarkers.push(marker);
      }
    }

    // Always make the last release a major marker if not already
    const lastIndex = releases.length - 1;
    if (lastIndex % WAYBACK_TIMELINE.MAJOR_MARKER_INTERVAL !== 0) {
      const position = 100;
      majorMarkers.push({
        releaseNum: releases[lastIndex].releaseNum,
        date: releases[lastIndex].releaseDate,
        label: releases[lastIndex].label,
        position,
        isMajor: true,
      });
    }

    return { majorMarkers, minorMarkers };
  }, [releases]);

  // Calculate year markers for timeline scale
  const yearMarkers = useYearMarkers(releases);

  // Calculate all destruction event markers grouped by position (for stacking dots)
  // Group destruction events by Wayback release for timeline visualization
  const allEventMarkers = useMemo(() => {
    if (!showEventMarkers) {
      return [];
    }
    return groupEventsByRelease(sites, releases);
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
        {/* Year markers - below timeline for scale reference */}
        <div className="absolute top-3 left-0 right-0 h-6 pointer-events-none">
          {yearMarkers.map((marker) => (
            <div
              key={`year-${marker.year}`}
              className="absolute"
              style={{ left: `${marker.position}%` }}
            >
              {/* Small black vertical line (half size of minor gray markers) */}
              <div className="absolute w-0.5 h-2 bg-black -translate-x-1/2 opacity-40" />

              {/* Year label below the line */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-medium text-black opacity-60 whitespace-nowrap">
                {marker.year}
              </div>
            </div>
          ))}
        </div>

        {/* Markers layer - positioned above slider */}
        <div className="absolute -top-6 left-0 right-0 h-8 pointer-events-none">
          {/* Minor gray markers - all releases (smaller, subtle, positioned lower) */}
          {waybackReleaseMarkers.minorMarkers.map((marker) => (
            <div
              key={`wayback-minor-${marker.releaseNum}`}
              className="absolute z-5 pointer-events-auto top-2 group"
              style={{ left: `${marker.position}%` }}
            >
              {/* Small gray vertical line touching the slider bar */}
              <div className={`absolute w-0.5 h-4 ${isDark ? "bg-gray-700" : "bg-gray-400"} -translate-x-1/2 opacity-30`} />

              {/* Tooltip on hover */}
              <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[2000] whitespace-nowrap ${
                isDark ? "bg-gray-900 text-white" : "bg-white text-black"
              } px-2 py-1 rounded text-xs border ${isDark ? "border-gray-600" : "border-gray-300"} shadow-md`}>
                <div className={`text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}>{marker.label}</div>
              </div>
            </div>
          ))}

          {/* Major gray markers - every 10th release (taller, more visible) */}
          {waybackReleaseMarkers.majorMarkers.map((marker) => (
            <div
              key={`wayback-major-${marker.releaseNum}`}
              className="absolute z-10 pointer-events-auto group"
              style={{ left: `${marker.position}%` }}
            >
              {/* Taller gray vertical line extending through the slider */}
              <div className={`absolute w-0.5 h-8 ${isDark ? "bg-gray-600" : "bg-gray-300"} -translate-x-1/2 opacity-50`} />

              {/* Tooltip on hover */}
              <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[2000] whitespace-nowrap ${
                isDark ? "bg-gray-900 text-white" : "bg-white text-black"
              } px-2 py-1 rounded text-xs border ${isDark ? "border-gray-600" : "border-gray-300"} shadow-md`}>
                <div className="font-semibold">{marker.label}</div>
              </div>
            </div>
          ))}

          {/* Red dot markers for destroyed sites - stacked vertically if multiple at same date */}
          {showEventMarkers && allEventMarkers.map((markerGroup, groupIndex) => (
            <div
              key={`marker-group-${groupIndex}`}
              className="absolute pointer-events-auto z-20"
              style={{ left: `${markerGroup.position}%` }}
            >
              {/* Stack dots vertically */}
              {markerGroup.sites.map((site, siteIndex) => {
                const isHighlighted = highlightedSiteId === site.siteId;
                return (
                  <div
                    key={`${site.siteId}-${siteIndex}`}
                    className="group"
                    style={{
                      position: 'absolute',
                      bottom: `${siteIndex * WAYBACK_TIMELINE.EVENT_MARKER_STACK_SPACING}px`,
                      left: '50%',
                      transform: 'translateX(-50%)',
                    }}
                  >
                    {/* Red dot - turns black when highlighted */}
                    <div className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      isHighlighted ? 'bg-black scale-150' : 'bg-[#ed3039]'
                    }`} />

                    {/* Tooltip on hover */}
                    <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[2000] whitespace-nowrap ${
                      isDark ? "bg-gray-900 text-white" : "bg-white text-black"
                    } px-2 py-1 rounded text-xs border-2 ${isDark ? "border-white" : "border-black"} shadow-xl`}>
                      <div className="font-bold">{site.siteName}</div>
                      <div className={isDark ? "text-gray-400" : "text-gray-600"}>{site.date}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Slider input with tooltip */}
        <div className="relative group">
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
            aria-keyshortcuts="ArrowLeft ArrowRight Home End"
          />

          {/* Tooltip showing exact date under the scrubber - always visible */}
          <div
            className={`absolute top-8 transition-all duration-200 pointer-events-none z-[2000] whitespace-nowrap ${
              isDark ? "bg-gray-900 text-white" : "bg-white text-black"
            } px-2 py-1 rounded text-xs border-2 border-[#009639] shadow-xl`}
            style={{ left: `${(currentIndex / (releases.length - 1)) * 100}%`, transform: 'translateX(-50%)' }}
          >
            <div className="font-bold text-[#009639]">{currentRelease?.label}</div>
          </div>
        </div>
      </div>

      {/* Navigation buttons - centered */}
      <div className="mt-8">
        <NavigationControls />
      </div>

      {/* Color key, site markers toggle, and keyboard shortcuts */}
      <div className="flex items-center justify-between mt-3">
        {/* Color key */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className={`w-0.5 h-4 ${isDark ? "bg-gray-600" : "bg-gray-300"} opacity-50`} />
            <span className={isDark ? "text-gray-400" : "text-gray-600"}>Satellite imagery dates</span>
          </div>
          {showEventMarkers && (
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-[#ed3039] rounded-full" />
              <span className={isDark ? "text-gray-400" : "text-gray-600"}>Site destruction dates</span>
            </div>
          )}
          {/* Site markers toggle */}
          {onToggleSiteMarkers && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showSiteMarkers}
                onChange={(e) => onToggleSiteMarkers(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
                aria-label="Toggle site markers on map"
              />
              <span className={`text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Show site markers
              </span>
            </label>
          )}
        </div>

        {/* Keyboard shortcuts */}
        <div className={`text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}>
          <kbd className={`px-1.5 py-0.5 ${isDark ? "bg-gray-700" : "bg-gray-200"} rounded`}>←/→</kbd> Navigate
          {' • '}
          <kbd className={`px-1.5 py-0.5 ${isDark ? "bg-gray-700" : "bg-gray-200"} rounded`}>Home/End</kbd> Jump
        </div>
      </div>
    </div>
  );
}
