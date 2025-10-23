/**
 * Filter Configuration Tests
 */

import { describe, it, expect } from "vitest";
import type { GazaSite } from "../types";
import type { FilterState } from "../types/filterConfig";
import {
  FILTER_REGISTRY,
  getFilter,
  getAllFilters,
  getEnabledFilters,
  getFilterIds,
  isValidFilter,
  getFilterLabel,
  applyFilter,
  applyAllFilters,
  filterSites,
  getDefaultFilterState,
  resetFilter,
  resetAllFilters,
  countActiveFilters,
} from "./filters";

// ============================================================================
// Mock Data
// ============================================================================

const mockSite: GazaSite = {
  id: "test-mosque",
  name: "Test Mosque",
  nameArabic: "مسجد الاختبار",
  type: "mosque",
  yearBuilt: "800 BCE",
  coordinates: [31.5, 34.4],
  status: "destroyed",
  dateDestroyed: "2023-10-15",
  description: "A test mosque for unit testing",
};

const mockSites: GazaSite[] = [
  {
    id: "site-1",
    name: "Ancient Mosque",
    nameArabic: "مسجد قديم",
    type: "mosque",
    yearBuilt: "800 BCE",
    coordinates: [31.5, 34.4],
    status: "destroyed",
    dateDestroyed: "2023-10-15",
    description: "An ancient mosque",
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
    description: "A historic church",
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
    description: "An archaeological site",
  },
];

// ============================================================================
// Registry Tests
// ============================================================================

describe("FILTER_REGISTRY", () => {
  it("should have 5 filters", () => {
    expect(Object.keys(FILTER_REGISTRY).length).toBe(5);
  });

  it("should have all expected filter IDs", () => {
    expect(FILTER_REGISTRY).toHaveProperty("search");
    expect(FILTER_REGISTRY).toHaveProperty("type");
    expect(FILTER_REGISTRY).toHaveProperty("status");
    expect(FILTER_REGISTRY).toHaveProperty("dateRange");
    expect(FILTER_REGISTRY).toHaveProperty("yearBuilt");
  });

  it("should have correct filter types", () => {
    expect(FILTER_REGISTRY.search.type).toBe("text");
    expect(FILTER_REGISTRY.type.type).toBe("multi-select");
    expect(FILTER_REGISTRY.status.type).toBe("multi-select");
    expect(FILTER_REGISTRY.dateRange.type).toBe("date-range");
    expect(FILTER_REGISTRY.yearBuilt.type).toBe("year-range");
  });

  it("should have labels for all filters", () => {
    Object.values(FILTER_REGISTRY).forEach((filter) => {
      expect(filter.label).toBeTruthy();
    });
  });

  it("should have Arabic labels for all filters", () => {
    Object.values(FILTER_REGISTRY).forEach((filter) => {
      expect(filter.labelArabic).toBeTruthy();
    });
  });

  it("should have default values for all filters", () => {
    Object.values(FILTER_REGISTRY).forEach((filter) => {
      expect(filter.defaultValue).toBeDefined();
    });
  });

  it("should have filter functions for all filters", () => {
    Object.values(FILTER_REGISTRY).forEach((filter) => {
      expect(typeof filter.filterFn).toBe("function");
    });
  });

  it("should have order for all filters", () => {
    Object.values(FILTER_REGISTRY).forEach((filter) => {
      expect(typeof filter.order).toBe("number");
    });
  });

  it("should have unique order values", () => {
    const orders = Object.values(FILTER_REGISTRY).map((f) => f.order);
    const uniqueOrders = new Set(orders);
    expect(uniqueOrders.size).toBe(orders.length);
  });
});

// ============================================================================
// Helper Function Tests - CRUD Operations
// ============================================================================

describe("getFilter", () => {
  it("should return filter configuration by ID", () => {
    const filter = getFilter("search");
    expect(filter).toBeDefined();
    expect(filter?.id).toBe("search");
  });

  it("should return undefined for invalid ID", () => {
    const filter = getFilter("invalid" as unknown as typeof FILTER_REGISTRY[keyof typeof FILTER_REGISTRY]["id"]);
    expect(filter).toBeUndefined();
  });
});

describe("getAllFilters", () => {
  it("should return all filters", () => {
    const filters = getAllFilters();
    expect(filters.length).toBe(5);
  });

  it("should return filters sorted by order", () => {
    const filters = getAllFilters();
    for (let i = 1; i < filters.length; i++) {
      expect(filters[i].order).toBeGreaterThan(filters[i - 1].order);
    }
  });
});

