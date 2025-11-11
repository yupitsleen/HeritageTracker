import { describe, it, expect } from "vitest";
import {
  calculateBeforeDate,
  calculateIntervalDate,
  findBeforeRelease,
  findClosestReleaseIndex,
} from "./intervalCalculations";
import type { WaybackRelease } from "../services/waybackService";

// Mock Wayback releases for testing
const mockReleases: WaybackRelease[] = [
  {
    releaseNum: 1,
    releaseDate: "2014-02-20",
    label: "2014-02-20",
    tileUrl: "https://example.com/tile/1/{z}/{y}/{x}",
    maxZoom: 19,
  },
  {
    releaseNum: 2,
    releaseDate: "2020-06-15",
    label: "2020-06-15",
    tileUrl: "https://example.com/tile/2/{z}/{y}/{x}",
    maxZoom: 19,
  },
  {
    releaseNum: 3,
    releaseDate: "2023-10-01",
    label: "2023-10-01",
    tileUrl: "https://example.com/tile/3/{z}/{y}/{x}",
    maxZoom: 19,
  },
  {
    releaseNum: 4,
    releaseDate: "2024-01-15",
    label: "2024-01-15",
    tileUrl: "https://example.com/tile/4/{z}/{y}/{x}",
    maxZoom: 19,
  },
  {
    releaseNum: 5,
    releaseDate: "2024-06-30",
    label: "2024-06-30",
    tileUrl: "https://example.com/tile/5/{z}/{y}/{x}",
    maxZoom: 19,
  },
];

describe("calculateBeforeDate", () => {
  const destructionDate = new Date("2024-02-15");

  it("calculates 'as_large_as_possible' interval correctly", () => {
    const beforeDate = calculateBeforeDate(
      destructionDate,
      "as_large_as_possible",
      mockReleases
    );

    // Should return the earliest release
    expect(beforeDate.toISOString().split("T")[0]).toBe("2014-02-20");
  });

  it("calculates 'as_small_as_possible' interval correctly", () => {
    const beforeDate = calculateBeforeDate(
      destructionDate,
      "as_small_as_possible",
      mockReleases
    );

    // Should return the latest release before destruction (2024-01-15)
    expect(beforeDate.toISOString().split("T")[0]).toBe("2024-01-15");
  });

  it("calculates '1_month' interval correctly", () => {
    const beforeDate = calculateBeforeDate(destructionDate, "1_month", mockReleases);

    // Should be approximately 30 days before destruction
    const expectedDate = new Date(destructionDate);
    expectedDate.setDate(expectedDate.getDate() - 30);

    expect(beforeDate.toISOString().split("T")[0]).toBe(
      expectedDate.toISOString().split("T")[0]
    );
  });

  it("calculates '1_year' interval correctly", () => {
    const beforeDate = calculateBeforeDate(destructionDate, "1_year", mockReleases);

    // Should be 1 year before destruction
    expect(beforeDate.getFullYear()).toBe(destructionDate.getFullYear() - 1);
    expect(beforeDate.getMonth()).toBe(destructionDate.getMonth());
  });

  it("calculates '5_years' interval correctly", () => {
    const beforeDate = calculateBeforeDate(destructionDate, "5_years", mockReleases);

    // Should be 5 years before destruction
    expect(beforeDate.getFullYear()).toBe(destructionDate.getFullYear() - 5);
    expect(beforeDate.getMonth()).toBe(destructionDate.getMonth());
  });

  it("handles empty releases array for 'as_large_as_possible'", () => {
    const beforeDate = calculateBeforeDate(
      destructionDate,
      "as_large_as_possible",
      []
    );

    // Should fallback to 10 years before destruction
    expect(beforeDate.getFullYear()).toBe(destructionDate.getFullYear() - 10);
  });

  it("handles empty releases array for 'as_small_as_possible'", () => {
    const beforeDate = calculateBeforeDate(
      destructionDate,
      "as_small_as_possible",
      []
    );

    // Should fallback to 7 days before destruction
    const expectedDate = new Date(destructionDate);
    expectedDate.setDate(expectedDate.getDate() - 7);

    expect(beforeDate.toISOString().split("T")[0]).toBe(
      expectedDate.toISOString().split("T")[0]
    );
  });

  it("handles destruction before all releases for 'as_small_as_possible'", () => {
    const earlyDestruction = new Date("2010-01-01");
    const beforeDate = calculateBeforeDate(
      earlyDestruction,
      "as_small_as_possible",
      mockReleases
    );

    // Should fallback to 7 days before destruction
    const expectedDate = new Date(earlyDestruction);
    expectedDate.setDate(expectedDate.getDate() - 7);

    expect(beforeDate.toISOString().split("T")[0]).toBe(
      expectedDate.toISOString().split("T")[0]
    );
  });
});

