/**
 * Frame Rate Configuration Registry Tests
 *
 * Comprehensive test suite for frame rate configuration registry.
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  FRAME_RATE_REGISTRY,
  registerFrameRateConfig,
  getAllFrameRateConfigs,
  getFrameRateConfig,
  getDefaultFrameRateConfig,
  updateFrameRateConfig,
  removeFrameRateConfig,
  getFrameRateConfigIds,
  isValidFrameRateConfig,
  getFrameRateConfigLabel,
  getFrameInterval,
  getFps,
  createFrameRateConfigFromFps,
  DEFAULT_FRAME_RATE_CONFIG,
  FRAME_INTERVAL,
  TARGET_FPS,
} from "./frameRates";
import type { FrameRateConfig } from "../types/frameRateTypes";

describe("Frame Rate Configuration Registry", () => {
  // ============================================================================
  // Registry Validation Tests
  // ============================================================================

  describe("Registry Validation", () => {
    it("should contain fps-30 configuration", () => {
      expect(FRAME_RATE_REGISTRY["fps-30"]).toBeDefined();
      expect(FRAME_RATE_REGISTRY["fps-30"].label).toBe("30 FPS");
    });

    it("should contain fps-60 configuration", () => {
      expect(FRAME_RATE_REGISTRY["fps-60"]).toBeDefined();
      expect(FRAME_RATE_REGISTRY["fps-60"].label).toBe("60 FPS");
    });

    it("should have default configuration (fps-60)", () => {
      expect(FRAME_RATE_REGISTRY["fps-60"].isDefault).toBe(true);
    });

    it("should have Arabic labels", () => {
      expect(FRAME_RATE_REGISTRY["fps-30"].labelArabic).toBe(
        "٣٠ إطارًا في الثانية"
      );
      expect(FRAME_RATE_REGISTRY["fps-60"].labelArabic).toBe(
        "٦٠ إطارًا في الثانية"
      );
    });

    it("fps-30 should have correct values", () => {
      const config = FRAME_RATE_REGISTRY["fps-30"];
      expect(config.fps).toBe(30);
      expect(config.frameInterval).toBe(33);
    });

    it("fps-60 should have correct values", () => {
      const config = FRAME_RATE_REGISTRY["fps-60"];
      expect(config.fps).toBe(60);
      expect(config.frameInterval).toBe(16);
    });

    it("should have metadata", () => {
      expect(FRAME_RATE_REGISTRY["fps-30"].metadata).toBeDefined();
      expect(FRAME_RATE_REGISTRY["fps-30"].metadata?.author).toBe(
        "Heritage Tracker Team"
      );
      expect(FRAME_RATE_REGISTRY["fps-60"].metadata).toBeDefined();
    });

    it("frame interval should be close to fps calculation", () => {
      const config = FRAME_RATE_REGISTRY["fps-60"];
      const expectedInterval = 1000 / config.fps; // ~16.67
      // Allow 1ms tolerance since we round
      expect(Math.abs(config.frameInterval - expectedInterval)).toBeLessThanOrEqual(1);
    });
  });

  // ============================================================================
  // CRUD Operations Tests
  // ============================================================================

  describe("CRUD Operations", () => {
    const customConfig: FrameRateConfig = {
      id: "test-fps",
      label: "Test FPS",
      labelArabic: "معدل الإطارات التجريبي",
      description: "Test frame rate",
      fps: 120,
      frameInterval: 8,
    };

    beforeEach(() => {
      // Clean up test config if it exists
      if (isValidFrameRateConfig("test-fps")) {
        removeFrameRateConfig("test-fps");
      }
    });

    it("should register a new configuration", () => {
      registerFrameRateConfig(customConfig);
      expect(FRAME_RATE_REGISTRY["test-fps"]).toBeDefined();
      expect(FRAME_RATE_REGISTRY["test-fps"].label).toBe("Test FPS");
    });

    it("should get configuration by ID", () => {
      registerFrameRateConfig(customConfig);
      const config = getFrameRateConfig("test-fps");
      expect(config).toBeDefined();
      expect(config?.label).toBe("Test FPS");
    });

    it("should return undefined for non-existent configuration", () => {
      const config = getFrameRateConfig("non-existent");
      expect(config).toBeUndefined();
    });

    it("should update existing configuration", () => {
      registerFrameRateConfig(customConfig);
      updateFrameRateConfig("test-fps", {
        frameInterval: 10,
      });
      expect(FRAME_RATE_REGISTRY["test-fps"].frameInterval).toBe(10);
    });

    it("should throw error when updating non-existent configuration", () => {
      expect(() =>
        updateFrameRateConfig("non-existent", { label: "Test" })
      ).toThrow("Frame rate configuration 'non-existent' not found in registry");
    });

    it("should remove configuration", () => {
      registerFrameRateConfig(customConfig);
      expect(FRAME_RATE_REGISTRY["test-fps"]).toBeDefined();
      removeFrameRateConfig("test-fps");
      expect(FRAME_RATE_REGISTRY["test-fps"]).toBeUndefined();
    });

    it("should get all configuration IDs", () => {
      const ids = getFrameRateConfigIds();
      expect(ids).toContain("fps-30");
      expect(ids).toContain("fps-60");
    });

    it("should validate configuration ID", () => {
      expect(isValidFrameRateConfig("fps-60")).toBe(true);
      expect(isValidFrameRateConfig("non-existent")).toBe(false);
    });

    it("should preserve all properties when updating", () => {
      registerFrameRateConfig(customConfig);
      updateFrameRateConfig("test-fps", { label: "Updated Test" });
      const config = getFrameRateConfig("test-fps");
      expect(config?.label).toBe("Updated Test");
      expect(config?.fps).toBe(120);
      expect(config?.frameInterval).toBe(8);
    });
  });

  // ============================================================================
  // Query Function Tests
  // ============================================================================

  describe("Query Functions", () => {
    it("should get all configurations", () => {
      const configs = getAllFrameRateConfigs();
      expect(configs.length).toBeGreaterThanOrEqual(2);
      expect(configs.some((c) => c.id === "fps-30")).toBe(true);
      expect(configs.some((c) => c.id === "fps-60")).toBe(true);
    });

    it("should get default configuration", () => {
      const defaultConfig = getDefaultFrameRateConfig();
      expect(defaultConfig).toBeDefined();
      expect(defaultConfig.id).toBe("fps-60");
      expect(defaultConfig.isDefault).toBe(true);
    });

    it("should get label in English", () => {
      const label = getFrameRateConfigLabel("fps-60", "en");
      expect(label).toBe("60 FPS");
    });

    it("should get label in Arabic", () => {
      const label = getFrameRateConfigLabel("fps-60", "ar");
      expect(label).toBe("٦٠ إطارًا في الثانية");
    });

    it("should fallback to English if Arabic not available", () => {
      const customConfig: FrameRateConfig = {
        ...FRAME_RATE_REGISTRY["fps-60"],
        id: "test-no-arabic",
        label: "Test No Arabic",
        labelArabic: undefined,
      };
      registerFrameRateConfig(customConfig);
      const label = getFrameRateConfigLabel("test-no-arabic", "ar");
      expect(label).toBe("Test No Arabic");
      removeFrameRateConfig("test-no-arabic");
    });

    it("should return ID for non-existent configuration", () => {
      const label = getFrameRateConfigLabel("non-existent", "en");
      expect(label).toBe("non-existent");
    });

    it("should get frame interval for default config", () => {
      const interval = getFrameInterval();
      expect(interval).toBe(16);
    });

    it("should get frame interval for specific config", () => {
      const interval = getFrameInterval("fps-30");
      expect(interval).toBe(33);
    });

    it("should get fps for default config", () => {
      const fps = getFps();
      expect(fps).toBe(60);
    });

    it("should get fps for specific config", () => {
      const fps = getFps("fps-30");
      expect(fps).toBe(30);
    });

    it("should handle non-existent config ID gracefully", () => {
      const interval = getFrameInterval("non-existent");
      expect(interval).toBe(16); // Falls back to default

      const fps = getFps("non-existent");
      expect(fps).toBe(60); // Falls back to default
    });
  });

  // ============================================================================
  // Utility Function Tests
  // ============================================================================

  describe("Utility Functions", () => {
    it("should create frame rate config from fps", () => {
      const config = createFrameRateConfigFromFps(120);
      expect(config.id).toBe("fps-120");
      expect(config.label).toBe("120 FPS");
      expect(config.fps).toBe(120);
      expect(config.frameInterval).toBe(8); // 1000 / 120 ≈ 8
    });

    it("should create frame rate config with custom id and label", () => {
      const config = createFrameRateConfigFromFps(
        90,
        "custom-90",
        "Custom 90 FPS"
      );
      expect(config.id).toBe("custom-90");
      expect(config.label).toBe("Custom 90 FPS");
      expect(config.fps).toBe(90);
      expect(config.frameInterval).toBe(11); // 1000 / 90 ≈ 11
    });

    it("should calculate correct frame interval for various fps values", () => {
      const testCases = [
        { fps: 24, expectedInterval: 42 }, // Film
        { fps: 30, expectedInterval: 33 }, // Mobile
        { fps: 60, expectedInterval: 17 }, // Desktop
        { fps: 120, expectedInterval: 8 }, // High refresh
        { fps: 144, expectedInterval: 7 }, // Gaming
      ];

      testCases.forEach(({ fps, expectedInterval }) => {
        const config = createFrameRateConfigFromFps(fps);
        expect(config.frameInterval).toBeCloseTo(expectedInterval, 0);
      });
    });
  });

  // ============================================================================
  // Backward Compatibility Tests
  // ============================================================================

  describe("Backward Compatibility", () => {
    it("should export DEFAULT_FRAME_RATE_CONFIG constant", () => {
      expect(DEFAULT_FRAME_RATE_CONFIG).toBeDefined();
      expect(DEFAULT_FRAME_RATE_CONFIG.id).toBe("fps-60");
    });

    it("should export FRAME_INTERVAL constant", () => {
      expect(FRAME_INTERVAL).toBeDefined();
      expect(typeof FRAME_INTERVAL).toBe("number");
      expect(FRAME_INTERVAL).toBe(16);
    });

    it("should export TARGET_FPS constant", () => {
      expect(TARGET_FPS).toBeDefined();
      expect(typeof TARGET_FPS).toBe("number");
      expect(TARGET_FPS).toBe(60);
    });

    it("FRAME_INTERVAL should match default config", () => {
      const defaultConfig = getDefaultFrameRateConfig();
      expect(FRAME_INTERVAL).toBe(defaultConfig.frameInterval);
    });

    it("TARGET_FPS should match default config", () => {
      const defaultConfig = getDefaultFrameRateConfig();
      expect(TARGET_FPS).toBe(defaultConfig.fps);
    });
  });

  // ============================================================================
  // Integration Tests
  // ============================================================================

  describe("Integration Tests", () => {
    it("should allow dynamic configuration switching", () => {
      const fps30Interval = getFrameInterval("fps-30");
      const fps60Interval = getFrameInterval("fps-60");

      expect(fps30Interval).toBeGreaterThan(fps60Interval);
      expect(fps30Interval).toBe(33);
      expect(fps60Interval).toBe(16);
    });

    it("should maintain fps/interval relationship", () => {
      const configs = getAllFrameRateConfigs();
      configs.forEach((config) => {
        const exactInterval = 1000 / config.fps;
        // Allow 1ms tolerance since we round
        expect(Math.abs(config.frameInterval - exactInterval)).toBeLessThanOrEqual(1);
      });
    });

    it("should support custom high-refresh rate configurations", () => {
      const fps144 = createFrameRateConfigFromFps(144, "fps-144", "144 FPS");
      registerFrameRateConfig(fps144);

      const interval = getFrameInterval("fps-144");
      expect(interval).toBe(7); // 1000 / 144 ≈ 7

      removeFrameRateConfig("fps-144");
    });
  });

  // ============================================================================
  // Edge Cases Tests
  // ============================================================================

  describe("Edge Cases", () => {
    it("should handle fallback when no default configuration set", () => {
      // Temporarily remove isDefault flag
      const originalConfig = FRAME_RATE_REGISTRY["fps-60"];
      const originalDefault = originalConfig.isDefault;
      originalConfig.isDefault = undefined;

      const defaultConfig = getDefaultFrameRateConfig();
      expect(defaultConfig).toBeDefined();

      // Restore
      originalConfig.isDefault = originalDefault;
    });

    it("should handle very low frame rates", () => {
      const fps15 = createFrameRateConfigFromFps(15);
      expect(fps15.fps).toBe(15);
      expect(fps15.frameInterval).toBe(67); // 1000 / 15 ≈ 67
    });

    it("should handle very high frame rates", () => {
      const fps240 = createFrameRateConfigFromFps(240);
      expect(fps240.fps).toBe(240);
      expect(fps240.frameInterval).toBe(4); // 1000 / 240 ≈ 4
    });

    it("should handle decimal fps gracefully", () => {
      const fps29_97 = createFrameRateConfigFromFps(29.97);
      expect(fps29_97.fps).toBe(29.97);
      expect(fps29_97.frameInterval).toBe(33); // 1000 / 29.97 ≈ 33
    });

    it("should validate all default configs have required properties", () => {
      const configs = ["fps-30", "fps-60"];
      configs.forEach((id) => {
        const config = getFrameRateConfig(id);
        expect(config).toBeDefined();
        expect(config?.label).toBeDefined();
        expect(config?.fps).toBeDefined();
        expect(config?.frameInterval).toBeDefined();
        expect(config?.fps).toBeGreaterThan(0);
        expect(config?.frameInterval).toBeGreaterThan(0);
      });
    });

    it("should ensure frame interval is positive", () => {
      const configs = getAllFrameRateConfigs();
      configs.forEach((config) => {
        expect(config.frameInterval).toBeGreaterThan(0);
        expect(config.fps).toBeGreaterThan(0);
      });
    });
  });
});
