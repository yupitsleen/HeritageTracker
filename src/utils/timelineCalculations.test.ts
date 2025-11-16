/**
 * Tests for timeline calculation utilities
 * Covers date range calculations and 7-day buffer logic
 */

import { describe, it, expect } from "vitest";
import {
  calculateDefaultDateRange,
  filterEventsByDateRange,
  calculateAdjustedDateRange,
} from "./timelineCalculations";
import type { TimelineEvent } from "./d3Timeline";

describe("calculateDefaultDateRange", () => {
  const fallbackStart = new Date("2023-01-01");
  const fallbackEnd = new Date("2024-12-31");

  it("returns fallback dates when events array is empty", () => {
    const result = calculateDefaultDateRange([], fallbackStart, fallbackEnd);
    expect(result.defaultStartDate).toEqual(fallbackStart);
    expect(result.defaultEndDate).toEqual(fallbackEnd);
  });

  it("calculates range from single event", () => {
    const events: TimelineEvent[] = [
      {
        date: new Date("2024-06-15"),
        siteName: "Test Site",
        siteId: "site-1",
        status: "destroyed",
      },
    ];

    const result = calculateDefaultDateRange(events, fallbackStart, fallbackEnd);
    expect(result.defaultStartDate).toEqual(new Date("2024-06-15"));
    expect(result.defaultEndDate).toEqual(new Date("2024-06-15"));
  });

  it("calculates range from multiple events", () => {
    const events: TimelineEvent[] = [
      {
        date: new Date("2024-03-15"),
        siteName: "Site 1",
        siteId: "site-1",
        status: "destroyed",
      },
      {
        date: new Date("2024-08-20"),
        siteName: "Site 2",
        siteId: "site-2",
        status: "heavily-damaged",
      },
      {
        date: new Date("2024-01-10"),
        siteName: "Site 3",
        siteId: "site-3",
        status: "damaged",
      },
    ];

    const result = calculateDefaultDateRange(events, fallbackStart, fallbackEnd);
    expect(result.defaultStartDate).toEqual(new Date("2024-01-10"));
    expect(result.defaultEndDate).toEqual(new Date("2024-08-20"));
  });

  it("handles events with same date", () => {
    const sameDate = new Date("2024-05-01");
    const events: TimelineEvent[] = [
      {
        date: sameDate,
        siteName: "Site 1",
        siteId: "site-1",
        status: "destroyed",
      },
      {
        date: sameDate,
        siteName: "Site 2",
        siteId: "site-2",
        status: "destroyed",
      },
    ];

    const result = calculateDefaultDateRange(events, fallbackStart, fallbackEnd);
    expect(result.defaultStartDate).toEqual(sameDate);
    expect(result.defaultEndDate).toEqual(sameDate);
  });
});

describe("filterEventsByDateRange", () => {
  const events: TimelineEvent[] = [
    {
      date: new Date("2024-01-15"),
      siteName: "Site 1",
      siteId: "site-1",
      status: "destroyed",
    },
    {
      date: new Date("2024-03-20"),
      siteName: "Site 2",
      siteId: "site-2",
      status: "heavily-damaged",
    },
    {
      date: new Date("2024-06-10"),
      siteName: "Site 3",
      siteId: "site-3",
      status: "damaged",
    },
    {
      date: new Date("2024-09-05"),
      siteName: "Site 4",
      siteId: "site-4",
      status: "destroyed",
    },
  ];

  it("returns all events when no filters applied", () => {
    const result = filterEventsByDateRange(events, null, null);
    expect(result).toHaveLength(4);
    expect(result).toEqual(events);
  });

  it("filters by start date only", () => {
    const result = filterEventsByDateRange(events, new Date("2024-03-01"), null);
    expect(result).toHaveLength(3);
    expect(result[0].siteId).toBe("site-2");
    expect(result[1].siteId).toBe("site-3");
    expect(result[2].siteId).toBe("site-4");
  });

  it("filters by end date only", () => {
    const result = filterEventsByDateRange(events, null, new Date("2024-06-30"));
    expect(result).toHaveLength(3);
    expect(result[0].siteId).toBe("site-1");
    expect(result[1].siteId).toBe("site-2");
    expect(result[2].siteId).toBe("site-3");
  });

  it("filters by both start and end date", () => {
    const result = filterEventsByDateRange(
      events,
      new Date("2024-03-01"),
      new Date("2024-06-30")
    );
    expect(result).toHaveLength(2);
    expect(result[0].siteId).toBe("site-2");
    expect(result[1].siteId).toBe("site-3");
  });

  it("returns empty array when no events match filter", () => {
    const result = filterEventsByDateRange(
      events,
      new Date("2025-01-01"),
      new Date("2025-12-31")
    );
    expect(result).toHaveLength(0);
  });

  it("includes events on exact boundary dates", () => {
    const result = filterEventsByDateRange(
      events,
      new Date("2024-03-20"),
      new Date("2024-06-10")
    );
    expect(result).toHaveLength(2);
    expect(result[0].siteId).toBe("site-2");
    expect(result[1].siteId).toBe("site-3");
  });
});

