import { describe, it, expect } from "vitest";
import {
  getSourceTypes,
  getSourceTypeConfig,
  getSourceTypeLabel,
  getSourceCredibility,
  calculateSourceCredibility,
} from "./sourceTypes";

describe("Source Type Registry", () => {
  describe("getSourceTypes", () => {
    it("returns source types sorted by credibility", () => {
      const types = getSourceTypes();
      expect(types).toHaveLength(7);

      for (let i = 1; i < types.length; i++) {
        expect(types[i - 1].credibilityWeight).toBeGreaterThanOrEqual(types[i].credibilityWeight);
      }
    });
  });

  describe("getSourceTypeConfig", () => {
    it("returns default config for non-existent type", () => {
      const config = getSourceTypeConfig("nonexistent");
      expect(config.id).toBe("nonexistent");
      expect(config.credibilityWeight).toBe(50);
    });
  });

  describe("Credibility Scoring", () => {
    it("calculates aggregate credibility for multiple sources", () => {
      // Official (100) + Academic (95) = 195 / 2 = 97.5 → 98
      expect(calculateSourceCredibility(["official", "academic"])).toBe(98);
    });

    it("returns 0 for empty source array", () => {
      expect(calculateSourceCredibility([])).toBe(0);
    });

    it("handles unknown source types with default weight", () => {
      expect(getSourceCredibility("unknown")).toBe(50);
    });
  });

  describe("Localization", () => {
    it("returns English labels by default", () => {
      expect(getSourceTypeLabel("official")).toBe("Official Report");
    });

    it("returns Arabic labels when requested", () => {
      expect(getSourceTypeLabel("official", "ar")).toBe("تقرير رسمي");
    });
  });
});
