import { describe, it, expect } from "vitest";
import { calculateBeforeDate, findClosestReleaseIndex } from "./intervalCalculations";
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
