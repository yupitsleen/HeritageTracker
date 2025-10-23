/**
 * Filter State Adapter Tests
 */

import { describe, it, expect } from "vitest";
import type { GazaSite } from "../types";
import type { FilterState as LegacyFilterState } from "../types/filters";
import type { FilterState as RegistryFilterState } from "../types/filterConfig";
import {
  legacyToRegistryState,
  registryToLegacyState,
  filterSitesWithLegacyState,
  countActiveFiltersLegacy,
  getDefaultLegacyState,
  isLegacyStateEmpty,
} from "./filterStateAdapter";

// ============================================================================
// Mock Data
// ============================================================================

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

const emptyLegacyState: LegacyFilterState = {
  searchTerm: "",
  selectedTypes: [],
  selectedStatuses: [],
  destructionDateStart: null,
  destructionDateEnd: null,
  creationYearStart: null,
  creationYearEnd: null,
};

const populatedLegacyState: LegacyFilterState = {
  searchTerm: "mosque",
  selectedTypes: ["mosque", "church"],
  selectedStatuses: ["destroyed"],
  destructionDateStart: new Date("2023-10-01"),
  destructionDateEnd: new Date("2023-12-31"),
  creationYearStart: -1000,
  creationYearEnd: 2000,
};

// ============================================================================
// Conversion Tests
// ============================================================================

describe("legacyToRegistryState", () => {
  it("should convert empty legacy state to empty registry state", () => {
    const result = legacyToRegistryState(emptyLegacyState);

    expect(result.search).toBe("");
    expect(result.type).toEqual([]);
    expect(result.status).toEqual([]);
    expect(result.dateRange).toEqual({ start: "", end: "" });
    expect(result.yearBuilt).toEqual({ min: null, max: null });
  });

  it("should convert search term", () => {
    const state: LegacyFilterState = {
      ...emptyLegacyState,
      searchTerm: "test search",
    };
    const result = legacyToRegistryState(state);

    expect(result.search).toBe("test search");
  });

  it("should convert selected types", () => {
    const state: LegacyFilterState = {
      ...emptyLegacyState,
      selectedTypes: ["mosque", "church"],
    };
    const result = legacyToRegistryState(state);

    expect(result.type).toEqual(["mosque", "church"]);
  });

  it("should convert selected statuses", () => {
    const state: LegacyFilterState = {
      ...emptyLegacyState,
      selectedStatuses: ["destroyed", "damaged"],
    };
    const result = legacyToRegistryState(state);

    expect(result.status).toEqual(["destroyed", "damaged"]);
  });

  it("should convert destruction date range", () => {
    const state: LegacyFilterState = {
      ...emptyLegacyState,
      destructionDateStart: new Date("2023-10-01"),
      destructionDateEnd: new Date("2023-12-31"),
    };
    const result = legacyToRegistryState(state);

    expect(result.dateRange).toEqual({
      start: "2023-10-01",
      end: "2023-12-31",
    });
  });

  it("should convert partial destruction date range (start only)", () => {
    const state: LegacyFilterState = {
      ...emptyLegacyState,
      destructionDateStart: new Date("2023-10-01"),
      destructionDateEnd: null,
    };
    const result = legacyToRegistryState(state);

    expect(result.dateRange).toEqual({
      start: "2023-10-01",
      end: "",
    });
  });

  it("should convert partial destruction date range (end only)", () => {
    const state: LegacyFilterState = {
      ...emptyLegacyState,
      destructionDateStart: null,
      destructionDateEnd: new Date("2023-12-31"),
    };
    const result = legacyToRegistryState(state);

    expect(result.dateRange).toEqual({
      start: "",
      end: "2023-12-31",
    });
  });

  it("should convert creation year range", () => {
    const state: LegacyFilterState = {
      ...emptyLegacyState,
      creationYearStart: -800,
      creationYearEnd: 1950,
    };
    const result = legacyToRegistryState(state);

    expect(result.yearBuilt).toEqual({
      min: -800,
      max: 1950,
    });
  });

  it("should convert partial year range (min only)", () => {
    const state: LegacyFilterState = {
      ...emptyLegacyState,
      creationYearStart: -800,
      creationYearEnd: null,
    };
    const result = legacyToRegistryState(state);

    expect(result.yearBuilt).toEqual({
      min: -800,
      max: null,
    });
  });

  it("should convert fully populated legacy state", () => {
    const result = legacyToRegistryState(populatedLegacyState);

    expect(result.search).toBe("mosque");
    expect(result.type).toEqual(["mosque", "church"]);
    expect(result.status).toEqual(["destroyed"]);
    expect(result.dateRange).toEqual({
      start: "2023-10-01",
      end: "2023-12-31",
    });
    expect(result.yearBuilt).toEqual({
      min: -1000,
      max: 2000,
    });
  });
});

