/**
 * Tile Layer Registry Tests
 */

import { describe, it, expect, beforeEach } from "vitest";
import type { ExtendedTileLayerConfig } from "../types/tileLayerTypes";
import {
  TILE_LAYER_REGISTRY,
  registerTileLayer,
  getAllTileLayers,
  getTileLayer,
  getEnabledTileLayers,
  getDefaultTileLayer,
  getTileLayersByType,
  getTileLayersByProvider,
  isValidTileLayer,
  getTileLayerLabel,
  updateTileLayer,
  removeTileLayer,
  getTileLayerIds,
} from "./tileLayers";

// ============================================================================
// Registry Tests
// ============================================================================

describe("TILE_LAYER_REGISTRY", () => {
  it("should have default tile layers", () => {
    const layers = Object.keys(TILE_LAYER_REGISTRY);
    expect(layers.length).toBeGreaterThan(0);
  });

  it("should have OSM standard layer", () => {
    expect(TILE_LAYER_REGISTRY).toHaveProperty("osm-standard");
  });

  it("should have ESRI satellite layer", () => {
    expect(TILE_LAYER_REGISTRY).toHaveProperty("esri-world-imagery");
  });

  it("should have all required fields on each layer", () => {
    Object.values(TILE_LAYER_REGISTRY).forEach((layer) => {
      expect(layer.id).toBeTruthy();
      expect(layer.label).toBeTruthy();
      expect(layer.provider).toBeTruthy();
      expect(layer.type).toBeTruthy();
      expect(layer.url).toBeTruthy();
      expect(layer.attribution).toBeTruthy();
      expect(typeof layer.maxZoom).toBe("number");
      expect(typeof layer.order).toBe("number");
    });
  });

  it("should have unique IDs", () => {
    const ids = Object.keys(TILE_LAYER_REGISTRY);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("should have unique order values", () => {
    const orders = Object.values(TILE_LAYER_REGISTRY).map((l) => l.order);
    const uniqueOrders = new Set(orders);
    expect(uniqueOrders.size).toBe(orders.length);
  });

  it("should have at least one default layer", () => {
    const defaults = Object.values(TILE_LAYER_REGISTRY).filter(
      (l) => l.isDefault
    );
    expect(defaults.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// CRUD Operations
// ============================================================================

describe("registerTileLayer", () => {
  const testLayer: ExtendedTileLayerConfig = {
    id: "test-layer",
    label: "Test Layer",
    labelArabic: "طبقة اختبار",
    provider: "custom",
    type: "street",
    url: "https://test.example.com/{z}/{x}/{y}.png",
    attribution: "© Test",
    maxZoom: 18,
    order: 100,
  };

  beforeEach(() => {
    // Clean up test layer if it exists
    if (TILE_LAYER_REGISTRY["test-layer"]) {
      delete TILE_LAYER_REGISTRY["test-layer"];
    }
  });

  it("should register a new tile layer", () => {
    registerTileLayer(testLayer);
    expect(TILE_LAYER_REGISTRY["test-layer"]).toEqual(testLayer);
  });

  it("should overwrite existing layer with same ID", () => {
    registerTileLayer(testLayer);
    const updated = { ...testLayer, label: "Updated Label" };
    registerTileLayer(updated);
    expect(TILE_LAYER_REGISTRY["test-layer"].label).toBe("Updated Label");
  });
});

describe("getAllTileLayers", () => {
  it("should return all tile layers", () => {
    const layers = getAllTileLayers();
    expect(layers.length).toBeGreaterThan(0);
  });

  it("should return layers sorted by order", () => {
    const layers = getAllTileLayers();
    for (let i = 1; i < layers.length; i++) {
      expect(layers[i].order).toBeGreaterThan(layers[i - 1].order);
    }
  });

  it("should return array of ExtendedTileLayerConfig", () => {
    const layers = getAllTileLayers();
    layers.forEach((layer) => {
      expect(layer).toHaveProperty("id");
      expect(layer).toHaveProperty("type");
      expect(layer).toHaveProperty("url");
    });
  });
});

describe("getTileLayer", () => {
  it("should return layer by ID", () => {
    const layer = getTileLayer("osm-standard");
    expect(layer).toBeDefined();
    expect(layer?.id).toBe("osm-standard");
  });

  it("should return undefined for invalid ID", () => {
    const layer = getTileLayer("nonexistent");
    expect(layer).toBeUndefined();
  });
});

describe("getEnabledTileLayers", () => {
  it("should return only enabled layers", () => {
    const layers = getEnabledTileLayers();
    layers.forEach((layer) => {
      expect(layer.enabled).not.toBe(false);
    });
  });

  it("should return layers sorted by order", () => {
    const layers = getEnabledTileLayers();
    for (let i = 1; i < layers.length; i++) {
      expect(layers[i].order).toBeGreaterThan(layers[i - 1].order);
    }
  });
});

describe("getDefaultTileLayer", () => {
  it("should return the default layer", () => {
    const defaultLayer = getDefaultTileLayer();
    expect(defaultLayer).toBeDefined();
    expect(defaultLayer.isDefault).toBe(true);
  });

  it("should return OSM standard by default", () => {
    const defaultLayer = getDefaultTileLayer();
    expect(defaultLayer.id).toBe("osm-standard");
  });
});

// ============================================================================
// Query Functions
// ============================================================================

describe("getTileLayersByType", () => {
  it("should return layers of specified type", () => {
    const satelliteLayers = getTileLayersByType("satellite");
    satelliteLayers.forEach((layer) => {
      expect(layer.type).toBe("satellite");
    });
  });

  it("should return street layers", () => {
    const streetLayers = getTileLayersByType("street");
    expect(streetLayers.length).toBeGreaterThan(0);
    streetLayers.forEach((layer) => {
      expect(layer.type).toBe("street");
    });
  });

  it("should return empty array for nonexistent type", () => {
    const layers = getTileLayersByType("hybrid");
    expect(Array.isArray(layers)).toBe(true);
  });
});

describe("getTileLayersByProvider", () => {
  it("should return layers from specified provider", () => {
    const esriLayers = getTileLayersByProvider("esri");
    expect(esriLayers.length).toBeGreaterThan(0);
    esriLayers.forEach((layer) => {
      expect(layer.provider).toBe("esri");
    });
  });

  it("should return OpenStreetMap layers", () => {
    const osmLayers = getTileLayersByProvider("openstreetmap");
    expect(osmLayers.length).toBeGreaterThan(0);
  });

  it("should return empty array for nonexistent provider", () => {
    const layers = getTileLayersByProvider("nonexistent");
    expect(Array.isArray(layers)).toBe(true);
    expect(layers.length).toBe(0);
  });
});

describe("isValidTileLayer", () => {
  it("should return true for valid layer ID", () => {
    expect(isValidTileLayer("osm-standard")).toBe(true);
    expect(isValidTileLayer("esri-world-imagery")).toBe(true);
  });

  it("should return false for invalid layer ID", () => {
    expect(isValidTileLayer("nonexistent")).toBe(false);
    expect(isValidTileLayer("")).toBe(false);
  });
});

describe("getTileLayerLabel", () => {
  it("should return English label by default", () => {
    const label = getTileLayerLabel("osm-standard");
    expect(label).toBe("OpenStreetMap");
  });

  it("should return English label when locale is 'en'", () => {
    const label = getTileLayerLabel("osm-standard", "en");
    expect(label).toBe("OpenStreetMap");
  });

  it("should return Arabic label when locale is 'ar'", () => {
    const label = getTileLayerLabel("osm-standard", "ar");
    expect(label).toBe("خريطة الشارع المفتوحة");
  });

  it("should return layer ID for nonexistent layer", () => {
    const label = getTileLayerLabel("nonexistent");
    expect(label).toBe("nonexistent");
  });

  it("should fallback to English if Arabic not available", () => {
    // Some layers might not have Arabic labels
    const label = getTileLayerLabel("esri-topo", "ar");
    expect(typeof label).toBe("string");
  });
});

describe("getTileLayerIds", () => {
  it("should return array of all layer IDs", () => {
    const ids = getTileLayerIds();
    expect(Array.isArray(ids)).toBe(true);
    expect(ids.length).toBeGreaterThan(0);
  });

  it("should include osm-standard", () => {
    const ids = getTileLayerIds();
    expect(ids).toContain("osm-standard");
  });

  it("should include esri-world-imagery", () => {
    const ids = getTileLayerIds();
    expect(ids).toContain("esri-world-imagery");
  });
});

// ============================================================================
// Update/Delete Operations
// ============================================================================

describe("updateTileLayer", () => {
  beforeEach(() => {
    // Reset osm-standard to default
    const original = getAllTileLayers().find((l) => l.id === "osm-standard");
    if (original) {
      TILE_LAYER_REGISTRY["osm-standard"] = original;
    }
  });

  it("should update layer configuration", () => {
    updateTileLayer("osm-standard", { enabled: false });
    expect(TILE_LAYER_REGISTRY["osm-standard"].enabled).toBe(false);
  });

  it("should update multiple fields", () => {
    updateTileLayer("osm-standard", {
      label: "Updated OSM",
      maxZoom: 20,
    });
    expect(TILE_LAYER_REGISTRY["osm-standard"].label).toBe("Updated OSM");
    expect(TILE_LAYER_REGISTRY["osm-standard"].maxZoom).toBe(20);
  });

  it("should throw error for nonexistent layer", () => {
    expect(() => {
      updateTileLayer("nonexistent", { enabled: false });
    }).toThrow();
  });

  it("should preserve other fields when updating", () => {
    const originalUrl = TILE_LAYER_REGISTRY["osm-standard"].url;
    updateTileLayer("osm-standard", { label: "New Label" });
    expect(TILE_LAYER_REGISTRY["osm-standard"].url).toBe(originalUrl);
  });
});

describe("removeTileLayer", () => {
  beforeEach(() => {
    // Add test layer
    registerTileLayer({
      id: "temp-layer",
      label: "Temp Layer",
      provider: "custom",
      type: "street",
      url: "https://temp.example.com/{z}/{x}/{y}.png",
      attribution: "© Temp",
      maxZoom: 18,
      order: 999,
    });
  });

  it("should remove layer from registry", () => {
    expect(TILE_LAYER_REGISTRY["temp-layer"]).toBeDefined();
    removeTileLayer("temp-layer");
    expect(TILE_LAYER_REGISTRY["temp-layer"]).toBeUndefined();
  });

  it("should not throw error when removing nonexistent layer", () => {
    expect(() => {
      removeTileLayer("nonexistent");
    }).not.toThrow();
  });
});

// ============================================================================
// Integration Tests
// ============================================================================

describe("Integration: Full workflow", () => {
  const customLayer: ExtendedTileLayerConfig = {
    id: "custom-satellite",
    label: "Custom Satellite",
    labelArabic: "قمر صناعي مخصص",
    provider: "custom",
    type: "satellite",
    url: "https://custom.example.com/{z}/{x}/{y}.png",
    attribution: "© Custom Provider",
    maxZoom: 20,
    order: 10,
    enabled: true,
  };

  beforeEach(() => {
    // Clean up
    if (TILE_LAYER_REGISTRY["custom-satellite"]) {
      delete TILE_LAYER_REGISTRY["custom-satellite"];
    }
  });

  it("should support complete CRUD cycle", () => {
    // Create
    registerTileLayer(customLayer);
    expect(getTileLayer("custom-satellite")).toEqual(customLayer);

    // Read
    const allLayers = getAllTileLayers();
    expect(allLayers.some((l) => l.id === "custom-satellite")).toBe(true);

    // Update
    updateTileLayer("custom-satellite", { maxZoom: 22 });
    expect(getTileLayer("custom-satellite")?.maxZoom).toBe(22);

    // Delete
    removeTileLayer("custom-satellite");
    expect(getTileLayer("custom-satellite")).toBeUndefined();
  });

  it("should filter by type and provider", () => {
    registerTileLayer(customLayer);

    const satelliteLayers = getTileLayersByType("satellite");
    expect(satelliteLayers.some((l) => l.id === "custom-satellite")).toBe(true);

    const customLayers = getTileLayersByProvider("custom");
    expect(customLayers.some((l) => l.id === "custom-satellite")).toBe(true);

    // Cleanup
    removeTileLayer("custom-satellite");
  });
});

// ============================================================================
// Edge Cases
// ============================================================================

describe("Edge Cases", () => {
  it("should handle layer with minimal configuration", () => {
    const minimalLayer: ExtendedTileLayerConfig = {
      id: "minimal",
      label: "Minimal",
      provider: "custom",
      type: "street",
      url: "https://example.com/{z}/{x}/{y}.png",
      attribution: "© Example",
      maxZoom: 18,
      order: 999,
    };

    registerTileLayer(minimalLayer);
    const retrieved = getTileLayer("minimal");
    expect(retrieved).toEqual(minimalLayer);

    // Cleanup
    removeTileLayer("minimal");
  });

  it("should handle layer with all optional fields", () => {
    const fullLayer: ExtendedTileLayerConfig = {
      id: "full",
      label: "Full Layer",
      labelArabic: "طبقة كاملة",
      provider: "custom",
      type: "hybrid",
      url: "https://example.com/{z}/{x}/{y}.png",
      attribution: "© Example",
      maxZoom: 20,
      minZoom: 5,
      subdomains: ["a", "b"],
      isDefault: false,
      order: 100,
      enabled: true,
      description: "Full layer with all fields",
      apiKey: "test-key",
      languages: ["en", "ar"],
      region: "middle-east",
      leafletOptions: { crossOrigin: true },
    };

    registerTileLayer(fullLayer);
    expect(getTileLayer("full")).toEqual(fullLayer);

    // Cleanup
    removeTileLayer("full");
  });
});
