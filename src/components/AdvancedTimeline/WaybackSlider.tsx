import { useMemo, useRef, useCallback } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import type { WaybackRelease } from "../../services/waybackService";

interface WaybackSliderProps {
  releases: WaybackRelease[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

/**
 * WaybackSlider - Interactive timeline for Wayback imagery releases
 *
 * Features:
 * - Year labels (2014-2025) spaced by date
 * - Tick marks for each of 186 releases positioned by date
 * - Clickable timeline bar to jump to any release
 * - Previous/Next step buttons
 * - Visual scrubber showing current position
 */
export function WaybackSlider({ releases, currentIndex, onIndexChange }: WaybackSliderProps) {
  const { isDark } = useTheme();
  const t = useThemeClasses();
  const timelineRef = useRef<HTMLDivElement>(null);

  const currentRelease = releases[currentIndex];

  // Calculate year markers and release positions
  const { yearMarkers, releasePositions, currentPositionPercent } = useMemo(() => {
    if (releases.length === 0) return { yearMarkers: [], releasePositions: [], currentPositionPercent: 0 };

    const firstDate = new Date(releases[0].releaseDate);
    const lastDate = new Date(releases[releases.length - 1].releaseDate);
    const startYear = firstDate.getFullYear();
    const endYear = lastDate.getFullYear();

    // Create year markers (positioned by actual date)
    const years: Array<{ year: number; position: number }> = [];
    for (let year = startYear; year <= endYear; year++) {
      const yearStart = new Date(`${year}-01-01`).getTime();
      const totalRange = lastDate.getTime() - firstDate.getTime();
      const yearOffset = yearStart - firstDate.getTime();
      const position = (yearOffset / totalRange) * 100;
      years.push({ year, position: Math.max(0, Math.min(100, position)) });
    }

    // Calculate position for each release
    const positions = releases.map((release, idx) => {
      const releaseDate = new Date(release.releaseDate).getTime();
      const totalRange = lastDate.getTime() - firstDate.getTime();
      const releaseOffset = releaseDate - firstDate.getTime();
      const position = (releaseOffset / totalRange) * 100;
      return {
        index: idx,
        position: Math.max(0, Math.min(100, position)),
        date: release.releaseDate,
      };
    });

    // Current release position
    const currentPos = positions[currentIndex]?.position || 0;

    return { yearMarkers: years, releasePositions: positions, currentPositionPercent: currentPos };
  }, [releases, currentIndex]);

  // Handle timeline click - find nearest release
  const handleTimelineClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickPercent = (clickX / rect.width) * 100;

    // Find the release closest to this position
    let closestIndex = 0;
    let closestDistance = Math.abs(releasePositions[0].position - clickPercent);

    for (let i = 1; i < releasePositions.length; i++) {
      const distance = Math.abs(releasePositions[i].position - clickPercent);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    }

    onIndexChange(closestIndex);
  }, [releasePositions, onIndexChange]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onIndexChange(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < releases.length - 1) {
      onIndexChange(currentIndex + 1);
    }
  };

  if (releases.length === 0) {
    return (
      <div className={`px-4 py-2 rounded border-2 ${isDark ? "border-white bg-black/50" : "border-black bg-white/50"} shadow-xl`}>
        <div className={`text-sm ${t.text.muted}`}>No imagery releases available</div>
      </div>
    );
  }

  return (
    <div className={`px-4 py-2 rounded border-2 ${isDark ? "border-white bg-black/50" : "border-black bg-white/50"} shadow-xl`}>
      {/* Header - Current date and position with step controls - centered */}
      <div className="flex items-center justify-center gap-3 mb-2">
        {/* Previous button */}
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className={`px-2 py-0.5 text-xs font-semibold rounded transition-all ${
            currentIndex === 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[#009639] hover:text-white"
          } ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"}`}
          aria-label="Previous imagery release"
        >
          ← Prev
        </button>

        <span className={`text-sm font-mono ${t.text.body}`}>
          {currentRelease?.releaseDate || "Unknown"}
        </span>
        <span className={`text-[10px] ${t.text.muted}`}>
          {currentIndex + 1} / {releases.length}
        </span>

        {/* Next button */}
        <button
          onClick={handleNext}
          disabled={currentIndex === releases.length - 1}
          className={`px-2 py-0.5 text-xs font-semibold rounded transition-all ${
            currentIndex === releases.length - 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[#009639] hover:text-white"
          } ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"}`}
          aria-label="Next imagery release"
        >
          Next →
        </button>
      </div>

      {/* Timeline visualization container */}
      <div className="relative">
        {/* Year labels - positioned above the timeline */}
        <div className="relative h-4 mb-0.5">
          {yearMarkers.map(({ year, position }) => (
            <div
              key={year}
              className="absolute -translate-x-1/2"
              style={{ left: `${position}%` }}
            >
              <span className={`text-[9px] font-semibold ${t.text.body}`}>
                {year}
              </span>
            </div>
          ))}
        </div>

        {/* Interactive timeline bar */}
        <div
          ref={timelineRef}
          className="relative h-3 cursor-pointer"
          onClick={handleTimelineClick}
        >
          {/* Background track */}
          <div className={`absolute inset-0 rounded ${isDark ? "bg-gray-600" : "bg-gray-300"}`} />

          {/* Green progress fill */}
          <div
            className="absolute inset-y-0 left-0 bg-[#009639] rounded-l"
            style={{ width: `${currentPositionPercent}%` }}
          />

          {/* Release tick marks with tooltips */}
          {releasePositions.map(({ index, position, date }) => {
            const isCurrentRelease = index === currentIndex;
            return (
              <div
                key={index}
                className="absolute top-0 bottom-0 -translate-x-1/2 group"
                style={{ left: `${position}%` }}
              >
                <div
                  className={`w-[1px] h-full ${
                    isCurrentRelease
                      ? "bg-white w-[2px]" // White and thicker for current
                      : isDark
                      ? "bg-gray-400"
                      : "bg-gray-500"
                  }`}
                />
                {/* Tooltip */}
                <div className={`absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${isDark ? "bg-gray-800 text-white" : "bg-gray-700 text-white"} shadow-md z-10`}>
                  {date}
                </div>
              </div>
            );
          })}

          {/* Current position scrubber indicator */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
            style={{ left: `${currentPositionPercent}%` }}
          >
            <div className="w-3 h-3 bg-white border-2 border-[#009639] rounded-full shadow-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
