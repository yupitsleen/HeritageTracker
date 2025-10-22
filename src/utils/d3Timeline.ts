import { select, type Selection } from "d3-selection";
import type { ScaleTime } from "d3-scale";
import { axisBottom } from "d3-axis";
import { timeFormat } from "d3-time-format";
import { drag } from "d3-drag";
import "d3-transition";

export type { Selection, ScaleTime };

export interface TimelineEvent {
  date: Date;
  siteName: string;
  siteId: string;
  status?: "destroyed" | "heavily-damaged" | "damaged";
}

export interface TimelineConfig {
  height: number;
  margin: number;
  eventMarkerRadius: number;
  scrubberRadius: number;
  colors: {
    axis: string;
    axisLine: string;
    axisDomain: string;
    eventMarker: string;
    eventMarkerStroke: string;
    scrubberLine: string;
    scrubberHandle: string;
    scrubberStroke: string;
  };
}

export const DEFAULT_TIMELINE_CONFIG: TimelineConfig = {
  height: 40,
  margin: 25,
  eventMarkerRadius: 3, // Compact: reduced from 6 to 3
  scrubberRadius: 7, // Compact: reduced from 12 to 7
  colors: {
    axis: "#525252",
    axisLine: "#d4d4d4",
    axisDomain: "#a3a3a3",
    eventMarker: "#ed3039", // Palestinian flag red (default)
    eventMarkerStroke: "#000000",
    scrubberLine: "#009639", // Palestinian flag green
    scrubberHandle: "#009639",
    scrubberStroke: "#000000",
  },
};

/**
 * D3TimelineRenderer - Encapsulates all D3.js timeline rendering logic
 * Separates D3 operations from React component lifecycle
 */
export class D3TimelineRenderer {
  private svg: Selection<SVGSVGElement, unknown, null, undefined>;
  private config: TimelineConfig;
  private timeScale: ScaleTime<number, number>;
  private onTimestampChange: (date: Date) => void;
  private onPause: () => void;
  private onSiteHighlight?: (event: TimelineEvent) => void;
  private highlightedSiteId: string | null = null;

  constructor(
    svgElement: SVGSVGElement,
    timeScale: ScaleTime<number, number>,
    config: Partial<TimelineConfig> = {},
    callbacks: {
      onTimestampChange: (date: Date) => void;
      onPause: () => void;
      onSiteHighlight?: (event: TimelineEvent) => void;
    }
  ) {
    this.svg = select(svgElement);
    this.config = { ...DEFAULT_TIMELINE_CONFIG, ...config };
    this.timeScale = timeScale;
    this.onTimestampChange = callbacks.onTimestampChange;
    this.onPause = callbacks.onPause;
    this.onSiteHighlight = callbacks.onSiteHighlight;
  }

  /**
   * Update the time scale (e.g., when container width changes)
   */
  updateScale(timeScale: ScaleTime<number, number>) {
    this.timeScale = timeScale;
  }

  /**
   * Render the complete timeline (axis, events, scrubber)
   */
  render(events: TimelineEvent[], currentTimestamp: Date, highlightedSiteId: string | null = null) {
    this.highlightedSiteId = highlightedSiteId;
    this.svg.selectAll("*").remove();
    this.renderAxis();
    this.renderEventMarkers(events);
    this.renderScrubber(currentTimestamp);
  }

  /**
   * Render the time axis
   */
  private renderAxis() {
    const { height, colors } = this.config;

    const xAxis = axisBottom(this.timeScale).ticks(6).tickFormat((d) => {
      const date = d as Date;
      return timeFormat("%b %Y")(date);
    });

    const axisGroup = this.svg
      .append("g")
      .attr("transform", `translate(0, ${height / 2})`)
      .call(xAxis);

    axisGroup.selectAll("text").attr("fill", colors.axis).attr("font-size", "9px");

    axisGroup
      .selectAll("line")
      .attr("stroke", colors.axisLine)
      .attr("stroke-width", 1);

    axisGroup
      .select(".domain")
      .attr("stroke", colors.axisDomain)
      .attr("stroke-width", 2);
  }

  /**
   * Get color for event marker based on status
   */
  private getMarkerColor(status?: string): string {
    switch (status) {
      case "destroyed":
        return "#dc2626"; // red-600 (most severe)
      case "heavily-damaged":
        return "#ea580c"; // orange-600 (moderate)
      case "damaged":
        return "#ca8a04"; // yellow-600 (minor)
      default:
        return this.config.colors.eventMarker; // Default red
    }
  }