describe("registryToLegacyState", () => {
  it("should convert empty registry state to empty legacy state", () => {
    const registryState: RegistryFilterState = {
      search: "",
      type: [],
      status: [],
      dateRange: { start: "", end: "" },
      yearBuilt: { min: null, max: null },
    };
    const result = registryToLegacyState(registryState);

    expect(result.searchTerm).toBe("");
    expect(result.selectedTypes).toEqual([]);
    expect(result.selectedStatuses).toEqual([]);
    expect(result.destructionDateStart).toBeNull();
    expect(result.destructionDateEnd).toBeNull();
    expect(result.creationYearStart).toBeNull();
    expect(result.creationYearEnd).toBeNull();
  });

  it("should convert search term", () => {
    const registryState: RegistryFilterState = {
      search: "test search",
      type: [],
      status: [],
      dateRange: { start: "", end: "" },
      yearBuilt: { min: null, max: null },
    };
    const result = registryToLegacyState(registryState);

    expect(result.searchTerm).toBe("test search");
  });

  it("should convert type filter", () => {
    const registryState: RegistryFilterState = {
      search: "",
      type: ["mosque", "church"],
      status: [],
      dateRange: { start: "", end: "" },
      yearBuilt: { min: null, max: null },
    };
    const result = registryToLegacyState(registryState);

    expect(result.selectedTypes).toEqual(["mosque", "church"]);
  });

  it("should convert status filter", () => {
    const registryState: RegistryFilterState = {
      search: "",
      type: [],
      status: ["destroyed", "damaged"],
      dateRange: { start: "", end: "" },
      yearBuilt: { min: null, max: null },
    };
    const result = registryToLegacyState(registryState);

    expect(result.selectedStatuses).toEqual(["destroyed", "damaged"]);
  });

  it("should convert date range", () => {
    const registryState: RegistryFilterState = {
      search: "",
      type: [],
      status: [],
      dateRange: { start: "2023-10-01", end: "2023-12-31" },
      yearBuilt: { min: null, max: null },
    };
    const result = registryToLegacyState(registryState);

    expect(result.destructionDateStart).toEqual(new Date("2023-10-01"));
    expect(result.destructionDateEnd).toEqual(new Date("2023-12-31"));
  });

  it("should convert partial date range (start only)", () => {
    const registryState: RegistryFilterState = {
      search: "",
      type: [],
      status: [],
      dateRange: { start: "2023-10-01", end: "" },
      yearBuilt: { min: null, max: null },
    };
    const result = registryToLegacyState(registryState);

    expect(result.destructionDateStart).toEqual(new Date("2023-10-01"));
    expect(result.destructionDateEnd).toBeNull();
  });

  it("should convert year range", () => {
    const registryState: RegistryFilterState = {
      search: "",
      type: [],
      status: [],
      dateRange: { start: "", end: "" },
      yearBuilt: { min: -800, max: 1950 },
    };
    const result = registryToLegacyState(registryState);

    expect(result.creationYearStart).toBe(-800);
    expect(result.creationYearEnd).toBe(1950);
  });
});

describe("Round-trip conversion", () => {
  it("should maintain data through legacy→registry→legacy conversion", () => {
    const original = populatedLegacyState;
    const registry = legacyToRegistryState(original);
    const backToLegacy = registryToLegacyState(registry);

    expect(backToLegacy.searchTerm).toBe(original.searchTerm);
    expect(backToLegacy.selectedTypes).toEqual(original.selectedTypes);
    expect(backToLegacy.selectedStatuses).toEqual(original.selectedStatuses);
    expect(backToLegacy.destructionDateStart?.getTime()).toBe(
      original.destructionDateStart?.getTime()
    );
    expect(backToLegacy.destructionDateEnd?.getTime()).toBe(
      original.destructionDateEnd?.getTime()
    );
    expect(backToLegacy.creationYearStart).toBe(original.creationYearStart);
    expect(backToLegacy.creationYearEnd).toBe(original.creationYearEnd);
  });
});

// ============================================================================
// Filtering Tests
// ============================================================================

describe("filterSitesWithLegacyState", () => {
  it("should filter sites using empty legacy state (return all)", () => {
    const result = filterSitesWithLegacyState(mockSites, emptyLegacyState);
    expect(result.length).toBe(3);
  });

  it("should filter sites by search term", () => {
    const state: LegacyFilterState = {
      ...emptyLegacyState,
      searchTerm: "mosque",
    };
    const result = filterSitesWithLegacyState(mockSites, state);

    expect(result.length).toBe(1);
    expect(result[0].id).toBe("site-1");
  });

  it("should filter sites by type", () => {
    const state: LegacyFilterState = {
      ...emptyLegacyState,
      selectedTypes: ["mosque", "church"],
    };
    const result = filterSitesWithLegacyState(mockSites, state);

    expect(result.length).toBe(2);
  });

  it("should filter sites by status", () => {
    const state: LegacyFilterState = {
      ...emptyLegacyState,
      selectedStatuses: ["destroyed"],
    };
    const result = filterSitesWithLegacyState(mockSites, state);

    expect(result.length).toBe(1);
    expect(result[0].status).toBe("destroyed");
  });

  it("should filter sites by destruction date range", () => {
    const state: LegacyFilterState = {
      ...emptyLegacyState,
      destructionDateStart: new Date("2023-11-01"),
      destructionDateEnd: new Date("2023-12-31"),
    };
    const result = filterSitesWithLegacyState(mockSites, state);

    expect(result.length).toBe(1);
    expect(result[0].id).toBe("site-2");
  });

  it("should filter sites by year built range", () => {
    const state: LegacyFilterState = {
      ...emptyLegacyState,
      creationYearStart: -3000,
      creationYearEnd: -1000,
    };
    const result = filterSitesWithLegacyState(mockSites, state);

    expect(result.length).toBe(1);
    expect(result[0].id).toBe("site-3"); // 2000 BCE
  });

  it("should combine multiple filters", () => {
    const state: LegacyFilterState = {
      ...emptyLegacyState,
      selectedTypes: ["mosque", "church"],
      selectedStatuses: ["destroyed", "heavily-damaged"],
    };
    const result = filterSitesWithLegacyState(mockSites, state);

    expect(result.length).toBe(2);
  });
});

