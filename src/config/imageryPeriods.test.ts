/**
 * Imagery Period Registry Tests
 *
 * Comprehensive test suite for imagery period registry and helper functions.
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  IMAGERY_PERIOD_REGISTRY,
  registerImageryPeriod,
  getAllImageryPeriods,
  getImageryPeriod,
  getEnabledImageryPeriods,
  getDefaultImageryPeriod,
  getImageryPeriodsByCategory,
  getImageryPeriodsByDateRange,
  isValidImageryPeriod,
  getImageryPeriodLabel,
  updateImageryPeriod,
  removeImageryPeriod,
  getImageryPeriodIds,
  getEarliestImageryPeriod,
  getLatestImageryPeriod,
} from "./imageryPeriods";
import type {
  ExtendedImageryPeriodConfig,
  ImageryPeriodCategory,
  ImageryPeriodId,
} from "../types/imageryPeriodTypes";

describe("Imagery Period Registry", () => {
  // ============================================================================
  // Registry Validation Tests
  // ============================================================================

  describe("Registry Validation", () => {
    it("should contain baseline-2014 period", () => {
      expect(IMAGERY_PERIOD_REGISTRY["baseline-2014"]).toBeDefined();
      expect(IMAGERY_PERIOD_REGISTRY["baseline-2014"].label).toBe(
        "2014 Baseline"
      );
    });

    it("should contain early-2024 period", () => {
      expect(IMAGERY_PERIOD_REGISTRY["early-2024"]).toBeDefined();
      expect(IMAGERY_PERIOD_REGISTRY["early-2024"].label).toBe("January 2024");
    });

    it("should contain current period", () => {
      expect(IMAGERY_PERIOD_REGISTRY["current"]).toBeDefined();
      expect(IMAGERY_PERIOD_REGISTRY["current"].label).toBe("Current");
    });

    it("should have default period (current)", () => {
      expect(IMAGERY_PERIOD_REGISTRY["current"].isDefault).toBe(true);
    });

    it("should have all periods enabled", () => {
      const periods = getAllImageryPeriods();
      periods.forEach((period) => {
        expect(period.enabled).toBe(true);
      });
    });

    it("should have Arabic labels for all periods", () => {
      const periods = getAllImageryPeriods();
      periods.forEach((period) => {
        expect(period.labelArabic).toBeDefined();
        expect(period.labelArabic).not.toBe("");
      });
    });

    it("should have correct categories", () => {
      expect(IMAGERY_PERIOD_REGISTRY["baseline-2014"].category).toBe(
        "baseline"
      );
      expect(IMAGERY_PERIOD_REGISTRY["early-2024"].category).toBe("conflict");
      expect(IMAGERY_PERIOD_REGISTRY["current"].category).toBe("current");
    });

    it("should have metadata for all periods", () => {
      const periods = getAllImageryPeriods();
      periods.forEach((period) => {
        expect(period.metadata).toBeDefined();
        expect(period.metadata?.source).toBeDefined();
      });
    });
  });

  // ============================================================================
  // CRUD Operations Tests
  // ============================================================================

  describe("CRUD Operations", () => {
    const customPeriod: ExtendedImageryPeriodConfig = {
      id: "test-2023",
      label: "Test 2023",
      labelArabic: "اختبار 2023",
      category: "pre-conflict",
      date: "2023-10-01",
      url: "https://example.com/tile/{z}/{y}/{x}",
      maxZoom: 18,
      minZoom: 1,
      releaseNum: 12345,
      order: 1.5,
      enabled: true,
      description: "Test period",
      metadata: {
        source: "Test Source",
        resolution: 0.5,
        quality: 4,
      },
    };

    beforeEach(() => {
      // Clean up test period if it exists
      if (isValidImageryPeriod("test-2023")) {
        removeImageryPeriod("test-2023");
      }
    });

    it("should register a new period", () => {
      registerImageryPeriod(customPeriod);
      expect(IMAGERY_PERIOD_REGISTRY["test-2023"]).toBeDefined();
      expect(IMAGERY_PERIOD_REGISTRY["test-2023"].label).toBe("Test 2023");
    });

    it("should get period by ID", () => {
      registerImageryPeriod(customPeriod);
      const period = getImageryPeriod("test-2023");
      expect(period).toBeDefined();
      expect(period?.label).toBe("Test 2023");
    });

    it("should return undefined for non-existent period", () => {
      const period = getImageryPeriod("non-existent" as ImageryPeriodId);
      expect(period).toBeUndefined();
    });

    it("should update existing period", () => {
      registerImageryPeriod(customPeriod);
      updateImageryPeriod("test-2023", { label: "Updated Test 2023" });
      expect(IMAGERY_PERIOD_REGISTRY["test-2023"].label).toBe(
        "Updated Test 2023"
      );
    });

    it("should throw error when updating non-existent period", () => {
      expect(() =>
        updateImageryPeriod("non-existent" as ImageryPeriodId, {
          label: "Test",
        })
      ).toThrow("Imagery period 'non-existent' not found in registry");
    });

    it("should remove period", () => {
      registerImageryPeriod(customPeriod);
      expect(IMAGERY_PERIOD_REGISTRY["test-2023"]).toBeDefined();
      removeImageryPeriod("test-2023");
      expect(IMAGERY_PERIOD_REGISTRY["test-2023"]).toBeUndefined();
    });

    it("should get all period IDs", () => {
      const ids = getImageryPeriodIds();
      expect(ids).toContain("baseline-2014");
      expect(ids).toContain("early-2024");
      expect(ids).toContain("current");
    });

    it("should validate period ID", () => {
      expect(isValidImageryPeriod("baseline-2014")).toBe(true);
      expect(isValidImageryPeriod("non-existent")).toBe(false);
    });

    it("should preserve all properties when updating", () => {
      registerImageryPeriod(customPeriod);
      updateImageryPeriod("test-2023", { enabled: false });
      const period = getImageryPeriod("test-2023");
      expect(period?.enabled).toBe(false);
      expect(period?.label).toBe("Test 2023");
      expect(period?.category).toBe("pre-conflict");
      expect(period?.metadata?.source).toBe("Test Source");
    });
  });

  // ============================================================================
  // Query Function Tests
  // ============================================================================

  describe("Query Functions", () => {
    it("should get all periods sorted by order", () => {
      const periods = getAllImageryPeriods();
      expect(periods.length).toBeGreaterThanOrEqual(3);
      expect(periods[0].order).toBeLessThanOrEqual(periods[1].order);
    });

    it("should get enabled periods only", () => {
      const enabled = getEnabledImageryPeriods();
      enabled.forEach((period) => {
        expect(period.enabled).not.toBe(false);
      });
    });

    it("should get default period", () => {
      const defaultPeriod = getDefaultImageryPeriod();
      expect(defaultPeriod).toBeDefined();
      expect(defaultPeriod.id).toBe("current");
    });

    it("should get periods by category", () => {
      const baselinePeriods = getImageryPeriodsByCategory("baseline");
      expect(baselinePeriods.length).toBeGreaterThan(0);
      baselinePeriods.forEach((period) => {
        expect(period.category).toBe("baseline");
      });
    });

    it("should get conflict periods", () => {
      const conflictPeriods = getImageryPeriodsByCategory("conflict");
      expect(conflictPeriods.length).toBeGreaterThan(0);
      conflictPeriods.forEach((period) => {
        expect(period.category).toBe("conflict");
      });
    });

    it("should get current periods", () => {
      const currentPeriods = getImageryPeriodsByCategory("current");
      expect(currentPeriods.length).toBeGreaterThan(0);
      currentPeriods.forEach((period) => {
        expect(period.category).toBe("current");
      });
    });

    it("should return empty array for non-existent category", () => {
      const periods = getImageryPeriodsByCategory(
        "post-conflict" as ImageryPeriodCategory
      );
      expect(periods).toEqual([]);
    });

    it("should get periods by date range (string dates)", () => {
      const periods = getImageryPeriodsByDateRange("2014-01-01", "2024-12-31");
      expect(periods.length).toBeGreaterThan(0);
      periods.forEach((period) => {
        if (period.date !== "current") {
          const periodDate = new Date(period.date);
          expect(periodDate.getTime()).toBeGreaterThanOrEqual(
            new Date("2014-01-01").getTime()
          );
          expect(periodDate.getTime()).toBeLessThanOrEqual(
            new Date("2024-12-31").getTime()
          );
        }
      });
    });

    it("should get periods by date range (Date objects)", () => {
      const start = new Date("2014-01-01");
      const end = new Date("2024-12-31");
      const periods = getImageryPeriodsByDateRange(start, end);
      expect(periods.length).toBeGreaterThan(0);
    });

    it("should include current period in any date range", () => {
      const periods = getImageryPeriodsByDateRange("2020-01-01", "2020-12-31");
      const hasCurrent = periods.some((p) => p.date === "current");
      expect(hasCurrent).toBe(true);
    });

    it("should get earliest period", () => {
      const earliest = getEarliestImageryPeriod();
      expect(earliest).toBeDefined();
      expect(earliest.id).toBe("baseline-2014");
    });

    it("should get latest period (excluding current)", () => {
      const latest = getLatestImageryPeriod();
      expect(latest).toBeDefined();
      expect(latest.date).not.toBe("current");
      expect(latest.id).toBe("early-2024");
    });

    it("should get label in English", () => {
      const label = getImageryPeriodLabel("baseline-2014", "en");
      expect(label).toBe("2014 Baseline");
    });

    it("should get label in Arabic", () => {
      const label = getImageryPeriodLabel("baseline-2014", "ar");
      expect(label).toBe("خط الأساس 2014");
    });

    it("should fallback to English if Arabic not available", () => {
      const customPeriod: ExtendedImageryPeriodConfig = {
        id: "test-no-arabic",
        label: "Test No Arabic",
        category: "pre-conflict",
        date: "2023-10-01",
        url: "https://example.com/tile/{z}/{y}/{x}",
        maxZoom: 18,
        order: 10,
      };
      registerImageryPeriod(customPeriod);
      const label = getImageryPeriodLabel("test-no-arabic", "ar");
      expect(label).toBe("Test No Arabic");
      removeImageryPeriod("test-no-arabic");
    });

    it("should return ID for non-existent period", () => {
      const label = getImageryPeriodLabel("non-existent" as ImageryPeriodId, "en");
      expect(label).toBe("non-existent");
    });
  });

  // ============================================================================
  // Integration Tests
  // ============================================================================

  describe("Integration Tests", () => {
    it("should maintain sort order after registration", () => {
      const customPeriod: ExtendedImageryPeriodConfig = {
        id: "test-integration",
        label: "Test Integration",
        category: "pre-conflict",
        date: "2023-09-01",
        url: "https://example.com/tile/{z}/{y}/{x}",
        maxZoom: 18,
        order: 1.75,
      };

      registerImageryPeriod(customPeriod);
      const periods = getAllImageryPeriods();
      for (let i = 0; i < periods.length - 1; i++) {
        expect(periods[i].order).toBeLessThanOrEqual(periods[i + 1].order);
      }
      removeImageryPeriod("test-integration");
    });

    it("should filter enabled periods correctly", () => {
      const customPeriod: ExtendedImageryPeriodConfig = {
        id: "test-disabled",
        label: "Test Disabled",
        category: "pre-conflict",
        date: "2023-09-01",
        url: "https://example.com/tile/{z}/{y}/{x}",
        maxZoom: 18,
        order: 1.8,
        enabled: false,
      };

      registerImageryPeriod(customPeriod);
      const enabled = getEnabledImageryPeriods();
      const hasDisabled = enabled.some((p) => p.id === "test-disabled");
      expect(hasDisabled).toBe(false);
      removeImageryPeriod("test-disabled");
    });
  });

  // ============================================================================
  // Edge Cases Tests
  // ============================================================================

  describe("Edge Cases", () => {
    it("should handle empty date range", () => {
      const periods = getImageryPeriodsByDateRange("2025-01-01", "2025-01-01");
      // Should still include "current"
      expect(periods.length).toBeGreaterThanOrEqual(1);
      const hasCurrent = periods.some((p) => p.date === "current");
      expect(hasCurrent).toBe(true);
    });

    it("should handle future date range", () => {
      const periods = getImageryPeriodsByDateRange("2030-01-01", "2040-01-01");
      // Should only include "current"
      expect(periods.length).toBeGreaterThanOrEqual(1);
      periods.forEach((period) => {
        expect(period.date === "current" || period.date >= "2030-01-01").toBe(
          true
        );
      });
    });

    it("should return current as fallback when no earliest period", () => {
      // Save periods before removal
      const baseline = { ...getImageryPeriod("baseline-2014")! };
      const early2024 = { ...getImageryPeriod("early-2024")! };

      // Temporarily remove all dated periods
      const ids = getImageryPeriodIds();
      const datedIds = ids.filter((id) => {
        const period = getImageryPeriod(id);
        return period?.date !== "current";
      });

      datedIds.forEach((id) => removeImageryPeriod(id));

      const earliest = getEarliestImageryPeriod();
      expect(earliest.id).toBe("current");

      // Restore periods
      registerImageryPeriod(baseline);
      registerImageryPeriod(early2024);
    });

    it("should return current as fallback when no latest period", () => {
      // Save periods before removal
      const baseline = { ...getImageryPeriod("baseline-2014")! };
      const early2024 = { ...getImageryPeriod("early-2024")! };

      // Temporarily remove all dated periods
      const ids = getImageryPeriodIds();
      const datedIds = ids.filter((id) => {
        const period = getImageryPeriod(id);
        return period?.date !== "current";
      });

      datedIds.forEach((id) => removeImageryPeriod(id));

      const latest = getLatestImageryPeriod();
      expect(latest.id).toBe("current");

      // Restore periods
      registerImageryPeriod(baseline);
      registerImageryPeriod(early2024);
    });

    it("should handle period with null releaseNum", () => {
      const period = getImageryPeriod("current");
      expect(period?.releaseNum).toBe(null);
    });

    it("should fallback to current if no default period set", () => {
      // Temporarily remove isDefault flag
      const currentPeriod = IMAGERY_PERIOD_REGISTRY["current"];
      const originalDefault = currentPeriod.isDefault;
      currentPeriod.isDefault = undefined;

      const defaultPeriod = getDefaultImageryPeriod();
      expect(defaultPeriod).toBeDefined();

      // Restore
      currentPeriod.isDefault = originalDefault;
    });
  });
});
