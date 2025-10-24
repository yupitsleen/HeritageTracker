/**
 * Marker Icon CDN Configuration Registry Tests
 *
 * Comprehensive test suite for marker icon CDN configuration registry.
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  MARKER_ICON_REGISTRY,
  registerMarkerIconConfig,
  getAllMarkerIconConfigs,
  getMarkerIconConfig,
  getDefaultMarkerIconConfig,
  updateMarkerIconConfig,
  removeMarkerIconConfig,
  getMarkerIconConfigIds,
  isValidMarkerIconConfig,
  getMarkerIconConfigLabel,
  getIconBaseUrl,
  getShadowUrl,
  DEFAULT_MARKER_ICON_CONFIG,
  MARKER_ICON_BASE_URL,
  MARKER_SHADOW_URL,
} from "./markerIcons";
import type { MarkerIconConfig } from "../types/markerIconTypes";

describe("Marker Icon CDN Configuration Registry", () => {
  // ============================================================================
  // Registry Validation Tests
  // ============================================================================

  describe("Registry Validation", () => {
    it("should contain leaflet-color-markers configuration", () => {
      expect(MARKER_ICON_REGISTRY["leaflet-color-markers"]).toBeDefined();
      expect(MARKER_ICON_REGISTRY["leaflet-color-markers"].label).toBe(
        "Leaflet Color Markers"
      );
    });

    it("should have default configuration", () => {
      expect(MARKER_ICON_REGISTRY["leaflet-color-markers"].isDefault).toBe(
        true
      );
    });

    it("should have Arabic labels", () => {
      expect(
        MARKER_ICON_REGISTRY["leaflet-color-markers"].labelArabic
      ).toBe("علامات الخريطة الملونة");
    });

    it("should have icon base URL", () => {
      const config = MARKER_ICON_REGISTRY["leaflet-color-markers"];
      expect(config.iconBaseUrl).toBeDefined();
      expect(config.iconBaseUrl).toContain("leaflet-color-markers");
    });

    it("should have shadow URL", () => {
      const config = MARKER_ICON_REGISTRY["leaflet-color-markers"];
      expect(config.shadowUrl).toBeDefined();
      expect(config.shadowUrl).toContain("marker-shadow");
    });

    it("should have metadata", () => {
      const config = MARKER_ICON_REGISTRY["leaflet-color-markers"];
      expect(config.metadata).toBeDefined();
      expect(config.metadata?.author).toBe("Heritage Tracker Team");
    });

    it("should have valid URLs", () => {
      const config = MARKER_ICON_REGISTRY["leaflet-color-markers"];
      expect(config.iconBaseUrl.startsWith("https://")).toBe(true);
      expect(config.shadowUrl.startsWith("https://")).toBe(true);
    });
  });

  // ============================================================================
  // CRUD Operations Tests
  // ============================================================================

  describe("CRUD Operations", () => {
    const customConfig: MarkerIconConfig = {
      id: "test-icons",
      label: "Test Icons",
      labelArabic: "أيقونات الاختبار",
      description: "Test icon CDN",
      iconBaseUrl: "https://test-cdn.com/icons",
      shadowUrl: "https://test-cdn.com/shadow.png",
    };

    beforeEach(() => {
      // Clean up test config if it exists
      if (isValidMarkerIconConfig("test-icons")) {
        removeMarkerIconConfig("test-icons");
      }
    });

    it("should register a new configuration", () => {
      registerMarkerIconConfig(customConfig);
      expect(MARKER_ICON_REGISTRY["test-icons"]).toBeDefined();
      expect(MARKER_ICON_REGISTRY["test-icons"].label).toBe("Test Icons");
    });

    it("should get configuration by ID", () => {
      registerMarkerIconConfig(customConfig);
      const config = getMarkerIconConfig("test-icons");
      expect(config).toBeDefined();
      expect(config?.label).toBe("Test Icons");
    });

    it("should return undefined for non-existent configuration", () => {
      const config = getMarkerIconConfig("non-existent");
      expect(config).toBeUndefined();
    });

    it("should update existing configuration", () => {
      registerMarkerIconConfig(customConfig);
      updateMarkerIconConfig("test-icons", {
        iconBaseUrl: "https://new-cdn.com/icons",
      });
      expect(MARKER_ICON_REGISTRY["test-icons"].iconBaseUrl).toBe(
        "https://new-cdn.com/icons"
      );
    });

    it("should throw error when updating non-existent configuration", () => {
      expect(() =>
        updateMarkerIconConfig("non-existent", { label: "Test" })
      ).toThrow("Marker icon configuration 'non-existent' not found in registry");
    });

    it("should remove configuration", () => {
      registerMarkerIconConfig(customConfig);
      expect(MARKER_ICON_REGISTRY["test-icons"]).toBeDefined();
      removeMarkerIconConfig("test-icons");
      expect(MARKER_ICON_REGISTRY["test-icons"]).toBeUndefined();
    });

    it("should get all configuration IDs", () => {
      const ids = getMarkerIconConfigIds();
      expect(ids).toContain("leaflet-color-markers");
    });

    it("should validate configuration ID", () => {
      expect(isValidMarkerIconConfig("leaflet-color-markers")).toBe(true);
      expect(isValidMarkerIconConfig("non-existent")).toBe(false);
    });

    it("should preserve all properties when updating", () => {
      registerMarkerIconConfig(customConfig);
      updateMarkerIconConfig("test-icons", { label: "Updated Test" });
      const config = getMarkerIconConfig("test-icons");
      expect(config?.label).toBe("Updated Test");
      expect(config?.iconBaseUrl).toBe("https://test-cdn.com/icons");
      expect(config?.shadowUrl).toBe("https://test-cdn.com/shadow.png");
    });
  });

  // ============================================================================
  // Query Function Tests
  // ============================================================================

  describe("Query Functions", () => {
    it("should get all configurations", () => {
      const configs = getAllMarkerIconConfigs();
      expect(configs.length).toBeGreaterThanOrEqual(1);
      expect(configs.some((c) => c.id === "leaflet-color-markers")).toBe(true);
    });

    it("should get default configuration", () => {
      const defaultConfig = getDefaultMarkerIconConfig();
      expect(defaultConfig).toBeDefined();
      expect(defaultConfig.id).toBe("leaflet-color-markers");
      expect(defaultConfig.isDefault).toBe(true);
    });

    it("should get label in English", () => {
      const label = getMarkerIconConfigLabel("leaflet-color-markers", "en");
      expect(label).toBe("Leaflet Color Markers");
    });

    it("should get label in Arabic", () => {
      const label = getMarkerIconConfigLabel("leaflet-color-markers", "ar");
      expect(label).toBe("علامات الخريطة الملونة");
    });

    it("should fallback to English if Arabic not available", () => {
      const customConfig: MarkerIconConfig = {
        ...MARKER_ICON_REGISTRY["leaflet-color-markers"],
        id: "test-no-arabic",
        label: "Test No Arabic",
        labelArabic: undefined,
      };
      registerMarkerIconConfig(customConfig);
      const label = getMarkerIconConfigLabel("test-no-arabic", "ar");
      expect(label).toBe("Test No Arabic");
      removeMarkerIconConfig("test-no-arabic");
    });

    it("should return ID for non-existent configuration", () => {
      const label = getMarkerIconConfigLabel("non-existent", "en");
      expect(label).toBe("non-existent");
    });

    it("should get icon base URL from default config", () => {
      const baseUrl = getIconBaseUrl();
      expect(baseUrl).toBeDefined();
      expect(baseUrl).toContain("leaflet-color-markers");
    });

    it("should get icon base URL from specific config", () => {
      const customConfig: MarkerIconConfig = {
        id: "test-url",
        label: "Test URL",
        iconBaseUrl: "https://custom-cdn.com/icons",
        shadowUrl: "https://custom-cdn.com/shadow.png",
      };
      registerMarkerIconConfig(customConfig);
      const baseUrl = getIconBaseUrl("test-url");
      expect(baseUrl).toBe("https://custom-cdn.com/icons");
      removeMarkerIconConfig("test-url");
    });

    it("should get shadow URL from default config", () => {
      const shadowUrl = getShadowUrl();
      expect(shadowUrl).toBeDefined();
      expect(shadowUrl).toContain("marker-shadow");
    });

    it("should get shadow URL from specific config", () => {
      const customConfig: MarkerIconConfig = {
        id: "test-shadow",
        label: "Test Shadow",
        iconBaseUrl: "https://custom-cdn.com/icons",
        shadowUrl: "https://custom-cdn.com/shadow.png",
      };
      registerMarkerIconConfig(customConfig);
      const shadowUrl = getShadowUrl("test-shadow");
      expect(shadowUrl).toBe("https://custom-cdn.com/shadow.png");
      removeMarkerIconConfig("test-shadow");
    });
  });

  // ============================================================================
  // Backward Compatibility Tests
  // ============================================================================

  describe("Backward Compatibility", () => {
    it("should export DEFAULT_MARKER_ICON_CONFIG constant", () => {
      expect(DEFAULT_MARKER_ICON_CONFIG).toBeDefined();
      expect(DEFAULT_MARKER_ICON_CONFIG.id).toBe("leaflet-color-markers");
    });

    it("should export MARKER_ICON_BASE_URL constant", () => {
      expect(MARKER_ICON_BASE_URL).toBeDefined();
      expect(typeof MARKER_ICON_BASE_URL).toBe("string");
      expect(MARKER_ICON_BASE_URL).toContain("leaflet-color-markers");
    });

    it("should export MARKER_SHADOW_URL constant", () => {
      expect(MARKER_SHADOW_URL).toBeDefined();
      expect(typeof MARKER_SHADOW_URL).toBe("string");
      expect(MARKER_SHADOW_URL).toContain("marker-shadow");
    });

    it("MARKER_ICON_BASE_URL should match default config", () => {
      const defaultConfig = getDefaultMarkerIconConfig();
      expect(MARKER_ICON_BASE_URL).toBe(defaultConfig.iconBaseUrl);
    });

    it("MARKER_SHADOW_URL should match default config", () => {
      const defaultConfig = getDefaultMarkerIconConfig();
      expect(MARKER_SHADOW_URL).toBe(defaultConfig.shadowUrl);
    });
  });

  // ============================================================================
  // Integration Tests
  // ============================================================================

  describe("Integration Tests", () => {
    it("should allow dynamic configuration switching", () => {
      const customConfig: MarkerIconConfig = {
        ...MARKER_ICON_REGISTRY["leaflet-color-markers"],
        id: "test-integration",
        label: "Test Integration",
        iconBaseUrl: "https://integration-cdn.com/icons",
        shadowUrl: "https://integration-cdn.com/shadow.png",
      };

      registerMarkerIconConfig(customConfig);
      const config = getMarkerIconConfig("test-integration");
      expect(config).toBeDefined();
      expect(config?.iconBaseUrl).toBe("https://integration-cdn.com/icons");
      expect(config?.shadowUrl).toBe("https://integration-cdn.com/shadow.png");

      removeMarkerIconConfig("test-integration");
    });

    it("should maintain URL consistency across queries", () => {
      const config = getMarkerIconConfig("leaflet-color-markers")!;

      expect(getIconBaseUrl("leaflet-color-markers")).toBe(config.iconBaseUrl);
      expect(getShadowUrl("leaflet-color-markers")).toBe(config.shadowUrl);
    });
  });

  // ============================================================================
  // Edge Cases Tests
  // ============================================================================

  describe("Edge Cases", () => {
    it("should handle fallback when no default configuration set", () => {
      // Temporarily remove isDefault flag
      const originalConfig = MARKER_ICON_REGISTRY["leaflet-color-markers"];
      const originalDefault = originalConfig.isDefault;
      originalConfig.isDefault = undefined;

      const defaultConfig = getDefaultMarkerIconConfig();
      expect(defaultConfig).toBeDefined();

      // Restore
      originalConfig.isDefault = originalDefault;
    });

    it("should handle empty icon base URL gracefully", () => {
      const customConfig: MarkerIconConfig = {
        id: "test-empty-url",
        label: "Empty URL",
        iconBaseUrl: "",
        shadowUrl: "https://example.com/shadow.png",
      };
      registerMarkerIconConfig(customConfig);

      const baseUrl = getIconBaseUrl("test-empty-url");
      expect(baseUrl).toBe("");

      removeMarkerIconConfig("test-empty-url");
    });

    it("should handle CDN with query parameters", () => {
      const customConfig: MarkerIconConfig = {
        id: "test-query-params",
        label: "Query Params",
        iconBaseUrl: "https://cdn.com/icons?version=1.0&format=png",
        shadowUrl: "https://cdn.com/shadow.png?v=2",
      };
      registerMarkerIconConfig(customConfig);

      const config = getMarkerIconConfig("test-query-params");
      expect(config?.iconBaseUrl).toContain("?");
      expect(config?.shadowUrl).toContain("?");

      removeMarkerIconConfig("test-query-params");
    });

    it("should handle very long CDN URLs", () => {
      const longUrl =
        "https://very-long-cdn-domain-name-for-testing-purposes.example.com/path/to/icons/with/many/subdirectories/marker-icons";
      const customConfig: MarkerIconConfig = {
        id: "test-long-url",
        label: "Long URL",
        iconBaseUrl: longUrl,
        shadowUrl: longUrl + "/shadow.png",
      };
      registerMarkerIconConfig(customConfig);

      const config = getMarkerIconConfig("test-long-url");
      expect(config?.iconBaseUrl.length).toBeGreaterThan(100);

      removeMarkerIconConfig("test-long-url");
    });

    it("should validate HTTPS URLs in default config", () => {
      const config = MARKER_ICON_REGISTRY["leaflet-color-markers"];
      expect(config.iconBaseUrl.startsWith("https://")).toBe(true);
      expect(config.shadowUrl.startsWith("https://")).toBe(true);
    });
  });
});
