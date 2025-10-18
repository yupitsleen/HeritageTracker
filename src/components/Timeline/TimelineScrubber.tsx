import { useEffect, useRef, useMemo, useState } from "react";
import * as d3 from "d3";
import {
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";
import type { GazaSite } from "../../types";
import { useAnimation, type AnimationSpeed } from "../../contexts/AnimationContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import { D3TimelineRenderer } from "../../utils/d3Timeline";
import { useTimelineData } from "../../hooks/useTimelineData";
import { Input } from "../Form/Input";

interface TimelineScrubberProps {
  sites: GazaSite[];
  onSyncMapChange?: (isSynced: boolean) => void; // Optional callback for map sync toggle
  destructionDateStart: Date | null;
  destructionDateEnd: Date | null;
  onDestructionDateStartChange: (date: Date | null) => void;
  onDestructionDateEndChange: (date: Date | null) => void;
}

/**
 * Horizontal timeline scrubber with D3.js visualization
 * Features:
 * - Draggable scrubber handle
 * - Event markers for destruction dates
 * - Play/pause/reset controls
 * - Sync Map toggle (syncs satellite imagery with timeline)
 * - Speed control dropdown
 * - Keyboard navigation (space, arrows, home/end)
 * - Responsive to container width changes
 */
export function TimelineScrubber({
  sites,
  onSyncMapChange,
  destructionDateStart,
  destructionDateEnd,
  onDestructionDateStartChange,
  onDestructionDateEndChange,
}: TimelineScrubberProps) {
  const {
    currentTimestamp,
    isPlaying,
    speed,
    startDate,
    endDate,
    play,
    pause,
    reset,
    setTimestamp,
    setSpeed,
  } = useAnimation();

  const { isDark } = useTheme();
  const t = useThemeClasses();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const rendererRef = useRef<D3TimelineRenderer | null>(null);
  const [syncMap, setSyncMap] = useState(false); // Map sync toggle state

  // Extract timeline data using custom hook
  const { events: allDestructionDates } = useTimelineData(sites);

  // Calculate default date range from dataset (oldest and newest destruction dates)
  const { defaultStartDate, defaultEndDate } = useMemo(() => {
    if (allDestructionDates.length === 0) {
      return { defaultStartDate: startDate, defaultEndDate: endDate };
    }
    const dates = allDestructionDates.map((event) => event.date);
    return {
      defaultStartDate: new Date(Math.min(...dates.map((d) => d.getTime()))),
      defaultEndDate: new Date(Math.max(...dates.map((d) => d.getTime()))),
    };
  }, [allDestructionDates, startDate, endDate]);

  // Notify parent when sync state changes
  useEffect(() => {
    onSyncMapChange?.(syncMap);

    // When sync is enabled, pause and jump to 2014 baseline
    if (syncMap) {
      pause();
      // Set to Feb 20, 2014 (BASELINE_2014 date) to show progression from 2014 → 2023 → Current
      setTimestamp(new Date("2014-02-20"));
    }
  }, [syncMap, onSyncMapChange, pause, setTimestamp]);

  // Filter destruction dates based on date filter
  const destructionDates = useMemo(() => {
    if (!destructionDateStart && !destructionDateEnd) {
      return allDestructionDates;
    }
    return allDestructionDates.filter((event) => {
      if (destructionDateStart && event.date < destructionDateStart) return false;
      if (destructionDateEnd && event.date > destructionDateEnd) return false;
      return true;
    });
  }, [allDestructionDates, destructionDateStart, destructionDateEnd]);

  // Calculate adjusted timeline range based on filtered dates
  const { adjustedStartDate, adjustedEndDate } = useMemo(() => {
    if (destructionDates.length === 0) {
      return { adjustedStartDate: startDate, adjustedEndDate: endDate };
    }

    // Find min and max from filtered destruction dates
    const minDate = new Date(Math.min(...destructionDates.map((event) => event.date.getTime())));
    const maxDate = new Date(Math.max(...destructionDates.map((event) => event.date.getTime())));

    return {
      adjustedStartDate: destructionDateStart || destructionDateEnd ? minDate : startDate,
      adjustedEndDate: destructionDateStart || destructionDateEnd ? maxDate : endDate,
    };
  }, [destructionDates, startDate, endDate, destructionDateStart, destructionDateEnd]);

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
    const margin = 50; // Leave space for handles
    return d3
      .scaleTime()
      .domain([adjustedStartDate, adjustedEndDate])
      .range([margin, containerWidth - margin]);
  }, [adjustedStartDate, adjustedEndDate, containerWidth]);

  // Initialize D3 renderer
  useEffect(() => {
    if (!svgRef.current) return;

    rendererRef.current = new D3TimelineRenderer(
      svgRef.current,
      timeScale,
      {}, // Use default config
      {
        onTimestampChange: setTimestamp,
        onPause: pause,
      }
    );

    return () => {
      rendererRef.current?.cleanup();
    };
  }, [timeScale, setTimestamp, pause]);

  // Update timeline rendering when data or timestamp changes
  useEffect(() => {
    if (!rendererRef.current) return;

    // Update scale in case container width changed
    rendererRef.current.updateScale(timeScale);

    // Render timeline with current state
    rendererRef.current.render(destructionDates, currentTimestamp);
  }, [timeScale, destructionDates, currentTimestamp]);

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

  // Speed options
  const speedOptions: AnimationSpeed[] = [0.5, 1, 2, 4];

  // Check if timeline is at the start position
  const isAtStart = currentTimestamp.getTime() === startDate.getTime();

  return (
    <div
      ref={containerRef}
      className={`backdrop-blur-sm border-2 border-[#000000] rounded-lg p-3 shadow-2xl-dark transition-colors duration-200 ${isDark ? "bg-[#000000]/95" : "bg-white/95"}`}
      role="region"
      aria-label="Timeline Scrubber"
    >
      {/* Controls */}
      <div className="flex items-center mb-3 gap-4">
        {/* Left: Play/Pause/Reset/Sync Map/Speed */}
        <div className="flex items-center gap-2 flex-1">
          {!isPlaying ? (
            <button
              onClick={play}
              className="flex items-center gap-2 px-4 py-2 bg-[#009639] text-[#fefefe] hover:bg-[#007b2f] rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm font-semibold active:scale-95 border border-[#000000]"
              aria-label="Play timeline animation"
            >
              <PlayIcon className="w-4 h-4" />
              <span>Play</span>
            </button>
          ) : (
            <button
              onClick={pause}
              className="flex items-center gap-2 px-4 py-2 bg-[#ed3039] text-[#fefefe] hover:bg-[#d4202a] rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm font-semibold active:scale-95 border border-[#000000]"
              aria-label="Pause timeline animation"
            >
              <PauseIcon className="w-4 h-4" />
              <span>Pause</span>
            </button>
          )}
          <button
            onClick={reset}
            disabled={isAtStart}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-semibold border border-[#000000] ${
              isAtStart
                ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                : `shadow-md hover:shadow-lg active:scale-95 ${t.bg.secondary} ${t.bg.hover} ${t.text.body}`
            }`}
            aria-label="Reset timeline to start"
          >
            <ArrowPathIcon className="w-4 h-4" />
            <span>Reset</span>
          </button>

          {/* Sync Map toggle button */}
          <button
            onClick={() => setSyncMap(!syncMap)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm font-semibold active:scale-95 border border-[#000000] ${
              syncMap
                ? `${t.flag.greenBg} text-[#fefefe] ${t.flag.greenHover}`
                : `${t.bg.active} ${t.text.body} ${t.bg.hover}`
            }`}
            aria-label={syncMap ? "Disable map sync with timeline" : "Enable map sync with timeline"}
            title="Sync satellite imagery with timeline date"
          >
            <span>{syncMap ? "✓" : ""} Sync Map</span>
          </button>

          {/* Speed control */}
          <div className="flex items-center gap-2">
            <label htmlFor="speed-control" className={`text-sm font-medium ${t.text.body}`}>
              Speed:
            </label>
            <select
              id="speed-control"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value) as AnimationSpeed)}
              className={`px-2 py-2 border rounded-md text-sm focus:ring-2 focus:ring-[#009639] focus:border-[#009639] ${t.input.base}`}
              aria-label="Animation speed control"
            >
              {speedOptions.map((s) => (
                <option key={s} value={s}>
                  {s}x
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center: Current date display */}
        <div className={`text-sm font-semibold text-center flex-1 ${isDark ? "text-[#fefefe]" : t.text.heading}`}>
          <span className={t.text.muted}>Current:</span>{" "}
          {d3.timeFormat("%B %d, %Y")(currentTimestamp)}
        </div>

        {/* Right: Date Filter */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <label className={`text-xs font-semibold ${t.text.heading}`}>
            Destruction Date:
          </label>
          <Input
            variant="date"
            value={(destructionDateStart || defaultStartDate).toISOString().split("T")[0]}
            onChange={(e) => {
              onDestructionDateStartChange(e.target.value ? new Date(e.target.value) : null);
            }}
            placeholder="From"
            className="flex-none w-32 text-xs py-1.5 px-2"
          />
          <span className={`text-xs font-medium ${t.text.body}`}>to</span>
          <Input
            variant="date"
            value={(destructionDateEnd || defaultEndDate).toISOString().split("T")[0]}
            onChange={(e) => {
              onDestructionDateEndChange(e.target.value ? new Date(e.target.value) : null);
            }}
            placeholder="To"
            className="flex-none w-32 text-xs py-1.5 px-2"
          />

          {/* Clear Date Filter button - always reserve space, only visible when filter is active */}
          <button
            onClick={() => {
              onDestructionDateStartChange(null);
              onDestructionDateEndChange(null);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-xs font-semibold active:scale-95 border border-[#000000] ${
              destructionDateStart || destructionDateEnd
                ? `${t.bg.secondary} ${t.text.body} ${t.bg.hover}`
                : "invisible"
            }`}
            aria-label="Clear date filter"
            disabled={!destructionDateStart && !destructionDateEnd}
          >
            Clear Date Filter
          </button>
        </div>
      </div>

      {/* D3 Timeline SVG */}
      <svg ref={svgRef} width="100%" height="80" aria-hidden="true" />

      {/* Keyboard shortcuts hint */}
      <div className={`mt-2 text-xs text-center ${t.text.muted}`}>
        Keyboard: <kbd className={`px-1 py-0.5 border rounded ${t.bg.secondary} ${t.border.default} ${t.text.body}`}>Space</kbd> Play/Pause
        {" • "}
        <kbd className={`px-1 py-0.5 border rounded ${t.bg.secondary} ${t.border.default} ${t.text.body}`}>←/→</kbd> Step
        {" • "}
        <kbd className={`px-1 py-0.5 border rounded ${t.bg.secondary} ${t.border.default} ${t.text.body}`}>Home/End</kbd> Jump
      </div>
    </div>
  );
}
