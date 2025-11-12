/**
 * Filter Configuration Tests
 *
 * Focuses on testing complex filtering logic and integration.
 * Registry structure is validated by TypeScript.
 */

import { describe, it, expect } from "vitest";
import type { Site } from "../types";
import type { FilterState } from "../types/filterConfig";
import {
  getAllFilters,
  filterSites,
  countActiveFilters,
} from "./filters";

// ============================================================================
// Mock Data
// ============================================================================

const mockSites: Site[] = [
  {
    id: "site-1",
    name: "Ancient Mosque",
    nameArabic: "مسجد قديم",
    type: "mosque",
    yearBuilt: "800 BCE",
    coordinates: [31.5, 34.4],
    status: "destroyed",
    dateDestroyed: "2023-10-15",
    lastUpdated: "2024-01-01",
    description: "An ancient mosque",
    historicalSignificance: "Test significance",
    culturalValue: "Test value",
    verifiedBy: ["UNESCO"],
    sources: [],
  },
  {
    id: "site-2",
    name: "Historic Church",
    nameArabic: "كنيسة تاريخية",
    type: "church",
    yearBuilt: "5th century",
    coordinates: [31.52, 34.45],
    status: "heavily-damaged",
    dateDestroyed: "2023-11-20",
    lastUpdated: "2024-01-01",
    description: "A historic church",
    historicalSignificance: "Test significance",
    culturalValue: "Test value",
    verifiedBy: ["UNESCO"],
    sources: [],
  },
  {
    id: "site-3",
    name: "Archaeological Site",
    nameArabic: "موقع أثري",
    type: "archaeological",
    yearBuilt: "2000 BCE",
    coordinates: [31.51, 34.46],
    status: "damaged",
    dateDestroyed: "2024-01-10",
    lastUpdated: "2024-01-01",
    description: "An archaeological site",
    historicalSignificance: "Test significance",
    culturalValue: "Test value",
    verifiedBy: ["UNESCO"],
    sources: [],
  },
];

// ============================================================================
// Core Functionality Tests
// ============================================================================

describe("Filter System", () => {
  describe("getAllFilters", () => {
    it("returns filters sorted by order", () => {
      const filters = getAllFilters();
      expect(filters.length).toBeGreaterThan(0);

      for (let i = 1; i < filters.length; i++) {
        expect(filters[i].order).toBeGreaterThan(filters[i - 1].order);
      }
    });
  });

  describe("filterSites - Integration", () => {
    it("filters by type", () => {
      const filterState: FilterState = {
        search: "",
        type: ["mosque"],
        status: [],
        dateRange: { start: "", end: "" },
        yearBuilt: { min: null, max: null },
      };

      const filtered = filterSites(mockSites, filterState);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].type).toBe("mosque");
    });

    it("filters by status", () => {
      const filterState: FilterState = {
        search: "",
        type: [],
        status: ["destroyed"],
        dateRange: { start: "", end: "" },
        yearBuilt: { min: null, max: null },
      };

      const filtered = filterSites(mockSites, filterState);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].status).toBe("destroyed");
    });

    it("filters by search text", () => {
      const filterState: FilterState = {
        search: "church",
        type: [],
        status: [],
        dateRange: { start: "", end: "" },
        yearBuilt: { min: null, max: null },
      };

      const filtered = filterSites(mockSites, filterState);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toContain("Church");
    });

    it("filters by date range", () => {
      const filterState: FilterState = {
        search: "",
        type: [],
        status: [],
        dateRange: { start: "2023-10-01", end: "2023-10-31" },
        yearBuilt: { min: null, max: null },
      };

      const filtered = filterSites(mockSites, filterState);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].dateDestroyed).toBe("2023-10-15");
    });

    it("applies multiple filters (AND logic)", () => {
      const filterState: FilterState = {
        search: "mosque",
        type: ["mosque"],
        status: ["destroyed"],
        dateRange: { start: "", end: "" },
        yearBuilt: { min: null, max: null },
      };

      const filtered = filterSites(mockSites, filterState);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].type).toBe("mosque");
      expect(filtered[0].status).toBe("destroyed");
    });

    it("returns all sites when no filters active", () => {
      const filterState: FilterState = {
        search: "",
        type: [],
        status: [],
        dateRange: { start: "", end: "" },
        yearBuilt: { min: null, max: null },
      };

      const filtered = filterSites(mockSites, filterState);
      expect(filtered).toHaveLength(mockSites.length);
    });

    it("returns empty array when no sites match", () => {
      const filterState: FilterState = {
        search: "nonexistent",
        type: [],
        status: [],
        dateRange: { start: "", end: "" },
        yearBuilt: { min: null, max: null },
      };

      const filtered = filterSites(mockSites, filterState);
      expect(filtered).toHaveLength(0);
    });
  });

  describe("Multiple types filter", () => {
    it("filters by multiple types (OR logic)", () => {
      const filterState: FilterState = {
        search: "",
        type: ["mosque", "church"],
        status: [],
        dateRange: { start: "", end: "" },
        yearBuilt: { min: null, max: null },
      };

      const filtered = filterSites(mockSites, filterState);
      expect(filtered).toHaveLength(2);
      expect(filtered.every((s: Site) => s.type === "mosque" || s.type === "church")).toBe(true);
    });
  });

  describe("countActiveFilters", () => {
    it("counts zero when no filters active", () => {
      const filterState: FilterState = {
        search: "",
        type: [],
        status: [],
        dateRange: { start: "", end: "" },
        yearBuilt: { min: null, max: null },
      };

      expect(countActiveFilters(filterState)).toBe(0);
    });

    it("counts search filter", () => {
      const filterState: FilterState = {
        search: "test",
        type: [],
        status: [],
        dateRange: { start: "", end: "" },
        yearBuilt: { min: null, max: null },
      };

      expect(countActiveFilters(filterState)).toBe(1);
    });

    it("counts multiple active filters", () => {
      const filterState: FilterState = {
        search: "test",
        type: ["mosque"],
        status: ["destroyed"],
        dateRange: { start: "2023-01-01", end: "2023-12-31" },
        yearBuilt: { min: null, max: null },
      };

      expect(countActiveFilters(filterState)).toBe(4);
    });
  });
});
