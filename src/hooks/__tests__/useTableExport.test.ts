import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useTableExport } from "../useTableExport";
import * as exportFormats from "../../config/exportFormats";
import type { Site } from "../../types";

// Mock exportSites
vi.mock("../../config/exportFormats", async () => {
  const actual = await vi.importActual<typeof exportFormats>("../../config/exportFormats");
  return {
    ...actual,
    exportSites: vi.fn(),
  };
});

const mockExportSites = vi.mocked(exportFormats.exportSites);

// Mock sites for testing
const mockSites: Site[] = [
  {
    id: "site-1",
    name: "Al-Omari Mosque",
    nameArabic: "مسجد العمري الكبير",
    type: "mosque",
    yearBuilt: "1277",
    coordinates: [31.5203, 34.4668],
    status: "destroyed",
    dateDestroyed: "2023-12-07",
    lastUpdated: "2024-01-15",
    description: "Historic mosque",
    historicalSignificance: "Ancient mosque",
    culturalValue: "High value",
    verifiedBy: ["UNESCO"],
    sources: [],
  },
  {
    id: "site-2",
    name: "Byzantine Church",
    type: "church",
    yearBuilt: "425",
    coordinates: [31.5, 34.5],
    status: "severely_damaged",
    dateDestroyed: "2024-01-10",
    lastUpdated: "2024-01-20",
    description: "Ancient church",
    historicalSignificance: "Historic church",
    culturalValue: "High value",
    verifiedBy: ["UNESCO"],
    sources: [],
  },
];

describe("useTableExport", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful export by default
    mockExportSites.mockReturnValue({
      success: true,
      format: "csv",
      filename: "heritage-tracker-sites-2025-11-12.csv",
      siteCount: 2,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Export Triggering", () => {
    it("Test 1: Clicking export button triggers download", () => {
      const { result } = renderHook(() => useTableExport(mockSites));

      act(() => {
        result.current.handleExport();
      });

      expect(mockExportSites).toHaveBeenCalledWith({
        format: "csv",
        sites: mockSites,
      });
      expect(mockExportSites).toHaveBeenCalledTimes(1);
    });

    it("Test 2: Export uses selected format (CSV/JSON/GeoJSON)", () => {
      const { result } = renderHook(() => useTableExport(mockSites));

      // Test CSV format (default)
      act(() => {
        result.current.handleExport();
      });
      expect(mockExportSites).toHaveBeenCalledWith({
        format: "csv",
        sites: mockSites,
      });

      // Test JSON format
      act(() => {
        result.current.setSelectedExportFormat("json");
      });
      mockExportSites.mockReturnValue({
        success: true,
        format: "json",
        filename: "heritage-tracker-sites-2025-11-12.json",
        siteCount: 2,
      });
      act(() => {
        result.current.handleExport();
      });
      expect(mockExportSites).toHaveBeenCalledWith({
        format: "json",
        sites: mockSites,
      });

      // Test GeoJSON format
      act(() => {
        result.current.setSelectedExportFormat("geojson");
      });
      mockExportSites.mockReturnValue({
        success: true,
        format: "geojson",
        filename: "heritage-tracker-sites-2025-11-12.geojson",
        siteCount: 2,
      });
      act(() => {
        result.current.handleExport();
      });
      expect(mockExportSites).toHaveBeenCalledWith({
        format: "geojson",
        sites: mockSites,
      });
    });

    it("Test 3: Export includes only filtered sites (not all sites)", () => {
      const filteredSites = [mockSites[0]]; // Only one site
      const { result } = renderHook(() => useTableExport(filteredSites));

      act(() => {
        result.current.handleExport();
      });

      expect(mockExportSites).toHaveBeenCalledWith({
        format: "csv",
        sites: filteredSites,
      });
      expect(mockExportSites).toHaveBeenCalledTimes(1);
      // Verify only 1 site is exported, not all mockSites
      const callArgs = mockExportSites.mock.calls[0][0];
      expect(callArgs.sites).toHaveLength(1);
      expect(callArgs.sites[0].id).toBe("site-1");
    });
  });

  describe("Additional Tests (Behavior Verification)", () => {
    it("Returns export configs from getExportConfigs", () => {
      const { result } = renderHook(() => useTableExport(mockSites));

      // Verify exportConfigs is returned and contains expected formats
      expect(result.current.exportConfigs).toBeDefined();
      expect(Array.isArray(result.current.exportConfigs)).toBe(true);
      expect(result.current.exportConfigs.length).toBeGreaterThan(0);

      // Verify CSV config is present
      const csvConfig = result.current.exportConfigs.find((config) => config.id === "csv");
      expect(csvConfig).toBeDefined();
      expect(csvConfig?.fileExtension).toBe("csv");
    });

    it("Default export format is CSV", () => {
      const { result } = renderHook(() => useTableExport(mockSites));

      expect(result.current.selectedExportFormat).toBe("csv");
    });

    it("Can change export format multiple times", () => {
      const { result } = renderHook(() => useTableExport(mockSites));

      expect(result.current.selectedExportFormat).toBe("csv");

      act(() => {
        result.current.setSelectedExportFormat("json");
      });
      expect(result.current.selectedExportFormat).toBe("json");

      act(() => {
        result.current.setSelectedExportFormat("geojson");
      });
      expect(result.current.selectedExportFormat).toBe("geojson");

      act(() => {
        result.current.setSelectedExportFormat("csv");
      });
      expect(result.current.selectedExportFormat).toBe("csv");
    });

    it("Handles empty sites array gracefully", () => {
      const { result } = renderHook(() => useTableExport([]));

      mockExportSites.mockReturnValue({
        success: true,
        format: "csv",
        filename: "heritage-tracker-sites-2025-11-12.csv",
        siteCount: 0,
      });

      act(() => {
        result.current.handleExport();
      });

      expect(mockExportSites).toHaveBeenCalledWith({
        format: "csv",
        sites: [],
      });

      const returnValue = mockExportSites.mock.results[0].value;
      expect(returnValue.siteCount).toBe(0);
    });
  });
});
