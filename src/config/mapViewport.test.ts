/**
 * Map Viewport Registry Tests
 *
 * Comprehensive test suite for viewport and zoom level registries.
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  VIEWPORT_REGISTRY,
  ZOOM_LEVEL_REGISTRY,
  registerViewport,
  getAllViewports,
  getViewport,
  getDefaultViewport,
  updateViewport,
  removeViewport,
  getViewportIds,
  isValidViewport,
  getViewportLabel,
  registerZoomLevel,
  getAllZoomLevels,
  getZoomLevel,
  getZoomLevelsByContext,
  updateZoomLevel,
  removeZoomLevel,
  getZoomLevelIds,
  isValidZoomLevel,
  getZoomLevelLabel,
  GAZA_CENTER,
  DEFAULT_ZOOM,
  SITE_DETAIL_ZOOM,
} from "./mapViewport";
import type {
  MapViewportConfig,
  ZoomLevelConfig,
} from "../types/mapViewportTypes";

describe("Map Viewport Registry", () => {
  // ============================================================================
  // Viewport Registry Validation Tests
  // ============================================================================

  describe("Viewport Registry Validation", () => {
    it("should contain gaza-overview viewport", () => {
      expect(VIEWPORT_REGISTRY["gaza-overview"]).toBeDefined();
      expect(VIEWPORT_REGISTRY["gaza-overview"].label).toBe(
        "Gaza Strip Overview"
      );
    });

    it("should have default viewport", () => {
      expect(VIEWPORT_REGISTRY["gaza-overview"].isDefault).toBe(true);
    });

    it("should have Arabic labels", () => {
      expect(VIEWPORT_REGISTRY["gaza-overview"].labelArabic).toBe(
        "نظرة عامة على قطاع غزة"
      );
    });

    it("should have valid center coordinates", () => {
      const viewport = VIEWPORT_REGISTRY["gaza-overview"];
      expect(viewport.center).toEqual([31.42, 34.38]);
      expect(viewport.center.length).toBe(2);
    });

    it("should have valid zoom level", () => {
      const viewport = VIEWPORT_REGISTRY["gaza-overview"];
      expect(viewport.zoom).toBe(10.5);
      expect(viewport.zoom).toBeGreaterThan(0);
      expect(viewport.zoom).toBeLessThan(20);
    });

    it("should have bounds defined", () => {
      const viewport = VIEWPORT_REGISTRY["gaza-overview"];
      expect(viewport.bounds).toBeDefined();
      expect(viewport.bounds?.north).toBeGreaterThan(viewport.bounds!.south);
      expect(viewport.bounds?.east).toBeGreaterThan(viewport.bounds!.west);
    });
  });

  // ============================================================================
  // Viewport CRUD Operations Tests
  // ============================================================================

  describe("Viewport CRUD Operations", () => {
    const customViewport: MapViewportConfig = {
      id: "test-viewport",
      label: "Test Viewport",
      labelArabic: "عرض اختباري",
      center: [32.0, 35.0],
      zoom: 12,
      minZoom: 5,
      maxZoom: 18,
      description: "Test viewport for testing",
    };

    beforeEach(() => {
      // Clean up test viewport if it exists
      if (isValidViewport("test-viewport")) {
        removeViewport("test-viewport");
      }
    });

    it("should register a new viewport", () => {
      registerViewport(customViewport);
      expect(VIEWPORT_REGISTRY["test-viewport"]).toBeDefined();
      expect(VIEWPORT_REGISTRY["test-viewport"].label).toBe("Test Viewport");
    });

    it("should get viewport by ID", () => {
      registerViewport(customViewport);
      const viewport = getViewport("test-viewport");
      expect(viewport).toBeDefined();
      expect(viewport?.label).toBe("Test Viewport");
      expect(viewport?.center).toEqual([32.0, 35.0]);
    });

    it("should return undefined for non-existent viewport", () => {
      const viewport = getViewport("non-existent");
      expect(viewport).toBeUndefined();
    });

    it("should update existing viewport", () => {
      registerViewport(customViewport);
      updateViewport("test-viewport", { zoom: 15 });
      expect(VIEWPORT_REGISTRY["test-viewport"].zoom).toBe(15);
      expect(VIEWPORT_REGISTRY["test-viewport"].label).toBe("Test Viewport");
    });

    it("should throw error when updating non-existent viewport", () => {
      expect(() => updateViewport("non-existent", { zoom: 12 })).toThrow(
        "Viewport 'non-existent' not found in registry"
      );
    });

    it("should remove viewport", () => {
      registerViewport(customViewport);
      expect(VIEWPORT_REGISTRY["test-viewport"]).toBeDefined();
      removeViewport("test-viewport");
      expect(VIEWPORT_REGISTRY["test-viewport"]).toBeUndefined();
    });

    it("should get all viewport IDs", () => {
      const ids = getViewportIds();
      expect(ids).toContain("gaza-overview");
    });

    it("should validate viewport ID", () => {
      expect(isValidViewport("gaza-overview")).toBe(true);
      expect(isValidViewport("non-existent")).toBe(false);
    });

    it("should preserve all properties when updating", () => {
      registerViewport(customViewport);
      updateViewport("test-viewport", { zoom: 14 });
      const viewport = getViewport("test-viewport");
      expect(viewport?.zoom).toBe(14);
      expect(viewport?.label).toBe("Test Viewport");
      expect(viewport?.center).toEqual([32.0, 35.0]);
      expect(viewport?.minZoom).toBe(5);
    });
  });

  // ============================================================================
  // Viewport Query Function Tests
  // ============================================================================

  describe("Viewport Query Functions", () => {
    it("should get all viewports", () => {
      const viewports = getAllViewports();
      expect(viewports.length).toBeGreaterThanOrEqual(1);
      expect(viewports.some((v) => v.id === "gaza-overview")).toBe(true);
    });

    it("should get default viewport", () => {
      const defaultViewport = getDefaultViewport();
      expect(defaultViewport).toBeDefined();
      expect(defaultViewport.id).toBe("gaza-overview");
      expect(defaultViewport.isDefault).toBe(true);
    });

    it("should get label in English", () => {
      const label = getViewportLabel("gaza-overview", "en");
      expect(label).toBe("Gaza Strip Overview");
    });

    it("should get label in Arabic", () => {
      const label = getViewportLabel("gaza-overview", "ar");
      expect(label).toBe("نظرة عامة على قطاع غزة");
    });

    it("should fallback to English if Arabic not available", () => {
      const customViewport: MapViewportConfig = {
        id: "test-no-arabic",
        label: "Test No Arabic",
        center: [32.0, 35.0],
        zoom: 12,
      };
      registerViewport(customViewport);
      const label = getViewportLabel("test-no-arabic", "ar");
      expect(label).toBe("Test No Arabic");
      removeViewport("test-no-arabic");
    });

    it("should return ID for non-existent viewport", () => {
      const label = getViewportLabel("non-existent", "en");
      expect(label).toBe("non-existent");
    });
  });

  // ============================================================================
  // Zoom Level Registry Validation Tests
  // ============================================================================

  describe("Zoom Level Registry Validation", () => {
    it("should contain default-overview zoom level", () => {
      expect(ZOOM_LEVEL_REGISTRY["default-overview"]).toBeDefined();
      expect(ZOOM_LEVEL_REGISTRY["default-overview"].label).toBe(
        "Default Overview"
      );
    });

    it("should contain site-detail zoom level", () => {
      expect(ZOOM_LEVEL_REGISTRY["site-detail"]).toBeDefined();
      expect(ZOOM_LEVEL_REGISTRY["site-detail"].label).toBe("Site Detail");
    });

    it("should have Arabic labels", () => {
      expect(ZOOM_LEVEL_REGISTRY["default-overview"].labelArabic).toBe(
        "العرض الافتراضي"
      );
      expect(ZOOM_LEVEL_REGISTRY["site-detail"].labelArabic).toBe(
        "تفاصيل الموقع"
      );
    });

    it("should have valid zoom values", () => {
      const defaultZoom = ZOOM_LEVEL_REGISTRY["default-overview"];
      const siteZoom = ZOOM_LEVEL_REGISTRY["site-detail"];
      expect(defaultZoom.zoom).toBe(10.5);
      expect(siteZoom.zoom).toBe(17);
    });

    it("should have context defined", () => {
      expect(ZOOM_LEVEL_REGISTRY["default-overview"].context).toBe("overview");
      expect(ZOOM_LEVEL_REGISTRY["site-detail"].context).toBe("site");
    });
  });

  // ============================================================================
  // Zoom Level CRUD Operations Tests
  // ============================================================================

  describe("Zoom Level CRUD Operations", () => {
    const customZoom: ZoomLevelConfig = {
      id: "test-zoom",
      label: "Test Zoom",
      labelArabic: "تكبير الاختبار",
      zoom: 14,
      context: "custom",
      description: "Test zoom level",
    };

    beforeEach(() => {
      // Clean up test zoom if it exists
      if (isValidZoomLevel("test-zoom")) {
        removeZoomLevel("test-zoom");
      }
    });

    it("should register a new zoom level", () => {
      registerZoomLevel(customZoom);
      expect(ZOOM_LEVEL_REGISTRY["test-zoom"]).toBeDefined();
      expect(ZOOM_LEVEL_REGISTRY["test-zoom"].label).toBe("Test Zoom");
    });

    it("should get zoom level by ID", () => {
      registerZoomLevel(customZoom);
      const zoom = getZoomLevel("test-zoom");
      expect(zoom).toBeDefined();
      expect(zoom?.label).toBe("Test Zoom");
      expect(zoom?.zoom).toBe(14);
    });

    it("should return undefined for non-existent zoom level", () => {
      const zoom = getZoomLevel("non-existent");
      expect(zoom).toBeUndefined();
    });

    it("should update existing zoom level", () => {
      registerZoomLevel(customZoom);
      updateZoomLevel("test-zoom", { zoom: 16 });
      expect(ZOOM_LEVEL_REGISTRY["test-zoom"].zoom).toBe(16);
      expect(ZOOM_LEVEL_REGISTRY["test-zoom"].label).toBe("Test Zoom");
    });

    it("should throw error when updating non-existent zoom level", () => {
      expect(() => updateZoomLevel("non-existent", { zoom: 12 })).toThrow(
        "Zoom level 'non-existent' not found in registry"
      );
    });

    it("should remove zoom level", () => {
      registerZoomLevel(customZoom);
      expect(ZOOM_LEVEL_REGISTRY["test-zoom"]).toBeDefined();
      removeZoomLevel("test-zoom");
      expect(ZOOM_LEVEL_REGISTRY["test-zoom"]).toBeUndefined();
    });

    it("should get all zoom level IDs", () => {
      const ids = getZoomLevelIds();
      expect(ids).toContain("default-overview");
      expect(ids).toContain("site-detail");
    });

    it("should validate zoom level ID", () => {
      expect(isValidZoomLevel("default-overview")).toBe(true);
      expect(isValidZoomLevel("non-existent")).toBe(false);
    });

    it("should preserve all properties when updating", () => {
      registerZoomLevel(customZoom);
      updateZoomLevel("test-zoom", { zoom: 15 });
      const zoom = getZoomLevel("test-zoom");
      expect(zoom?.zoom).toBe(15);
      expect(zoom?.label).toBe("Test Zoom");
      expect(zoom?.context).toBe("custom");
      expect(zoom?.description).toBe("Test zoom level");
    });
  });

  // ============================================================================
  // Zoom Level Query Function Tests
  // ============================================================================

  describe("Zoom Level Query Functions", () => {
    it("should get all zoom levels", () => {
      const zoomLevels = getAllZoomLevels();
      expect(zoomLevels.length).toBeGreaterThanOrEqual(2);
      expect(zoomLevels.some((z) => z.id === "default-overview")).toBe(true);
      expect(zoomLevels.some((z) => z.id === "site-detail")).toBe(true);
    });

    it("should get zoom levels by context (overview)", () => {
      const overviewZooms = getZoomLevelsByContext("overview");
      expect(overviewZooms.length).toBeGreaterThan(0);
      overviewZooms.forEach((z) => {
        expect(z.context).toBe("overview");
      });
    });

    it("should get zoom levels by context (site)", () => {
      const siteZooms = getZoomLevelsByContext("site");
      expect(siteZooms.length).toBeGreaterThan(0);
      siteZooms.forEach((z) => {
        expect(z.context).toBe("site");
      });
    });

    it("should get label in English", () => {
      const label = getZoomLevelLabel("site-detail", "en");
      expect(label).toBe("Site Detail");
    });

    it("should get label in Arabic", () => {
      const label = getZoomLevelLabel("site-detail", "ar");
      expect(label).toBe("تفاصيل الموقع");
    });

    it("should fallback to English if Arabic not available", () => {
      const customZoom: ZoomLevelConfig = {
        id: "test-no-arabic",
        label: "Test No Arabic",
        zoom: 12,
        context: "custom",
      };
      registerZoomLevel(customZoom);
      const label = getZoomLevelLabel("test-no-arabic", "ar");
      expect(label).toBe("Test No Arabic");
      removeZoomLevel("test-no-arabic");
    });

    it("should return ID for non-existent zoom level", () => {
      const label = getZoomLevelLabel("non-existent", "en");
      expect(label).toBe("non-existent");
    });
  });

  // ============================================================================
  // Backward Compatibility Tests
  // ============================================================================

  describe("Backward Compatibility", () => {
    it("should export GAZA_CENTER constant", () => {
      expect(GAZA_CENTER).toBeDefined();
      expect(GAZA_CENTER).toEqual([31.42, 34.38]);
    });

    it("should export DEFAULT_ZOOM constant", () => {
      expect(DEFAULT_ZOOM).toBeDefined();
      expect(DEFAULT_ZOOM).toBe(10.5);
    });

    it("should export SITE_DETAIL_ZOOM constant", () => {
      expect(SITE_DETAIL_ZOOM).toBeDefined();
      expect(SITE_DETAIL_ZOOM).toBe(17);
    });

    it("GAZA_CENTER should match default viewport center", () => {
      const defaultViewport = getDefaultViewport();
      expect(GAZA_CENTER).toEqual(defaultViewport.center);
    });

    it("DEFAULT_ZOOM should match default-overview zoom", () => {
      const defaultZoom = getZoomLevel("default-overview");
      expect(DEFAULT_ZOOM).toBe(defaultZoom?.zoom);
    });

    it("SITE_DETAIL_ZOOM should match site-detail zoom", () => {
      const siteZoom = getZoomLevel("site-detail");
      expect(SITE_DETAIL_ZOOM).toBe(siteZoom?.zoom);
    });
  });

  // ============================================================================
  // Integration Tests
  // ============================================================================

  describe("Integration Tests", () => {
    it("should allow dynamic viewport switching", () => {
      const customViewport: MapViewportConfig = {
        id: "test-integration",
        label: "Test Integration",
        center: [31.5, 34.5],
        zoom: 13,
      };

      registerViewport(customViewport);
      const viewport = getViewport("test-integration");
      expect(viewport).toBeDefined();
      expect(viewport?.center).toEqual([31.5, 34.5]);
      expect(viewport?.zoom).toBe(13);

      removeViewport("test-integration");
    });

    it("should allow dynamic zoom level switching", () => {
      const customZoom: ZoomLevelConfig = {
        id: "test-integration",
        label: "Test Integration",
        zoom: 15,
        context: "custom",
      };

      registerZoomLevel(customZoom);
      const zoom = getZoomLevel("test-integration");
      expect(zoom).toBeDefined();
      expect(zoom?.zoom).toBe(15);

      removeZoomLevel("test-integration");
    });
  });
});
