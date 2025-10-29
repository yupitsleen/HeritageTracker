import { useEffect, useRef, useMemo, useState } from "react";
// Optimized D3 imports - only import what we need
import { scaleTime } from "d3-scale";
import {
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";
import type { GazaSite } from "../../types";
import { useAnimation, type AnimationSpeed } from "../../contexts/AnimationContext";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import { useTranslation } from "../../contexts/LocaleContext";
import { D3TimelineRenderer } from "../../utils/d3Timeline";
import { useTimelineData } from "../../hooks/useTimelineData";
import { Input } from "../Form/Input";
import { Button } from "../Button";
import { TIMELINE_CONFIG, TOOLTIP_CONFIG } from "../../constants/timeline";
import {
  calculateDefaultDateRange,
  filterEventsByDateRange,
  calculateAdjustedDateRange,
} from "../../utils/timelineCalculations";
import { getSpeedValues } from "../../config/animation";
import { InfoIconWithTooltip } from "../Icons/InfoIconWithTooltip";

/**
 * Callback type for date change handlers
 */
export type DateChangeHandler = (date: Date | null) => void;

/**
 * Callback type for site highlight handlers
 */
export type SiteHighlightHandler = (siteId: string | null) => void;

/**
 * Callback type for toggle handlers (no parameters)
 */
export type ToggleHandler = () => void;

/**
 * Advanced timeline mode configuration
 */
export interface AdvancedTimelineMode {
  syncMapOnDotClick: boolean;
  onSyncMapToggle: ToggleHandler;
}

interface TimelineScrubberProps {
  sites: GazaSite[];
  destructionDateStart: Date | null;
  destructionDateEnd: Date | null;
  onDestructionDateStartChange: DateChangeHandler;
  onDestructionDateEndChange: DateChangeHandler;
  highlightedSiteId?: string | null;
  onSiteHighlight?: SiteHighlightHandler;
  // Advanced Timeline mode: Sync Map button syncs on dot click instead of during playback
  advancedMode?: AdvancedTimelineMode;
}

/**
 * Horizontal timeline scrubber with D3.js visualization
 * Features:
 * - Draggable scrubber handle
 * - Event markers for destruction dates
 * - Play/pause/reset controls
 * - Sync Map toggle (syncs satellite imagery with timeline OR on dot click in advanced mode)
 * - Speed control dropdown
 * - Keyboard navigation (space, arrows, home/end)
 * - Responsive to container width changes
 */
export function TimelineScrubber({
  sites,
  destructionDateStart,
  destructionDateEnd,
  onDestructionDateStartChange,
  onDestructionDateEndChange,
  highlightedSiteId,
  onSiteHighlight,
  advancedMode,
}: TimelineScrubberProps) {
  const {
    currentTimestamp,
    isPlaying,
    speed,
    startDate,
    endDate,
    zoomToSiteEnabled,
    play,
    pause,
    reset,
    setTimestamp,
    setSpeed,
    setZoomToSiteEnabled,
  } = useAnimation();

  const t = useThemeClasses();
  const translate = useTranslation();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const rendererRef = useRef<D3TimelineRenderer | null>(null);
  const [scrubberPosition, setScrubberPosition] = useState<number | null>(null);

  // Extract timeline data using custom hook
  const { events: allDestructionDates } = useTimelineData(sites);

  // Combine related date calculations into single memoization for better performance
  // Reduces dependency checking overhead and prevents cascading recalculations
  const timelineData = useMemo(() => {
    // Calculate default date range from dataset (oldest and newest destruction dates)
    const defaults = calculateDefaultDateRange(allDestructionDates, startDate, endDate);

    // Filter destruction dates based on date filter
    const filtered = filterEventsByDateRange(allDestructionDates, destructionDateStart, destructionDateEnd);

    // Calculate adjusted timeline range based on filtered dates
    const hasActiveFilter = Boolean(destructionDateStart || destructionDateEnd);
    const adjusted = calculateAdjustedDateRange(filtered, hasActiveFilter, startDate, endDate);

    return {
      ...defaults,
      destructionDates: filtered,
      ...adjusted,
    };
  }, [allDestructionDates, startDate, endDate, destructionDateStart, destructionDateEnd]);

  // Destructure combined timeline data
  const { defaultStartDate, defaultEndDate, destructionDates, adjustedStartDate, adjustedEndDate } = timelineData;

  // Observe container width changes
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        setContainerWidth(width);
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  // D3 time scale (responsive to container width, uses adjusted dates when filtered)
  const timeScale = useMemo(() => {
    return scaleTime()
      .domain([adjustedStartDate, adjustedEndDate])
      .range([TIMELINE_CONFIG.MARGIN, containerWidth - TIMELINE_CONFIG.MARGIN]);
  }, [adjustedStartDate, adjustedEndDate, containerWidth]);

  // Track if SVG is mounted
  const [svgMounted, setSvgMounted] = useState(false);

  // Detect when SVG ref becomes available
  useEffect(() => {
    if (svgRef.current && !svgMounted) {
      setSvgMounted(true);
    }
  }, [svgMounted]);

  // Initialize D3 renderer and render timeline
  useEffect(() => {
    if (!svgRef.current || !svgMounted) {
      return;
    }

    // Initialize renderer if not exists
    if (!rendererRef.current) {
      rendererRef.current = new D3TimelineRenderer(
        svgRef.current,
        timeScale,
        {}, // Use default config
        {
          onTimestampChange: setTimestamp,
          onPause: pause,
          onSiteHighlight: onSiteHighlight ? (event) => {
            // Highlight the site when timeline dot is clicked
            onSiteHighlight(event.siteId);
          } : undefined,
          onScrubberPositionChange: setScrubberPosition,
        }
      );
    }

    // Update scale in case container width changed
    rendererRef.current.updateScale(timeScale);

    // Render timeline with current state and highlighted site
    rendererRef.current.render(destructionDates, currentTimestamp, highlightedSiteId);

    return () => {
      // Cleanup on unmount only
      rendererRef.current?.cleanup();
      rendererRef.current = null;
    };
  }, [svgMounted, timeScale, destructionDates, currentTimestamp, highlightedSiteId, setTimestamp, pause, onSiteHighlight]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case " ": // Space - play/pause
          e.preventDefault();
          if (isPlaying) {
            pause();
          } else {
            play();
          }
          break;
        case "ArrowLeft": // Step backward by 1 day
          e.preventDefault();
          pause();
          setTimestamp(
            new Date(currentTimestamp.getTime() - 24 * 60 * 60 * 1000)
          );
          break;
        case "ArrowRight": // Step forward by 1 day
          e.preventDefault();
          pause();
          setTimestamp(
            new Date(currentTimestamp.getTime() + 24 * 60 * 60 * 1000)
          );
          break;
        case "Home": // Jump to start
          e.preventDefault();
          pause();
          reset();
          break;
        case "End": // Jump to end
          e.preventDefault();
          pause();
          setTimestamp(endDate);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    currentTimestamp,
    isPlaying,
    play,
    pause,
    reset,
    setTimestamp,
    endDate,
  ]);

  // Speed options from config
  const speedOptions: AnimationSpeed[] = useMemo(() => {
    return getSpeedValues();
  }, []);

  // Check if timeline is at the start or end position
  const isAtStart = currentTimestamp.getTime() === startDate.getTime();
  const isAtEnd = currentTimestamp.getTime() >= adjustedEndDate.getTime();

  // Handle play button click - reset and play if at the end
  const handlePlay = () => {
    if (isAtEnd) {
      reset();
      // Small delay to let reset complete before playing
      setTimeout(() => play(), 10);
    } else {
      play();
    }
  };

  // Previous/Next navigation for Advanced Timeline mode
  const currentEventIndex = useMemo(() => {
    if (!advancedMode || destructionDates.length === 0) return -1;
    return destructionDates.findIndex(
      (event) => event.date.getTime() === currentTimestamp.getTime()
    );
  }, [advancedMode, destructionDates, currentTimestamp]);

  const canGoPrevious = advancedMode && currentEventIndex > 0;
  const canGoNext = advancedMode && currentEventIndex < destructionDates.length - 1;

  const goToPreviousEvent = () => {
    if (canGoPrevious) {
      const prevEvent = destructionDates[currentEventIndex - 1];
      setTimestamp(prevEvent.date);
      if (onSiteHighlight) {
        onSiteHighlight(prevEvent.siteId);
      }
    }
  };

  const goToNextEvent = () => {
    if (canGoNext) {
      const nextEvent = destructionDates[currentEventIndex + 1];
      setTimestamp(nextEvent.date);
      if (onSiteHighlight) {
        onSiteHighlight(nextEvent.siteId);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={t.timeline.container}
      role="region"
      aria-label="Timeline Scrubber"
    >
      {/* Controls */}
      {/* dir="ltr" keeps media controls left-to-right regardless of language */}
      <div className="flex items-center mb-2 gap-2 flex-wrap relative" dir="ltr">
        {/* Info icon in top right */}
        <div className="absolute right-0 top-0">
          <InfoIconWithTooltip
            tooltip={advancedMode
              ? translate("timeline.tooltipAdvanced")
              : translate("timeline.tooltipDefault")
            }
          />
        </div>

        {/* Left: Play/Pause/Reset/Sync Map/Speed (hide play/pause in advanced mode) */}
        <div className="flex items-center gap-1.5">
          {!advancedMode && (
            <>
              {!isPlaying ? (
                <Button
                  onClick={handlePlay}
                  variant="primary"
                  size="xs"
                  icon={<PlayIcon className="w-3 h-3" />}
                  aria-label={translate("timeline.play")}
                >
                  {translate("timeline.play")}
                </Button>
              ) : (
                <Button
                  onClick={pause}
                  variant="danger"
                  size="xs"
                  icon={<PauseIcon className="w-3 h-3" />}
                  aria-label={translate("timeline.pause")}
                >
                  {translate("timeline.pause")}
                </Button>
              )}
            </>
          )}

          <Button
            onClick={reset}
            disabled={isAtStart}
            variant="secondary"
            size="xs"
            icon={<ArrowPathIcon className="w-3 h-3" />}
            aria-label={translate("common.reset")}
          >
            {translate("common.reset")}
          </Button>

          {/* Sync Map toggle button - only show in advanced mode */}
          {advancedMode && (
            <Button
              onClick={advancedMode.onSyncMapToggle}
              variant="secondary"
              active={advancedMode.syncMapOnDotClick}
              size="xs"
              aria-label={translate("timeline.syncMap")}
              title={translate("timeline.syncMap")}
            >
              {advancedMode.syncMapOnDotClick ? "✓" : ""} {translate("timeline.syncMap")}
            </Button>
          )}

          {/* Zoom to Site toggle button */}
          <Button
            onClick={() => setZoomToSiteEnabled(!zoomToSiteEnabled)}
            variant="secondary"
            active={zoomToSiteEnabled}
            size="xs"
            aria-label={translate("timeline.zoomToSite")}
            title={translate("timeline.zoomToSite")}
          >
            {zoomToSiteEnabled ? "✓" : ""} {translate("timeline.zoomToSite")}
          </Button>

          {!advancedMode && (
            /* Speed control - hidden in advanced mode */
            <div className="flex items-center gap-1.5">
              <label htmlFor="speed-control" className={`text-xs font-medium ${t.text.body}`}>
                {translate("timeline.speed")}:
              </label>
              <select
                id="speed-control"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value) as AnimationSpeed)}
                className={`${t.timeline.speedSelect} ${t.input.base}`}
                aria-label="Animation speed control"
              >
                {speedOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}x
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Center: Previous/Next navigation (Advanced Timeline only) */}
        {/* dir="ltr" keeps temporal controls left-to-right regardless of language */}
        {advancedMode && (
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5" dir="ltr">
            <Button
              onClick={goToPreviousEvent}
              disabled={!canGoPrevious}
              variant="secondary"
              size="xs"
              aria-label={translate("timeline.previousAriaLabel")}
              title={translate("timeline.previousTitle")}
            >
              ⏮ {translate("timeline.previous")}
            </Button>
            <Button
              onClick={goToNextEvent}
              disabled={!canGoNext}
              variant="secondary"
              size="xs"
              aria-label={translate("timeline.nextAriaLabel")}
              title={translate("timeline.nextTitle")}
            >
              {translate("timeline.next")} ⏭
            </Button>
          </div>
        )}

        {/* Right: Date Filter */}
        <div className="flex items-center gap-1.5 ml-auto">
          <label className={`text-[10px] font-semibold ${t.text.heading}`}>
            {translate("timeline.dateFilter")}:
          </label>
          <Input
            variant="date"
            value={(destructionDateStart || defaultStartDate).toISOString().split("T")[0]}
            onChange={(e) => {
              onDestructionDateStartChange(e.target.value ? new Date(e.target.value) : null);
            }}
            placeholder={translate("timeline.from")}
            className="flex-none w-28 text-[10px] py-0.5 px-1.5"
          />
          <span className={`text-[10px] font-medium ${t.text.body}`}>{translate("timeline.to")}</span>
          <Input
            variant="date"
            value={(destructionDateEnd || defaultEndDate).toISOString().split("T")[0]}
            onChange={(e) => {
              onDestructionDateEndChange(e.target.value ? new Date(e.target.value) : null);
            }}
            placeholder={translate("timeline.to")}
            className="flex-none w-28 text-[10px] py-0.5 px-1.5"
          />

          {/* Clear Date Filter button - always reserve space, only visible when filter is active */}
          <button
            onClick={() => {
              onDestructionDateStartChange(null);
              onDestructionDateEndChange(null);
            }}
            className={`${t.timeline.clearFilterVisible} ${
              destructionDateStart || destructionDateEnd
                ? `${t.bg.secondary} ${t.text.body} ${t.bg.hover}`
                : t.timeline.clearFilterInvisible
            }`}
            aria-label={translate("timeline.clearFilter")}
            disabled={!destructionDateStart && !destructionDateEnd}
          >
            {translate("timeline.clear")}
          </button>
        </div>
      </div>

      {/* D3 Timeline SVG - Ultra compact */}
      <div className="relative overflow-visible" style={{ minHeight: TIMELINE_CONFIG.MIN_HEIGHT }}>
        <svg
          ref={(node) => {
            if (node && node !== svgRef.current) {
              svgRef.current = node;
              setSvgMounted(true);
            }
          }}
          key={`timeline-${containerWidth}-${startDate.getTime()}`}
          width="100%"
          height={TIMELINE_CONFIG.HEIGHT}
          className="mt-1"
          aria-hidden="true"
        />
        {/* Floating scrubber date tooltip - positioned below timeline */}
        {scrubberPosition !== null && (
          <div
            className="absolute z-[9999] pointer-events-none"
            style={{
              left: `${scrubberPosition}px`,
              top: `${TOOLTIP_CONFIG.VERTICAL_OFFSET}px`,
              transform: `translateX(${TOOLTIP_CONFIG.HORIZONTAL_TRANSFORM})`,
            }}
          >
            <div className="px-2 py-0.5 bg-[#009639] text-white text-[10px] font-semibold rounded whitespace-nowrap shadow-lg">
              {currentTimestamp.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
        )}
      </div>

      {/* Keyboard shortcuts hint */}
      <div className={`mt-0.5 text-[10px] text-center leading-tight ${t.text.muted}`}>
        {translate("timeline.keyboard")}: <kbd className={`${t.timeline.kbdKey} ${t.bg.secondary} ${t.border.default} ${t.text.body}`}>Space</kbd> {translate("timeline.playPause")}
        {" • "}
        <kbd className={`${t.timeline.kbdKey} ${t.bg.secondary} ${t.border.default} ${t.text.body}`}>←/→</kbd> {translate("timeline.step")}
        {" • "}
        <kbd className={`${t.timeline.kbdKey} ${t.bg.secondary} ${t.border.default} ${t.text.body}`}>Home/End</kbd> {translate("timeline.jump")}
      </div>
    </div>
  );
}
