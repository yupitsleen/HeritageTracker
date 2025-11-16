import { useEffect, useRef, useMemo, useState, useCallback } from "react";
// Optimized D3 imports - only import what we need
import { scaleTime } from "d3-scale";
import type { Site } from "../../types";
import { useAnimation } from "../../contexts/AnimationContext";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import { useTranslation } from "../../contexts/LocaleContext";
import { D3TimelineRenderer } from "../../utils/d3Timeline";
import { useTimelineData } from "../../hooks/useTimelineData";
import { TIMELINE_CONFIG, TOOLTIP_CONFIG } from "../../constants/timeline";
import { Z_INDEX } from "../../constants/layout";
import { COLORS } from "../../config/colorThemes";
import {
  calculateDefaultDateRange,
  calculateAdjustedDateRange,
} from "../../utils/timelineCalculations";
import { InfoIcon } from "../Icons/InfoIcon";
import { INFO_ICON_COLORS } from "../../constants/tooltip";
import { TimelineControls } from "./TimelineControls";
import { TimelineNavigation } from "./TimelineNavigation";

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
  onSyncMapToggle?: ToggleHandler; // Optional: allows hiding Sync Map button
  showNavigation?: boolean; // Optional: show Previous/Next navigation (default: true when advancedMode is set)
  hidePlayControls?: boolean; // Optional: hide Play/Pause/Speed controls (default: false)
  hideMapSettings?: boolean; // Optional: hide Zoom to Site and Show Map Markers (moved to map on Dashboard)
  onReset?: () => void; // Optional: custom reset handler for parent components (e.g., Timeline page to reset wayback sliders)
}

