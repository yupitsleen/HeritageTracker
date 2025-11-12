import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import {
  useMapGlow,
  getGlowIntensity,
  getGlowRadius,
  interpolateColor,
} from "../hooks/useMapGlow";
import type { Site } from "../types";

// Test data helpers
const createBaseSite = (overrides?: Partial<Site>): Site => ({
  id: "test-site",
  name: "Test Site",
  type: "mosque",
  yearBuilt: "1950",
  coordinates: [31.5, 34.5],
  status: "destroyed",
  description: "Test",
  historicalSignificance: "Test",
  culturalValue: "Test",
  verifiedBy: ["UNESCO"],
  sources: [],
  ...overrides,
});

describe("useMapGlow", () => {
  it("calculates glow contributions for all sites", () => {
    const sites = [
      createBaseSite({ id: "1", yearBuilt: "2000" }),
      createBaseSite({ id: "2", yearBuilt: "1000" }),
    ];
    const currentDate = new Date("2023-12-01");

    const { result } = renderHook(() => useMapGlow(sites, currentDate));

    expect(result.current.glowContributions).toHaveLength(2);
    expect(result.current.glowContributions[0].siteId).toBe("1");
    expect(result.current.glowContributions[1].siteId).toBe("2");
  });

  it("reduces glow for destroyed sites", () => {
    const sites = [
      createBaseSite({
        id: "1",
        yearBuilt: "2000",
        status: "destroyed",
        dateDestroyed: "2023-10-15",
      }),
    ];
    const currentDate = new Date("2023-12-01");

    const { result } = renderHook(() => useMapGlow(sites, currentDate));

    const contribution = result.current.glowContributions[0];
    expect(contribution.baseGlow).toBe(100);
    expect(contribution.currentGlow).toBe(0); // 100% reduction for destroyed
  });

  it("does not reduce glow for sites not yet destroyed", () => {
    const sites = [
      createBaseSite({
        id: "1",
        yearBuilt: "2000",
        status: "destroyed",
        dateDestroyed: "2024-01-01",
      }),
    ];
    const currentDate = new Date("2023-12-01");

    const { result } = renderHook(() => useMapGlow(sites, currentDate));

    const contribution = result.current.glowContributions[0];
    expect(contribution.currentGlow).toBe(100); // Not yet destroyed
  });

  it("applies 50% reduction for heavily-damaged sites", () => {
    const sites = [
      createBaseSite({
        id: "1",
        yearBuilt: "2000",
        status: "heavily-damaged",
        dateDestroyed: "2023-10-15",
      }),
    ];
    const currentDate = new Date("2023-12-01");

    const { result } = renderHook(() => useMapGlow(sites, currentDate));

    const contribution = result.current.glowContributions[0];
    expect(contribution.currentGlow).toBe(50); // 50% of 100
  });

  it("applies 25% reduction for damaged sites", () => {
    const sites = [
      createBaseSite({
        id: "1",
        yearBuilt: "2000",
        status: "damaged",
        dateDestroyed: "2023-10-15",
      }),
    ];
    const currentDate = new Date("2023-12-01");

    const { result } = renderHook(() => useMapGlow(sites, currentDate));

    const contribution = result.current.glowContributions[0];
    expect(contribution.currentGlow).toBe(75); // 75% of 100
  });

  it("calculates total heritage value correctly", () => {
    const sites = [
      createBaseSite({ id: "1", yearBuilt: "2000" }), // 100
      createBaseSite({ id: "2", yearBuilt: "1000" }), // 200
    ];
    const currentDate = new Date("2023-12-01");

    const { result } = renderHook(() => useMapGlow(sites, currentDate));

    expect(result.current.totalHeritageValue).toBe(300);
  });

  it("calculates current metrics correctly", () => {
    const sites = [
      createBaseSite({
        id: "1",
        yearBuilt: "2000",
        dateDestroyed: "2023-10-15",
      }), // 100 destroyed
      createBaseSite({
        id: "2",
        yearBuilt: "2000",
        dateDestroyed: "2024-01-01",
      }), // 100 not destroyed yet
    ];
    const currentDate = new Date("2023-12-01");

    const { result } = renderHook(() => useMapGlow(sites, currentDate));

    expect(result.current.currentMetrics.destroyedValue).toBe(100);
    expect(result.current.currentMetrics.destroyedCount).toBe(1);
    expect(result.current.currentMetrics.integrityPercent).toBe(50);
    expect(result.current.currentMetrics.remainingValue).toBe(100);
  });

  it("recalculates when currentDate changes", () => {
    const sites = [
      createBaseSite({
        id: "1",
        yearBuilt: "2000",
        dateDestroyed: "2023-11-01",
      }),
    ];

    const { result, rerender } = renderHook(
      ({ date }) => useMapGlow(sites, date),
      {
        initialProps: { date: new Date("2023-10-15") },
      }
    );

    // Before destruction
    expect(result.current.currentMetrics.destroyedCount).toBe(0);

    // After destruction
    rerender({ date: new Date("2023-12-01") });
    expect(result.current.currentMetrics.destroyedCount).toBe(1);
  });

  it("handles empty sites array", () => {
    const { result } = renderHook(() => useMapGlow([], new Date()));

    expect(result.current.glowContributions).toHaveLength(0);
    expect(result.current.totalHeritageValue).toBe(0);
    expect(result.current.currentMetrics.destroyedCount).toBe(0);
    expect(result.current.currentMetrics.integrityPercent).toBe(100);
  });

  it("includes all required properties in glow contributions", () => {
    const sites = [
      createBaseSite({
        id: "1",
        name: "Test Site",
        yearBuilt: "2000",
        coordinates: [31.5, 34.5],
        status: "destroyed",
        dateDestroyed: "2023-10-15",
      }),
    ];
    const currentDate = new Date("2023-12-01");

    const { result } = renderHook(() => useMapGlow(sites, currentDate));

    const contribution = result.current.glowContributions[0];
    expect(contribution).toHaveProperty("siteId");
    expect(contribution).toHaveProperty("siteName");
    expect(contribution).toHaveProperty("baseGlow");
    expect(contribution).toHaveProperty("currentGlow");
    expect(contribution).toHaveProperty("coordinates");
    expect(contribution).toHaveProperty("status");
    expect(contribution).toHaveProperty("dateDestroyed");
  });
});

