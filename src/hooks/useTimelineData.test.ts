import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useTimelineData } from "./useTimelineData";
import type { Site } from "../types";

describe("useTimelineData", () => {
  const mockSiteWithDestructionDate: Site = {
    id: "1",
    name: "Site with destruction date",
    nameArabic: "",
    type: "mosque",
    yearBuilt: "1200",
    coordinates: [31.5, 34.5],
    status: "destroyed",
    dateDestroyed: "2023-10-15",
    sourceAssessmentDate: "2023-11-01",
    lastUpdated: "2024-01-01",
    description: "Test site",
    historicalSignificance: "Test significance",
    culturalValue: "Test value",
    verifiedBy: ["UNESCO"],
    sources: [],
  };

  const mockSiteWithOnlySurveyDate: Site = {
    id: "2",
    name: "Site with only survey date",
    nameArabic: "",
    type: "church",
    yearBuilt: "1300",
    coordinates: [31.6, 34.6],
    status: "damaged",
    dateDestroyed: undefined,
    sourceAssessmentDate: "2023-12-01",
    lastUpdated: "2024-01-01",
    description: "Test site 2",
    historicalSignificance: "Test significance 2",
    culturalValue: "Test value 2",
    verifiedBy: ["UNESCO"],
    sources: [],
  };

  const mockSiteWithNoDates: Site = {
    id: "3",
    name: "Site with no dates",
    nameArabic: "",
    type: "archaeological_site",
    yearBuilt: "BCE 500",
    coordinates: [31.7, 34.7],
    status: "threatened",
    dateDestroyed: undefined,
    sourceAssessmentDate: undefined,
    lastUpdated: "2024-01-01",
    description: "Test site 3",
    historicalSignificance: "Test significance 3",
    culturalValue: "Test value 3",
    verifiedBy: ["UNESCO"],
    sources: [],
  };

  describe("when showUnknownDestructionDates is true (default)", () => {
    it("includes sites with destruction dates", () => {
      const { result } = renderHook(() =>
        useTimelineData([mockSiteWithDestructionDate], true)
      );

      expect(result.current.events).toHaveLength(1);
      expect(result.current.events[0].siteId).toBe("1");
      expect(result.current.totalEvents).toBe(1);
    });

    it("includes sites with only survey dates", () => {
      const { result } = renderHook(() =>
        useTimelineData([mockSiteWithOnlySurveyDate], true)
      );

      expect(result.current.events).toHaveLength(1);
      expect(result.current.events[0].siteId).toBe("2");
      expect(result.current.totalEvents).toBe(1);
    });

    it("excludes sites with no dates", () => {
      const { result } = renderHook(() =>
        useTimelineData([mockSiteWithNoDates], true)
      );

      expect(result.current.events).toHaveLength(0);
      expect(result.current.totalEvents).toBe(0);
    });

    it("includes both types of sites", () => {
      const { result } = renderHook(() =>
        useTimelineData(
          [mockSiteWithDestructionDate, mockSiteWithOnlySurveyDate, mockSiteWithNoDates],
          true
        )
      );

      expect(result.current.events).toHaveLength(2);
      expect(result.current.totalEvents).toBe(2);
    });
  });

  describe("when showUnknownDestructionDates is false", () => {
    it("includes sites with destruction dates", () => {
      const { result } = renderHook(() =>
        useTimelineData([mockSiteWithDestructionDate], false)
      );

      expect(result.current.events).toHaveLength(1);
      expect(result.current.events[0].siteId).toBe("1");
      expect(result.current.totalEvents).toBe(1);
    });

    it("excludes sites with only survey dates", () => {
      const { result } = renderHook(() =>
        useTimelineData([mockSiteWithOnlySurveyDate], false)
      );

      expect(result.current.events).toHaveLength(0);
      expect(result.current.totalEvents).toBe(0);
    });

    it("excludes sites with no dates", () => {
      const { result } = renderHook(() =>
        useTimelineData([mockSiteWithNoDates], false)
      );

      expect(result.current.events).toHaveLength(0);
      expect(result.current.totalEvents).toBe(0);
    });

    it("only includes sites with exact destruction dates", () => {
      const { result } = renderHook(() =>
        useTimelineData(
          [mockSiteWithDestructionDate, mockSiteWithOnlySurveyDate, mockSiteWithNoDates],
          false
        )
      );

      expect(result.current.events).toHaveLength(1);
      expect(result.current.events[0].siteId).toBe("1");
      expect(result.current.totalEvents).toBe(1);
    });
  });

  describe("event sorting", () => {
    it("sorts events chronologically", () => {
      const site1: Site = {
        ...mockSiteWithDestructionDate,
        id: "site1",
        dateDestroyed: "2023-12-01",
      };
      const site2: Site = {
        ...mockSiteWithDestructionDate,
        id: "site2",
        dateDestroyed: "2023-10-01",
      };
      const site3: Site = {
        ...mockSiteWithDestructionDate,
        id: "site3",
        dateDestroyed: "2023-11-01",
      };

      const { result } = renderHook(() => useTimelineData([site1, site2, site3], true));

      expect(result.current.events).toHaveLength(3);
      expect(result.current.events[0].siteId).toBe("site2"); // Oct
      expect(result.current.events[1].siteId).toBe("site3"); // Nov
      expect(result.current.events[2].siteId).toBe("site1"); // Dec
    });
  });
});