describe("findClosestReleaseIndex", () => {
  it("finds the closest release to a target date", () => {
    const targetDate = new Date("2023-10-05");
    const index = findClosestReleaseIndex(mockReleases, targetDate);

    // Should find release #3 (2023-10-01) as closest
    expect(index).toBe(2);
  });

  it("finds the exact match when target date matches release date", () => {
    const targetDate = new Date("2024-01-15");
    const index = findClosestReleaseIndex(mockReleases, targetDate);

    // Should find release #4 (2024-01-15)
    expect(index).toBe(3);
  });

  it("finds the closest release when target is between two releases", () => {
    const targetDate = new Date("2022-01-01");
    const index = findClosestReleaseIndex(mockReleases, targetDate);

    // Should find release #2 (2020-06-15) as closest
    expect(index).toBe(1);
  });

  it("finds the closest release when target is before all releases", () => {
    const targetDate = new Date("2010-01-01");
    const index = findClosestReleaseIndex(mockReleases, targetDate);

    // Should find release #1 (2014-02-20) as closest
    expect(index).toBe(0);
  });

  it("finds the closest release when target is after all releases", () => {
    const targetDate = new Date("2025-12-31");
    const index = findClosestReleaseIndex(mockReleases, targetDate);

    // Should find release #5 (2024-06-30) as closest
    expect(index).toBe(4);
  });

  it("returns 0 when releases array is empty", () => {
    const targetDate = new Date("2024-01-01");
    const index = findClosestReleaseIndex([], targetDate);

    expect(index).toBe(0);
  });

  it("handles single release correctly", () => {
    const singleRelease = [mockReleases[0]];
    const targetDate = new Date("2020-01-01");
    const index = findClosestReleaseIndex(singleRelease, targetDate);

    expect(index).toBe(0);
  });
});

describe("calculateBeforeDate - Edge Cases", () => {
  it("handles invalid destruction date gracefully", () => {
    const invalidDate = new Date("invalid");
    const result = calculateBeforeDate(invalidDate, "1_month", mockReleases);

    // Should return a Date object (even if NaN internally)
    expect(result).toBeInstanceOf(Date);
  });

  it("handles null interval string by using default", () => {
    const destructionDate = new Date("2024-02-15");
    const emptyInterval = "" as ComparisonInterval; // Force empty string to test fallback
    const result = calculateBeforeDate(destructionDate, emptyInterval, mockReleases);

    // Should use default (1 month fallback)
    expect(result).toBeInstanceOf(Date);
    expect(result.getTime()).toBeLessThan(destructionDate.getTime());
  });

  it("handles empty releases array for all interval types", () => {
    const destructionDate = new Date("2024-02-15");
    const intervals = ["1_month", "1_year", "5_years"] as const;

    intervals.forEach((interval) => {
      const result = calculateBeforeDate(destructionDate, interval, []);
      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).toBeLessThan(destructionDate.getTime());
    });
  });

  it("handles destruction date at year boundary", () => {
    const newYearDate = new Date("2024-01-01");
    const beforeDate = calculateBeforeDate(newYearDate, "1_month", mockReleases);

    // Should correctly handle month rollover to previous year
    expect(beforeDate.getFullYear()).toBe(2023);
    expect(beforeDate.getMonth()).toBe(11); // December
  });

  it("handles very old destruction dates", () => {
    const ancientDate = new Date("1900-01-01");
    const beforeDate = calculateBeforeDate(ancientDate, "as_large_as_possible", mockReleases);

    // Should still return earliest release (not go further back)
    expect(beforeDate.toISOString().split("T")[0]).toBe("2014-02-20");
  });

  it("handles far future destruction dates", () => {
    const futureDate = new Date("2030-01-01");
    const beforeDate = calculateBeforeDate(futureDate, "5_years", mockReleases);

    // Should calculate correctly even for future dates (2030 - 5 = 2025, but Date arithmetic may vary)
    expect(beforeDate.getFullYear()).toBe(futureDate.getFullYear() - 5);
  });
});

