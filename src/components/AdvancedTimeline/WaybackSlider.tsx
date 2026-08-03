import { useMemo, useRef, useCallback, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import { useTranslation } from "../../contexts/LocaleContext";
import { Button } from "../Button";
import { DateLabel } from "../Timeline/DateLabel";
import type { WaybackRelease } from "../../services/waybackService";
import { COLORS } from "../../config/colorThemes";
import { EmptyState } from "../EmptyState";
import { TOOLTIPS } from "../../config/tooltips";
import { Z_INDEX } from "../../constants/layout";

/**
 * Callback type for Wayback release index changes
 */
export type IndexChangeHandler = (index: number) => void;

/**
 * WaybackSlider props
 *
 * Comparison-mode *settings* (toggle, interval, sync) live in WaybackSettings;
 * this component only needs to know the resulting mode and the before index.
 */
export interface WaybackSliderProps {
  releases: WaybackRelease[];
  currentIndex: number;
  onIndexChange: IndexChangeHandler;
  // Left edge of the map column: the card runs the full page width, so the nav
  // buttons need this inset to sit under the maps they drive.
  mapsInsetPx?: number;
  // Comparison mode support
  comparisonMode?: boolean;
  beforeIndex?: number;
  onBeforeIndexChange?: IndexChangeHandler;
}

/**
 * WaybackSlider - Interactive timeline for Wayback imagery releases
 *
 * Features:
 * - Year labels spaced by date
 * - Tick marks for each release positioned by date
 * - Clickable timeline bar to jump to any release
 * - Previous/Next step buttons
 * - Visual scrubber showing current position
 * - Keyboard navigation (arrows, Home/End, PageUp/PageDown)
 * - Screen reader support with ARIA attributes
 */
export function WaybackSlider({
  releases,
  currentIndex,
  onIndexChange,
  mapsInsetPx = 0,
  comparisonMode = false,
  beforeIndex = 0,
  onBeforeIndexChange,
}: WaybackSliderProps) {
  const { isDark } = useTheme();
  const t = useThemeClasses();
  const translate = useTranslation();
  const timelineRef = useRef<HTMLDivElement>(null);

  const currentRelease = releases[currentIndex];
  const beforeRelease = comparisonMode && beforeIndex !== undefined ? releases[beforeIndex] : null;

  // Calculate year markers and release positions
  const { yearMarkers, releasePositions, currentPositionPercent, beforePositionPercent } = useMemo(() => {
    if (releases.length === 0) return { yearMarkers: [], releasePositions: [], currentPositionPercent: 0, beforePositionPercent: 0 };

    const firstDate = new Date(releases[0].releaseDate);
    const lastDate = new Date(releases[releases.length - 1].releaseDate);
    const startYear = firstDate.getFullYear();
    const endYear = lastDate.getFullYear();

    // Create year markers (positioned by actual date)
    const years: Array<{ year: number; position: number }> = [];
    const totalRange = lastDate.getTime() - firstDate.getTime();
    for (let year = startYear; year <= endYear; year++) {
      const isLastYear = year === endYear;
      // Pin the last year label to 100% so it aligns with the last tick rather
      // than floating at Jan 1 of that year (which leaves an unlabeled tail).
      const position = isLastYear
        ? 100
        : ((new Date(`${year}-01-01`).getTime() - firstDate.getTime()) / totalRange) * 100;
      years.push({ year, position: Math.max(0, Math.min(100, position)) });
    }

    // Calculate position for each release
    const positions = releases.map((release, idx) => {
      const releaseDate = new Date(release.releaseDate).getTime();
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

    // Before release position (for comparison mode)
    const beforePos = comparisonMode && beforeIndex !== undefined ? (positions[beforeIndex]?.position || 0) : 0;

    return { yearMarkers: years, releasePositions: positions, currentPositionPercent: currentPos, beforePositionPercent: beforePos };
  }, [releases, currentIndex, comparisonMode, beforeIndex]);

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

    // In comparison mode, determine which scrubber to move based on proximity
    if (comparisonMode && onBeforeIndexChange) {
      const distanceToGreenScrubber = Math.abs(currentPositionPercent - clickPercent);
      const distanceToYellowScrubber = Math.abs(beforePositionPercent - clickPercent);

      // Move the scrubber that's closer to the click position
      if (distanceToYellowScrubber < distanceToGreenScrubber) {
        onBeforeIndexChange(closestIndex);
      } else {
        onIndexChange(closestIndex);
      }
    } else {
      // Single mode: always move the "after" scrubber
      onIndexChange(closestIndex);
    }
  }, [releasePositions, onIndexChange, comparisonMode, onBeforeIndexChange, currentPositionPercent, beforePositionPercent]);

  // Comparison mode steps both scrubbers as a fixed-width window: the gap
  // between before/after is what the user (or the sync interval) chose, so
  // navigation slides it instead of collapsing it to one release.
  const dualMode = comparisonMode && !!onBeforeIndexChange;
  const lowIndex = dualMode ? Math.min(currentIndex, beforeIndex) : currentIndex;
  const highIndex = dualMode ? Math.max(currentIndex, beforeIndex) : currentIndex;

  const step = useCallback(
    (delta: number) => {
      const lo = dualMode ? Math.min(currentIndex, beforeIndex) : currentIndex;
      const hi = dualMode ? Math.max(currentIndex, beforeIndex) : currentIndex;
      // Clamp so neither scrubber leaves the track; the window stops as a unit.
      const applied = Math.max(-lo, Math.min(delta, releases.length - 1 - hi));
      if (applied === 0) return;

      onIndexChange(currentIndex + applied);
      if (dualMode && onBeforeIndexChange) onBeforeIndexChange(beforeIndex + applied);
    },
    [dualMode, currentIndex, beforeIndex, releases.length, onIndexChange, onBeforeIndexChange]
  );

  const handlePrevious = useCallback(() => step(-1), [step]);
  const handleNext = useCallback(() => step(1), [step]);

  // Comparison mode: each scrubber gets its own prev/next, moving only itself.
  const stepBefore = useCallback(
    (delta: number) => {
      const next = Math.max(0, Math.min(beforeIndex + delta, releases.length - 1));
      if (next !== beforeIndex) onBeforeIndexChange?.(next);
    },
    [beforeIndex, releases.length, onBeforeIndexChange]
  );
  const stepAfter = useCallback(
    (delta: number) => {
      const next = Math.max(0, Math.min(currentIndex + delta, releases.length - 1));
      if (next !== currentIndex) onIndexChange(next);
    },
    [currentIndex, releases.length, onIndexChange]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if there are releases available
      if (releases.length === 0) return;

      // Don't hijack arrows/Home/End while the user is typing or in a select.
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;

      switch (e.key) {
        case "ArrowLeft": // Step backward by 1 release
          e.preventDefault();
          step(-1);
          break;
        case "ArrowRight": // Step forward by 1 release
          e.preventDefault();
          step(1);
          break;
        case "Home": // Slide the window to the start of the track
          e.preventDefault();
          step(-releases.length);
          break;
        case "End": // Slide the window to the end of the track
          e.preventDefault();
          step(releases.length);
          break;
        case "PageUp": // Jump backward by 10 releases
          e.preventDefault();
          step(-10);
          break;
        case "PageDown": // Jump forward by 10 releases
          e.preventDefault();
          step(10);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [releases.length, step]);

  if (releases.length === 0) {
    return (
      <div className={t.timeline.container}>
        <EmptyState
          title={translate("timeline.noImageryAvailable")}
          size="sm"
        />
      </div>
    );
  }

  return (
    <div
      className={t.timeline.container}
      data-testid="wayback-slider"
      role="region"
      aria-label="Wayback Imagery Timeline"
    >
      {/* Header: nav buttons centered on the map column, so each pair lands under
          the map it drives. */}
      {/* dir="ltr" keeps temporal controls left-to-right regardless of language */}
      <div
        className="relative flex items-center justify-center gap-2 mb-2"
        style={{ paddingLeft: mapsInsetPx }}
        dir="ltr"
      >
        {/* Center: nav buttons. In comparison mode each scrubber gets its own
            pair, outlined in its scrubber colour and centered on its half. */}
        {dualMode ? (
          <div className="grid grid-cols-2 w-full">
            {[
              {
                key: "before",
                color: COLORS.FLAG_YELLOW,
                index: beforeIndex,
                onStep: stepBefore,
              },
              {
                key: "after",
                color: COLORS.FLAG_GREEN,
                index: currentIndex,
                onStep: stepAfter,
              },
            ].map(({ key, color, index, onStep }) => (
              <div key={key} className="flex items-center justify-center gap-2">
                <Button
                  onClick={() => onStep(-1)}
                  disabled={index === 0}
                  variant="secondary"
                  size="xs"
                  style={{ borderColor: color }}
                  aria-label={`Go to previous ${key} imagery release`}
                  title={TOOLTIPS.WAYBACK.PREV_RELEASE}
                  data-testid={`wayback-${key}-prev`}
                >
                  ⏮
                </Button>

                <Button
                  onClick={() => onStep(1)}
                  disabled={index === releases.length - 1}
                  variant="secondary"
                  size="xs"
                  style={{ borderColor: color }}
                  aria-label={`Go to next ${key} imagery release`}
                  title={TOOLTIPS.WAYBACK.NEXT_RELEASE}
                  data-testid={`wayback-${key}-next`}
                >
                  ⏭
                </Button>
              </div>
            ))}
          </div>
        ) : (
        <div className="flex items-center gap-2">
          <Button
            onClick={handlePrevious}
            disabled={lowIndex === 0}
            variant="secondary"
            size="xs"
            aria-label="Go to previous satellite image release"
            title={TOOLTIPS.WAYBACK.PREV_RELEASE}
          >
            ⏮
          </Button>

          <Button
            onClick={handleNext}
            disabled={highIndex === releases.length - 1}
            variant="secondary"
            size="xs"
            aria-label="Go to next satellite image release"
            title={TOOLTIPS.WAYBACK.NEXT_RELEASE}
          >
            ⏭
          </Button>
        </div>
        )}
      </div>

      {/* Timeline visualization container - extra pb-6 for yellow tooltip below */}
      <div className="relative pb-6">
        {/* Year labels - positioned above the timeline */}
        <div className="relative h-4 mb-2">
          {yearMarkers.map(({ year, position }, index) => {
            const isFirst = index === 0;
            const isLast = index === yearMarkers.length - 1;
            const transformClass = isFirst
              ? "" // Left-align for first year to prevent left overflow
              : isLast
              ? "-translate-x-full" // Right-align for last year to prevent right overflow
              : "-translate-x-1/2"; // Center for middle years

            return (
              <div
                key={year}
                className={`absolute ${transformClass}`}
                style={{ left: `${position}%` }}
              >
                <span className={`text-[9px] font-semibold ${t.text.body}`}>
                  {year}
                </span>
              </div>
            );
          })}
        </div>

        {/* Interactive timeline bar */}
        <div
          ref={timelineRef}
          className="relative h-3 cursor-pointer"
          onClick={handleTimelineClick}
          role="slider"
          aria-label="Wayback imagery timeline scrubber"
          aria-valuemin={0}
          aria-valuemax={releases.length - 1}
          aria-valuenow={currentIndex}
          aria-valuetext={`${currentRelease?.releaseDate || 'Unknown date'}, release ${currentIndex + 1} of ${releases.length}`}
          tabIndex={0}
        >
          {/* Background track */}
          <div className={`absolute inset-0 rounded ${isDark ? "bg-gray-600" : "bg-gray-300"}`} />

          {/* Release tick marks with tooltips - wider hover area for easier interaction */}
          {releasePositions.map(({ index, position, date }) => {
            const isCurrentRelease = index === currentIndex;
            return (
              <div
                key={index}
                className="absolute top-0 bottom-0 -translate-x-1/2 group cursor-pointer"
                style={{ left: `${position}%` }}
              >
                {/* Invisible wider hitbox for easier hovering (8px wide) */}
                <div className="absolute inset-0 w-2 -ml-1" />

                {/* Visible tick mark line (1-2px) */}
                <div
                  className={`w-[1px] h-full ${
                    isCurrentRelease
                      ? "bg-white w-[2px]" // White and thicker for current
                      : isDark
                      ? "bg-gray-400"
                      : "bg-gray-500"
                  }`}
                />

                {/* Tooltip — `hidden` until hover, not just transparent: the first and
                    last ticks sit at the track's edges, so a laid-out invisible tooltip
                    overflows the page and raises a horizontal scrollbar. */}
                <div className={`hidden group-hover:block absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap pointer-events-none ${isDark ? "bg-gray-800 text-white" : "bg-gray-700 text-white"} shadow-md z-10`}>
                  {date}
                </div>
              </div>
            );
          })}

          {/* Before position scrubber indicator (yellow) - only in comparison mode */}
          {comparisonMode && beforeRelease && (
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
              style={{ left: `${beforePositionPercent}%` }}
            >
              {/* Floating date tooltip - positioned below scrubber with edge detection */}
              <div
                className={`absolute top-full mt-2 pointer-events-none ${
                  beforePositionPercent < 10
                    ? 'left-0'
                    : beforePositionPercent > 90
                    ? 'right-0'
                    : 'left-1/2 -translate-x-1/2'
                }`}
                style={{ zIndex: Z_INDEX.TIMELINE_TOOLTIP }}
                data-testid="wayback-before-tooltip"
              >
                <DateLabel
                  date={beforeRelease?.releaseDate || translate("timeline.unknownDate")}
                  variant="yellow"
                  size="sm"
                />
              </div>
              {/* Scrubber indicator - Yellow */}
              <div
                data-testid="wayback-before-scrubber"
                className="w-3 h-3 bg-white border-2 rounded-full shadow-md"
                style={{ borderColor: COLORS.FLAG_YELLOW }}
              />
            </div>
          )}

          {/* Current position scrubber indicator with floating date tooltip (green) */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
            style={{ left: `${currentPositionPercent}%` }}
          >
            {/* Floating date tooltip - positioned above scrubber with edge detection */}
            <div
              className={`absolute bottom-full mb-2 pointer-events-none ${
                currentPositionPercent < 10
                  ? 'left-0'
                  : currentPositionPercent > 90
                  ? 'right-0'
                  : 'left-1/2 -translate-x-1/2'
              }`}
              style={{ zIndex: Z_INDEX.TIMELINE_TOOLTIP }}
              data-testid="wayback-current-tooltip"
            >
              <DateLabel
                date={currentRelease?.releaseDate || translate("timeline.unknownDate")}
                variant="green"
                size="sm"
              />
            </div>
            {/* Scrubber indicator - Green */}
            <div
              data-testid="wayback-current-scrubber"
              className="w-3 h-3 bg-white border-2 rounded-full shadow-md"
              style={{ borderColor: COLORS.FLAG_GREEN }}
            />
          </div>
        </div>
      </div>

      {/* Keyboard shortcuts hint - hidden below 1280px */}
      <div className={`hidden xl:block mt-0.5 text-[10px] text-center leading-tight ${t.text.muted}`}>
        {translate("timeline.keyboard")}: <kbd className={`${t.timeline.kbdKey} ${t.bg.secondary} ${t.border.default} ${t.text.body}`}>←/→</kbd> {translate("timeline.step")}
        {" • "}
        <kbd className={`${t.timeline.kbdKey} ${t.bg.secondary} ${t.border.default} ${t.text.body}`}>Home/End</kbd> {translate("timeline.jump")}
        {" • "}
        <kbd className={`${t.timeline.kbdKey} ${t.bg.secondary} ${t.border.default} ${t.text.body}`}>PgUp/PgDn</kbd> Jump ±10
      </div>
    </div>
  );
}
