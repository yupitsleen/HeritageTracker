import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDefaultDateRange } from "./useDefaultDateRange";
import type { GazaSite } from "../types";

describe("useDefaultDateRange", () => {
  const mockSites: GazaSite[] = [
    {
      id: "1",
      name: "Test Site 1",
      type: "mosque",
      yearBuilt: "1900",
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
      name: "Test Site 2",
      type: "church",
      yearBuilt: "1850",
      coordinates: [31.6, 34.6],
      status: "destroyed",
      dateDestroyed: "2023-12-20",
      description: "Test",
      historicalSignificance: "High",
      culturalValue: "High",
      sources: [],
      verifiedBy: [],
    },
  ];

  it("returns date range from sites' destruction dates", () => {
    const { result } = renderHook(() => useDefaultDateRange(mockSites));

    expect(result.current.defaultStartDate).toEqual(new Date("2023-10-15"));
    expect(result.current.defaultEndDate).toEqual(new Date("2023-12-20"));
  });

  it("returns fallback dates when no sites have destruction dates", () => {
    const sitesWithoutDates: GazaSite[] = [
      {
        ...mockSites[0],
        dateDestroyed: undefined,
      },
    ];

    const { result } = renderHook(() => useDefaultDateRange(sitesWithoutDates));

    expect(result.current.defaultStartDate).toEqual(new Date("2023-10-07"));
    expect(result.current.defaultEndDate).toBeInstanceOf(Date);
  });

  it("returns fallback dates for empty array", () => {
    const { result } = renderHook(() => useDefaultDateRange([]));

    expect(result.current.defaultStartDate).toEqual(new Date("2023-10-07"));
    expect(result.current.defaultEndDate).toBeInstanceOf(Date);
  });

  it("handles single site correctly", () => {
    const singleSite: GazaSite[] = [mockSites[0]];
    const { result } = renderHook(() => useDefaultDateRange(singleSite));

    expect(result.current.defaultStartDate).toEqual(new Date("2023-10-15"));
    expect(result.current.defaultEndDate).toEqual(new Date("2023-10-15"));
  });
});
