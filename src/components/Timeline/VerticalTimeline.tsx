import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import type { GazaSite } from "../../types";
import { getStatusHexColor, components } from "../../styles/theme";

interface VerticalTimelineProps {
  sites: GazaSite[];
  onDateChange?: (date: Date | null) => void;
  onSiteHighlight?: (siteId: string | null) => void;
}

// Constants for vertical timeline dimensions
const TIMELINE_CONFIG = {
  MARGIN: { top: 20, right: 20, bottom: 20, left: 100 },
  ITEM_HEIGHT: 60, // Height per timeline item
  LINE_X: 100, // X position of vertical line
  MARKER_RADIUS: { default: 8, hover: 12, selected: 10 },
  STROKE_WIDTH: { default: 2, selected: 4 },
  STROKE_COLOR: { default: "#fff", selected: "#000" },
} as const;

/**
 * Vertical timeline component showing destruction events chronologically
 * Scales better than horizontal timeline for many data points
 */
export function VerticalTimeline({ sites, onDateChange, onSiteHighlight }: VerticalTimelineProps) {
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

    const { MARGIN, ITEM_HEIGHT, LINE_X } = TIMELINE_CONFIG;
    const height = sitesWithDates.length * ITEM_HEIGHT + MARGIN.top + MARGIN.bottom;

    // Set SVG height dynamically
    svg.attr("height", height);

    const g = svg
      .append("g")
      .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

    // Create Y scale for positioning items
    const yScale = d3
      .scaleLinear()
      .domain([0, sitesWithDates.length - 1])
      .range([0, sitesWithDates.length * ITEM_HEIGHT]);

    // Draw vertical timeline line
    g.append("line")
      .attr("x1", LINE_X)
      .attr("x2", LINE_X)
      .attr("y1", 0)
      .attr("y2", sitesWithDates.length * ITEM_HEIGHT)
      .attr("stroke", "#cbd5e1")
      .attr("stroke-width", 3);

    // Create timeline items (one per site)
    const items = g
      .selectAll(".timeline-item")
      .data(sitesWithDates)
      .enter()
      .append("g")
      .attr("class", "timeline-item")
      .attr("transform", (d, i) => `translate(0,${yScale(i) + ITEM_HEIGHT / 2})`)
      .style("cursor", "pointer");

    // Draw markers
    items
      .append("circle")
      .attr("class", "event-marker")
      .attr("cx", LINE_X)
      .attr("cy", 0)
      .attr("r", TIMELINE_CONFIG.MARKER_RADIUS.default)
      .attr("fill", (d) => getStatusHexColor(d.status))
      .attr("stroke", TIMELINE_CONFIG.STROKE_COLOR.default)
      .attr("stroke-width", TIMELINE_CONFIG.STROKE_WIDTH.default);

    // Add date labels (left side)
    items
      .append("text")
      .attr("class", "date-label")
      .attr("x", LINE_X - 20)
      .attr("y", 0)
      .attr("text-anchor", "end")
      .attr("alignment-baseline", "middle")
      .attr("font-size", "13px")
      .attr("font-weight", "600")
      .attr("fill", "#6b7280")
      .text((d) => d3.timeFormat("%b %d, %Y")(d.date));

    // Add site names (right side)
    items
      .append("text")
      .attr("class", "site-name")
      .attr("x", LINE_X + 20)
      .attr("y", -2)
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "500")
      .attr("fill", "#1f2937")
      .text((d) => d.name);

    // Add status labels (right side, below name)
    items
      .append("text")
      .attr("class", "status-label")
      .attr("x", LINE_X + 20)
      .attr("y", 14)
      .attr("text-anchor", "start")
      .attr("font-size", "11px")
      .attr("fill", (d) => getStatusHexColor(d.status))
      .text((d) => {
        const statusText = d.status.replace("-", " ");
        return statusText.charAt(0).toUpperCase() + statusText.slice(1);
      });

    // Add hover and click interactions
    items
      .on("mouseenter", function (event, d) {
        const isSelected = selectedDate?.getTime() === d.date.getTime();

        // Enlarge marker
        d3.select(this)
          .select(".event-marker")
          .attr("r", TIMELINE_CONFIG.MARKER_RADIUS.hover)
          .attr("stroke", isSelected ? TIMELINE_CONFIG.STROKE_COLOR.selected : TIMELINE_CONFIG.STROKE_COLOR.default)
          .attr("stroke-width", isSelected ? TIMELINE_CONFIG.STROKE_WIDTH.selected : TIMELINE_CONFIG.STROKE_WIDTH.default);

        // Highlight site name
        d3.select(this)
          .select(".site-name")
          .attr("font-weight", "700")
          .attr("fill", "#111827");

        // Highlight on map
        onSiteHighlight?.(d.id);
      })
      .on("mouseleave", function (event, d) {
        const isSelected = selectedDate?.getTime() === d.date.getTime();

        // Reset marker size
        d3.select(this)
          .select(".event-marker")
          .attr("r", isSelected ? TIMELINE_CONFIG.MARKER_RADIUS.selected : TIMELINE_CONFIG.MARKER_RADIUS.default)
          .attr("stroke", isSelected ? TIMELINE_CONFIG.STROKE_COLOR.selected : TIMELINE_CONFIG.STROKE_COLOR.default)
          .attr("stroke-width", isSelected ? TIMELINE_CONFIG.STROKE_WIDTH.selected : TIMELINE_CONFIG.STROKE_WIDTH.default);

        // Reset site name
        d3.select(this)
          .select(".site-name")
          .attr("font-weight", isSelected ? "700" : "500")
          .attr("fill", isSelected ? "#111827" : "#1f2937");

        // Clear highlight unless item is selected
        if (!isSelected) {
          onSiteHighlight?.(null);
        }
      })
      .on("click", function (event, d) {
        const newDate = selectedDate?.getTime() === d.date.getTime() ? null : d.date;
        setSelectedDate(newDate);
        onDateChange?.(newDate);
        onSiteHighlight?.(d.id);

        // Reset all markers
        g.selectAll(".event-marker")
          .attr("r", TIMELINE_CONFIG.MARKER_RADIUS.default)
          .attr("stroke", TIMELINE_CONFIG.STROKE_COLOR.default)
          .attr("stroke-width", TIMELINE_CONFIG.STROKE_WIDTH.default);

        // Reset all site names
        g.selectAll(".site-name")
          .attr("font-weight", "500")
          .attr("fill", "#1f2937");

        // Highlight selected item
        if (newDate) {
          d3.select(this)
            .select(".event-marker")
            .attr("r", TIMELINE_CONFIG.MARKER_RADIUS.selected)
            .attr("stroke", TIMELINE_CONFIG.STROKE_COLOR.selected)
            .attr("stroke-width", TIMELINE_CONFIG.STROKE_WIDTH.selected);

          d3.select(this)
            .select(".site-name")
            .attr("font-weight", "700")
            .attr("fill", "#111827");
        }
      });

    // Apply selected state on initial render
    if (selectedDate) {
      items
        .filter((d) => d.date.getTime() === selectedDate.getTime())
        .each(function () {
          d3.select(this)
            .select(".event-marker")
            .attr("r", TIMELINE_CONFIG.MARKER_RADIUS.selected)
            .attr("stroke", TIMELINE_CONFIG.STROKE_COLOR.selected)
            .attr("stroke-width", TIMELINE_CONFIG.STROKE_WIDTH.selected);

          d3.select(this)
            .select(".site-name")
            .attr("font-weight", "700")
            .attr("fill", "#111827");
        });
    }
  }, [sitesWithDates, selectedDate, onDateChange, onSiteHighlight]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Destruction Timeline</h2>
          <p className="text-sm text-gray-600 mt-1">
            {selectedDate
              ? `Showing sites destroyed on or before ${d3.timeFormat("%B %d, %Y")(selectedDate)}`
              : "Click any site to filter by date"}
          </p>
        </div>
        {selectedDate && (
          <button
            onClick={() => {
              setSelectedDate(null);
              onDateChange?.(null);
              onSiteHighlight?.(null);
            }}
            className={components.button.reset}
          >
            Reset
          </button>
        )}
      </div>
      <div className="overflow-y-auto max-h-[500px]">
        <svg ref={svgRef} className="w-full" />
      </div>
    </div>
  );
}