interface TimelineScrubberProps {
  sites: Site[];
  highlightedSiteId?: string | null;
  onSiteHighlight?: SiteHighlightHandler;
  // Advanced Timeline mode: Sync Map button syncs on dot click instead of during playback
  advancedMode?: AdvancedTimelineMode;
  // Show/hide sites with unknown destruction dates (only survey date)
  showUnknownDestructionDates?: boolean;
  onShowUnknownDestructionDatesChange?: (show: boolean) => void;
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
  highlightedSiteId,
  onSiteHighlight,
  advancedMode,
  showUnknownDestructionDates = true,
  onShowUnknownDestructionDatesChange,
}: TimelineScrubberProps) {
  const {
    currentTimestamp,
    isPlaying,
    speed,
    startDate,
    endDate,
    zoomToSiteEnabled,
    mapMarkersVisible,
    play,
    pause,
    reset,
    setTimestamp,
    setSpeed,
    setZoomToSiteEnabled,
    setMapMarkersVisible,
  } = useAnimation();

  const t = useThemeClasses();
  const translate = useTranslation();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const rendererRef = useRef<D3TimelineRenderer | null>(null);
  const [scrubberPosition, setScrubberPosition] = useState<number | null>(null);

  // Extract timeline data using custom hook with unknown dates filter
  const { events: allDestructionDates } = useTimelineData(sites, showUnknownDestructionDates);

  // Calculate date range from dataset (oldest and newest destruction dates)
  const { adjustedStartDate, adjustedEndDate } = useMemo(() => {
    const defaults = calculateDefaultDateRange(allDestructionDates, startDate, endDate);
    // No filtering - show all events (filtering happens at page level via FilterBar)
    const adjusted = calculateAdjustedDateRange(allDestructionDates, false, startDate, endDate);

    return {
      ...defaults,
      ...adjusted,
    };
  }, [allDestructionDates, startDate, endDate]);

  // Use all destruction dates (no filtering in timeline component)
  const destructionDates = allDestructionDates;

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

  // Handle reset button click - reset timeline AND clear highlighted site to reset map zoom
  const handleReset = useCallback(() => {
    reset(); // Reset timeline to start
    if (onSiteHighlight) {
      onSiteHighlight(null); // Clear highlighted site to reset map to Gaza overview
    }
    // Call custom reset handler if provided (e.g., Timeline page resets wayback sliders)
    if (advancedMode?.onReset) {
      advancedMode.onReset();
    }
  }, [reset, onSiteHighlight, advancedMode]);

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
          handleReset();
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
    handleReset,
    setTimestamp,
    endDate,
  ]);

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
  // Find the current position relative to events (not requiring exact match)
  const currentEventIndex = useMemo(() => {
    if (!advancedMode || destructionDates.length === 0) return -1;

    const currentTime = currentTimestamp.getTime();

    // If we have a highlighted site, try to find its exact index first
    // This handles multiple sites with the same destruction date
    if (highlightedSiteId) {
      const exactIndex = destructionDates.findIndex(
        (event) => event.siteId === highlightedSiteId
      );
      if (exactIndex !== -1) {
        return exactIndex;
      }
    }

    // Check if we're before all events
    if (currentTime < destructionDates[0].date.getTime()) {
      return -1; // Special value meaning "before first event"
    }

    // Check if we're after all events
    if (currentTime >= destructionDates[destructionDates.length - 1].date.getTime()) {
      return destructionDates.length - 1; // At or after last event
    }

    // We're somewhere in the middle - find the event we've passed or are at
    for (let i = 0; i < destructionDates.length; i++) {
      const eventTime = destructionDates[i].date.getTime();

      if (currentTime === eventTime) {
        // Exact match - we're at this event
        return i;
      }

      if (currentTime < eventTime) {
        // We're before this event, so we're at the previous event
        return i - 1;
      }
    }

    // Fallback: find nearest event
    let nearestIndex = 0;
    let minDiff = Math.abs(destructionDates[0].date.getTime() - currentTime);

    for (let i = 1; i < destructionDates.length; i++) {
      const diff = Math.abs(destructionDates[i].date.getTime() - currentTime);
      if (diff < minDiff) {
        minDiff = diff;
        nearestIndex = i;
      }
    }

    return nearestIndex;
  }, [advancedMode, destructionDates, currentTimestamp, highlightedSiteId]);

  const canGoPrevious = !!advancedMode && currentEventIndex >= 0;
  const canGoNext = !!advancedMode && destructionDates.length > 0 && currentEventIndex < destructionDates.length - 1;

  const goToPreviousEvent = () => {
    if (canGoPrevious) {
      if (currentEventIndex === 0) {
        // At first event, go back to timeline start (before first event)
        setTimestamp(startDate);
        if (onSiteHighlight) {
          onSiteHighlight(null); // Clear highlighted site
        }
      } else {
        // Go to previous event
        const targetIndex = currentEventIndex === -1 ? 0 : currentEventIndex - 1;
        const prevEvent = destructionDates[targetIndex];
        setTimestamp(prevEvent.date);
        if (onSiteHighlight) {
          onSiteHighlight(prevEvent.siteId);
        }
      }
    }
  };

  const goToNextEvent = () => {
    if (canGoNext) {
      // If we're before all events (index -1), go to first event (index 0)
      const targetIndex = currentEventIndex === -1 ? 0 : currentEventIndex + 1;
      const nextEvent = destructionDates[targetIndex];
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
      <div className="flex items-center justify-center mb-2 gap-2 relative" dir="ltr">
        {/* Left: Play/Pause/Reset/Sync Map/Speed controls - absolutely positioned */}
        <div className="absolute left-0 top-0 flex items-center gap-2 flex-wrap">
          <TimelineControls
            isPlaying={isPlaying}
            isAtStart={isAtStart}
            speed={speed}
            zoomToSiteEnabled={zoomToSiteEnabled}
            mapMarkersVisible={mapMarkersVisible}
            advancedMode={!!advancedMode}
            hidePlayControls={advancedMode?.hidePlayControls ?? false}
            hideMapSettings={advancedMode?.hideMapSettings ?? false}
            syncMapOnDotClick={advancedMode?.syncMapOnDotClick}
            showUnknownDestructionDates={showUnknownDestructionDates}
            onPlay={handlePlay}
            onPause={pause}
            onReset={handleReset}
            onSpeedChange={setSpeed}
            onZoomToSiteToggle={() => setZoomToSiteEnabled(!zoomToSiteEnabled)}
            onMapMarkersToggle={() => setMapMarkersVisible(!mapMarkersVisible)}
            onSyncMapToggle={advancedMode?.onSyncMapToggle}
            onShowUnknownDestructionDatesToggle={onShowUnknownDestructionDatesChange ? () => onShowUnknownDestructionDatesChange(!showUnknownDestructionDates) : undefined}
          />
        </div>

        {/* Center: Previous/Next navigation - centered in flex container */}
        {advancedMode && (advancedMode.showNavigation !== false) && (
          <TimelineNavigation
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
            onPrevious={goToPreviousEvent}
            onNext={goToNextEvent}
          />
        )}

        {/* Right: Info icon - absolutely positioned */}
        <div className="absolute right-0 top-0">
          <InfoIcon
            title={advancedMode
              ? translate("timeline.tooltipAdvanced")
              : translate("timeline.tooltipDefault")
            }
            aria-label={advancedMode
              ? translate("timeline.tooltipAdvanced")
              : translate("timeline.tooltipDefault")
            }
            className={`w-4 h-4 ${INFO_ICON_COLORS.DEFAULT} ${INFO_ICON_COLORS.HOVER} transition-colors cursor-help`}
          />
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
        {/*
          Floating scrubber date tooltip - positioned below timeline

          NOTE: This tooltip uses custom positioning instead of native browser tooltips.
          Reason: Must follow the scrubber's dynamic position as user drags along timeline.
          Native tooltips (title attribute) cannot track moving elements precisely.

          All other tooltips in the app use native browser tooltips for simplicity.
        */}
        {scrubberPosition !== null && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: `${scrubberPosition}px`,
              top: `${TOOLTIP_CONFIG.VERTICAL_OFFSET}px`,
              transform: `translateX(${TOOLTIP_CONFIG.HORIZONTAL_TRANSFORM})`,
              zIndex: Z_INDEX.TIMELINE_TOOLTIP,
            }}
          >
            <div className="px-2 py-0.5 bg-[#009639] text-white text-[10px] font-semibold rounded whitespace-nowrap shadow-lg" style={{ outline: `1px solid ${COLORS.BORDER_BLACK}` }}>
              {currentTimestamp.toISOString().split('T')[0]}
            </div>
          </div>
        )}
      </div>

      {/* Keyboard shortcuts hint - hidden below 1280px */}
      <div className={`hidden xl:block mt-0.5 text-[10px] text-center leading-tight ${t.text.muted}`}>
        {translate("timeline.keyboard")}: <kbd className={`${t.timeline.kbdKey} ${t.bg.secondary} ${t.border.default} ${t.text.body}`}>Space</kbd> {translate("timeline.playPause")}
        {" • "}
        <kbd className={`${t.timeline.kbdKey} ${t.bg.secondary} ${t.border.default} ${t.text.body}`}>←/→</kbd> {translate("timeline.step")}
        {" • "}
        <kbd className={`${t.timeline.kbdKey} ${t.bg.secondary} ${t.border.default} ${t.text.body}`}>Home/End</kbd> {translate("timeline.jump")}
      </div>
    </div>
  );
}
