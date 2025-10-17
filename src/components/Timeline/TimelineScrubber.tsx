import { useEffect, useRef, useMemo, useState } from "react";
import * as d3 from "d3";
import {
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";
import type { GazaSite } from "../../types";
import { useAnimation, type AnimationSpeed } from "../../contexts/AnimationContext";
import { components } from "../../styles/theme";
import { D3TimelineRenderer } from "../../utils/d3Timeline";
import { useTimelineData } from "../../hooks/useTimelineData";

interface TimelineScrubberProps {
  sites: GazaSite[];
  onSyncMapChange?: (isSynced: boolean) => void; // Optional callback for map sync toggle
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
export function TimelineScrubber({ sites, onSyncMapChange }: TimelineScrubberProps) {
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

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const rendererRef = useRef<D3TimelineRenderer | null>(null);
  const [syncMap, setSyncMap] = useState(false); // Map sync toggle state

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

  // Extract timeline data using custom hook
  const { events: destructionDates } = useTimelineData(sites);

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

  // D3 time scale (responsive to container width)
  const timeScale = useMemo(() => {
    const margin = 50; // Leave space for handles
    return d3
      .scaleTime()
      .domain([startDate, endDate])
      .range([margin, containerWidth - margin]);
  }, [startDate, endDate, containerWidth]);

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

  return (
    <div
      ref={containerRef}
      className="bg-white/90 backdrop-blur-sm border-2 border-[#000000] rounded-lg p-3 shadow-xl"
      role="region"
      aria-label="Timeline Scrubber"
    >
      {/* Controls */}
      <div className="flex items-center justify-between mb-3 gap-4">
        {/* Left: Play/Pause/Reset */}
        <div className="flex items-center gap-2">
          {!isPlaying ? (
            <button
              onClick={play}
              className="flex items-center gap-2 px-4 py-2 bg-[#009639] text-[#fefefe] hover:bg-[#007b2f] rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm font-semibold active:scale-95"
              aria-label="Play timeline animation"
            >
              <PlayIcon className="w-4 h-4" />
              <span>Play</span>
            </button>
          ) : (
            <button
              onClick={pause}
              className="flex items-center gap-2 px-4 py-2 bg-[#ed3039] text-[#fefefe] hover:bg-[#d4202a] rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm font-semibold active:scale-95"
              aria-label="Pause timeline animation"
            >
              <PauseIcon className="w-4 h-4" />
              <span>Pause</span>
            </button>
          )}
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-[#fefefe] hover:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm font-semibold active:scale-95"
            aria-label="Reset timeline to start"
          >
            <ArrowPathIcon className="w-4 h-4" />
            <span>Reset</span>
          </button>

          {/* Sync Map toggle button */}
          <button
            onClick={() => setSyncMap(!syncMap)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm font-semibold active:scale-95 ${
              syncMap
                ? "bg-[#009639] text-[#fefefe] hover:bg-[#007b2f]"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
            aria-label={syncMap ? "Disable map sync with timeline" : "Enable map sync with timeline"}
            title="Sync satellite imagery with timeline date"
          >
            <span>{syncMap ? "✓" : ""} Sync Map</span>
          </button>
        </div>

        {/* Center: Current date display */}
        <div className="text-sm font-semibold text-[#000000]">
          <span className="text-gray-600">Current:</span>{" "}
          {d3.timeFormat("%B %d, %Y")(currentTimestamp)}
        </div>

        {/* Right: Speed control */}
        <div className="flex items-center gap-2">
          <label htmlFor="speed-control" className="text-sm font-medium text-gray-700">
            Speed:
          </label>
          <select
            id="speed-control"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value) as AnimationSpeed)}
            className={components.select.small}
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

      {/* D3 Timeline SVG */}
      <svg ref={svgRef} width="100%" height="80" aria-hidden="true" />

      {/* Keyboard shortcuts hint */}
      <div className="mt-2 text-xs text-gray-500 text-center">
        Keyboard: <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded">Space</kbd> Play/Pause
        {" • "}
        <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded">←/→</kbd> Step
        {" • "}
        <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded">Home/End</kbd> Jump
      </div>
    </div>
  );
}