// ============================================================================
// Helper Function Tests
// ============================================================================

describe("countActiveFiltersLegacy", () => {
  it("should return 0 for empty state", () => {
    const count = countActiveFiltersLegacy(emptyLegacyState);
    expect(count).toBe(0);
  });

  it("should count search term", () => {
    const state: LegacyFilterState = {
      ...emptyLegacyState,
      searchTerm: "mosque",
    };
    const count = countActiveFiltersLegacy(state);
    expect(count).toBe(1);
  });

  it("should count type filter", () => {
    const state: LegacyFilterState = {
      ...emptyLegacyState,
      selectedTypes: ["mosque"],
    };
    const count = countActiveFiltersLegacy(state);
    expect(count).toBe(1);
  });

  it("should count status filter", () => {
    const state: LegacyFilterState = {
      ...emptyLegacyState,
      selectedStatuses: ["destroyed"],
    };
    const count = countActiveFiltersLegacy(state);
    expect(count).toBe(1);
  });

  it("should count date range filter", () => {
    const state: LegacyFilterState = {
      ...emptyLegacyState,
      destructionDateStart: new Date("2023-10-01"),
    };
    const count = countActiveFiltersLegacy(state);
    expect(count).toBe(1);
  });

  it("should count year built filter", () => {
    const state: LegacyFilterState = {
      ...emptyLegacyState,
      creationYearStart: -1000,
    };
    const count = countActiveFiltersLegacy(state);
    expect(count).toBe(1);
  });

  it("should count all active filters", () => {
    const count = countActiveFiltersLegacy(populatedLegacyState);
    expect(count).toBe(5); // search, type, status, dateRange, yearBuilt
  });
});

describe("getDefaultLegacyState", () => {
  it("should return empty legacy state", () => {
    const result = getDefaultLegacyState();

    expect(result.searchTerm).toBe("");
    expect(result.selectedTypes).toEqual([]);
    expect(result.selectedStatuses).toEqual([]);
    expect(result.destructionDateStart).toBeNull();
    expect(result.destructionDateEnd).toBeNull();
    expect(result.creationYearStart).toBeNull();
    expect(result.creationYearEnd).toBeNull();
  });
});

describe("isLegacyStateEmpty", () => {
  it("should return true for empty state", () => {
    expect(isLegacyStateEmpty(emptyLegacyState)).toBe(true);
  });

  it("should return false when search term is set", () => {
    const state: LegacyFilterState = {
      ...emptyLegacyState,
      searchTerm: "mosque",
    };
    expect(isLegacyStateEmpty(state)).toBe(false);
  });

  it("should return false when type is selected", () => {
    const state: LegacyFilterState = {
      ...emptyLegacyState,
      selectedTypes: ["mosque"],
    };
    expect(isLegacyStateEmpty(state)).toBe(false);
  });

  it("should return false when any filter is active", () => {
    expect(isLegacyStateEmpty(populatedLegacyState)).toBe(false);
  });
});

// ============================================================================
// Edge Cases
// ============================================================================

describe("Edge Cases", () => {
  it("should handle empty sites array", () => {
    const result = filterSitesWithLegacyState([], populatedLegacyState);
    expect(result).toEqual([]);
  });

  it("should handle sites with missing optional fields", () => {
    const minimalSite: GazaSite = {
      id: "minimal",
      name: "Minimal Site",
      type: "mosque",
      yearBuilt: "1950",
      coordinates: [31.5, 34.4],
      status: "destroyed",
    };

    const state: LegacyFilterState = {
      ...emptyLegacyState,
      selectedTypes: ["mosque"],
    };

    const result = filterSitesWithLegacyState([minimalSite], state);
    expect(result.length).toBe(1);
  });

  it("should handle date conversion edge cases", () => {
    const registryState: RegistryFilterState = {
      search: "",
      type: [],
      status: [],
      dateRange: { start: "invalid-date", end: "" },
      yearBuilt: { min: null, max: null },
    };

    const result = registryToLegacyState(registryState);
    // Invalid dates should still create Date objects (but they'll be Invalid Date)
    expect(result.destructionDateStart).toBeInstanceOf(Date);
  });
});
