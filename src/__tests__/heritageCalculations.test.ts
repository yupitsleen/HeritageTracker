import { describe, it, expect } from "vitest";
import {
  calculateGlowContribution,
  getAgeColorCode,
  calculateTotalHeritageValue,
  calculateDestroyedValue,
  calculateHeritageIntegrity,
  calculateSignificanceScore,
  getGlowReductionPercentage,
} from "../utils/heritageCalculations";
import type { GazaSite } from "../types";

// Test data helpers
const createBaseSite = (overrides?: Partial<GazaSite>): GazaSite => ({
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

describe("heritageCalculations", () => {
  // Glow Contribution Tests
  describe("calculateGlowContribution", () => {
    it("returns base value (100) for modern site with no special properties", () => {
      const site = createBaseSite({ yearBuilt: "2000" });
      expect(calculateGlowContribution(site)).toBe(100);
    });

    it("applies 3x multiplier for ancient sites (>2000 years)", () => {
      const site = createBaseSite({ yearBuilt: "1 BCE" }); // ~2024 years old
      expect(calculateGlowContribution(site)).toBe(300);
    });

    it("applies 2x multiplier for medieval sites (>1000 years)", () => {
      const site = createBaseSite({ yearBuilt: "900" }); // ~1124 years old
      expect(calculateGlowContribution(site)).toBe(200);
    });

    it("applies 1.5x multiplier for historic sites (>200 years)", () => {
      const site = createBaseSite({ yearBuilt: "1800" }); // ~224 years old
      expect(calculateGlowContribution(site)).toBe(150);
    });

    it("applies UNESCO multiplier (2x)", () => {
      const site = createBaseSite({
        yearBuilt: "2000",
        unescoListed: true,
      });
      expect(calculateGlowContribution(site)).toBe(200);
    });

    it("applies artifact count multiplier (1.5x for >100 artifacts)", () => {
      const site = createBaseSite({
        yearBuilt: "2000",
        artifactCount: 150,
      });
      expect(calculateGlowContribution(site)).toBe(150);
    });

    it("does not apply artifact multiplier for <=100 artifacts", () => {
      const site = createBaseSite({
        yearBuilt: "2000",
        artifactCount: 50,
      });
      expect(calculateGlowContribution(site)).toBe(100);
    });

    it("applies unique site multiplier (2x)", () => {
      const site = createBaseSite({
        yearBuilt: "2000",
        isUnique: true,
      });
      expect(calculateGlowContribution(site)).toBe(200);
    });

    it("applies archaeological type multiplier (1.8x)", () => {
      const site = createBaseSite({
        yearBuilt: "2000",
        type: "archaeological",
      });
      expect(calculateGlowContribution(site)).toBe(180);
    });

    it("applies museum type multiplier (1.6x)", () => {
      const site = createBaseSite({
        yearBuilt: "2000",
        type: "museum",
      });
      expect(calculateGlowContribution(site)).toBe(160);
    });

    it("applies religious significance multiplier (1.3x)", () => {
      const site = createBaseSite({
        yearBuilt: "2000",
        religiousSignificance: true,
      });
      expect(calculateGlowContribution(site)).toBe(130);
    });

    it("applies community gathering place multiplier (1.2x)", () => {
      const site = createBaseSite({
        yearBuilt: "2000",
        communityGatheringPlace: true,
      });
      expect(calculateGlowContribution(site)).toBe(120);
    });

    it("applies historical events multiplier (+10% per event)", () => {
      const site = createBaseSite({
        yearBuilt: "2000",
        historicalEvents: ["Event 1", "Event 2", "Event 3"],
      });
      // 100 * (1 + 0.3) = 130
      expect(calculateGlowContribution(site)).toBe(130);
    });

    it("combines multiple multipliers correctly", () => {
      const site = createBaseSite({
        yearBuilt: "1 BCE", // Ancient (3x), exactly >2000 years
        unescoListed: true, // 2x
        isUnique: true, // 2x
        type: "archaeological", // 1.8x
      });
      // 100 * 3 * 2 * 2 * 1.8 = 2160
      expect(calculateGlowContribution(site)).toBe(2160);
    });

    it("handles BCE dates correctly", () => {
      const site = createBaseSite({ yearBuilt: "800 BCE" });
      // 2824 years old = ancient (3x)
      expect(calculateGlowContribution(site)).toBe(300);
    });

    it("handles century-based dates correctly", () => {
      const site = createBaseSite({ yearBuilt: "7th century" });
      // Midpoint: 650, ~1374 years old = medieval (2x)
      expect(calculateGlowContribution(site)).toBe(200);
    });

    it("handles null yearBuilt gracefully", () => {
      const site = createBaseSite({ yearBuilt: "Unknown" });
      // No age multiplier applied
      expect(calculateGlowContribution(site)).toBe(100);
    });

    it("rounds result to nearest integer", () => {
      const site = createBaseSite({
        yearBuilt: "2000",
        religiousSignificance: true, // 1.3x
        communityGatheringPlace: true, // 1.2x
      });
      // 100 * 1.3 * 1.2 = 156
      expect(calculateGlowContribution(site)).toBe(156);
    });
  });

  // Age Color Code Tests
  describe("getAgeColorCode", () => {
    it("returns gold for ancient sites (>2000 years)", () => {
      const site = createBaseSite({ yearBuilt: "1 BCE" });
      expect(getAgeColorCode(site)).toBe("#FFD700");
    });

    it("returns bronze for medieval sites (500-2000 years)", () => {
      const site = createBaseSite({ yearBuilt: "1000" });
      expect(getAgeColorCode(site)).toBe("#CD7F32");
    });

    it("returns silver for historic sites (200-500 years)", () => {
      const site = createBaseSite({ yearBuilt: "1800" });
      expect(getAgeColorCode(site)).toBe("#C0C0C0");
    });

    it("returns blue for modern sites (<200 years)", () => {
      const site = createBaseSite({ yearBuilt: "2000" });
      expect(getAgeColorCode(site)).toBe("#4A90E2");
    });

    it("returns blue for unknown age", () => {
      const site = createBaseSite({ yearBuilt: "Unknown" });
      expect(getAgeColorCode(site)).toBe("#4A90E2");
    });
  });

  // Total Heritage Value Tests
  describe("calculateTotalHeritageValue", () => {
    it("sums glow contributions from all sites", () => {
      const sites = [
        createBaseSite({ id: "1", yearBuilt: "2000" }), // 100
        createBaseSite({ id: "2", yearBuilt: "1000" }), // 200 (medieval)
        createBaseSite({ id: "3", yearBuilt: "1 BCE" }), // 300 (ancient)
      ];
      expect(calculateTotalHeritageValue(sites)).toBe(600);
    });

    it("returns 0 for empty array", () => {
      expect(calculateTotalHeritageValue([])).toBe(0);
    });

    it("handles single site", () => {
      const sites = [createBaseSite({ yearBuilt: "2000" })];
      expect(calculateTotalHeritageValue(sites)).toBe(100);
    });
  });

  // Destroyed Value Tests
  describe("calculateDestroyedValue", () => {
    it("calculates value of sites destroyed by current date", () => {
      const sites = [
        createBaseSite({
          id: "1",
          yearBuilt: "2000",
          dateDestroyed: "2023-10-15",
        }), // 100
        createBaseSite({
          id: "2",
          yearBuilt: "1000",
          dateDestroyed: "2023-11-01",
        }), // 200
        createBaseSite({
          id: "3",
          yearBuilt: "1 BCE",
          dateDestroyed: "2023-12-01",
        }), // 300 - not yet destroyed
      ];

      const currentDate = new Date("2023-11-15");
      const result = calculateDestroyedValue(sites, currentDate);

      expect(result.value).toBe(300); // 100 + 200
      expect(result.count).toBe(2);
    });

    it("returns zero for sites with no destruction dates", () => {
      const sites = [createBaseSite({ yearBuilt: "2000", dateDestroyed: undefined })];
      const result = calculateDestroyedValue(sites, new Date());

      expect(result.value).toBe(0);
      expect(result.count).toBe(0);
    });

    it("excludes sites destroyed after current date", () => {
      const sites = [
        createBaseSite({
          yearBuilt: "2000",
          dateDestroyed: "2024-01-01",
        }),
      ];

      const currentDate = new Date("2023-12-01");
      const result = calculateDestroyedValue(sites, currentDate);

      expect(result.value).toBe(0);
      expect(result.count).toBe(0);
    });
  });

  // Heritage Integrity Tests
  describe("calculateHeritageIntegrity", () => {
    it("returns 100% when no sites are destroyed", () => {
      const sites = [
        createBaseSite({ yearBuilt: "2000", dateDestroyed: "2024-01-01" }),
      ];
      const currentDate = new Date("2023-10-01");

      expect(calculateHeritageIntegrity(sites, currentDate)).toBe(100);
    });

    it("returns 0% when all sites are destroyed", () => {
      const sites = [
        createBaseSite({ yearBuilt: "2000", dateDestroyed: "2023-10-15" }),
        createBaseSite({ yearBuilt: "1000", dateDestroyed: "2023-11-01" }),
      ];
      const currentDate = new Date("2023-12-01");

      expect(calculateHeritageIntegrity(sites, currentDate)).toBe(0);
    });

    it("calculates correct percentage for partial destruction", () => {
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
        }), // 100 not yet destroyed
      ];
      const currentDate = new Date("2023-11-01");

      // Total: 200, Destroyed: 100, Remaining: 100 = 50%
      expect(calculateHeritageIntegrity(sites, currentDate)).toBe(50);
    });

    it("returns 100% for empty sites array", () => {
      expect(calculateHeritageIntegrity([], new Date())).toBe(100);
    });
  });

  // Significance Score Tests
  describe("calculateSignificanceScore", () => {
    it("returns base score of 1 for basic site", () => {
      const site = createBaseSite({ yearBuilt: "2000" });
      expect(calculateSignificanceScore(site)).toBeGreaterThanOrEqual(1);
    });

    it("adds age bonus (+1 per millennium)", () => {
      const site = createBaseSite({ yearBuilt: "1000" }); // ~1024 years
      const score = calculateSignificanceScore(site);
      expect(score).toBeGreaterThan(2); // 1 + ~1.024
    });

    it("adds UNESCO bonus (+2)", () => {
      const site = createBaseSite({ yearBuilt: "2000", unescoListed: true });
      const score = calculateSignificanceScore(site);
      expect(score).toBeGreaterThan(3); // 1 + ~0.024 (age) + 2
      expect(score).toBeLessThan(3.1);
    });

    it("adds artifact bonus (count/100)", () => {
      const site = createBaseSite({ yearBuilt: "2000", artifactCount: 200 });
      const score = calculateSignificanceScore(site);
      expect(score).toBeGreaterThan(3); // 1 + ~0.024 (age) + 2
      expect(score).toBeLessThan(3.1);
    });

    it("adds uniqueness bonus (+3)", () => {
      const site = createBaseSite({ yearBuilt: "2000", isUnique: true });
      const score = calculateSignificanceScore(site);
      expect(score).toBeGreaterThan(4); // 1 + ~0.024 (age) + 3
      expect(score).toBeLessThan(4.1);
    });

    it("combines all bonuses correctly", () => {
      const site = createBaseSite({
        yearBuilt: "2000",
        unescoListed: true, // +2
        isUnique: true, // +3
        religiousSignificance: true, // +1
        communityGatheringPlace: true, // +1
        historicalEvents: ["Event 1", "Event 2"], // +1 (2 * 0.5)
      });
      const score = calculateSignificanceScore(site);
      expect(score).toBeGreaterThan(9); // 1 + ~0.024 (age) + 2 + 3 + 1 + 1 + 1
      expect(score).toBeLessThan(9.1);
    });
  });

  // Glow Reduction Tests
  describe("getGlowReductionPercentage", () => {
    it("returns 100% for destroyed status", () => {
      expect(getGlowReductionPercentage("destroyed")).toBe(100);
    });

    it("returns 50% for heavily-damaged status", () => {
      expect(getGlowReductionPercentage("heavily-damaged")).toBe(50);
    });

    it("returns 25% for damaged status", () => {
      expect(getGlowReductionPercentage("damaged")).toBe(25);
    });
  });
});
