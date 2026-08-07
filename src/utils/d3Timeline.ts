import { select, type Selection } from "d3-selection";
import type { ScaleTime } from "d3";
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
    scrubberLine: string;
    scrubberHandle: string;
    scrubberStroke: string;
  };
}

/** Vertical distance between stacked dots (diameter + a hairline of daylight). */
const ROW_PITCH = 7;

/**
 * How tall a column can grow before it saturates.
 * ponytail: beyond this, dots pile on the top row and the column just reads
 * "full" — raise the strip height and this together if the cap starts hiding
 * real differences.
 */
const MAX_ROWS = 6;

/** Gap between the axis line and the first row of dots. */
const BASELINE_GAP = 5;

/** Space kept below the axis line for its tick marks and labels (with descenders). */
const AXIS_LABEL_SPACE = 17;

export const DEFAULT_TIMELINE_CONFIG: TimelineConfig = {
  height: 64,
  margin: 25,
  eventMarkerRadius: 3, // Compact: reduced from 6 to 3
  scrubberRadius: 7, // Compact: reduced from 12 to 7
  colors: {
    axis: "#525252",
    axisLine: "#d4d4d4",
    axisDomain: "#a3a3a3",
    eventMarker: "#ed3039", // Palestinian flag red (default)
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
  /** Y of the axis line — dots stack upward from here, tick labels sit below. */
  private get baselineY(): number {
    return this.config.height - AXIS_LABEL_SPACE;
  }

  private renderAxis() {
    const { colors } = this.config;

    const xAxis = axisBottom(this.timeScale).ticks(6).tickFormat((d) => {
      const date = d as Date;
      return timeFormat("%b %Y")(date);
    });

    const axisGroup = this.svg
      .append("g")
      .attr("transform", `translate(0, ${this.baselineY})`)
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
   * Assign each event a row above the baseline so dots never sit on top of one
   * another. Greedy, left to right: an event drops into the lowest row whose
   * last dot has already cleared its x. Same-day events therefore stack into a
   * column, and the column's height is the day's toll.
   */
  private assignRows(events: TimelineEvent[]): Array<{ event: TimelineEvent; row: number }> {
    const minGap = this.config.eventMarkerRadius * 2 + 1;
    const rowEndX: number[] = [];

    return [...events]
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map((event) => {
        const x = this.timeScale(event.date);
        let row = rowEndX.findIndex((endX) => x - endX >= minGap);
        if (row === -1) row = rowEndX.length;
        rowEndX[row] = x;
        return { event, row: Math.min(row, MAX_ROWS - 1) };
      });
  }

  /** Y of a dot in the given stack row. */
  private rowY(row: number): number {
    return this.baselineY - BASELINE_GAP - row * ROW_PITCH;
  }

  /**
   * Render event markers (destruction dates), stacked into columns so a dense
   * week reads as height rather than as one unreadable blob.
   *
   * Deliberately one colour: the dots used to be shaded by status, but every
   * event on this timeline is a destruction event, so the shading encoded
   * nothing the reader could act on.
   */
  private renderEventMarkers(events: TimelineEvent[]) {
    const { eventMarkerRadius, colors } = this.config;

    // Create a group for each event marker so we can add text labels
    const markerGroups = this.svg
      .selectAll("g.event-marker-group")
      .data(this.assignRows(events))
      .enter()
      .append("g")
      .attr("class", "event-marker-group");

    const markers = markerGroups
      .append("circle")
      .attr("class", "event-marker")
      .attr("cx", (d) => this.timeScale(d.event.date))
      .attr("cy", (d) => this.rowY(d.row))
      .attr("r", (d) => d.event.siteId === this.highlightedSiteId ? eventMarkerRadius + 2 : eventMarkerRadius)
      .attr("fill", colors.eventMarker)
      // No outline by default — the row assignment already keeps dots apart, so
      // a stroke on every dot only thickens the dense columns into a smear.
      .attr("stroke", (d) => d.event.siteId === this.highlightedSiteId ? "#009639" : "none")
      .attr("stroke-width", (d) => d.event.siteId === this.highlightedSiteId ? 3 : 0)
      .style("cursor", "pointer")
      .style("transition", "all 0.2s");

    markerGroups
      .append("text")
      .attr("class", "event-date-label")
      .attr("x", (d) => this.timeScale(d.event.date))
      .attr("y", (d) => this.rowY(d.row) - eventMarkerRadius - 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("font-weight", "500")
      .attr("fill", "#9ca3af")
      .attr("opacity", 0)
      .style("pointer-events", "none")
      .text((d) => timeFormat("%b %d, %Y")(d.event.date));

    markerGroups
      .on("mouseenter", function () {
        // Lift above neighbours so the grown dot and its label aren't overdrawn
        const group = select(this).raise();
        group.select("circle")
          .transition()
          .duration(150)
          .attr("r", eventMarkerRadius + 2);

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
          .attr("r", eventMarkerRadius);

        group.select("text")
          .transition()
          .duration(150)
          .attr("opacity", 0);
      })
      .on("click", (_event, d) => {
        this.onTimestampChange(d.event.date);
        this.onPause();
        // Highlight site when timeline dot is clicked (doesn't open modal)
        if (this.onSiteHighlight) {
          this.onSiteHighlight(d.event);
        }
      });

    markers
      .append("title")
      .text(
        ({ event: d }) =>
          `${d.siteName}\n${timeFormat("%B %d, %Y")(d.date)}${d.status ? `\nStatus: ${d.status.replace("-", " ")}` : ""}`
      );
  }

  /**
   * Render the scrubber (vertical line + draggable handle)
   */
  private renderScrubber(currentTimestamp: Date) {
    const { scrubberRadius, colors } = this.config;

    const scrubberGroup = this.svg.append("g").attr("class", "scrubber-group");

    const xPosition = this.timeScale(currentTimestamp);

    // Spans the full stack so the playhead crosses every dot, not just row 0
    scrubberGroup
      .append("line")
      .attr("class", "scrubber-line")
      .attr("x1", xPosition)
      .attr("y1", 2)
      .attr("x2", xPosition)
      .attr("y2", this.baselineY)
      .attr("stroke", colors.scrubberLine)
      .attr("stroke-width", 3);

    const handle = scrubberGroup
      .append("circle")
      .attr("class", "scrubber-handle")
      .attr("cx", xPosition)
      .attr("cy", this.baselineY)
      .attr("r", scrubberRadius)
      .attr("fill", colors.scrubberHandle)
      .attr("stroke", colors.scrubberStroke)
      .attr("stroke-width", 2)
      .style("cursor", "grab");

    // Native tooltip, same as the event dots: the date is on hover, not always on.
    handle.append("title").text(timeFormat("%B %d, %Y")(currentTimestamp));

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
