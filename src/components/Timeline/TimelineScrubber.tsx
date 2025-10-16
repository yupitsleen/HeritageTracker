import { useEffect, useRef, useMemo, useState } from "react";
import * as d3 from "d3";
import type { GazaSite } from "../../types";
import { useAnimation, type AnimationSpeed } from "../../contexts/AnimationContext";
import { components } from "../../styles/theme";

interface TimelineScrubberProps {
  sites: GazaSite[];
}

/**
 * Horizontal timeline scrubber with D3.js visualization
 * Features:
 * - Draggable scrubber handle
 * - Event markers for destruction dates
 * - Play/pause/reset controls
 * - Speed control dropdown
 * - Keyboard navigation (space, arrows, home/end)
 * - Responsive to container width changes
 */
export function TimelineScrubber({ sites }: TimelineScrubberProps) {
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

  // Extract destruction dates from sites (memoized)
  const destructionDates = useMemo(() => {
    return sites
      .filter((site) => site.dateDestroyed)
      .map((site) => ({
        date: new Date(site.dateDestroyed!),
        siteName: site.name,
        siteId: site.id,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [sites]);

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

  // Note: Scrubber drag is handled by D3 drag behavior in useEffect

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

  // Render D3 timeline
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    const height = 80;

    // Clear previous content
    svg.selectAll("*").remove();

    // Create axis
    const xAxis = d3.axisBottom(timeScale).ticks(6).tickFormat((d) => {
      const date = d as Date;
      return d3.timeFormat("%b %Y")(date);
    });

    const axisGroup = svg
      .append("g")
      .attr("transform", `translate(0, ${height / 2})`)
      .call(xAxis);

    // Style axis
    axisGroup.selectAll("text").attr("fill", "#525252").attr("font-size", "12px");

    axisGroup
      .selectAll("line")
      .attr("stroke", "#d4d4d4")
      .attr("stroke-width", 1);

    axisGroup.select(".domain").attr("stroke", "#a3a3a3").attr("stroke-width", 2);

    // Event markers (dots for destruction dates)
    svg
      .selectAll("circle.event-marker")
      .data(destructionDates)
      .enter()
      .append("circle")
      .attr("class", "event-marker")
      .attr("cx", (d) => timeScale(d.date))
      .attr("cy", height / 2)
      .attr("r", 4)
      .attr("fill", "#ed3039") // Palestinian flag red
      .attr("stroke", "#000000")
      .attr("stroke-width", 1)
      .style("cursor", "pointer")
      .on("click", function (_event, d) {
        setTimestamp(d.date);
        pause();
      })
      .append("title")
      .text((d) => `${d.siteName}\n${d3.timeFormat("%B %d, %Y")(d.date)}`);

    // Current position indicator (vertical line + handle)
    const scrubberGroup = svg.append("g").attr("class", "scrubber-group");

    scrubberGroup
      .append("line")
      .attr("class", "scrubber-line")
      .attr("x1", timeScale(currentTimestamp))
      .attr("y1", 10)
      .attr("x2", timeScale(currentTimestamp))
      .attr("y2", height - 10)
      .attr("stroke", "#009639") // Palestinian flag green
      .attr("stroke-width", 3);

    const handle = scrubberGroup
      .append("circle")
      .attr("class", "scrubber-handle")
      .attr("cx", timeScale(currentTimestamp))
      .attr("cy", height / 2)
      .attr("r", 10)
      .attr("fill", "#009639") // Palestinian flag green
      .attr("stroke", "#000000")
      .attr("stroke-width", 2)
      .style("cursor", "grab");

    // Drag behavior
    const drag = d3
      .drag<SVGCircleElement, unknown>()
      .on("start", function () {
        d3.select(this).style("cursor", "grabbing");
        pause(); // Pause animation during drag
      })
      .on("drag", function (event) {
        const x = Math.max(
          timeScale.range()[0],
          Math.min(timeScale.range()[1], event.x)
        );
        const newDate = timeScale.invert(x);
        setTimestamp(newDate);
      })
      .on("end", function () {
        d3.select(this).style("cursor", "grab");
      });

    handle.call(drag);
  }, [
    timeScale,
    currentTimestamp,
    destructionDates,
    setTimestamp,
    pause,
  ]);

  // Speed options
  const speedOptions: AnimationSpeed[] = [0.5, 1, 2, 4];

  return (
    <div
      ref={containerRef}
      className="bg-[#fefefe] border-2 border-[#000000] rounded-lg p-4 shadow-md"
      role="region"
      aria-label="Timeline Scrubber"
    >
      {/* Controls */}
      <div className="flex items-center justify-between mb-4 gap-4">
        {/* Left: Play/Pause/Reset */}
        <div className="flex items-center gap-2">
          {!isPlaying ? (
            <button
              onClick={play}
              className="px-4 py-2 bg-[#009639] text-[#fefefe] hover:bg-[#007b2f] rounded-md transition-colors text-sm font-medium"
              aria-label="Play timeline animation"
            >
              ▶ Play
            </button>
          ) : (
            <button
              onClick={pause}
              className="px-4 py-2 bg-[#ed3039] text-[#fefefe] hover:bg-[#d4202a] rounded-md transition-colors text-sm font-medium"
              aria-label="Pause timeline animation"
            >
              ❚❚ Pause
            </button>
          )}
          <button
            onClick={reset}
            className={components.button.reset}
            aria-label="Reset timeline to start"
          >
            ↻ Reset
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