describe("getEnabledFilters", () => {
  it("should return only enabled filters", () => {
    const filters = getEnabledFilters();
    filters.forEach((filter) => {
      expect(filter.enabled).not.toBe(false);
    });
  });

  it("should return all filters when all enabled", () => {
    const filters = getEnabledFilters();
    expect(filters.length).toBe(5);
  });
});

describe("getFilterIds", () => {
  it("should return array of filter IDs", () => {
    const filters = getAllFilters();
    const ids = getFilterIds(filters);
    expect(ids).toEqual(["search", "type", "status", "dateRange", "yearBuilt"]);
  });

  it("should return empty array for empty input", () => {
    const ids = getFilterIds([]);
    expect(ids).toEqual([]);
  });
});

describe("isValidFilter", () => {
  it("should return true for valid filter ID", () => {
    expect(isValidFilter("search")).toBe(true);
    expect(isValidFilter("type")).toBe(true);
  });

  it("should return false for invalid filter ID", () => {
    expect(isValidFilter("invalid")).toBe(false);
    expect(isValidFilter("")).toBe(false);
  });
});

describe("getFilterLabel", () => {
  it("should return English label by default", () => {
    expect(getFilterLabel("search")).toBe("Search");
  });

  it("should return English label when locale is 'en'", () => {
    expect(getFilterLabel("search", "en")).toBe("Search");
  });

  it("should return Arabic label when locale is 'ar'", () => {
    expect(getFilterLabel("search", "ar")).toBe("بحث");
  });

  it("should return filter ID for invalid filter", () => {
    expect(getFilterLabel("invalid" as unknown as typeof FILTER_REGISTRY[keyof typeof FILTER_REGISTRY]["id"])).toBe("invalid");
  });
});

// ============================================================================
// Filter Application Tests
// ============================================================================

describe("applyFilter - search", () => {
  it("should match site by name", () => {
    expect(applyFilter(mockSite, "search", "Test")).toBe(true);
    expect(applyFilter(mockSite, "search", "Mosque")).toBe(true);
  });

  it("should match site by Arabic name", () => {
    expect(applyFilter(mockSite, "search", "مسجد")).toBe(true);
  });

  it("should match site by description", () => {
    expect(applyFilter(mockSite, "search", "unit testing")).toBe(true);
  });

  it("should be case-insensitive", () => {
    expect(applyFilter(mockSite, "search", "TEST")).toBe(true);
    expect(applyFilter(mockSite, "search", "MOSQUE")).toBe(true);
  });

  it("should not match when search term not found", () => {
    expect(applyFilter(mockSite, "search", "church")).toBe(false);
  });

  it("should match all sites when search is empty", () => {
    expect(applyFilter(mockSite, "search", "")).toBe(true);
  });
});

describe("applyFilter - type", () => {
  it("should match when type is in array", () => {
    expect(applyFilter(mockSite, "type", ["mosque"])).toBe(true);
    expect(applyFilter(mockSite, "type", ["mosque", "church"])).toBe(true);
  });

  it("should not match when type is not in array", () => {
    expect(applyFilter(mockSite, "type", ["church"])).toBe(false);
  });

  it("should match all sites when array is empty", () => {
    expect(applyFilter(mockSite, "type", [])).toBe(true);
  });
});

describe("applyFilter - status", () => {
  it("should match when status is in array", () => {
    expect(applyFilter(mockSite, "status", ["destroyed"])).toBe(true);
    expect(applyFilter(mockSite, "status", ["destroyed", "damaged"])).toBe(true);
  });

  it("should not match when status is not in array", () => {
    expect(applyFilter(mockSite, "status", ["damaged"])).toBe(false);
  });

  it("should match all sites when array is empty", () => {
    expect(applyFilter(mockSite, "status", [])).toBe(true);
  });
});

describe("applyFilter - dateRange", () => {
  it("should match when date is within range", () => {
    expect(
      applyFilter(mockSite, "dateRange", {
        start: "2023-10-01",
        end: "2023-10-31",
      })
    ).toBe(true);
  });

  it("should match when date is after start date", () => {
    expect(
      applyFilter(mockSite, "dateRange", { start: "2023-10-01", end: "" })
    ).toBe(true);
  });

  it("should match when date is before end date", () => {
    expect(
      applyFilter(mockSite, "dateRange", { start: "", end: "2023-12-31" })
    ).toBe(true);
  });

  it("should not match when date is before start date", () => {
    expect(
      applyFilter(mockSite, "dateRange", { start: "2023-10-20", end: "" })
    ).toBe(false);
  });

  it("should not match when date is after end date", () => {
    expect(
      applyFilter(mockSite, "dateRange", { start: "", end: "2023-10-10" })
    ).toBe(false);
  });

  it("should match all sites when range is empty", () => {
    expect(applyFilter(mockSite, "dateRange", { start: "", end: "" })).toBe(
      true
    );
  });

  it("should match sites without dateDestroyed", () => {
    const siteWithoutDate: GazaSite = { ...mockSite, dateDestroyed: undefined };
    expect(
      applyFilter(siteWithoutDate, "dateRange", {
        start: "2023-10-01",
        end: "2023-10-31",
      })
    ).toBe(true);
  });
});

