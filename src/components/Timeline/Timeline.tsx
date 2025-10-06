import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import type { GazaSite } from "../../types";
import { getStatusHexColor, components } from "../../styles/theme";

interface TimelineProps {
  sites: GazaSite[];
  onDateChange?: (date: Date | null) => void;
}

// Constants for timeline dimensions and positioning
const TIMELINE_CONFIG = {
  MARGIN: { top: 20, right: 40, bottom: 60, left: 40 },
  HEIGHT: 120,
  MARKER_RADIUS: { default: 6, hover: 10, selected: 9 },
  STROKE_WIDTH: { default: 2, selected: 3 },
  TOOLTIP_EDGE_THRESHOLD: { LEFT: 0.2, RIGHT: 0.8 },
} as const;

export function Timeline({ sites, onDateChange }: TimelineProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Parse dates and sort sites chronologically
  const sitesWithDates = sites
    .filter((site) => site.dateDestroyed)
    .map((site) => ({
      ...site,
      date: new Date(site.dateDestroyed!),
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  useEffect(() => {
    if (!svgRef.current || sitesWithDates.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const { MARGIN, HEIGHT } = TIMELINE_CONFIG;
    const width = svgRef.current.clientWidth - MARGIN.left - MARGIN.right;
    const height = HEIGHT - MARGIN.top - MARGIN.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

    // Get date range
    const minDate = sitesWithDates[0].date;
    const maxDate = sitesWithDates[sitesWithDates.length - 1].date;

    // Create time scale
    const xScale = d3
      .scaleTime()
      .domain([minDate, maxDate])
      .range([0, width]);

    // Draw timeline line
    g.append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", height / 2)
      .attr("y2", height / 2)
      .attr("stroke", "#cbd5e1")
      .attr("stroke-width", 2);

    // Draw event markers with color-coded status
    g.selectAll(".event-marker")
      .data(sitesWithDates)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.date))
      .attr("cy", height / 2)
      .attr("r", TIMELINE_CONFIG.MARKER_RADIUS.default)
      .attr("fill", (d) => getStatusHexColor(d.status))
      .attr("stroke", "#fff")
      .attr("stroke-width", TIMELINE_CONFIG.STROKE_WIDTH.default)
      .style("cursor", "pointer")
      .on("mouseenter", function (event, d) {
        // Enlarge marker on hover
        d3.select(this).attr("r", TIMELINE_CONFIG.MARKER_RADIUS.hover);

        // Show tooltip with smart positioning
        const tooltip = g.append("g").attr("class", "tooltip");
        const markerX = xScale(d.date);

        // Determine text anchor based on position
        let textAnchor: "start" | "middle" | "end" = "middle";
        if (markerX < width * TIMELINE_CONFIG.TOOLTIP_EDGE_THRESHOLD.LEFT) {
          textAnchor = "start"; // Near left edge
        } else if (markerX > width * TIMELINE_CONFIG.TOOLTIP_EDGE_THRESHOLD.RIGHT) {
          textAnchor = "end"; // Near right edge
        }

        const text = tooltip
          .append("text")
          .attr("x", markerX)
          .attr("y", height / 2 - 20)
          .attr("text-anchor", textAnchor)
          .attr("font-size", "12px")
          .attr("font-weight", "600")
          .text(d.name);

        const bbox = (text.node() as SVGTextElement).getBBox();
        tooltip
          .insert("rect", "text")
          .attr("x", bbox.x - 4)
          .attr("y", bbox.y - 2)
          .attr("width", bbox.width + 8)
          .attr("height", bbox.height + 4)
          .attr("fill", "white")
          .attr("stroke", "#e5e7eb")
          .attr("rx", 4);
      })
      .on("mouseleave", function (event, d) {
        // Reset marker size only if not selected
        const isSelected = selectedDate?.getTime() === d.date.getTime();
        d3.select(this)
          .attr("r", isSelected ? TIMELINE_CONFIG.MARKER_RADIUS.selected : TIMELINE_CONFIG.MARKER_RADIUS.default)
          .attr("stroke-width", isSelected ? TIMELINE_CONFIG.STROKE_WIDTH.selected : TIMELINE_CONFIG.STROKE_WIDTH.default);
        // Remove tooltip
        g.select(".tooltip").remove();
      })
      .on("click", (event, d) => {
        const newDate = selectedDate?.getTime() === d.date.getTime() ? null : d.date;
        setSelectedDate(newDate);
        onDateChange?.(newDate);
      });

    // Draw axis
    const xAxis = d3.axisBottom(xScale).ticks(5);

    g.append("g")
      .attr("transform", `translate(0,${height / 2 + 20})`)
      .call(xAxis);

    // Highlight selected marker
    if (selectedDate) {
      g.selectAll<SVGCircleElement, typeof sitesWithDates[0]>(".event-marker")
        .filter((d) => d.date.getTime() === selectedDate.getTime())
        .attr("r", TIMELINE_CONFIG.MARKER_RADIUS.selected)
        .attr("stroke-width", TIMELINE_CONFIG.STROKE_WIDTH.selected);
    }
  }, [sitesWithDates, selectedDate, onDateChange]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Destruction Timeline</h2>
          <p className="text-sm text-gray-600 mt-1">
            {selectedDate
              ? `Showing sites destroyed on or before ${d3.timeFormat("%B %d, %Y")(selectedDate)}`
              : "Click markers to filter by date"}
          </p>
        </div>
        {selectedDate && (
          <button
            onClick={() => {
              setSelectedDate(null);
              onDateChange?.(null);
            }}
            className={components.button.reset}
          >
            Reset
          </button>
        )}
      </div>
      <svg ref={svgRef} className="w-full" style={{ height: "120px" }} />
    </div>
  );
}
