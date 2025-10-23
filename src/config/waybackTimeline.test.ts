/**
 * Wayback Timeline Configuration Registry Tests
 *
 * Comprehensive test suite for wayback timeline configuration registry.
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  WAYBACK_TIMELINE_REGISTRY,
  registerWaybackTimelineConfig,
  getAllWaybackTimelineConfigs,
  getWaybackTimelineConfig,
  getDefaultWaybackTimelineConfig,
  updateWaybackTimelineConfig,
  removeWaybackTimelineConfig,
  getWaybackTimelineConfigIds,
  isValidWaybackTimelineConfig,
  getWaybackTimelineConfigLabel,
  DEFAULT_WAYBACK_TIMELINE_CONFIG,
  WAYBACK_TIMELINE,
} from "./waybackTimeline";
import type { WaybackTimelineConfig } from "../types/waybackTimelineTypes";

describe("Wayback Timeline Configuration Registry", () => {
  // ============================================================================
  // Registry Validation Tests
  // ============================================================================

  describe("Registry Validation", () => {
    it("should contain heritage-tracker-v1 configuration", () => {
      expect(WAYBACK_TIMELINE_REGISTRY["heritage-tracker-v1"]).toBeDefined();
      expect(WAYBACK_TIMELINE_REGISTRY["heritage-tracker-v1"].label).toBe(
        "Heritage Tracker Configuration v1"
      );
    });

    it("should have default configuration", () => {
      expect(WAYBACK_TIMELINE_REGISTRY["heritage-tracker-v1"].isDefault).toBe(
        true
      );
    });

    it("should have Arabic labels", () => {
      expect(
        WAYBACK_TIMELINE_REGISTRY["heritage-tracker-v1"].labelArabic
      ).toBe("تكوين متتبع التراث الإصدار 1");
    });

    it("should have marker configuration", () => {
      const config = WAYBACK_TIMELINE_REGISTRY["heritage-tracker-v1"];
      expect(config.markerConfig).toBeDefined();
      expect(config.markerConfig.majorMarkerInterval).toBe(10);
      expect(config.markerConfig.eventMarkerStackSpacing).toBe(6);
    });

    it("should have playback configuration", () => {
      const config = WAYBACK_TIMELINE_REGISTRY["heritage-tracker-v1"];
      expect(config.playbackConfig).toBeDefined();
      expect(config.playbackConfig.yearAdvanceIntervalMs).toBe(2000);
      expect(config.playbackConfig.initialPauseMs).toBe(1000);
    });

    it("should have layout configuration", () => {
      const config = WAYBACK_TIMELINE_REGISTRY["heritage-tracker-v1"];
      expect(config.layoutConfig).toBeDefined();
      expect(config.layoutConfig.yearLabel).toBeDefined();
      expect(config.layoutConfig.markerContainer).toBeDefined();
      expect(config.layoutConfig.tooltip).toBeDefined();
      expect(config.layoutConfig.scrubberTooltip).toBeDefined();
    });

    it("should have metadata", () => {
      const config = WAYBACK_TIMELINE_REGISTRY["heritage-tracker-v1"];
      expect(config.metadata).toBeDefined();
      expect(config.metadata?.author).toBe("Heritage Tracker Team");
    });

    it("should have complete marker dimensions", () => {
      const config = WAYBACK_TIMELINE_REGISTRY["heritage-tracker-v1"];
      expect(config.markerConfig.minorMarker.height).toBe(4);
      expect(config.markerConfig.minorMarker.width).toBe(0.5);
      expect(config.markerConfig.majorMarker.height).toBe(8);
      expect(config.markerConfig.majorMarker.width).toBe(0.5);
      expect(config.markerConfig.yearMarker.height).toBe(2);
      expect(config.markerConfig.yearMarker.width).toBe(0.5);
    });
  });

  // ============================================================================
  // CRUD Operations Tests
  // ============================================================================

  describe("CRUD Operations", () => {
    const customConfig: WaybackTimelineConfig = {
      id: "test-config",
      label: "Test Configuration",
      labelArabic: "تكوين الاختبار",
      description: "Test configuration for testing",
      markerConfig: {
        majorMarkerInterval: 5,
        eventMarkerStackSpacing: 8,
        minorMarker: { height: 6, width: 1 },
        majorMarker: { height: 12, width: 1 },
        yearMarker: { height: 3, width: 1 },
      },
      playbackConfig: {
        yearAdvanceIntervalMs: 1000,
        initialPauseMs: 500,
        loopPlayback: true,
        showYearMarkers: true,
      },
      layoutConfig: {
        yearLabel: { top: 4, height: 8, topOffset: -8 },
        markerContainer: { top: -8, height: 10 },
        tooltip: { bottom: 8 },
        scrubberTooltip: { top: 10, height: 8 },
      },
    };

    beforeEach(() => {
      // Clean up test config if it exists
      if (isValidWaybackTimelineConfig("test-config")) {
        removeWaybackTimelineConfig("test-config");
      }
    });

    it("should register a new configuration", () => {
      registerWaybackTimelineConfig(customConfig);
      expect(WAYBACK_TIMELINE_REGISTRY["test-config"]).toBeDefined();
      expect(WAYBACK_TIMELINE_REGISTRY["test-config"].label).toBe(
        "Test Configuration"
      );
    });

    it("should get configuration by ID", () => {
      registerWaybackTimelineConfig(customConfig);
      const config = getWaybackTimelineConfig("test-config");
      expect(config).toBeDefined();
      expect(config?.label).toBe("Test Configuration");
    });

    it("should return undefined for non-existent configuration", () => {
      const config = getWaybackTimelineConfig("non-existent");
      expect(config).toBeUndefined();
    });

    it("should update existing configuration", () => {
      registerWaybackTimelineConfig(customConfig);
      updateWaybackTimelineConfig("test-config", {
        playbackConfig: {
          yearAdvanceIntervalMs: 1500,
          initialPauseMs: 750,
        },
      });
      expect(
        WAYBACK_TIMELINE_REGISTRY["test-config"].playbackConfig
          .yearAdvanceIntervalMs
      ).toBe(1500);
    });

    it("should throw error when updating non-existent configuration", () => {
      expect(() =>
        updateWaybackTimelineConfig("non-existent", { label: "Test" })
      ).toThrow(
        "Wayback timeline configuration 'non-existent' not found in registry"
      );
    });

    it("should remove configuration", () => {
      registerWaybackTimelineConfig(customConfig);
      expect(WAYBACK_TIMELINE_REGISTRY["test-config"]).toBeDefined();
      removeWaybackTimelineConfig("test-config");
      expect(WAYBACK_TIMELINE_REGISTRY["test-config"]).toBeUndefined();
    });

    it("should get all configuration IDs", () => {
      const ids = getWaybackTimelineConfigIds();
      expect(ids).toContain("heritage-tracker-v1");
    });

    it("should validate configuration ID", () => {
      expect(isValidWaybackTimelineConfig("heritage-tracker-v1")).toBe(true);
      expect(isValidWaybackTimelineConfig("non-existent")).toBe(false);
    });

    it("should preserve all properties when updating", () => {
      registerWaybackTimelineConfig(customConfig);
      updateWaybackTimelineConfig("test-config", { label: "Updated Test" });
      const config = getWaybackTimelineConfig("test-config");
      expect(config?.label).toBe("Updated Test");
      expect(config?.markerConfig.majorMarkerInterval).toBe(5);
      expect(config?.playbackConfig.yearAdvanceIntervalMs).toBe(1000);
    });
  });

  // ============================================================================
  // Query Function Tests
  // ============================================================================

  describe("Query Functions", () => {
    it("should get all configurations", () => {
      const configs = getAllWaybackTimelineConfigs();
      expect(configs.length).toBeGreaterThanOrEqual(1);
      expect(configs.some((c) => c.id === "heritage-tracker-v1")).toBe(true);
    });

    it("should get default configuration", () => {
      const defaultConfig = getDefaultWaybackTimelineConfig();
      expect(defaultConfig).toBeDefined();
      expect(defaultConfig.id).toBe("heritage-tracker-v1");
      expect(defaultConfig.isDefault).toBe(true);
    });

    it("should get label in English", () => {
      const label = getWaybackTimelineConfigLabel("heritage-tracker-v1", "en");
      expect(label).toBe("Heritage Tracker Configuration v1");
    });

    it("should get label in Arabic", () => {
      const label = getWaybackTimelineConfigLabel("heritage-tracker-v1", "ar");
      expect(label).toBe("تكوين متتبع التراث الإصدار 1");
    });

    it("should fallback to English if Arabic not available", () => {
      const customConfig: WaybackTimelineConfig = {
        ...WAYBACK_TIMELINE_REGISTRY["heritage-tracker-v1"],
        id: "test-no-arabic",
        label: "Test No Arabic",
        labelArabic: undefined,
      };
      registerWaybackTimelineConfig(customConfig);
      const label = getWaybackTimelineConfigLabel("test-no-arabic", "ar");
      expect(label).toBe("Test No Arabic");
      removeWaybackTimelineConfig("test-no-arabic");
    });

    it("should return ID for non-existent configuration", () => {
      const label = getWaybackTimelineConfigLabel("non-existent", "en");
      expect(label).toBe("non-existent");
    });
  });

  // ============================================================================
  // Backward Compatibility Tests
  // ============================================================================

  describe("Backward Compatibility", () => {
    it("should export DEFAULT_WAYBACK_TIMELINE_CONFIG constant", () => {
      expect(DEFAULT_WAYBACK_TIMELINE_CONFIG).toBeDefined();
      expect(DEFAULT_WAYBACK_TIMELINE_CONFIG.id).toBe("heritage-tracker-v1");
    });

    it("should export WAYBACK_TIMELINE constant", () => {
      expect(WAYBACK_TIMELINE).toBeDefined();
      expect(WAYBACK_TIMELINE.MAJOR_MARKER_INTERVAL).toBe(10);
      expect(WAYBACK_TIMELINE.EVENT_MARKER_STACK_SPACING).toBe(6);
      expect(WAYBACK_TIMELINE.YEAR_ADVANCE_INTERVAL_MS).toBe(2000);
      expect(WAYBACK_TIMELINE.INITIAL_PAUSE_MS).toBe(1000);
    });

    it("WAYBACK_TIMELINE should match default config values", () => {
      const defaultConfig = getDefaultWaybackTimelineConfig();
      expect(WAYBACK_TIMELINE.MAJOR_MARKER_INTERVAL).toBe(
        defaultConfig.markerConfig.majorMarkerInterval
      );
      expect(WAYBACK_TIMELINE.MINOR_MARKER_HEIGHT).toBe(
        defaultConfig.markerConfig.minorMarker.height
      );
      expect(WAYBACK_TIMELINE.MAJOR_MARKER_HEIGHT).toBe(
        defaultConfig.markerConfig.majorMarker.height
      );
      expect(WAYBACK_TIMELINE.YEAR_ADVANCE_INTERVAL_MS).toBe(
        defaultConfig.playbackConfig.yearAdvanceIntervalMs
      );
    });

    it("should have all original WAYBACK_TIMELINE constants", () => {
      expect(WAYBACK_TIMELINE.MAJOR_MARKER_INTERVAL).toBeDefined();
      expect(WAYBACK_TIMELINE.EVENT_MARKER_STACK_SPACING).toBeDefined();
      expect(WAYBACK_TIMELINE.YEAR_ADVANCE_INTERVAL_MS).toBeDefined();
      expect(WAYBACK_TIMELINE.INITIAL_PAUSE_MS).toBeDefined();
      expect(WAYBACK_TIMELINE.MINOR_MARKER_HEIGHT).toBeDefined();
      expect(WAYBACK_TIMELINE.MAJOR_MARKER_HEIGHT).toBeDefined();
      expect(WAYBACK_TIMELINE.YEAR_MARKER_HEIGHT).toBeDefined();
      expect(WAYBACK_TIMELINE.MINOR_MARKER_WIDTH).toBeDefined();
      expect(WAYBACK_TIMELINE.MAJOR_MARKER_WIDTH).toBeDefined();
      expect(WAYBACK_TIMELINE.YEAR_MARKER_WIDTH).toBeDefined();
      expect(WAYBACK_TIMELINE.YEAR_LABEL_CONTAINER_TOP).toBeDefined();
      expect(WAYBACK_TIMELINE.YEAR_LABEL_CONTAINER_HEIGHT).toBeDefined();
      expect(WAYBACK_TIMELINE.YEAR_LABEL_TOP_OFFSET).toBeDefined();
      expect(WAYBACK_TIMELINE.MARKER_CONTAINER_TOP).toBeDefined();
      expect(WAYBACK_TIMELINE.MARKER_CONTAINER_HEIGHT).toBeDefined();
      expect(WAYBACK_TIMELINE.TOOLTIP_BOTTOM_OFFSET).toBeDefined();
      expect(WAYBACK_TIMELINE.SCRUBBER_TOOLTIP_TOP).toBeDefined();
      expect(WAYBACK_TIMELINE.SCRUBBER_TOOLTIP_HEIGHT).toBeDefined();
    });
  });

  // ============================================================================
  // Integration Tests
  // ============================================================================

  describe("Integration Tests", () => {
    it("should allow dynamic configuration switching", () => {
      const customConfig: WaybackTimelineConfig = {
        ...WAYBACK_TIMELINE_REGISTRY["heritage-tracker-v1"],
        id: "test-integration",
        label: "Test Integration",
        playbackConfig: {
          yearAdvanceIntervalMs: 500,
          initialPauseMs: 250,
        },
      };

      registerWaybackTimelineConfig(customConfig);
      const config = getWaybackTimelineConfig("test-integration");
      expect(config).toBeDefined();
      expect(config?.playbackConfig.yearAdvanceIntervalMs).toBe(500);

      removeWaybackTimelineConfig("test-integration");
    });

    it("should maintain consistency across configuration properties", () => {
      const config = getWaybackTimelineConfig("heritage-tracker-v1")!;

      // Verify all required properties exist
      expect(config.markerConfig).toBeDefined();
      expect(config.playbackConfig).toBeDefined();
      expect(config.layoutConfig).toBeDefined();

      // Verify nested properties
      expect(config.markerConfig.minorMarker).toBeDefined();
      expect(config.markerConfig.majorMarker).toBeDefined();
      expect(config.markerConfig.yearMarker).toBeDefined();
      expect(config.layoutConfig.yearLabel).toBeDefined();
      expect(config.layoutConfig.markerContainer).toBeDefined();
    });
  });

  // ============================================================================
  // Edge Cases Tests
  // ============================================================================

  describe("Edge Cases", () => {
    it("should handle fallback when no default configuration set", () => {
      // Temporarily remove isDefault flag
      const originalConfig = WAYBACK_TIMELINE_REGISTRY["heritage-tracker-v1"];
      const originalDefault = originalConfig.isDefault;
      originalConfig.isDefault = undefined;

      const defaultConfig = getDefaultWaybackTimelineConfig();
      expect(defaultConfig).toBeDefined();

      // Restore
      originalConfig.isDefault = originalDefault;
    });

    it("should handle marker interval of 1 (every release is major)", () => {
      const customConfig: WaybackTimelineConfig = {
        ...WAYBACK_TIMELINE_REGISTRY["heritage-tracker-v1"],
        id: "test-interval-1",
        markerConfig: {
          ...WAYBACK_TIMELINE_REGISTRY["heritage-tracker-v1"].markerConfig,
          majorMarkerInterval: 1,
        },
      };
      registerWaybackTimelineConfig(customConfig);
      const config = getWaybackTimelineConfig("test-interval-1");
      expect(config?.markerConfig.majorMarkerInterval).toBe(1);
      removeWaybackTimelineConfig("test-interval-1");
    });

    it("should handle zero pause times (instant playback)", () => {
      const customConfig: WaybackTimelineConfig = {
        ...WAYBACK_TIMELINE_REGISTRY["heritage-tracker-v1"],
        id: "test-zero-pause",
        playbackConfig: {
          yearAdvanceIntervalMs: 0,
          initialPauseMs: 0,
        },
      };
      registerWaybackTimelineConfig(customConfig);
      const config = getWaybackTimelineConfig("test-zero-pause");
      expect(config?.playbackConfig.yearAdvanceIntervalMs).toBe(0);
      expect(config?.playbackConfig.initialPauseMs).toBe(0);
      removeWaybackTimelineConfig("test-zero-pause");
    });

    it("should validate all layout properties are present", () => {
      const config = getWaybackTimelineConfig("heritage-tracker-v1")!;
      expect(config.layoutConfig.yearLabel.top).toBeDefined();
      expect(config.layoutConfig.yearLabel.height).toBeDefined();
      expect(config.layoutConfig.yearLabel.topOffset).toBeDefined();
      expect(config.layoutConfig.markerContainer.top).toBeDefined();
      expect(config.layoutConfig.markerContainer.height).toBeDefined();
      expect(config.layoutConfig.tooltip.bottom).toBeDefined();
      expect(config.layoutConfig.scrubberTooltip.top).toBeDefined();
      expect(config.layoutConfig.scrubberTooltip.height).toBeDefined();
    });
  });
});
