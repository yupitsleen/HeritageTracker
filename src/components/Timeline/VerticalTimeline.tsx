import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import type { GazaSite } from "../../types";
import { getStatusHexColor } from "../../styles/theme";
import { useCalendar } from "../../contexts/CalendarContext";

interface VerticalTimelineProps {
  sites: GazaSite[];
  onSiteHighlight?: (siteId: string | null) => void;
}

// Constants for vertical timeline dimensions
const TIMELINE_CONFIG = {
  MARGIN: { top: 20, right: 40, bottom: 20, left: 100 },
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
export function VerticalTimeline({ sites, onSiteHighlight }: VerticalTimelineProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTimelineHovered, setIsTimelineHovered] = useState(false);
  const { calendarType } = useCalendar();

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

    // Calculate content height based on number of sites
    const contentHeight = sitesWithDates.length * ITEM_HEIGHT + MARGIN.top + MARGIN.bottom;

    // Get container height (use viewport height as minimum)
    const container = svgRef.current.parentElement;
    const containerHeight = container ? container.clientHeight : window.innerHeight;

    // Use the larger of content height or container height
    const height = Math.max(contentHeight, containerHeight);

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

    // Draw vertical timeline line (extends to full container height)
    g.append("line")
      .attr("x1", LINE_X)
      .attr("x2", LINE_X)
      .attr("y1", 0)
      .attr("y2", height - MARGIN.top - MARGIN.bottom)
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
      .text((d) =>
        calendarType === "islamic" && d.dateDestroyedIslamic
          ? d.dateDestroyedIslamic
          : d3.timeFormat("%b %d, %Y")(d.date)
      );

    // Add site names (right side) with text truncation
    const siteNames = items
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

    // Truncate text that's too long and add ellipsis
    siteNames.each(function (d) {
      const textElement = d3.select(this);
      const fullText = d.name;
      const maxWidth = 220; // Max width in pixels before truncation

      // Check if getComputedTextLength is available (not available in test environment)
      if (typeof (this as SVGTextElement).getComputedTextLength !== "function") {
        return;
      }

      let textLength = (this as SVGTextElement).getComputedTextLength();
      let text = fullText;

      if (textLength > maxWidth) {
        // Binary search for optimal length
        while (textLength > maxWidth && text.length > 0) {
          text = text.slice(0, -1);
          textElement.text(text + "...");
          textLength = (this as SVGTextElement).getComputedTextLength();
        }

        // Add tooltip for full name
        textElement.append("title").text(fullText);
      }
    });

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

    // Add hover and click interactions (highlighting only, no filtering)
    items
      .on("mouseenter", function () {
        // Enlarge marker
        d3.select(this)
          .select(".event-marker")
          .attr("r", TIMELINE_CONFIG.MARKER_RADIUS.hover);

        // Highlight site name
        d3.select(this)
          .select(".site-name")
          .attr("font-weight", "700")
          .attr("fill", "#111827");
      })
      .on("mouseleave", function () {
        // Reset marker size
        d3.select(this)
          .select(".event-marker")
          .attr("r", TIMELINE_CONFIG.MARKER_RADIUS.default);

        // Reset site name
        d3.select(this)
          .select(".site-name")
          .attr("font-weight", "500")
          .attr("fill", "#1f2937");
      })
      .on("click", function (event, d) {
        // Only highlight the site, no filtering
        onSiteHighlight?.(d.id);
      });

  }, [sitesWithDates, onSiteHighlight, calendarType]);

  // Handle mouse wheel scroll to prevent page scroll when hovering timeline
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isTimelineHovered && containerRef.current) {
        // Prevent page scroll
        e.preventDefault();

        // Manually scroll the timeline container
        const scrollContainer = containerRef.current.querySelector('.overflow-y-auto');
        if (scrollContainer) {
          scrollContainer.scrollTop += e.deltaY;
        }
      }
    };

    // Add wheel listener with passive: false to allow preventDefault
    document.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      document.removeEventListener('wheel', handleWheel);
    };
  }, [isTimelineHovered]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full"
      onMouseEnter={() => setIsTimelineHovered(true)}
      onMouseLeave={() => setIsTimelineHovered(false)}
    >
      <div className="mb-4 flex-shrink-0 pl-4 pr-2">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">Destruction Timeline</h2>
          <p className="text-sm text-gray-600 mt-1">
            Click any site to highlight on map and table
          </p>
        </div>
      </div>
      <div className="overflow-y-auto flex-1 pl-4 pr-2">
        <svg ref={svgRef} className="w-full" />
      </div>
    </div>
  );
}