describe("applyFilter - yearBuilt", () => {
  it("should match when year is within range", () => {
    expect(applyFilter(mockSite, "yearBuilt", { min: -1000, max: -500 })).toBe(
      true
    );
  });

  it("should match when year is after min", () => {
    expect(applyFilter(mockSite, "yearBuilt", { min: -1000, max: null })).toBe(
      true
    );
  });

  it("should match when year is before max", () => {
    expect(applyFilter(mockSite, "yearBuilt", { min: null, max: 2000 })).toBe(
      true
    );
  });

  it("should not match when year is before min", () => {
    expect(applyFilter(mockSite, "yearBuilt", { min: -500, max: null })).toBe(
      false
    );
  });

  it("should not match when year is after max", () => {
    expect(applyFilter(mockSite, "yearBuilt", { min: null, max: -1000 })).toBe(
      false
    );
  });

  it("should match all sites when range is null", () => {
    expect(applyFilter(mockSite, "yearBuilt", { min: null, max: null })).toBe(
      true
    );
  });
});

// ============================================================================
// Filter State Tests
// ============================================================================

describe("applyAllFilters", () => {
  it("should match site when all filters pass", () => {
    const filterState: FilterState = {
      search: "mosque",
      type: ["mosque"],
      status: ["destroyed"],
      dateRange: { start: "2023-10-01", end: "2023-10-31" },
      yearBuilt: { min: -1000, max: 2000 },
    };
    expect(applyAllFilters(mockSite, filterState)).toBe(true);
  });

  it("should not match site when any filter fails", () => {
    const filterState: FilterState = {
      search: "mosque",
      type: ["church"], // This will fail
      status: ["destroyed"],
      dateRange: { start: "", end: "" },
      yearBuilt: { min: null, max: null },
    };
    expect(applyAllFilters(mockSite, filterState)).toBe(false);
  });

  it("should match site with default filter state", () => {
    const filterState = getDefaultFilterState();
    expect(applyAllFilters(mockSite, filterState)).toBe(true);
  });
});

describe("filterSites", () => {
  it("should filter sites by search", () => {
    const filterState: FilterState = {
      search: "mosque",
      type: [],
      status: [],
      dateRange: { start: "", end: "" },
      yearBuilt: { min: null, max: null },
    };
    const filtered = filterSites(mockSites, filterState);
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe("site-1");
  });

  it("should filter sites by type", () => {
    const filterState: FilterState = {
      search: "",
      type: ["mosque", "church"],
      status: [],
      dateRange: { start: "", end: "" },
      yearBuilt: { min: null, max: null },
    };
    const filtered = filterSites(mockSites, filterState);
    expect(filtered.length).toBe(2);
  });

  it("should filter sites by status", () => {
    const filterState: FilterState = {
      search: "",
      type: [],
      status: ["destroyed"],
      dateRange: { start: "", end: "" },
      yearBuilt: { min: null, max: null },
    };
    const filtered = filterSites(mockSites, filterState);
    expect(filtered.length).toBe(1);
    expect(filtered[0].status).toBe("destroyed");
  });

  it("should filter sites by date range", () => {
    const filterState: FilterState = {
      search: "",
      type: [],
      status: [],
      dateRange: { start: "2023-11-01", end: "2023-12-31" },
      yearBuilt: { min: null, max: null },
    };
    const filtered = filterSites(mockSites, filterState);
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe("site-2");
  });

  it("should filter sites by year built", () => {
    const filterState: FilterState = {
      search: "",
      type: [],
      status: [],
      dateRange: { start: "", end: "" },
      yearBuilt: { min: -3000, max: -1000 },
    };
    const filtered = filterSites(mockSites, filterState);
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe("site-3"); // 2000 BCE
  });

  it("should combine multiple filters", () => {
    const filterState: FilterState = {
      search: "",
      type: ["mosque", "church"],
      status: ["destroyed", "heavily-damaged"],
      dateRange: { start: "", end: "" },
      yearBuilt: { min: null, max: null },
    };
    const filtered = filterSites(mockSites, filterState);
    expect(filtered.length).toBe(2);
  });

  it("should return all sites with default state", () => {
    const filterState = getDefaultFilterState();
    const filtered = filterSites(mockSites, filterState);
    expect(filtered.length).toBe(3);
  });
});