describe("calculateAdjustedDateRange", () => {
  const fallbackStart = new Date("2023-01-01");
  const fallbackEnd = new Date("2024-12-31");

  describe("with no events", () => {
    it("returns fallback dates regardless of filter state", () => {
      const result = calculateAdjustedDateRange([], false, fallbackStart, fallbackEnd);
      expect(result.adjustedStartDate).toEqual(fallbackStart);
      expect(result.adjustedEndDate).toEqual(fallbackEnd);
    });

    it("returns fallback dates even with active filter", () => {
      const result = calculateAdjustedDateRange([], true, fallbackStart, fallbackEnd);
      expect(result.adjustedStartDate).toEqual(fallbackStart);
      expect(result.adjustedEndDate).toEqual(fallbackEnd);
    });
  });

  describe("with no active filter", () => {
    it("returns fallback dates when hasActiveFilter is false", () => {
      const events: TimelineEvent[] = [
        {
          date: new Date("2024-06-15"),
          siteName: "Test Site",
          siteId: "site-1",
          status: "destroyed",
        },
      ];

      const result = calculateAdjustedDateRange(events, false, fallbackStart, fallbackEnd);
      expect(result.adjustedStartDate).toEqual(fallbackStart);
      expect(result.adjustedEndDate).toEqual(fallbackEnd);
    });
  });

  describe("with active filter", () => {
    it("applies 7-day buffer to single event", () => {
      const eventDate = new Date("2024-06-15");
      const events: TimelineEvent[] = [
        {
          date: eventDate,
          siteName: "Test Site",
          siteId: "site-1",
          status: "destroyed",
        },
      ];

      const result = calculateAdjustedDateRange(events, true, fallbackStart, fallbackEnd);

      // Calculate expected dates with 7-day buffer
      const expectedStart = new Date(eventDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      const expectedEnd = new Date(eventDate.getTime() + 7 * 24 * 60 * 60 * 1000);

      expect(result.adjustedStartDate).toEqual(expectedStart);
      expect(result.adjustedEndDate).toEqual(expectedEnd);
    });

    it("applies 7-day buffer to multiple events", () => {
      const earliestDate = new Date("2024-01-10");
      const latestDate = new Date("2024-08-20");
      const events: TimelineEvent[] = [
        {
          date: new Date("2024-03-15"),
          siteName: "Site 1",
          siteId: "site-1",
          status: "destroyed",
        },
        {
          date: latestDate,
          siteName: "Site 2",
          siteId: "site-2",
          status: "heavily-damaged",
        },
        {
          date: earliestDate,
          siteName: "Site 3",
          siteId: "site-3",
          status: "damaged",
        },
      ];

      const result = calculateAdjustedDateRange(events, true, fallbackStart, fallbackEnd);

      // Calculate expected dates with 7-day buffer
      const expectedStart = new Date(earliestDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      const expectedEnd = new Date(latestDate.getTime() + 7 * 24 * 60 * 60 * 1000);

      expect(result.adjustedStartDate).toEqual(expectedStart);
      expect(result.adjustedEndDate).toEqual(expectedEnd);
    });

    it("buffer duration is exactly 7 days (604800000 ms)", () => {
      const eventDate = new Date("2024-06-15");
      const events: TimelineEvent[] = [
        {
          date: eventDate,
          siteName: "Test Site",
          siteId: "site-1",
          status: "destroyed",
        },
      ];

      const result = calculateAdjustedDateRange(events, true, fallbackStart, fallbackEnd);

      const bufferDuration = 7 * 24 * 60 * 60 * 1000; // 604800000 ms
      const startBuffer = eventDate.getTime() - result.adjustedStartDate.getTime();
      const endBuffer = result.adjustedEndDate.getTime() - eventDate.getTime();

      expect(startBuffer).toBe(bufferDuration);
      expect(endBuffer).toBe(bufferDuration);
    });

    it("maintains correct order when events span short time period", () => {
      const event1Date = new Date("2024-06-10");
      const event2Date = new Date("2024-06-12");
      const events: TimelineEvent[] = [
        {
          date: event1Date,
          siteName: "Site 1",
          siteId: "site-1",
          status: "destroyed",
        },
        {
          date: event2Date,
          siteName: "Site 2",
          siteId: "site-2",
          status: "destroyed",
        },
      ];

      const result = calculateAdjustedDateRange(events, true, fallbackStart, fallbackEnd);

      // Should still have proper start/end relationship
      expect(result.adjustedStartDate.getTime()).toBeLessThan(event1Date.getTime());
      expect(result.adjustedEndDate.getTime()).toBeGreaterThan(event2Date.getTime());
      expect(result.adjustedStartDate.getTime()).toBeLessThan(
        result.adjustedEndDate.getTime()
      );
    });
  });

  describe("integration: filter toggle behavior", () => {
    it("simulates showUnknownDestructionDates=true (no filter)", () => {
      const events: TimelineEvent[] = [
        {
          date: new Date("2024-06-15"),
          siteName: "Test Site",
          siteId: "site-1",
          status: "destroyed",
        },
      ];

      // When toggle is ON (show unknown dates), hasActiveFilter = false
      const hasActiveFilter = false;
      const result = calculateAdjustedDateRange(
        events,
        hasActiveFilter,
        fallbackStart,
        fallbackEnd
      );

      // Should use fallback dates (full timeline)
      expect(result.adjustedStartDate).toEqual(fallbackStart);
      expect(result.adjustedEndDate).toEqual(fallbackEnd);
    });

    it("simulates showUnknownDestructionDates=false (filter active)", () => {
      const eventDate = new Date("2024-06-15");
      const events: TimelineEvent[] = [
        {
          date: eventDate,
          siteName: "Test Site",
          siteId: "site-1",
          status: "destroyed",
        },
      ];

      // When toggle is OFF (hide unknown dates), hasActiveFilter = true
      const hasActiveFilter = true;
      const result = calculateAdjustedDateRange(
        events,
        hasActiveFilter,
        fallbackStart,
        fallbackEnd
      );

      // Should zoom to filtered events with buffer
      const expectedStart = new Date(eventDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      const expectedEnd = new Date(eventDate.getTime() + 7 * 24 * 60 * 60 * 1000);

      expect(result.adjustedStartDate).toEqual(expectedStart);
      expect(result.adjustedEndDate).toEqual(expectedEnd);
    });
  });
});