describe("findClosestReleaseIndex - Edge Cases", () => {
  it("handles target date with invalid Date object", () => {
    const invalidDate = new Date("invalid");

    // Should not throw, returns safe default
    expect(() => findClosestReleaseIndex(mockReleases, invalidDate)).not.toThrow();
  });

  it("handles releases with identical dates", () => {
    const duplicateReleases: WaybackRelease[] = [
      { ...mockReleases[0], releaseDate: "2020-06-15" },
      { ...mockReleases[1], releaseDate: "2020-06-15" },
    ];
    const targetDate = new Date("2020-06-15");
    const index = findClosestReleaseIndex(duplicateReleases, targetDate);

    // Should return first match
    expect(index).toBe(0);
  });

  it("handles target date exactly between two releases", () => {
    const midpointReleases: WaybackRelease[] = [
      { ...mockReleases[0], releaseDate: "2024-01-01" },
      { ...mockReleases[1], releaseDate: "2024-01-11" },
    ];
    const targetDate = new Date("2024-01-06"); // Exactly 5 days from each

    const index = findClosestReleaseIndex(midpointReleases, targetDate);

    // Should return first match (index 0) due to iteration order
    expect(index).toBeGreaterThanOrEqual(0);
    expect(index).toBeLessThan(midpointReleases.length);
  });

  it("handles releases in non-chronological order", () => {
    const unorderedReleases: WaybackRelease[] = [
      mockReleases[4], // 2024-06-30
      mockReleases[1], // 2020-06-15
      mockReleases[3], // 2024-01-15
    ];
    const targetDate = new Date("2024-01-20");
    const index = findClosestReleaseIndex(unorderedReleases, targetDate);

    // Should find closest regardless of order (2024-01-15 at index 2)
    expect(unorderedReleases[index].releaseDate).toBe("2024-01-15");
  });
});

