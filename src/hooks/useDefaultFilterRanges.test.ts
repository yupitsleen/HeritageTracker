import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useDefaultFilterRanges } from "./useDefaultFilterRanges";
import type { Site } from "../types";

describe("useDefaultFilterRanges", () => {
  describe("Date Range", () => {
    it("returns earliest and latest destruction dates", () => {
      const sites: Site[] = [
        {
          id: "1",
          name: "Site 1",
          type: "mosque",
          yearBuilt: "1500",
          coordinates: [31.5, 34.5],
          status: "destroyed",
          dateDestroyed: "2023-10-15",
          lastUpdated: "2024-01-01",
          description: "Test",
          historicalSignificance: "Test",
          culturalValue: "Test",
          verifiedBy: [],
          sources: [],
        },
        {
          id: "2",
          name: "Site 2",
          type: "mosque",
          yearBuilt: "1600",
          coordinates: [31.5, 34.5],
          status: "destroyed",
          dateDestroyed: "2024-02-20",
          lastUpdated: "2024-01-01",
          description: "Test",
          historicalSignificance: "Test",
          culturalValue: "Test",
          verifiedBy: [],
          sources: [],
        },
      ];

      const { result } = renderHook(() => useDefaultFilterRanges(sites));

      expect(result.current.dateRange.defaultStartDate).toEqual(
        new Date("2023-10-15")
      );
      expect(result.current.dateRange.defaultEndDate).toEqual(
        new Date("2024-02-20")
      );
    });

    it("returns default dates when no sites have destruction dates", () => {
      const sites: Site[] = [
        {
          id: "1",
          name: "Site 1",
          type: "mosque",
          yearBuilt: "1500",
          coordinates: [31.5, 34.5],
          status: "threatened",
          lastUpdated: "2024-01-01",
          description: "Test",
          historicalSignificance: "Test",
          culturalValue: "Test",
          verifiedBy: [],
          sources: [],
        },
      ];

      const { result } = renderHook(() => useDefaultFilterRanges(sites));

      expect(result.current.dateRange.defaultStartDate).toEqual(
        new Date("2023-10-07")
      );
      expect(result.current.dateRange.defaultEndDate).toBeInstanceOf(Date);
    });

    it("handles empty sites array", () => {
      const { result } = renderHook(() => useDefaultFilterRanges([]));

      expect(result.current.dateRange.defaultStartDate).toEqual(
        new Date("2023-10-07")
      );
      expect(result.current.dateRange.defaultEndDate).toBeInstanceOf(Date);
    });
  });

  describe("Year Range", () => {
    it("returns earliest and latest creation years (CE)", () => {
      const sites: Site[] = [
        {
          id: "1",
          name: "Site 1",
          type: "mosque",
          yearBuilt: "1200",
          coordinates: [31.5, 34.5],
          status: "destroyed",
          lastUpdated: "2024-01-01",
          description: "Test",
          historicalSignificance: "Test",
          culturalValue: "Test",
          verifiedBy: [],
          sources: [],
        },
        {
          id: "2",
          name: "Site 2",
          type: "mosque",
          yearBuilt: "1900",
          coordinates: [31.5, 34.5],
          status: "destroyed",
          lastUpdated: "2024-01-01",
          description: "Test",
          historicalSignificance: "Test",
          culturalValue: "Test",
          verifiedBy: [],
          sources: [],
        },
      ];

      const { result } = renderHook(() => useDefaultFilterRanges(sites));

      expect(result.current.yearRange.defaultStartYear).toBe("1200");
      expect(result.current.yearRange.defaultEndYear).toBe("1900");
      expect(result.current.yearRange.defaultStartEra).toBe("CE");
    });

    it("handles BCE years correctly", () => {
      const sites: Site[] = [
        {
          id: "1",
          name: "Ancient Site",
          type: "archaeological_site",
          yearBuilt: "800 BCE",
          coordinates: [31.5, 34.5],
          status: "destroyed",
          lastUpdated: "2024-01-01",
          description: "Test",
          historicalSignificance: "Test",
          culturalValue: "Test",
          verifiedBy: [],
          sources: [],
        },
        {
          id: "2",
          name: "Site 2",
          type: "mosque",
          yearBuilt: "1500",
          coordinates: [31.5, 34.5],
          status: "destroyed",
          lastUpdated: "2024-01-01",
          description: "Test",
          historicalSignificance: "Test",
          culturalValue: "Test",
          verifiedBy: [],
          sources: [],
        },
      ];

      const { result } = renderHook(() => useDefaultFilterRanges(sites));

      expect(result.current.yearRange.defaultStartYear).toBe("800");
      expect(result.current.yearRange.defaultEndYear).toBe("1500");
      expect(result.current.yearRange.defaultStartEra).toBe("BCE");
    });

    it("returns default years when no sites have creation years", () => {
      const sites: Site[] = [
        {
          id: "1",
          name: "Site 1",
          type: "mosque",
          coordinates: [31.5, 34.5],
          status: "destroyed",
          lastUpdated: "2024-01-01",
          description: "Test",
          historicalSignificance: "Test",
          culturalValue: "Test",
          verifiedBy: [],
          sources: [],
        },
      ];

      const { result } = renderHook(() => useDefaultFilterRanges(sites));

      expect(result.current.yearRange.defaultStartYear).toBe("");
      expect(result.current.yearRange.defaultEndYear).toBe(
        new Date().getFullYear().toString()
      );
      expect(result.current.yearRange.defaultStartEra).toBe("CE");
    });
  });

  describe("Memoization", () => {
    it("returns stable references when sites don't change", () => {
      const sites: Site[] = [
        {
          id: "1",
          name: "Site 1",
          type: "mosque",
          yearBuilt: "1500",
          coordinates: [31.5, 34.5],
          status: "destroyed",
          dateDestroyed: "2023-10-15",
          lastUpdated: "2024-01-01",
          description: "Test",
          historicalSignificance: "Test",
          culturalValue: "Test",
          verifiedBy: [],
          sources: [],
        },
      ];

      const { result, rerender } = renderHook(() =>
        useDefaultFilterRanges(sites)
      );

      const firstDateRange = result.current.dateRange;
      const firstYearRange = result.current.yearRange;

      rerender();

      expect(result.current.dateRange).toBe(firstDateRange);
      expect(result.current.yearRange).toBe(firstYearRange);
    });
  });
});