describe("getGlowIntensity", () => {
  it("returns 0 when maxGlow is 0", () => {
    expect(getGlowIntensity(100, 0)).toBe(0);
  });

  it("returns normalized value between 0 and 1", () => {
    expect(getGlowIntensity(50, 100)).toBe(0.5);
    expect(getGlowIntensity(25, 100)).toBe(0.25);
    expect(getGlowIntensity(100, 100)).toBe(1);
  });

  it("caps value at 1 even if currentGlow exceeds maxGlow", () => {
    expect(getGlowIntensity(150, 100)).toBe(1);
  });

  it("handles very small values correctly", () => {
    expect(getGlowIntensity(1, 1000)).toBe(0.001);
  });
});

describe("getGlowRadius", () => {
  it("returns minimum radius for small glow values", () => {
    const radius = getGlowRadius(0);
    expect(radius).toBeGreaterThan(0);
  });

  it("increases radius logarithmically with glow value", () => {
    const radius1 = getGlowRadius(100);
    const radius2 = getGlowRadius(1000);
    const radius3 = getGlowRadius(10000);

    expect(radius2).toBeGreaterThan(radius1);
    expect(radius3).toBeGreaterThan(radius2);
  });

  it("caps radius at 150 pixels", () => {
    const radius = getGlowRadius(1000000);
    expect(radius).toBeLessThanOrEqual(150);
  });

  it("returns consistent values for same input", () => {
    expect(getGlowRadius(500)).toBe(getGlowRadius(500));
  });
});

describe("interpolateColor", () => {
  it("returns start color when progress is 0", () => {
    const result = interpolateColor("#FFD700", "#6B7280", 0);
    expect(result).toBe("#ffd700");
  });

  it("returns end color when progress is 1", () => {
    const result = interpolateColor("#FFD700", "#6B7280", 1);
    expect(result).toBe("#6b7280");
  });

  it("interpolates colors correctly at 50%", () => {
    const result = interpolateColor("#000000", "#ffffff", 0.5);
    // Midpoint between black and white should be grey
    expect(result).toMatch(/^#[0-9a-f]{6}$/);
  });

  it("handles lowercase and uppercase hex codes", () => {
    const result1 = interpolateColor("#ffd700", "#6b7280", 0.5);
    const result2 = interpolateColor("#FFD700", "#6B7280", 0.5);
    expect(result1).toBe(result2);
  });

  it("produces valid hex color codes", () => {
    const result = interpolateColor("#FFD700", "#6B7280", 0.3);
    expect(result).toMatch(/^#[0-9a-f]{6}$/);
  });

  it("pads single-digit hex values with zeros", () => {
    const result = interpolateColor("#000001", "#000002", 0);
    expect(result).toBe("#000001");
  });
});