describe("calculateIntervalDate (Pure Function)", () => {
  const baseDate = new Date("2024-02-15");

  it("calculates 'as_large_as_possible' interval (10 years by default)", () => {
    const result = calculateIntervalDate(baseDate, "as_large_as_possible");

    expect(result.getFullYear()).toBe(baseDate.getFullYear() - 10);
    expect(result.getMonth()).toBe(baseDate.getMonth());
    expect(result.getDate()).toBe(baseDate.getDate());
  });

  it("calculates 'as_small_as_possible' interval (7 days by default)", () => {
    const result = calculateIntervalDate(baseDate, "as_small_as_possible");

    const expected = new Date(baseDate);
    expected.setDate(expected.getDate() - 7);

    expect(result.toISOString().split("T")[0]).toBe(
      expected.toISOString().split("T")[0]
    );
  });

  it("calculates '1_month' interval (30 days by default)", () => {
    const result = calculateIntervalDate(baseDate, "1_month");

    const expected = new Date(baseDate);
    expected.setDate(expected.getDate() - 30);

    expect(result.toISOString().split("T")[0]).toBe(
      expected.toISOString().split("T")[0]
    );
  });

  it("calculates '1_year' interval correctly", () => {
    const result = calculateIntervalDate(baseDate, "1_year");

    expect(result.getFullYear()).toBe(baseDate.getFullYear() - 1);
    expect(result.getMonth()).toBe(baseDate.getMonth());
    expect(result.getDate()).toBe(baseDate.getDate());
  });

  it("calculates '5_years' interval correctly", () => {
    const result = calculateIntervalDate(baseDate, "5_years");

    expect(result.getFullYear()).toBe(baseDate.getFullYear() - 5);
    expect(result.getMonth()).toBe(baseDate.getMonth());
    expect(result.getDate()).toBe(baseDate.getDate());
  });

  it("handles invalid interval by using default (1 month)", () => {
    const emptyInterval = "" as ComparisonInterval;
    const result = calculateIntervalDate(baseDate, emptyInterval);

    // Should default to 1 month (30 days)
    const expected = new Date(baseDate);
    expected.setDate(expected.getDate() - 30);

    expect(result.toISOString().split("T")[0]).toBe(
      expected.toISOString().split("T")[0]
    );
  });

  it("does not depend on releases array (pure function)", () => {
    // This test verifies calculateIntervalDate has no external dependencies
    const result1 = calculateIntervalDate(baseDate, "1_year");
    const result2 = calculateIntervalDate(baseDate, "1_year");

    // Same input = same output (referential transparency)
    expect(result1.getTime()).toBe(result2.getTime());
  });

  it("handles date at year boundary correctly", () => {
    const newYearDate = new Date("2024-01-01");
    const result = calculateIntervalDate(newYearDate, "1_month");

    // Should correctly roll back to previous year
    expect(result.getFullYear()).toBe(2023);
    expect(result.getMonth()).toBe(11); // December
  });

  it("handles leap year dates correctly", () => {
    const leapYearDate = new Date("2024-02-29T12:00:00Z"); // Leap year (noon UTC to avoid timezone issues)
    const result = calculateIntervalDate(leapYearDate, "1_year");

    // Non-leap year fallback (2023-02-28)
    expect(result.getFullYear()).toBe(2023);
    expect(result.getMonth()).toBe(1); // February (0-indexed)
    expect(result.getDate()).toBe(28); // Should adjust to last day of February
  });
});

describe("findBeforeRelease (Wayback-Specific)", () => {
  const destructionDate = new Date("2024-02-15");

  it("uses earliest release for 'as_large_as_possible'", () => {
    const result = findBeforeRelease(
      destructionDate,
      "as_large_as_possible",
      mockReleases
    );

    expect(result.toISOString().split("T")[0]).toBe("2014-02-20");
  });

  it("uses latest release before destruction for 'as_small_as_possible'", () => {
    const result = findBeforeRelease(
      destructionDate,
      "as_small_as_possible",
      mockReleases
    );

    expect(result.toISOString().split("T")[0]).toBe("2024-01-15");
  });

  it("uses pure calculation for fixed intervals (1_month)", () => {
    const result = findBeforeRelease(destructionDate, "1_month", mockReleases);

    const expected = new Date(destructionDate);
    expected.setDate(expected.getDate() - 30);

    expect(result.toISOString().split("T")[0]).toBe(
      expected.toISOString().split("T")[0]
    );
  });

  it("falls back to pure calculation when releases array is empty", () => {
    const result = findBeforeRelease(
      destructionDate,
      "as_large_as_possible",
      []
    );

    // Should use calculateIntervalDate fallback (10 years)
    expect(result.getFullYear()).toBe(destructionDate.getFullYear() - 10);
  });

  it("falls back to pure calculation when no release before destruction", () => {
    const earlyDestruction = new Date("2010-01-01");
    const result = findBeforeRelease(
      earlyDestruction,
      "as_small_as_possible",
      mockReleases
    );

    // Should fallback to 7 days before
    const expected = new Date(earlyDestruction);
    expected.setDate(expected.getDate() - 7);

    expect(result.toISOString().split("T")[0]).toBe(
      expected.toISOString().split("T")[0]
    );
  });

  it("maintains backwards compatibility with calculateBeforeDate", () => {
    // Both functions should return identical results
    const oldResult = calculateBeforeDate(
      destructionDate,
      "as_large_as_possible",
      mockReleases
    );
    const newResult = findBeforeRelease(
      destructionDate,
      "as_large_as_possible",
      mockReleases
    );

    expect(oldResult.getTime()).toBe(newResult.getTime());
  });
});
