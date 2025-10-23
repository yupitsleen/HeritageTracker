/**
 * Tests for Export Format Registry
 *
 * Comprehensive test coverage for:
 * - Built-in exporters (CSV, JSON, GeoJSON)
 * - Registry CRUD operations
 * - Export functionality
 * - Browser download triggering
 * - Error handling
 * - Extensibility
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import type { GazaSite } from "../types";
import type { Exporter } from "../types/export";
import {
  registerExportFormat,
  getExportFormats,
  getExportConfigs,
  getExportConfig,
  getExporter,
  isFormatRegistered,
  exportToFormat,
  exportSites,
} from "./exportFormats";

// Mock sites for testing
const mockSites: GazaSite[] = [
  {
    id: "1",
    type: "mosque",
    name: "Great Omari Mosque",
    nameArabic: "الجامع العمري الكبير",
    yearBuilt: "7th century",
    coordinates: [31.5167, 34.4667],
    status: "destroyed",
    dateDestroyed: "2023-12-07",
    description: "Historic mosque from early Islamic period",
    verifiedBy: ["UNESCO", "Local Authority"],
  },
  {
    id: "2",
    type: "church",
    name: "Saint Porphyrius Church",
    coordinates: [31.5069, 34.4561],
    yearBuilt: "425",
    status: "heavily-damaged",
    dateDestroyed: "2023-10-19",
  },
];

describe("Export Format Registry", () => {
  describe("Default Formats", () => {
    it("should have 3 default formats registered", () => {
      const formats = getExportFormats();
      expect(formats).toHaveLength(3);
    });

    it("should include CSV format", () => {
      const config = getExportConfig("csv");
      expect(config).toBeDefined();
      expect(config?.label).toBe("CSV");
      expect(config?.fileExtension).toBe("csv");
      expect(config?.mimeType).toBe("text/csv");
    });

    it("should include JSON format", () => {
      const config = getExportConfig("json");
      expect(config).toBeDefined();
      expect(config?.label).toBe("JSON");
      expect(config?.fileExtension).toBe("json");
      expect(config?.mimeType).toBe("application/json");
    });

    it("should include GeoJSON format", () => {
      const config = getExportConfig("geojson");
      expect(config).toBeDefined();
      expect(config?.label).toBe("GeoJSON");
      expect(config?.fileExtension).toBe("geojson");
      expect(config?.mimeType).toBe("application/geo+json");
    });
  });

  describe("Registry Functions", () => {
    it("should check if format is registered", () => {
      expect(isFormatRegistered("csv")).toBe(true);
      expect(isFormatRegistered("json")).toBe(true);
      expect(isFormatRegistered("geojson")).toBe(true);
      expect(isFormatRegistered("kml")).toBe(false);
    });

    it("should get all export configs", () => {
      const configs = getExportConfigs();
      expect(configs).toHaveLength(3);
      expect(configs.every((c) => c.id && c.label && c.fileExtension)).toBe(true);
    });

    it("should return undefined for non-existent format", () => {
      const config = getExportConfig("nonexistent");
      expect(config).toBeUndefined();

      const exporter = getExporter("nonexistent");
      expect(exporter).toBeUndefined();
    });
  });

  describe("CSV Export", () => {
    it("should export sites as CSV", () => {
      const csv = exportToFormat(mockSites, "csv");

      expect(csv).toContain("Name,Name (Arabic),Type,Status");
      expect(csv).toContain("Great Omari Mosque");
      expect(csv).toContain("الجامع العمري الكبير");
      expect(csv).toContain("mosque");
      expect(csv).toContain("destroyed");
    });

    it("should escape CSV fields correctly", () => {
      const csv = exportToFormat(mockSites, "csv");

      // Coordinates should always be quoted (contain comma)
      expect(csv).toContain('"31.5167, 34.4667"');
      expect(csv).toContain('"31.5069, 34.4561"');

      // Verified by with semicolon delimiter (multiple values)
      expect(csv).toContain("UNESCO; Local Authority");
    });

    it("should handle empty sites array", () => {
      const csv = exportToFormat([], "csv");
      expect(csv).toContain("Name,Name (Arabic)");
      expect(csv.split("\n")).toHaveLength(1); // Only headers
    });
  });

  describe("JSON Export", () => {
    it("should export sites as JSON with metadata", () => {
      const json = exportToFormat(mockSites, "json");
      const parsed = JSON.parse(json);

      expect(parsed.metadata).toBeDefined();
      expect(parsed.metadata.title).toBe("Gaza Heritage Sites");
      expect(parsed.metadata.siteCount).toBe(2);
      expect(parsed.sites).toHaveLength(2);
    });

    it("should include all site fields", () => {
      const json = exportToFormat(mockSites, "json");
      const parsed = JSON.parse(json);

      expect(parsed.sites[0].id).toBe("1");
      expect(parsed.sites[0].name).toBe("Great Omari Mosque");
      expect(parsed.sites[0].type).toBe("mosque");
      expect(parsed.sites[0].coordinates).toEqual([31.5167, 34.4667]);
    });

    it("should handle empty sites array", () => {
      const json = exportToFormat([], "json");
      const parsed = JSON.parse(json);

      expect(parsed.metadata.siteCount).toBe(0);
      expect(parsed.sites).toEqual([]);
    });
  });

  describe("GeoJSON Export", () => {
    it("should export sites as valid GeoJSON", () => {
      const geojson = exportToFormat(mockSites, "geojson");
      const parsed = JSON.parse(geojson);

      expect(parsed.type).toBe("FeatureCollection");
      expect(parsed.features).toHaveLength(2);
    });

    it("should convert coordinates from Leaflet to GeoJSON format", () => {
      const geojson = exportToFormat(mockSites, "geojson");
      const parsed = JSON.parse(geojson);

      // Leaflet: [lat, lng] → GeoJSON: [lng, lat]
      expect(parsed.features[0].geometry.coordinates).toEqual([34.4667, 31.5167]);
    });

    it("should include all properties", () => {
      const geojson = exportToFormat(mockSites, "geojson");
      const parsed = JSON.parse(geojson);

      const props = parsed.features[0].properties;
      expect(props.id).toBe("1");
      expect(props.name).toBe("Great Omari Mosque");
      expect(props.nameArabic).toBe("الجامع العمري الكبير");
      expect(props.type).toBe("mosque");
      expect(props.status).toBe("destroyed");
    });

    it("should include metadata", () => {
      const geojson = exportToFormat(mockSites, "geojson");
      const parsed = JSON.parse(geojson);

      expect(parsed.metadata).toBeDefined();
      expect(parsed.metadata.title).toBe("Gaza Heritage Sites");
      expect(parsed.metadata.siteCount).toBe(2);
      expect(parsed.metadata.generated).toBeDefined();
    });

    it("should handle empty sites array", () => {
      const geojson = exportToFormat([], "geojson");
      const parsed = JSON.parse(geojson);

      expect(parsed.type).toBe("FeatureCollection");
      expect(parsed.features).toEqual([]);
      expect(parsed.metadata.siteCount).toBe(0);
    });
  });

  describe("Export Registry Extension", () => {
    beforeEach(() => {
      // Clean up any custom formats from previous tests
      // Note: In production, registry would persist, but for tests we want isolation
    });

    it("should allow registering custom export format", () => {
      const customExporter: Exporter = {
        config: {
          id: "kml",
          label: "KML",
          fileExtension: "kml",
          mimeType: "application/vnd.google-earth.kml+xml",
          description: "Google Earth format",
        },
        export: (sites) => `<kml>${sites.length} sites</kml>`,
      };

      registerExportFormat(customExporter);

      expect(isFormatRegistered("kml")).toBe(true);
      const config = getExportConfig("kml");
      expect(config?.label).toBe("KML");
    });

    it("should use custom export function", () => {
      const customExporter: Exporter = {
        config: {
          id: "xml",
          label: "XML",
          fileExtension: "xml",
          mimeType: "application/xml",
        },
        export: (sites) => `<sites count="${sites.length}"></sites>`,
      };

      registerExportFormat(customExporter);

      const xml = exportToFormat(mockSites, "xml");
      expect(xml).toBe('<sites count="2"></sites>');
    });
  });

  describe("Error Handling", () => {
    it("should throw error for non-existent format", () => {
      expect(() => exportToFormat(mockSites, "nonexistent")).toThrow(
        "Export format 'nonexistent' not found in registry"
      );
    });

    it("should return error result when export fails", () => {
      const result = exportSites({
        format: "nonexistent",
        sites: mockSites,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Export format 'nonexistent' not found");
    });
  });

  describe("Browser Download", () => {
    beforeEach(() => {
      // Mock DOM APIs
      document.body.appendChild = vi.fn();
      document.body.removeChild = vi.fn();
      global.URL.createObjectURL = vi.fn(() => "blob:mock-url");
      global.URL.revokeObjectURL = vi.fn();
    });

    it("should trigger browser download", () => {
      const result = exportSites({
        format: "csv",
        sites: mockSites,
      });

      expect(result.success).toBe(true);
      expect(result.format).toBe("csv");
      expect(result.siteCount).toBe(2);
      expect(result.filename).toMatch(/heritage-tracker-sites-.*\.csv/);
    });

    it("should use custom filename if provided", () => {
      const result = exportSites({
        format: "json",
        sites: mockSites,
        filename: "my-custom-export.json",
      });

      expect(result.success).toBe(true);
      expect(result.filename).toBe("my-custom-export.json");
    });

    it("should generate timestamped filename by default", () => {
      const result = exportSites({
        format: "geojson",
        sites: mockSites,
      });

      expect(result.success).toBe(true);
      expect(result.filename).toMatch(/heritage-tracker-sites-\d{4}-\d{2}-\d{2}\.geojson/);
    });
  });

  describe("Internationalization", () => {
    it("should include Arabic labels in configs", () => {
      const csv = getExportConfig("csv");
      const json = getExportConfig("json");
      const geojson = getExportConfig("geojson");

      expect(csv?.labelArabic).toBe("سي إس في");
      expect(json?.labelArabic).toBe("جيسون");
      expect(geojson?.labelArabic).toBe("جيو جيسون");
    });
  });

  describe("Recommendations", () => {
    it("should mark GeoJSON as recommended for GIS", () => {
      const config = getExportConfig("geojson");
      expect(config?.recommended?.gis).toBe(true);
    });

    it("should mark CSV as recommended for analysis", () => {
      const config = getExportConfig("csv");
      expect(config?.recommended?.analysis).toBe(true);
    });

    it("should mark JSON as recommended for API", () => {
      const config = getExportConfig("json");
      expect(config?.recommended?.api).toBe(true);
    });
  });
});