  /**
   * Render event markers (destruction dates)
   * Enhanced with color-coding by status, hover effects, and better tooltips
   */
  private renderEventMarkers(events: TimelineEvent[]) {
    const { height, eventMarkerRadius, colors } = this.config;

    // Create a group for each event marker so we can add text labels
    const markerGroups = this.svg
      .selectAll("g.event-marker-group")
      .data(events)
      .enter()
      .append("g")
      .attr("class", "event-marker-group");

    const markers = markerGroups
      .append("circle")
      .attr("class", "event-marker")
      .attr("cx", (d) => this.timeScale(d.date))
      .attr("cy", height / 2)
      .attr("r", (d) => d.siteId === this.highlightedSiteId ? eventMarkerRadius + 2 : eventMarkerRadius)
      .attr("fill", (d) => this.getMarkerColor(d.status))
      .attr("stroke", (d) => d.siteId === this.highlightedSiteId ? "#009639" : colors.eventMarkerStroke) // Green for highlighted
      .attr("stroke-width", (d) => d.siteId === this.highlightedSiteId ? 3 : 1.5)
      .style("cursor", "pointer")
      .style("transition", "all 0.2s");

    markerGroups
      .append("text")
      .attr("class", "event-date-label")
      .attr("x", (d) => this.timeScale(d.date))
      .attr("y", height / 2 - eventMarkerRadius - 8)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("font-weight", "500")
      .attr("fill", "#9ca3af")
      .attr("opacity", 0)
      .style("pointer-events", "none")
      .text((d) => timeFormat("%b %d, %Y")(d.date));

    markerGroups
      .on("mouseenter", function () {
        const group = select(this);
        group.select("circle")
          .transition()
          .duration(150)
          .attr("r", eventMarkerRadius + 2)
          .attr("stroke-width", 2);

        group.select("text")
          .transition()
          .duration(150)
          .attr("opacity", 1);
      })
      .on("mouseleave", function () {
        const group = select(this);
        group.select("circle")
          .transition()
          .duration(150)
          .attr("r", eventMarkerRadius)
          .attr("stroke-width", 1.5);

        group.select("text")
          .transition()
          .duration(150)
          .attr("opacity", 0);
      })
      .on("click", (_event, d) => {
        this.onTimestampChange(d.date);
        this.onPause();
        // Highlight site when timeline dot is clicked (doesn't open modal)
        if (this.onSiteHighlight) {
          this.onSiteHighlight(d);
        }
      });

    markers
      .append("title")
      .text(
        (d) =>
          `${d.siteName}\n${timeFormat("%B %d, %Y")(d.date)}${d.status ? `\nStatus: ${d.status.replace("-", " ")}` : ""}`
      );
  }

  /**
   * Render the scrubber (vertical line + draggable handle)
   */
  private renderScrubber(currentTimestamp: Date) {
    const { height, scrubberRadius, colors } = this.config;

    const scrubberGroup = this.svg.append("g").attr("class", "scrubber-group");

    scrubberGroup
      .append("line")
      .attr("class", "scrubber-line")
      .attr("x1", this.timeScale(currentTimestamp))
      .attr("y1", 10)
      .attr("x2", this.timeScale(currentTimestamp))
      .attr("y2", height - 10)
      .attr("stroke", colors.scrubberLine)
      .attr("stroke-width", 3);

    const handle = scrubberGroup
      .append("circle")
      .attr("class", "scrubber-handle")
      .attr("cx", this.timeScale(currentTimestamp))
      .attr("cy", height / 2)
      .attr("r", scrubberRadius)
      .attr("fill", colors.scrubberHandle)
      .attr("stroke", colors.scrubberStroke)
      .attr("stroke-width", 2)
      .style("cursor", "grab");

    const dragBehavior = drag<SVGCircleElement, unknown>()
      .on("start", function () {
        select(this)
          .style("cursor", "grabbing")
          .transition()
          .duration(100)
          .attr("r", scrubberRadius + 2)
          .attr("stroke-width", 3)
          .style("filter", "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))");
      })
      .on("drag", (event) => {
        const x = Math.max(
          this.timeScale.range()[0],
          Math.min(this.timeScale.range()[1], event.x)
        );
        const newDate = this.timeScale.invert(x);
        this.onTimestampChange(newDate);
      })
      .on("end", function () {
        select(this)
          .style("cursor", "grab")
          .transition()
          .duration(200)
          .attr("r", scrubberRadius)
          .attr("stroke-width", 2)
          .style("filter", "none");
      });

    handle.on("mousedown", () => {
      this.onPause();
    });

    handle.call(dragBehavior);
  }

  /**
   * Cleanup D3 resources
   */
  cleanup() {
    this.svg.selectAll("*").remove();
  }
}
