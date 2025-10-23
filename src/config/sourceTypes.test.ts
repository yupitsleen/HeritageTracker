/**
 * Tests for Source Type Registry
 *
 * Comprehensive test coverage for:
 * - Built-in source types
 * - Registry CRUD operations
 * - Credibility scoring
 * - Localization
 * - Graceful degradation
 * - Extensibility
 */

import { describe, it, expect } from "vitest";
import type { SourceTypeConfig } from "../types/sourceTypes";
import {
  registerSourceType,
  getSourceTypes,
  getSourceTypeConfig,
  getSourceTypeLabel,
  isSourceTypeRegistered,
  getSourceCredibility,
  calculateSourceCredibility,
} from "./sourceTypes";

describe("Source Type Registry", () => {
  describe("Default Source Types", () => {
    it("should have 7 default source types registered", () => {
      const types = getSourceTypes();
      expect(types).toHaveLength(7);
    });

    it("should include official source type", () => {
      const config = getSourceTypeConfig("official");
      expect(config).toBeDefined();
      expect(config.label).toBe("Official Report");
      expect(config.credibilityWeight).toBe(100);
      expect(config.requiresURL).toBe(true);
      expect(config.requiresDate).toBe(true);
    });

    it("should include academic source type", () => {
      const config = getSourceTypeConfig("academic");
      expect(config).toBeDefined();
      expect(config.label).toBe("Academic Research");
      expect(config.credibilityWeight).toBe(95);
    });

    it("should include forensic source type", () => {
      const config = getSourceTypeConfig("forensic");
      expect(config).toBeDefined();
      expect(config.label).toBe("Forensic Analysis");
      expect(config.credibilityWeight).toBe(95);
    });

    it("should include journalism source type", () => {
      const config = getSourceTypeConfig("journalism");
      expect(config).toBeDefined();
      expect(config.label).toBe("Journalism");
      expect(config.credibilityWeight).toBe(80);
    });

    it("should include eyewitness source type", () => {
      const config = getSourceTypeConfig("eyewitness");
      expect(config).toBeDefined();
      expect(config.label).toBe("Eyewitness Account");
      expect(config.credibilityWeight).toBe(70);
    });

    it("should include satellite-analysis source type", () => {
      const config = getSourceTypeConfig("satellite-analysis");
      expect(config).toBeDefined();
      expect(config.label).toBe("Satellite Analysis");
      expect(config.credibilityWeight).toBe(90);
    });

    it("should include documentation source type", () => {
      const config = getSourceTypeConfig("documentation");
      expect(config).toBeDefined();
      expect(config.label).toBe("Documentation");
      expect(config.credibilityWeight).toBe(75);
    });
  });

  describe("Registry Functions", () => {
    it("should check if source type is registered", () => {
      expect(isSourceTypeRegistered("official")).toBe(true);
      expect(isSourceTypeRegistered("academic")).toBe(true);
      expect(isSourceTypeRegistered("forensic")).toBe(true);
      expect(isSourceTypeRegistered("nonexistent")).toBe(false);
    });

    it("should get all source types sorted by credibility", () => {
      const types = getSourceTypes();
      expect(types).toHaveLength(7);

      // Should be sorted by credibility weight (descending)
      expect(types[0].credibilityWeight).toBeGreaterThanOrEqual(types[1].credibilityWeight);
      expect(types[1].credibilityWeight).toBeGreaterThanOrEqual(types[2].credibilityWeight);
    });

    it("should return default config for non-existent type", () => {
      const config = getSourceTypeConfig("nonexistent");
      expect(config).toBeDefined();
      expect(config.id).toBe("nonexistent");
      expect(config.label).toBe("nonexistent");
      expect(config.credibilityWeight).toBe(50);
    });
  });

  describe("Credibility Scoring", () => {
    it("should get credibility weight for source type", () => {
      expect(getSourceCredibility("official")).toBe(100);
      expect(getSourceCredibility("academic")).toBe(95);
      expect(getSourceCredibility("forensic")).toBe(95);
      expect(getSourceCredibility("journalism")).toBe(80);
      expect(getSourceCredibility("eyewitness")).toBe(70);
    });

    it("should calculate aggregate credibility for single source", () => {
      expect(calculateSourceCredibility(["official"])).toBe(100);
      expect(calculateSourceCredibility(["academic"])).toBe(95);
    });

    it("should calculate aggregate credibility for multiple sources", () => {
      // Official (100) + Academic (95) = 195 / 2 = 97.5 → 98
      expect(calculateSourceCredibility(["official", "academic"])).toBe(98);

      // Official (100) + Journalism (80) = 180 / 2 = 90
      expect(calculateSourceCredibility(["official", "journalism"])).toBe(90);
    });

    it("should calculate aggregate credibility for three sources", () => {
      // Official (100) + Academic (95) + Forensic (95) = 290 / 3 = 96.67 → 97
      expect(calculateSourceCredibility(["official", "academic", "forensic"])).toBe(97);
    });

    it("should return 0 for empty source array", () => {
      expect(calculateSourceCredibility([])).toBe(0);
    });

    it("should handle unknown source types with default weight", () => {
      // Unknown source types get default weight of 50
      expect(getSourceCredibility("unknown")).toBe(50);
      expect(calculateSourceCredibility(["unknown"])).toBe(50);
    });
  });

  describe("Localization", () => {
    it("should return English labels by default", () => {
      expect(getSourceTypeLabel("official")).toBe("Official Report");
      expect(getSourceTypeLabel("academic")).toBe("Academic Research");
    });

    it("should return Arabic labels when requested", () => {
      expect(getSourceTypeLabel("official", "ar")).toBe("تقرير رسمي");
      expect(getSourceTypeLabel("academic", "ar")).toBe("بحث أكاديمي");
    });

    it("should fall back to English if Arabic not available", () => {
      const customType: SourceTypeConfig = {
        id: "custom",
        label: "Custom Type",
        credibilityWeight: 85,
      };
      registerSourceType(customType);

      expect(getSourceTypeLabel("custom", "ar")).toBe("Custom Type");
    });

    it("should handle unknown types gracefully", () => {
      expect(getSourceTypeLabel("nonexistent")).toBe("nonexistent");
      expect(getSourceTypeLabel("nonexistent", "ar")).toBe("nonexistent");
    });
  });

  describe("Requirements Validation", () => {
    it("should define URL requirements", () => {
      expect(getSourceTypeConfig("official").requiresURL).toBe(true);
      expect(getSourceTypeConfig("academic").requiresURL).toBe(true);
      expect(getSourceTypeConfig("journalism").requiresURL).toBe(false);
      expect(getSourceTypeConfig("eyewitness").requiresURL).toBe(false);
    });

    it("should define date requirements", () => {
      expect(getSourceTypeConfig("official").requiresDate).toBe(true);
      expect(getSourceTypeConfig("academic").requiresDate).toBe(true);
      expect(getSourceTypeConfig("forensic").requiresDate).toBe(false);
      expect(getSourceTypeConfig("journalism").requiresDate).toBe(false);
    });
  });

  describe("Badge Colors", () => {
    it("should have badge colors defined", () => {
      const types = getSourceTypes();
      types.forEach((type) => {
        if (type.badgeColor) {
          expect(type.badgeColor).toMatch(/^#[0-9a-f]{6}$/i);
        }
      });
    });

    it("should have distinct colors for major types", () => {
      const official = getSourceTypeConfig("official");
      const academic = getSourceTypeConfig("academic");
      const forensic = getSourceTypeConfig("forensic");

      expect(official.badgeColor).not.toBe(academic.badgeColor);
      expect(academic.badgeColor).not.toBe(forensic.badgeColor);
    });
  });

  describe("Registry Extension", () => {
    it("should allow registering custom source type", () => {
      const customType: SourceTypeConfig = {
        id: "legal-filing",
        label: "Legal Filing",
        labelArabic: "ملف قانوني",
        credibilityWeight: 100,
        requiresURL: true,
        requiresDate: true,
        description: "International court filings",
      };

      registerSourceType(customType);

      expect(isSourceTypeRegistered("legal-filing")).toBe(true);
      const config = getSourceTypeConfig("legal-filing");
      expect(config.label).toBe("Legal Filing");
      expect(config.credibilityWeight).toBe(100);
    });

    it("should include custom type in sorted list", () => {
      const customType: SourceTypeConfig = {
        id: "high-credibility",
        label: "High Credibility",
        credibilityWeight: 99,
      };

      registerSourceType(customType);

      const types = getSourceTypes();
      const customInList = types.find((t) => t.id === "high-credibility");
      expect(customInList).toBeDefined();
      expect(customInList?.credibilityWeight).toBe(99);
    });

    it("should allow overriding existing types", () => {
      const updatedOfficial: SourceTypeConfig = {
        id: "official",
        label: "Updated Official",
        credibilityWeight: 100,
      };

      registerSourceType(updatedOfficial);

      const config = getSourceTypeConfig("official");
      expect(config.label).toBe("Updated Official");
    });
  });

  describe("Backward Compatibility", () => {
    it("should handle all legacy source types", () => {
      const legacyTypes = ["official", "academic", "journalism", "documentation"];

      legacyTypes.forEach((type) => {
        expect(isSourceTypeRegistered(type)).toBe(true);
        const config = getSourceTypeConfig(type);
        expect(config.id).toBe(type);
        expect(config.credibilityWeight).toBeGreaterThan(0);
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty string type ID", () => {
      const config = getSourceTypeConfig("");
      expect(config.id).toBe("");
      expect(config.label).toBe("");
    });

    it("should handle special characters in type ID", () => {
      const config = getSourceTypeConfig("type-with-special_chars.123");
      expect(config).toBeDefined();
    });

    it("should calculate credibility with mixed valid and unknown types", () => {
      // Official (100) + Unknown (50) = 150 / 2 = 75
      const score = calculateSourceCredibility(["official", "unknown-type"]);
      expect(score).toBe(75);
    });
  });
});
