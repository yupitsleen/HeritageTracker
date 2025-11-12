import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDefaultYearRange } from "./useDefaultYearRange";
import type { Site } from "../types";

describe("useDefaultYearRange", () => {
  const mockSites: Site[] = [
    {
      id: "1",
      name: "Ancient Site",
      type: "mosque",
      yearBuilt: "800 BCE",
      coordinates: [31.5, 34.5],
      status: "destroyed",
      dateDestroyed: "2023-10-15",
      description: "Test",
      historicalSignificance: "High",
      culturalValue: "High",
      sources: [],
      verifiedBy: [],
    },
    {
      id: "2",
      name: "Modern Site",
      type: "museum",
      yearBuilt: "1950",
      coordinates: [31.6, 34.6],
      status: "destroyed",
      dateDestroyed: "2023-12-20",
      description: "Test",
      historicalSignificance: "Medium",
      culturalValue: "Medium",
      sources: [],
      verifiedBy: [],
    },
  ];

  it("returns year range with BCE era for ancient sites", () => {
    const { result } = renderHook(() => useDefaultYearRange(mockSites));

    expect(result.current.defaultStartYear).toBe("800");
    expect(result.current.defaultEndYear).toBe("1950");
    expect(result.current.defaultStartEra).toBe("BCE");
  });

  it("returns fallback values when no sites have yearBuilt", () => {
    const sitesWithoutYears: Site[] = [
      {
        ...mockSites[0],
        yearBuilt: undefined,
      },
    ];

    const { result } = renderHook(() => useDefaultYearRange(sitesWithoutYears));
    const currentYear = new Date().getFullYear();

    expect(result.current.defaultStartYear).toBe("");
    expect(result.current.defaultEndYear).toBe(currentYear.toString());
    expect(result.current.defaultStartEra).toBe("CE");
  });

  it("returns fallback values for empty array", () => {
    const { result } = renderHook(() => useDefaultYearRange([]));
    const currentYear = new Date().getFullYear();

    expect(result.current.defaultStartYear).toBe("");
    expect(result.current.defaultEndYear).toBe(currentYear.toString());
    expect(result.current.defaultStartEra).toBe("CE");
  });

  it("handles CE-only sites correctly", () => {
    const ceSites: Site[] = [
      {
        ...mockSites[0],
        yearBuilt: "1200",
      },
      {
        ...mockSites[1],
        yearBuilt: "1950",
      },
    ];

    const { result } = renderHook(() => useDefaultYearRange(ceSites));

    expect(result.current.defaultStartYear).toBe("1200");
    expect(result.current.defaultEndYear).toBe("1950");
    expect(result.current.defaultStartEra).toBe("CE");
  });

  it("formats negative years as absolute values (for BCE display)", () => {
    const bceSites: Site[] = [
      {
        ...mockSites[0],
        yearBuilt: "500 BCE",
      },
    ];

    const { result } = renderHook(() => useDefaultYearRange(bceSites));

    // parseYearBuilt converts "500 BCE" to -500, which should be formatted as "500"
    expect(result.current.defaultStartYear).toBe("500");
    expect(result.current.defaultEndYear).toBe("500");
    expect(result.current.defaultStartEra).toBe("BCE");
  });
});
