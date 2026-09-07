import { describe, it, expect, beforeEach } from "vitest";
import { scaleTime } from "d3-scale";
import { D3TimelineRenderer, DEFAULT_TIMELINE_CONFIG, type TimelineEvent } from "./d3Timeline";

/**
 * Marker placement — the part of the renderer that makes a factual claim.
 *
 * A dot's y says "this many sites on this date" and a dot's x says "on this
 * date", so these assert on the rendered cx/cy rather than on styling. They are
 * the guard on the regression that motivated the layout: bin-packing by pixel
 * gap stacked consecutive days on top of each other, which made a column's
 * height read as crowding rather than as a day's toll.
 */

const WIDTH = 900;
const DOMAIN_START = new Date("2023-10-01T00:00:00Z");
const DOMAIN_END = new Date("2024-01-01T00:00:00Z");

/** Y of the axis line: total height less the tick labels and the month lane. */
const BASELINE_Y = DEFAULT_TIMELINE_CONFIG.height - 17 - 11;

function makeEvent(date: string, siteId: string, precision?: "day" | "month"): TimelineEvent {
  return {
    date: new Date(`${date.length === 7 ? `${date}-01` : date}T00:00:00Z`),
    siteName: `Site ${siteId}`,
    siteId,
    ...(precision ? { datePrecision: precision } : {}),
  };
}

/** Render into a detached SVG and read back every event marker's centre. */
function place(events: TimelineEvent[]): Array<{ cx: number; cy: number; title: string }> {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  document.body.appendChild(svg);

  const scale = scaleTime().domain([DOMAIN_START, DOMAIN_END]).range([0, WIDTH]);
  const renderer = new D3TimelineRenderer(svg, scale, {}, {
    onTimestampChange: () => {},
    onPause: () => {},
  });
  renderer.render(events, DOMAIN_START);

  return [...svg.querySelectorAll("circle.event-marker")].map((c) => ({
    cx: Number(c.getAttribute("cx")),
    cy: Number(c.getAttribute("cy")),
    title: c.querySelector("title")?.textContent ?? "",
  }));
}

describe("D3TimelineRenderer marker placement", () => {
  beforeEach(() => {
    document.body.replaceChildren();
  });

  it("stacks same-day events into a single column", () => {
    const marks = place([
      makeEvent("2023-11-01", "a"),
      makeEvent("2023-11-01", "b"),
      makeEvent("2023-11-01", "c"),
    ]);

    expect(marks).toHaveLength(3);
    // One x — the column sits on the date, not spread around it.
    expect(new Set(marks.map((m) => m.cx)).size).toBe(1);
    // Three distinct rows, each higher than the last.
    const ys = marks.map((m) => m.cy).sort((p, q) => q - p);
    expect(new Set(ys).size).toBe(3);
    expect(ys[0]).toBeLessThan(BASELINE_Y);
  });

  it("keeps consecutive days side by side rather than stacked", () => {
    // The regression: at this span a day is ~10px, narrower than the old 7px
    // pixel gap plus dot, so Nov 1 and Nov 2 used to stack into a false column.
    const marks = place([makeEvent("2023-11-01", "a"), makeEvent("2023-11-02", "b")]);

    expect(marks[0].cy).toBe(marks[1].cy);
    expect(marks[0].cx).toBeLessThan(marks[1].cx);
  });

  it("caps a column's height so a dense day cannot overflow the strip", () => {
    const marks = place(
      Array.from({ length: 12 }, (_, i) => makeEvent("2023-11-01", `s${i}`))
    );

    expect(marks).toHaveLength(12);
    // Every dot stays above the axis and inside the SVG.
    for (const m of marks) {
      expect(m.cy).toBeGreaterThan(0);
      expect(m.cy).toBeLessThan(BASELINE_Y);
    }
    // Six rows, then the surplus piles onto the top one.
    expect(new Set(marks.map((m) => m.cy)).size).toBe(6);
  });

  it("puts month-only events in the lane below the axis", () => {
    const marks = place([makeEvent("2023-11", "a", "month"), makeEvent("2023-11-15", "b")]);

    const [monthOnly, dated] = marks;
    expect(monthOnly.cy).toBeGreaterThan(BASELINE_Y);
    expect(dated.cy).toBeLessThan(BASELINE_Y);
  });

  it("spreads month-only events across the month rather than piling them on the 1st", () => {
    const scale = scaleTime().domain([DOMAIN_START, DOMAIN_END]).range([0, WIDTH]);
    const decStart = scale(new Date("2023-12-01T00:00:00Z"));
    const janStart = scale(new Date("2024-01-01T00:00:00Z"));

    const marks = place(
      Array.from({ length: 4 }, (_, i) => makeEvent("2023-12", `s${i}`, "month"))
    );

    // Four distinct positions, all inside December — a window, not four claims
    // about the 1st, and not a claim about any day outside the month.
    expect(new Set(marks.map((m) => m.cx)).size).toBe(4);
    for (const m of marks) {
      expect(m.cx).toBeGreaterThan(decStart);
      expect(m.cx).toBeLessThan(janStart);
    }
    // They share the lane, so the spread reads horizontally.
    expect(new Set(marks.map((m) => m.cy)).size).toBe(1);
  });

  it("keeps the lanes independent when a date carries both kinds of event", () => {
    // Regression: dated and month-only events once shared one per-date counter,
    // so the five dated sites on Nov 1 consumed the indices the three month-only
    // ones needed. That overflowed the row cap *and* threw a November ring out
    // past the end of November — a site drawn in the wrong month entirely.
    const scale = scaleTime().domain([DOMAIN_START, DOMAIN_END]).range([0, WIDTH]);
    const novStart = scale(new Date("2023-11-01T00:00:00Z"));
    const decStart = scale(new Date("2023-12-01T00:00:00Z"));

    const marks = place([
      ...Array.from({ length: 5 }, (_, i) => makeEvent("2023-11-01", `dated${i}`)),
      ...Array.from({ length: 3 }, (_, i) => makeEvent("2023-11", `month${i}`, "month")),
    ]);

    const rings = marks.filter((m) => m.cy > BASELINE_Y);
    const dots = marks.filter((m) => m.cy < BASELINE_Y);

    // Every ring stays inside its own month.
    expect(rings).toHaveLength(3);
    for (const r of rings) {
      expect(r.cx).toBeGreaterThan(novStart);
      expect(r.cx).toBeLessThan(decStart);
    }
    // Evenly spread, so none of the three shares a position.
    expect(new Set(rings.map((r) => r.cx)).size).toBe(3);

    // The five dated dots get five distinct rows — none lost to the cap.
    expect(dots).toHaveLength(5);
    expect(new Set(dots.map((d) => d.cy)).size).toBe(5);
  });

  it("says the day is unrecorded in a month-only tooltip", () => {
    const [monthOnly] = place([makeEvent("2023-12", "a", "month")]);

    expect(monthOnly.title).toContain("December 2023");
    expect(monthOnly.title).toContain("day not recorded");
  });
});
