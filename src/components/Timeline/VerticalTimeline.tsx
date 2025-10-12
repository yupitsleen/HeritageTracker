import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import type { GazaSite } from "../../types";
import { getStatusHexColor } from "../../styles/theme";
import { useCalendar } from "../../contexts/CalendarContext";

interface VerticalTimelineProps {
  sites: GazaSite[];
  onSiteHighlight?: (siteId: string | null) => void;
  highlightedSiteId?: string | null;
}

// Constants for vertical timeline dimensions
const TIMELINE_CONFIG = {
  MARGIN: { top: 20, right: 24, bottom: 20, left: 0 },
  ITEM_HEIGHT: 80, // Height per timeline item (increased for word wrap)
  LINE_X: 120, // X position of vertical line from left edge of SVG (moved right for date space)
  DATE_WIDTH: 110, // Width allocated for date labels
  NAME_WIDTH: 260, // Width allocated for site names
  MARKER_RADIUS: { default: 10, hover: 14, selected: 12 },
  STROKE_WIDTH: { default: 2, selected: 4 },
  STROKE_COLOR: { default: "#fff", selected: "#000" },
} as const;

/**
 * Vertical timeline component showing destruction events chronologically
 * Scales better than horizontal timeline for many data points
 */
export function VerticalTimeline({ sites, onSiteHighlight, highlightedSiteId }: VerticalTimelineProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
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
    // Add extra bottom padding to ensure last item is fully visible
    const contentHeight = sitesWithDates.length * ITEM_HEIGHT + MARGIN.top + MARGIN.bottom + 100;

    // Get container height (use viewport height as minimum)
    const container = svgRef.current.parentElement;
    const containerHeight = container ? container.clientHeight : window.innerHeight;

    // Always use content height to ensure all items are visible
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
      .attr("stroke", "#fde6e8")
      .attr("stroke-width", 3);

    // Create timeline items (one per site)
    const items = g
      .selectAll(".timeline-item")
      .data(sitesWithDates)
      .enter()
      .append("g")
      .attr("class", "timeline-item")
      .attr("transform", (_d, i) => `translate(0,${yScale(i) + ITEM_HEIGHT / 2})`)
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

    // Add date labels (left side, word-wrapping with foreignObject)
    items
      .append("foreignObject")
      .attr("class", "date-label")
      .attr("x", 0)
      .attr("y", -30) // Center vertically
      .attr("width", TIMELINE_CONFIG.DATE_WIDTH)
      .attr("height", 60)
      .append("xhtml:div")
      .style("display", "flex")
      .style("align-items", "center")
      .style("height", "100%")
      .style("font-size", "13px")
      .style("font-weight", "600")
      .style("color", "#fde6e8")
      .style("word-wrap", "break-word")
      .style("overflow-wrap", "break-word")
      .style("hyphens", "auto")
      .style("line-height", "1.3")
      .html((d) =>
        calendarType === "islamic" && d.dateDestroyedIslamic
          ? d.dateDestroyedIslamic
          : d3.timeFormat("%b %d, %Y")(d.date)
      );

    // Add site names (right side) - word-wrapping with foreignObject
    items
      .append("foreignObject")
      .attr("class", "site-name")
      .attr("x", LINE_X + 20)
      .attr("y", -30) // Center vertically
      .attr("width", TIMELINE_CONFIG.NAME_WIDTH)
      .attr("height", 60)
      .append("xhtml:div")
      .style("display", "flex")
      .style("align-items", "center")
      .style("height", "100%")
      .style("font-size", "16px")
      .style("font-weight", "700")
      .style("color", "#000000")
      .style("word-wrap", "break-word")
      .style("overflow-wrap", "break-word")
      .style("hyphens", "auto")
      .style("line-height", "1.3")
      .text((d) => d.name);

    // Add Arabic names (right side, below English name)
    items
      .append("foreignObject")
      .attr("class", "site-name-arabic")
      .attr("x", LINE_X + 20)
      .attr("y", 20)
      .attr("width", TIMELINE_CONFIG.NAME_WIDTH)
      .attr("height", 30)
      .append("xhtml:div")
      .style("font-size", "12px")
      .style("font-weight", "500")
      .style("color", "#fde6e8")
      .style("word-wrap", "break-word")
      .style("overflow-wrap", "break-word")
      .style("line-height", "1.2")
      .attr("lang", "ar")
      .text((d) => d.nameArabic || "");


    // Apply selected state styling
    items.each(function (d) {
      const item = d3.select(this);
      const isSelected = highlightedSiteId === d.id;

      if (isSelected) {
        // Keep marker enlarged when selected
        item.select(".event-marker")
          .attr("r", TIMELINE_CONFIG.MARKER_RADIUS.hover);

        // Site name stays white and italicized when selected
        item.select(".site-name div")
          .style("color", "#ffffff")
          .style("font-style", "italic");

        // Arabic name turns black and italicized when selected
        item.select(".site-name-arabic div")
          .style("color", "#000000")
          .style("font-style", "italic");

        // Date turns black and italicized when selected
        item.select(".date-label div")
          .style("color", "#000000")
          .style("font-style", "italic");
      } else {
        // Default state
        item.select(".event-marker")
          .attr("r", TIMELINE_CONFIG.MARKER_RADIUS.default);

        item.select(".site-name div")
          .style("color", "#000000")
          .style("font-style", "normal");

        item.select(".site-name-arabic div")
          .style("color", "#fde6e8")
          .style("font-style", "normal");

        item.select(".date-label div")
          .style("color", "#fde6e8")
          .style("font-style", "normal");
      }
    });

    // Add hover and click interactions (highlighting only, no filtering)
    items
      .on("mouseenter", function (_, d) {
        const isSelected = highlightedSiteId === d.id;

        // Only apply hover effects if not selected
        if (!isSelected) {
          // Enlarge marker
          d3.select(this)
            .select(".event-marker")
            .attr("r", TIMELINE_CONFIG.MARKER_RADIUS.hover);

          // Highlight site name (foreignObject contains div)
          d3.select(this)
            .select(".site-name div")
            .style("font-weight", "900")
            .style("color", "#ffffff");
        }
      })
      .on("mouseleave", function (_, d) {
        const isSelected = highlightedSiteId === d.id;

        // Only reset if not selected
        if (!isSelected) {
          // Reset marker size
          d3.select(this)
            .select(".event-marker")
            .attr("r", TIMELINE_CONFIG.MARKER_RADIUS.default);

          // Reset site name
          d3.select(this)
            .select(".site-name div")
            .style("font-weight", "700")
            .style("color", "#000000");
        }
      })
      .on("click", function (_event, d) {
        // Toggle highlight: if already selected, deselect
        if (highlightedSiteId === d.id) {
          onSiteHighlight?.(null);
        } else {
          onSiteHighlight?.(d.id);
        }
      });

  }, [sitesWithDates, onSiteHighlight, highlightedSiteId, calendarType]);

  // Scroll to highlighted site when it changes
  useEffect(() => {
    if (!highlightedSiteId || !scrollContainerRef.current) return;

    // Use a small delay to ensure the DOM is fully updated
    const timeoutId = setTimeout(() => {
      const scrollContainer = scrollContainerRef.current;
      if (!scrollContainer) return;

      // Find the index of the highlighted site
      const siteIndex = sitesWithDates.findIndex(site => site.id === highlightedSiteId);
      if (siteIndex === -1) return;

      // Calculate the vertical position of the site
      const ITEM_HEIGHT = TIMELINE_CONFIG.ITEM_HEIGHT;
      const MARGIN_TOP = TIMELINE_CONFIG.MARGIN.top;

      // Center the item in the viewport
      const scrollContainerHeight = scrollContainer.clientHeight;
      const targetScrollTop = (siteIndex * ITEM_HEIGHT) + MARGIN_TOP - (scrollContainerHeight / 2) + (ITEM_HEIGHT / 2);

      // Scroll to the site with smooth behavior
      scrollContainer.scrollTo({
        top: Math.max(0, targetScrollTop), // Prevent negative scroll
        behavior: 'smooth'
      });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [highlightedSiteId, sitesWithDates]);

  // Handle mouse wheel scroll to prevent page scroll when hovering timeline
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isTimelineHovered && scrollContainerRef.current) {
        const scrollContainer = scrollContainerRef.current;
        const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
        const isAtTop = scrollTop === 0;
        const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1;

        // Only prevent default if we're not at scroll limits
        // or if we're scrolling in a direction that keeps us within bounds
        const isScrollingDown = e.deltaY > 0;
        const isScrollingUp = e.deltaY < 0;

        if ((isScrollingDown && !isAtBottom) || (isScrollingUp && !isAtTop)) {
          e.preventDefault();
          scrollContainer.scrollTop += e.deltaY;
        }
        // If at limits, allow page scroll by not preventing default
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
      className="flex flex-col h-full bg-[#b01822]"
      onMouseEnter={() => setIsTimelineHovered(true)}
      onMouseLeave={() => setIsTimelineHovered(false)}
    >
      <div className="sticky top-0 z-20 bg-[#b01822] mb-4 flex-shrink-0 px-4 pt-4 pb-4 border-b-2 border-white">
        <h2 className="text-xl font-bold text-white text-center">Destruction Timeline</h2>
        <p className="text-xs text-gray-300 mt-1 text-center">
          Only sites with a Destruction Date are shown
        </p>
      </div>
      <div ref={scrollContainerRef} className="overflow-y-auto overflow-x-visible flex-1 px-4 relative z-10">
        <svg ref={svgRef} className="w-full overflow-visible" />
      </div>
    </div>
  );
}
