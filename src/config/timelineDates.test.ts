/**
 * Timeline Date Configuration Registry Tests
 *
 * Comprehensive test suite for timeline date configuration registry.
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  TIMELINE_DATE_REGISTRY,
  registerTimelineDateConfig,
  getAllTimelineDateConfigs,
  getTimelineDateConfig,
  getDefaultTimelineDateConfig,
  updateTimelineDateConfig,
  removeTimelineDateConfig,
  getTimelineDateConfigIds,
  isValidTimelineDateConfig,
  getTimelineDateConfigLabel,
  getDateRange,
  isDateInBounds,
  DEFAULT_TIMELINE_DATE_CONFIG,
  FALLBACK_START_DATE,
  FALLBACK_END_DATE,
} from "./timelineDates";
import type { TimelineDateConfig } from "../types/timelineDateTypes";

describe("Timeline Date Configuration Registry", () => {
  // ============================================================================
  // Registry Validation Tests
  // ============================================================================

  describe("Registry Validation", () => {
    it("should contain gaza-conflict-2023 configuration", () => {
      expect(TIMELINE_DATE_REGISTRY["gaza-conflict-2023"]).toBeDefined();
      expect(TIMELINE_DATE_REGISTRY["gaza-conflict-2023"].label).toBe(
        "Gaza Conflict 2023-Present"
      );
    });

    it("should have default configuration", () => {
      expect(TIMELINE_DATE_REGISTRY["gaza-conflict-2023"].isDefault).toBe(true);
    });

    it("should have Arabic labels", () => {
      expect(TIMELINE_DATE_REGISTRY["gaza-conflict-2023"].labelArabic).toBe(
        "صراع غزة 2023-الحاضر"
      );
    });

    it("should have fallback dates", () => {
      const config = TIMELINE_DATE_REGISTRY["gaza-conflict-2023"];
      expect(config.fallbackStartDate).toBeInstanceOf(Date);
      expect(config.fallbackEndDate).toBeInstanceOf(Date);
      expect(config.fallbackStartDate.toISOString()).toContain("2023-10-07");
    });

    it("should have min/max dates", () => {
      const config = TIMELINE_DATE_REGISTRY["gaza-conflict-2023"];
      expect(config.minDate).toBeInstanceOf(Date);
      expect(config.maxDate).toBeInstanceOf(Date);
    });

    it("should have metadata", () => {
      const config = TIMELINE_DATE_REGISTRY["gaza-conflict-2023"];
      expect(config.metadata).toBeDefined();
      expect(config.metadata?.author).toBe("Heritage Tracker Team");
    });

    it("should have valid date ranges", () => {
      const config = TIMELINE_DATE_REGISTRY["gaza-conflict-2023"];
      expect(config.fallbackStartDate < config.fallbackEndDate).toBe(true);
      if (config.minDate && config.maxDate) {
        expect(config.minDate < config.maxDate).toBe(true);
      }
    });
  });

  // ============================================================================
  // CRUD Operations Tests
  // ============================================================================

  describe("CRUD Operations", () => {
    const customConfig: TimelineDateConfig = {
      id: "test-period",
      label: "Test Period",
      labelArabic: "فترة الاختبار",
      description: "Test timeline period",
      fallbackStartDate: new Date("2020-01-01"),
      fallbackEndDate: new Date("2024-12-31"),
      minDate: new Date("2019-01-01"),
      maxDate: new Date("2025-12-31"),
    };

    beforeEach(() => {
      // Clean up test config if it exists
      if (isValidTimelineDateConfig("test-period")) {
        removeTimelineDateConfig("test-period");
      }
    });

    it("should register a new configuration", () => {
      registerTimelineDateConfig(customConfig);
      expect(TIMELINE_DATE_REGISTRY["test-period"]).toBeDefined();
      expect(TIMELINE_DATE_REGISTRY["test-period"].label).toBe("Test Period");
    });

    it("should get configuration by ID", () => {
      registerTimelineDateConfig(customConfig);
      const config = getTimelineDateConfig("test-period");
      expect(config).toBeDefined();
      expect(config?.label).toBe("Test Period");
    });

    it("should return undefined for non-existent configuration", () => {
      const config = getTimelineDateConfig("non-existent");
      expect(config).toBeUndefined();
    });

    it("should update existing configuration", () => {
      registerTimelineDateConfig(customConfig);
      updateTimelineDateConfig("test-period", {
        fallbackEndDate: new Date("2025-06-30"),
      });
      const endDate = TIMELINE_DATE_REGISTRY["test-period"].fallbackEndDate;
      expect(endDate.toISOString()).toContain("2025-06-30");
    });

    it("should throw error when updating non-existent configuration", () => {
      expect(() =>
        updateTimelineDateConfig("non-existent", { label: "Test" })
      ).toThrow("Timeline date configuration 'non-existent' not found in registry");
    });

    it("should remove configuration", () => {
      registerTimelineDateConfig(customConfig);
      expect(TIMELINE_DATE_REGISTRY["test-period"]).toBeDefined();
      removeTimelineDateConfig("test-period");
      expect(TIMELINE_DATE_REGISTRY["test-period"]).toBeUndefined();
    });

    it("should get all configuration IDs", () => {
      const ids = getTimelineDateConfigIds();
      expect(ids).toContain("gaza-conflict-2023");
    });

    it("should validate configuration ID", () => {
      expect(isValidTimelineDateConfig("gaza-conflict-2023")).toBe(true);
      expect(isValidTimelineDateConfig("non-existent")).toBe(false);
    });

    it("should preserve all properties when updating", () => {
      registerTimelineDateConfig(customConfig);
      updateTimelineDateConfig("test-period", { label: "Updated Test" });
      const config = getTimelineDateConfig("test-period");
      expect(config?.label).toBe("Updated Test");
      expect(config?.fallbackStartDate.toISOString()).toContain("2020-01-01");
      expect(config?.minDate?.toISOString()).toContain("2019-01-01");
    });
  });

  // ============================================================================
  // Query Function Tests
  // ============================================================================

  describe("Query Functions", () => {
    it("should get all configurations", () => {
      const configs = getAllTimelineDateConfigs();
      expect(configs.length).toBeGreaterThanOrEqual(1);
      expect(configs.some((c) => c.id === "gaza-conflict-2023")).toBe(true);
    });

    it("should get default configuration", () => {
      const defaultConfig = getDefaultTimelineDateConfig();
      expect(defaultConfig).toBeDefined();
      expect(defaultConfig.id).toBe("gaza-conflict-2023");
      expect(defaultConfig.isDefault).toBe(true);
    });

    it("should get label in English", () => {
      const label = getTimelineDateConfigLabel("gaza-conflict-2023", "en");
      expect(label).toBe("Gaza Conflict 2023-Present");
    });

    it("should get label in Arabic", () => {
      const label = getTimelineDateConfigLabel("gaza-conflict-2023", "ar");
      expect(label).toBe("صراع غزة 2023-الحاضر");
    });

    it("should fallback to English if Arabic not available", () => {
      const customConfig: TimelineDateConfig = {
        ...TIMELINE_DATE_REGISTRY["gaza-conflict-2023"],
        id: "test-no-arabic",
        label: "Test No Arabic",
        labelArabic: undefined,
      };
      registerTimelineDateConfig(customConfig);
      const label = getTimelineDateConfigLabel("test-no-arabic", "ar");
      expect(label).toBe("Test No Arabic");
      removeTimelineDateConfig("test-no-arabic");
    });

    it("should return ID for non-existent configuration", () => {
      const label = getTimelineDateConfigLabel("non-existent", "en");
      expect(label).toBe("non-existent");
    });

    it("should get date range", () => {
      const range = getDateRange("gaza-conflict-2023");
      expect(range).toBeDefined();
      expect(range?.startDate).toBeInstanceOf(Date);
      expect(range?.endDate).toBeInstanceOf(Date);
      expect(range?.startDate.toISOString()).toContain("2023-10-07");
    });

    it("should return undefined range for non-existent configuration", () => {
      const range = getDateRange("non-existent");
      expect(range).toBeUndefined();
    });
  });

  // ============================================================================
  // Date Bounds Tests
  // ============================================================================

  describe("Date Bounds Functions", () => {
    it("should validate date within bounds", () => {
      const testDate = new Date("2024-01-15");
      const isValid = isDateInBounds("gaza-conflict-2023", testDate);
      expect(isValid).toBe(true);
    });

    it("should invalidate date before min bound", () => {
      const testDate = new Date("2022-12-31");
      const isValid = isDateInBounds("gaza-conflict-2023", testDate);
      expect(isValid).toBe(false);
    });

    it("should invalidate date after max bound", () => {
      const testDate = new Date("2027-01-01");
      const isValid = isDateInBounds("gaza-conflict-2023", testDate);
      expect(isValid).toBe(false);
    });

    it("should validate date at min bound (inclusive)", () => {
      const minDate = TIMELINE_DATE_REGISTRY["gaza-conflict-2023"].minDate!;
      const isValid = isDateInBounds("gaza-conflict-2023", minDate);
      expect(isValid).toBe(true);
    });

    it("should validate date at max bound (inclusive)", () => {
      const maxDate = TIMELINE_DATE_REGISTRY["gaza-conflict-2023"].maxDate!;
      const isValid = isDateInBounds("gaza-conflict-2023", maxDate);
      expect(isValid).toBe(true);
    });

    it("should return false for non-existent configuration", () => {
      const testDate = new Date("2024-01-01");
      const isValid = isDateInBounds("non-existent", testDate);
      expect(isValid).toBe(false);
    });

    it("should handle configuration without min/max dates", () => {
      const customConfig: TimelineDateConfig = {
        id: "test-no-bounds",
        label: "No Bounds",
        fallbackStartDate: new Date("2020-01-01"),
        fallbackEndDate: new Date("2024-12-31"),
        // No minDate or maxDate
      };
      registerTimelineDateConfig(customConfig);

      const testDate = new Date("2030-01-01");
      const isValid = isDateInBounds("test-no-bounds", testDate);
      expect(isValid).toBe(true); // No bounds, so any date is valid

      removeTimelineDateConfig("test-no-bounds");
    });
  });

  // ============================================================================
  // Backward Compatibility Tests
  // ============================================================================

  describe("Backward Compatibility", () => {
    it("should export DEFAULT_TIMELINE_DATE_CONFIG constant", () => {
      expect(DEFAULT_TIMELINE_DATE_CONFIG).toBeDefined();
      expect(DEFAULT_TIMELINE_DATE_CONFIG.id).toBe("gaza-conflict-2023");
    });

    it("should export FALLBACK_START_DATE constant", () => {
      expect(FALLBACK_START_DATE).toBeInstanceOf(Date);
      expect(FALLBACK_START_DATE.toISOString()).toContain("2023-10-07");
    });

    it("should export FALLBACK_END_DATE constant", () => {
      expect(FALLBACK_END_DATE).toBeInstanceOf(Date);
    });

    it("FALLBACK dates should match default config", () => {
      const defaultConfig = getDefaultTimelineDateConfig();
      expect(FALLBACK_START_DATE).toBe(defaultConfig.fallbackStartDate);
      expect(FALLBACK_END_DATE).toBe(defaultConfig.fallbackEndDate);
    });
  });

  // ============================================================================
  // Integration Tests
  // ============================================================================

  describe("Integration Tests", () => {
    it("should allow dynamic configuration switching", () => {
      const customConfig: TimelineDateConfig = {
        ...TIMELINE_DATE_REGISTRY["gaza-conflict-2023"],
        id: "test-integration",
        label: "Test Integration",
        fallbackStartDate: new Date("2021-01-01"),
        fallbackEndDate: new Date("2023-12-31"),
      };

      registerTimelineDateConfig(customConfig);
      const config = getTimelineDateConfig("test-integration");
      expect(config).toBeDefined();
      expect(config?.fallbackStartDate.toISOString()).toContain("2021-01-01");

      removeTimelineDateConfig("test-integration");
    });

    it("should maintain date range consistency", () => {
      const config = getTimelineDateConfig("gaza-conflict-2023")!;

      // Fallback dates should be within min/max bounds
      expect(isDateInBounds("gaza-conflict-2023", config.fallbackStartDate)).toBe(
        true
      );
      expect(isDateInBounds("gaza-conflict-2023", config.fallbackEndDate)).toBe(
        true
      );
    });
  });

  // ============================================================================
  // Edge Cases Tests
  // ============================================================================

  describe("Edge Cases", () => {
    it("should handle fallback when no default configuration set", () => {
      // Temporarily remove isDefault flag
      const originalConfig = TIMELINE_DATE_REGISTRY["gaza-conflict-2023"];
      const originalDefault = originalConfig.isDefault;
      originalConfig.isDefault = undefined;

      const defaultConfig = getDefaultTimelineDateConfig();
      expect(defaultConfig).toBeDefined();

      // Restore
      originalConfig.isDefault = originalDefault;
    });

    it("should handle same start and end dates", () => {
      const customConfig: TimelineDateConfig = {
        id: "test-same-dates",
        label: "Same Dates",
        fallbackStartDate: new Date("2024-01-01"),
        fallbackEndDate: new Date("2024-01-01"),
      };
      registerTimelineDateConfig(customConfig);

      const config = getTimelineDateConfig("test-same-dates");
      expect(config?.fallbackStartDate.getTime()).toBe(
        config?.fallbackEndDate.getTime()
      );

      removeTimelineDateConfig("test-same-dates");
    });

    it("should handle very wide date ranges", () => {
      const customConfig: TimelineDateConfig = {
        id: "test-wide-range",
        label: "Wide Range",
        fallbackStartDate: new Date("1900-01-01T00:00:00"),
        fallbackEndDate: new Date("2100-12-31T23:59:59"),
      };
      registerTimelineDateConfig(customConfig);

      const range = getDateRange("test-wide-range");
      expect(range?.startDate.getFullYear()).toBe(1900);
      expect(range?.endDate.getFullYear()).toBe(2100);

      removeTimelineDateConfig("test-wide-range");
    });

    it("should handle current date as fallback end", () => {
      const config = TIMELINE_DATE_REGISTRY["gaza-conflict-2023"];
      const now = new Date();

      // Fallback end should be close to current time (within 1 hour)
      const timeDiff = Math.abs(
        config.fallbackEndDate.getTime() - now.getTime()
      );
      expect(timeDiff).toBeLessThan(3600000); // Less than 1 hour
    });
  });
});