// ============================================================================
// Filter State Management Tests
// ============================================================================

describe("getDefaultFilterState", () => {
  it("should return default values for all filters", () => {
    const state = getDefaultFilterState();
    expect(state.search).toBe("");
    expect(state.type).toEqual([]);
    expect(state.status).toEqual([]);
    expect(state.dateRange).toEqual({ start: "", end: "" });
    expect(state.yearBuilt).toEqual({ min: null, max: null });
  });
});

describe("resetFilter", () => {
  it("should reset specific filter to default", () => {
    const currentState: FilterState = {
      search: "mosque",
      type: ["mosque"],
      status: [],
      dateRange: { start: "", end: "" },
      yearBuilt: { min: null, max: null },
    };
    const newState = resetFilter("search", currentState);
    expect(newState.search).toBe("");
    expect(newState.type).toEqual(["mosque"]); // Other filters unchanged
  });

  it("should return same state for invalid filter", () => {
    const currentState = getDefaultFilterState();
    const newState = resetFilter(
      "invalid" as unknown as typeof FILTER_REGISTRY[keyof typeof FILTER_REGISTRY]["id"],
      currentState
    );
    expect(newState).toEqual(currentState);
  });
});

describe("resetAllFilters", () => {
  it("should reset all filters to default", () => {
    const resetState = resetAllFilters();
    const defaultState = getDefaultFilterState();
    expect(resetState).toEqual(defaultState);
  });
});

describe("countActiveFilters", () => {
  it("should return 0 for default state", () => {
    const state = getDefaultFilterState();
    expect(countActiveFilters(state)).toBe(0);
  });

  it("should count text filter", () => {
    const state: FilterState = {
      search: "mosque",
      type: [],
      status: [],
      dateRange: { start: "", end: "" },
      yearBuilt: { min: null, max: null },
    };
    expect(countActiveFilters(state)).toBe(1);
  });

  it("should count multi-select filters", () => {
    const state: FilterState = {
      search: "",
      type: ["mosque"],
      status: ["destroyed"],
      dateRange: { start: "", end: "" },
      yearBuilt: { min: null, max: null },
    };
    expect(countActiveFilters(state)).toBe(2);
  });

  it("should count date range filter", () => {
    const state: FilterState = {
      search: "",
      type: [],
      status: [],
      dateRange: { start: "2023-10-01", end: "" },
      yearBuilt: { min: null, max: null },
    };
    expect(countActiveFilters(state)).toBe(1);
  });

  it("should count year range filter", () => {
    const state: FilterState = {
      search: "",
      type: [],
      status: [],
      dateRange: { start: "", end: "" },
      yearBuilt: { min: -1000, max: null },
    };
    expect(countActiveFilters(state)).toBe(1);
  });

  it("should count all active filters", () => {
    const state: FilterState = {
      search: "mosque",
      type: ["mosque"],
      status: ["destroyed"],
      dateRange: { start: "2023-10-01", end: "" },
      yearBuilt: { min: -1000, max: null },
    };
    expect(countActiveFilters(state)).toBe(5);
  });
});

// ============================================================================
// Edge Cases & Integration Tests
// ============================================================================

describe("Edge Cases", () => {
  it("should handle sites with missing optional fields", () => {
    const minimalSite: GazaSite = {
      id: "minimal",
      name: "Minimal Site",
      type: "mosque",
      yearBuilt: "1950",
      coordinates: [31.5, 34.4],
      status: "destroyed",
    };

    const filterState: FilterState = {
      search: "Minimal",
      type: ["mosque"],
      status: ["destroyed"],
      dateRange: { start: "", end: "" },
      yearBuilt: { min: 1900, max: 2000 },
    };

    expect(applyAllFilters(minimalSite, filterState)).toBe(true);
  });

  it("should handle unparseable yearBuilt", () => {
    const siteWithInvalidYear: GazaSite = {
      ...mockSite,
      yearBuilt: "unknown date",
    };

    // Should include site when yearBuilt is unparseable
    expect(
      applyFilter(siteWithInvalidYear, "yearBuilt", { min: 1000, max: 2000 })
    ).toBe(true);
  });

  it("should handle empty sites array", () => {
    const filterState = getDefaultFilterState();
    const filtered = filterSites([], filterState);
    expect(filtered).toEqual([]);
  });

  it("should handle filter with all sites excluded", () => {
    const filterState: FilterState = {
      search: "nonexistent",
      type: [],
      status: [],
      dateRange: { start: "", end: "" },
      yearBuilt: { min: null, max: null },
    };
    const filtered = filterSites(mockSites, filterState);
    expect(filtered).toEqual([]);
  });
});
