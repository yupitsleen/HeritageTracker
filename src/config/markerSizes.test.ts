/**
 * Marker Size Configuration Registry Tests
 *
 * Comprehensive test suite for marker size configuration registry with responsive breakpoints.
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  MARKER_SIZE_REGISTRY,
  BREAKPOINTS,
  registerMarkerSizeConfig,
  getAllMarkerSizeConfigs,
  getMarkerSizeConfig,
  getDefaultMarkerSizeConfig,
  updateMarkerSizeConfig,
  removeMarkerSizeConfig,
  getMarkerSizeConfigIds,
  isValidMarkerSizeConfig,
  getMarkerSizeConfigLabel,
  getCurrentBreakpoint,
  getMarkerSize,
  DEFAULT_MARKER_SIZE_CONFIG,
  MARKER_CONFIG,
} from "./markerSizes";
import type { MarkerSizeConfig } from "../types/markerSizeTypes";

describe("Marker Size Configuration Registry", () => {
  // ============================================================================
  // Registry Validation Tests
  // ============================================================================

  describe("Registry Validation", () => {
    it("should contain heritage-tracker-v1 configuration", () => {
      expect(MARKER_SIZE_REGISTRY["heritage-tracker-v1"]).toBeDefined();
      expect(MARKER_SIZE_REGISTRY["heritage-tracker-v1"].label).toBe(
        "Heritage Tracker Default Sizes"
      );
    });

    it("should have default configuration", () => {
      expect(MARKER_SIZE_REGISTRY["heritage-tracker-v1"].isDefault).toBe(true);
    });

    it("should have Arabic labels", () => {
      expect(
        MARKER_SIZE_REGISTRY["heritage-tracker-v1"].labelArabic
      ).toBe("أحجام متتبع التراث الافتراضية");
    });

    it("should have default marker dimensions", () => {
      const config = MARKER_SIZE_REGISTRY["heritage-tracker-v1"];
      expect(config.default.iconSize).toEqual([12, 20]);
      expect(config.default.iconAnchor).toEqual([6, 20]);
      expect(config.default.popupAnchor).toEqual([0, -17]);
      expect(config.default.shadowSize).toEqual([20, 20]);
    });

    it("should have highlighted marker dimensions", () => {
      const config = MARKER_SIZE_REGISTRY["heritage-tracker-v1"];
      expect(config.highlighted.iconSize).toEqual([25, 41]);
      expect(config.highlighted.iconAnchor).toEqual([12, 41]);
      expect(config.highlighted.popupAnchor).toEqual([1, -34]);
      expect(config.highlighted.shadowSize).toEqual([41, 41]);
    });

    it("should have metadata", () => {
      const config = MARKER_SIZE_REGISTRY["heritage-tracker-v1"];
      expect(config.metadata).toBeDefined();
      expect(config.metadata?.author).toBe("Heritage Tracker Team");
    });

    it("should have valid breakpoint thresholds", () => {
      expect(BREAKPOINTS.mobile).toBe(768);
      expect(BREAKPOINTS.tablet).toBe(1024);
    });
  });

  // ============================================================================
  // CRUD Operations Tests
  // ============================================================================

  describe("CRUD Operations", () => {
    const customConfig: MarkerSizeConfig = {
      id: "test-sizes",
      label: "Test Sizes",
      labelArabic: "أحجام الاختبار",
      description: "Test marker sizes",
      default: {
        iconSize: [10, 16],
        iconAnchor: [5, 16],
        popupAnchor: [0, -14],
        shadowSize: [16, 16],
      },
      highlighted: {
        iconSize: [20, 32],
        iconAnchor: [10, 32],
        popupAnchor: [0, -28],
        shadowSize: [32, 32],
      },
    };

    beforeEach(() => {
      // Clean up test config if it exists
      if (isValidMarkerSizeConfig("test-sizes")) {
        removeMarkerSizeConfig("test-sizes");
      }
    });

    it("should register a new configuration", () => {
      registerMarkerSizeConfig(customConfig);
      expect(MARKER_SIZE_REGISTRY["test-sizes"]).toBeDefined();
      expect(MARKER_SIZE_REGISTRY["test-sizes"].label).toBe("Test Sizes");
    });

    it("should get configuration by ID", () => {
      registerMarkerSizeConfig(customConfig);
      const config = getMarkerSizeConfig("test-sizes");
      expect(config).toBeDefined();
      expect(config?.label).toBe("Test Sizes");
    });

    it("should return undefined for non-existent configuration", () => {
      const config = getMarkerSizeConfig("non-existent");
      expect(config).toBeUndefined();
    });

    it("should update existing configuration", () => {
      registerMarkerSizeConfig(customConfig);
      updateMarkerSizeConfig("test-sizes", {
        default: {
          iconSize: [14, 22],
          iconAnchor: [7, 22],
          popupAnchor: [0, -18],
          shadowSize: [22, 22],
        },
      });
      expect(MARKER_SIZE_REGISTRY["test-sizes"].default.iconSize).toEqual([
        14, 22,
      ]);
    });

    it("should throw error when updating non-existent configuration", () => {
      expect(() =>
        updateMarkerSizeConfig("non-existent", { label: "Test" })
      ).toThrow("Marker size configuration 'non-existent' not found in registry");
    });

    it("should remove configuration", () => {
      registerMarkerSizeConfig(customConfig);
      expect(MARKER_SIZE_REGISTRY["test-sizes"]).toBeDefined();
      removeMarkerSizeConfig("test-sizes");
      expect(MARKER_SIZE_REGISTRY["test-sizes"]).toBeUndefined();
    });

    it("should get all configuration IDs", () => {
      const ids = getMarkerSizeConfigIds();
      expect(ids).toContain("heritage-tracker-v1");
    });

    it("should validate configuration ID", () => {
      expect(isValidMarkerSizeConfig("heritage-tracker-v1")).toBe(true);
      expect(isValidMarkerSizeConfig("non-existent")).toBe(false);
    });

    it("should preserve all properties when updating", () => {
      registerMarkerSizeConfig(customConfig);
      updateMarkerSizeConfig("test-sizes", { label: "Updated Test" });
      const config = getMarkerSizeConfig("test-sizes");
      expect(config?.label).toBe("Updated Test");
      expect(config?.default.iconSize).toEqual([10, 16]);
      expect(config?.highlighted.iconSize).toEqual([20, 32]);
    });
  });

  // ============================================================================
  // Query Function Tests
  // ============================================================================

  describe("Query Functions", () => {
    it("should get all configurations", () => {
      const configs = getAllMarkerSizeConfigs();
      expect(configs.length).toBeGreaterThanOrEqual(1);
      expect(configs.some((c) => c.id === "heritage-tracker-v1")).toBe(true);
    });

    it("should get default configuration", () => {
      const defaultConfig = getDefaultMarkerSizeConfig();
      expect(defaultConfig).toBeDefined();
      expect(defaultConfig.id).toBe("heritage-tracker-v1");
      expect(defaultConfig.isDefault).toBe(true);
    });

    it("should get label in English", () => {
      const label = getMarkerSizeConfigLabel("heritage-tracker-v1", "en");
      expect(label).toBe("Heritage Tracker Default Sizes");
    });

    it("should get label in Arabic", () => {
      const label = getMarkerSizeConfigLabel("heritage-tracker-v1", "ar");
      expect(label).toBe("أحجام متتبع التراث الافتراضية");
    });

    it("should fallback to English if Arabic not available", () => {
      const customConfig: MarkerSizeConfig = {
        ...MARKER_SIZE_REGISTRY["heritage-tracker-v1"],
        id: "test-no-arabic",
        label: "Test No Arabic",
        labelArabic: undefined,
      };
      registerMarkerSizeConfig(customConfig);
      const label = getMarkerSizeConfigLabel("test-no-arabic", "ar");
      expect(label).toBe("Test No Arabic");
      removeMarkerSizeConfig("test-no-arabic");
    });

    it("should return ID for non-existent configuration", () => {
      const label = getMarkerSizeConfigLabel("non-existent", "en");
      expect(label).toBe("non-existent");
    });
  });

  // ============================================================================
  // Breakpoint Detection Tests
  // ============================================================================

  describe("Breakpoint Detection", () => {
    it("should detect mobile breakpoint (width < 768px)", () => {
      expect(getCurrentBreakpoint(375)).toBe("mobile");
      expect(getCurrentBreakpoint(767)).toBe("mobile");
    });

    it("should detect tablet breakpoint (768px ≤ width < 1024px)", () => {
      expect(getCurrentBreakpoint(768)).toBe("tablet");
      expect(getCurrentBreakpoint(800)).toBe("tablet");
      expect(getCurrentBreakpoint(1023)).toBe("tablet");
    });

    it("should detect desktop breakpoint (width ≥ 1024px)", () => {
      expect(getCurrentBreakpoint(1024)).toBe("desktop");
      expect(getCurrentBreakpoint(1440)).toBe("desktop");
      expect(getCurrentBreakpoint(1920)).toBe("desktop");
    });

    it("should default to desktop breakpoint when width not provided", () => {
      const breakpoint = getCurrentBreakpoint();
      expect(breakpoint).toBeDefined();
      expect(["mobile", "tablet", "desktop"]).toContain(breakpoint);
    });
  });

  // ============================================================================
  // Responsive Marker Size Tests
  // ============================================================================

  describe("Responsive Marker Sizes", () => {
    it("should get default marker size for mobile", () => {
      const size = getMarkerSize(false, 375);
      expect(size).toBeDefined();
      expect(size.iconSize).toEqual([12, 20]);
    });

    it("should get highlighted marker size for mobile", () => {
      const size = getMarkerSize(true, 375);
      expect(size).toBeDefined();
      expect(size.iconSize).toEqual([25, 41]);
    });

    it("should get default marker size for tablet", () => {
      const size = getMarkerSize(false, 800);
      expect(size).toBeDefined();
      expect(size.iconSize).toEqual([12, 20]);
    });

    it("should get highlighted marker size for tablet", () => {
      const size = getMarkerSize(true, 800);
      expect(size).toBeDefined();
      expect(size.iconSize).toEqual([25, 41]);
    });

    it("should get default marker size for desktop", () => {
      const size = getMarkerSize(false, 1440);
      expect(size).toBeDefined();
      expect(size.iconSize).toEqual([12, 20]);
    });

    it("should get highlighted marker size for desktop", () => {
      const size = getMarkerSize(true, 1440);
      expect(size).toBeDefined();
      expect(size.iconSize).toEqual([25, 41]);
    });

    it("should use breakpoint-specific sizes when configured", () => {
      const responsiveConfig: MarkerSizeConfig = {
        id: "test-responsive",
        label: "Test Responsive",
        default: {
          iconSize: [12, 20],
          iconAnchor: [6, 20],
          popupAnchor: [0, -17],
          shadowSize: [20, 20],
        },
        highlighted: {
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        },
        mobile: {
          default: {
            iconSize: [16, 26],
            iconAnchor: [8, 26],
            popupAnchor: [0, -22],
            shadowSize: [26, 26],
          },
          highlighted: {
            iconSize: [32, 52],
            iconAnchor: [16, 52],
            popupAnchor: [0, -44],
            shadowSize: [52, 52],
          },
        },
      };

      registerMarkerSizeConfig(responsiveConfig);

      const mobileSize = getMarkerSize(false, 375, "test-responsive");
      expect(mobileSize.iconSize).toEqual([16, 26]);

      const mobileHighlighted = getMarkerSize(true, 375, "test-responsive");
      expect(mobileHighlighted.iconSize).toEqual([32, 52]);

      const desktopSize = getMarkerSize(false, 1440, "test-responsive");
      expect(desktopSize.iconSize).toEqual([12, 20]); // Falls back to default

      removeMarkerSizeConfig("test-responsive");
    });

    it("should return all size dimensions", () => {
      const size = getMarkerSize(false, 1440);
      expect(size.iconSize).toBeDefined();
      expect(size.iconAnchor).toBeDefined();
      expect(size.popupAnchor).toBeDefined();
      expect(size.shadowSize).toBeDefined();
    });

    it("should handle non-existent config ID gracefully", () => {
      const size = getMarkerSize(false, 1440, "non-existent");
      expect(size).toBeDefined();
      expect(size.iconSize).toEqual([12, 20]); // Fallback default size
    });
  });

  // ============================================================================
  // Backward Compatibility Tests
  // ============================================================================

  describe("Backward Compatibility", () => {
    it("should export DEFAULT_MARKER_SIZE_CONFIG constant", () => {
      expect(DEFAULT_MARKER_SIZE_CONFIG).toBeDefined();
      expect(DEFAULT_MARKER_SIZE_CONFIG.id).toBe("heritage-tracker-v1");
    });

    it("should export MARKER_CONFIG constant", () => {
      expect(MARKER_CONFIG).toBeDefined();
      expect(MARKER_CONFIG.iconSize).toEqual([12, 20]);
      expect(MARKER_CONFIG.iconAnchor).toEqual([6, 20]);
      expect(MARKER_CONFIG.popupAnchor).toEqual([0, -17]);
      expect(MARKER_CONFIG.shadowSize).toEqual([20, 20]);
      expect(MARKER_CONFIG.highlightedIconSize).toEqual([25, 41]);
      expect(MARKER_CONFIG.highlightedIconAnchor).toEqual([12, 41]);
      expect(MARKER_CONFIG.highlightedPopupAnchor).toEqual([1, -34]);
    });

    it("MARKER_CONFIG should match default config values", () => {
      const defaultConfig = getDefaultMarkerSizeConfig();
      expect(MARKER_CONFIG.iconSize).toEqual(defaultConfig.default.iconSize);
      expect(MARKER_CONFIG.iconAnchor).toEqual(defaultConfig.default.iconAnchor);
      expect(MARKER_CONFIG.highlightedIconSize).toEqual(
        defaultConfig.highlighted.iconSize
      );
      expect(MARKER_CONFIG.highlightedIconAnchor).toEqual(
        defaultConfig.highlighted.iconAnchor
      );
    });
  });

  // ============================================================================
  // Integration Tests
  // ============================================================================

  describe("Integration Tests", () => {
    it("should allow dynamic configuration switching across breakpoints", () => {
      const responsiveConfig: MarkerSizeConfig = {
        id: "test-integration",
        label: "Test Integration",
        default: {
          iconSize: [10, 16],
          iconAnchor: [5, 16],
          popupAnchor: [0, -14],
          shadowSize: [16, 16],
        },
        highlighted: {
          iconSize: [20, 32],
          iconAnchor: [10, 32],
          popupAnchor: [0, -28],
          shadowSize: [32, 32],
        },
        mobile: {
          default: {
            iconSize: [14, 22],
            iconAnchor: [7, 22],
            popupAnchor: [0, -18],
            shadowSize: [22, 22],
          },
          highlighted: {
            iconSize: [28, 44],
            iconAnchor: [14, 44],
            popupAnchor: [0, -36],
            shadowSize: [44, 44],
          },
        },
        desktop: {
          default: {
            iconSize: [8, 12],
            iconAnchor: [4, 12],
            popupAnchor: [0, -10],
            shadowSize: [12, 12],
          },
          highlighted: {
            iconSize: [16, 24],
            iconAnchor: [8, 24],
            popupAnchor: [0, -20],
            shadowSize: [24, 24],
          },
        },
      };

      registerMarkerSizeConfig(responsiveConfig);

      const mobileSize = getMarkerSize(false, 375, "test-integration");
      expect(mobileSize.iconSize).toEqual([14, 22]);

      const tabletSize = getMarkerSize(false, 800, "test-integration");
      expect(tabletSize.iconSize).toEqual([10, 16]); // Falls back to default

      const desktopSize = getMarkerSize(false, 1440, "test-integration");
      expect(desktopSize.iconSize).toEqual([8, 12]);

      removeMarkerSizeConfig("test-integration");
    });

    it("should maintain consistency across all size properties", () => {
      const config = getMarkerSizeConfig("heritage-tracker-v1")!;

      // Verify all required properties exist
      expect(config.default).toBeDefined();
      expect(config.highlighted).toBeDefined();

      // Verify nested properties
      expect(config.default.iconSize.length).toBe(2);
      expect(config.default.iconAnchor.length).toBe(2);
      expect(config.default.popupAnchor.length).toBe(2);
      expect(config.default.shadowSize.length).toBe(2);
    });
  });

  // ============================================================================
  // Edge Cases Tests
  // ============================================================================

  describe("Edge Cases", () => {
    it("should handle fallback when no default configuration set", () => {
      // Temporarily remove isDefault flag
      const originalConfig = MARKER_SIZE_REGISTRY["heritage-tracker-v1"];
      const originalDefault = originalConfig.isDefault;
      originalConfig.isDefault = undefined;

      const defaultConfig = getDefaultMarkerSizeConfig();
      expect(defaultConfig).toBeDefined();

      // Restore
      originalConfig.isDefault = originalDefault;
    });

    it("should handle zero-sized markers", () => {
      const zeroConfig: MarkerSizeConfig = {
        id: "test-zero",
        label: "Zero Size",
        default: {
          iconSize: [0, 0],
          iconAnchor: [0, 0],
          popupAnchor: [0, 0],
          shadowSize: [0, 0],
        },
        highlighted: {
          iconSize: [1, 1],
          iconAnchor: [0, 1],
          popupAnchor: [0, -1],
          shadowSize: [1, 1],
        },
      };
      registerMarkerSizeConfig(zeroConfig);

      const size = getMarkerSize(false, 1440, "test-zero");
      expect(size.iconSize).toEqual([0, 0]);

      removeMarkerSizeConfig("test-zero");
    });

    it("should handle very large marker sizes", () => {
      const largeConfig: MarkerSizeConfig = {
        id: "test-large",
        label: "Large Size",
        default: {
          iconSize: [100, 160],
          iconAnchor: [50, 160],
          popupAnchor: [0, -140],
          shadowSize: [160, 160],
        },
        highlighted: {
          iconSize: [200, 320],
          iconAnchor: [100, 320],
          popupAnchor: [0, -280],
          shadowSize: [320, 320],
        },
      };
      registerMarkerSizeConfig(largeConfig);

      const size = getMarkerSize(true, 1440, "test-large");
      expect(size.iconSize).toEqual([200, 320]);

      removeMarkerSizeConfig("test-large");
    });

    it("should validate anchor points are within icon bounds", () => {
      const config = MARKER_SIZE_REGISTRY["heritage-tracker-v1"];

      // Icon anchor should be within icon size
      expect(config.default.iconAnchor[0]).toBeLessThanOrEqual(
        config.default.iconSize[0]
      );
      expect(config.default.iconAnchor[1]).toBeLessThanOrEqual(
        config.default.iconSize[1]
      );
    });
  });
});
