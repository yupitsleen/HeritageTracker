/**
 * Filter Registry
 *
 * Central registry for all site filters. Enables dynamic filter
 * configuration and extensibility without code changes.
 *
 * @example
 * ```typescript
 * // Get all filters
 * const filters = getAllFilters();
 *
 * // Get specific filter
 * const searchFilter = getFilter('search');
 *
 * // Apply filter
 * const matchesSite = searchFilter.filterFn(site, 'mosque');
 * ```
 */

import type { Site } from "../types";
import type {
  FilterConfig,
  FilterId,
  FilterValue,
  FilterState,
} from "../types/filterConfig";
import { getSiteTypes } from "./siteTypes";
import { getStatuses } from "./siteStatus";
import { parseYearBuilt } from "../utils/siteFilters";

/**
 * Filter registry - stores all registered filters
 */
export const FILTER_REGISTRY: Record<FilterId, FilterConfig> = {
  search: {
    id: "search",
    type: "text",
    label: "Search",
    labelArabic: "بحث",
    placeholder: "Search by name or description...",
    placeholderArabic: "البحث بالاسم أو الوصف...",
    filterFn: (site: Site, value: FilterValue): boolean => {
      if (typeof value !== "string" || !value.trim()) {
        return true; // No filter applied
      }

      const searchLower = value.toLowerCase();
      return (
        site.name.toLowerCase().includes(searchLower) ||
        site.nameArabic?.toLowerCase().includes(searchLower) ||
        site.description?.toLowerCase().includes(searchLower) ||
        false
      );
    },
    defaultValue: "",
    order: 1,
    enabled: true,
    description: "Filter sites by name or description (case-insensitive)",
  },

  type: {
    id: "type",
    type: "multi-select",
    label: "Type",
    labelArabic: "نوع",
    filterFn: (site: Site, value: FilterValue): boolean => {
      if (!Array.isArray(value) || value.length === 0) {
        return true; // No filter applied
      }
      return value.includes(site.type);
    },
    defaultValue: [],
    order: 2,
    enabled: true,
    options: getSiteTypes().map((typeConfig) => ({
      value: typeConfig.id,
      label: typeConfig.label,
      labelArabic: typeConfig.labelArabic,
      icon: typeConfig.icon,
    })),
    description: "Filter sites by their type (mosque, church, etc.)",
  },

  status: {
    id: "status",
    type: "multi-select",
    label: "Status",
    labelArabic: "الحالة",
    filterFn: (site: Site, value: FilterValue): boolean => {
      if (!Array.isArray(value) || value.length === 0) {
        return true; // No filter applied
      }
      return value.includes(site.status);
    },
    defaultValue: [],
    order: 3,
    enabled: true,
    options: getStatuses().map((statusConfig) => ({
      value: statusConfig.id,
      label: statusConfig.label,
      labelArabic: statusConfig.labelArabic,
    })),
    description: "Filter sites by their damage status",
  },

  dateRange: {
    id: "dateRange",
    type: "date-range",
    label: "Destruction Date",
    labelArabic: "تاريخ الدمار",
    placeholder: "Start date",
    placeholderArabic: "تاريخ البدء",
    filterFn: (site: Site, value: FilterValue): boolean => {
      if (
        typeof value !== "object" ||
        !value ||
        Array.isArray(value) ||
        (!("start" in value) && !("end" in value))
      ) {
        return true; // No filter applied
      }

      const { start, end } = value as { start: string; end: string };
      if (!start && !end) return true;
      if (!site.dateDestroyed) return true;

      const destroyedDate = new Date(site.dateDestroyed);

      // Check start date
      if (start) {
        const startDate = new Date(start);
        if (destroyedDate < startDate) {
          return false;
        }
      }

      // Check end date
      if (end) {
        const endDate = new Date(end);
        if (destroyedDate > endDate) {
          return false;
        }
      }

      return true;
    },
    defaultValue: { start: "", end: "" },
    order: 4,
    enabled: true,
    description: "Filter sites by destruction date range",
  },

  yearBuilt: {
    id: "yearBuilt",
    type: "year-range",
    label: "Year Built",
    labelArabic: "سنة البناء",
    placeholder: "Min year",
    placeholderArabic: "السنة الدنيا",
    filterFn: (site: Site, value: FilterValue): boolean => {
      if (
        typeof value !== "object" ||
        !value ||
        Array.isArray(value) ||
        (!("min" in value) && !("max" in value))
      ) {
        return true; // No filter applied
      }

      const { min, max } = value as { min: number | null; max: number | null };
      if (min === null && max === null) return true;

      const yearBuilt = parseYearBuilt(site.yearBuilt);
      if (yearBuilt === null) return true; // Unparseable, include in results

      // Check min year
      if (min !== null && yearBuilt < min) {
        return false;
      }

      // Check max year
      if (max !== null && yearBuilt > max) {
        return false;
      }

      return true;
    },
    defaultValue: { min: null, max: null },
    order: 5,
    enabled: true,
    description: "Filter sites by construction year range (supports BCE)",
  },
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get a specific filter configuration by ID
 *
 * @param id - Filter identifier
 * @returns Filter configuration or undefined if not found
 *
 * @example
 * ```typescript
 * const searchFilter = getFilter('search');
 * if (searchFilter) {
 *   const matches = searchFilter.filterFn(site, 'mosque');
 * }
 * ```
 */
export function getFilter(id: FilterId): FilterConfig | undefined {
  return FILTER_REGISTRY[id];
}

/**
 * Get all registered filter configurations
 *
 * @returns Array of all filter configurations, sorted by order
 *
 * @example
 * ```typescript
 * const allFilters = getAllFilters();
 * allFilters.forEach(filter => {
 *   console.log(filter.label);
 * });
 * ```
 */
export function getAllFilters(): FilterConfig[] {
  return Object.values(FILTER_REGISTRY).sort((a, b) => a.order - b.order);
}

/**
 * Get all enabled filters
 *
 * @returns Array of enabled filter configurations, sorted by order
 *
 * @example
 * ```typescript
 * const enabledFilters = getEnabledFilters();
 * // Only filters with enabled: true
 * ```
 */
export function getEnabledFilters(): FilterConfig[] {
  return getAllFilters().filter((filter) => filter.enabled !== false);
}

/**
 * Get filter IDs
 *
 * @param filters - Array of filter configurations
 * @returns Array of filter IDs
 *
 * @example
 * ```typescript
 * const ids = getFilterIds(getAllFilters());
 * // ['search', 'type', 'status', 'dateRange', 'yearBuilt']
 * ```
 */
export function getFilterIds(filters: FilterConfig[]): FilterId[] {
  return filters.map((filter) => filter.id);
}

/**
 * Check if a filter ID is valid
 *
 * @param id - Filter identifier to validate
 * @returns True if filter exists in registry
 *
 * @example
 * ```typescript
 * if (isValidFilter('search')) {
 *   // Filter exists
 * }
 * ```
 */
export function isValidFilter(id: string): id is FilterId {
  return id in FILTER_REGISTRY;
}

/**
 * Get filter label (localized)
 *
 * @param id - Filter identifier
 * @param locale - Locale code ('en' or 'ar')
 * @returns Localized label or filter ID if not found
 *
 * @example
 * ```typescript
 * const label = getFilterLabel('search', 'ar'); // 'بحث'
 * ```
 */
export function getFilterLabel(
  id: FilterId,
  locale: "en" | "ar" = "en"
): string {
  const filter = getFilter(id);
  if (!filter) return id;

  return locale === "ar" && filter.labelArabic
    ? filter.labelArabic
    : filter.label;
}

/**
 * Apply a single filter to a site
 *
 * @param site - Site to filter
 * @param filterId - Filter to apply
 * @param value - Filter value
 * @returns True if site matches filter
 *
 * @example
 * ```typescript
 * const matches = applyFilter(site, 'type', ['mosque', 'church']);
 * ```
 */
export function applyFilter(
  site: Site,
  filterId: FilterId,
  value: FilterValue
): boolean {
  const filter = getFilter(filterId);
  if (!filter) return true; // Unknown filter, don't exclude

  return filter.filterFn(site, value);
}

/**
 * Apply all filters to a site
 *
 * @param site - Site to filter
 * @param filterState - Current filter state
 * @returns True if site matches all filters
 *
 * @example
 * ```typescript
 * const filterState: FilterState = {
 *   search: 'mosque',
 *   type: ['mosque'],
 *   status: [],
 *   dateRange: { start: '', end: '' },
 *   yearBuilt: { min: null, max: null }
 * };
 * const matches = applyAllFilters(site, filterState);
 * ```
 */
export function applyAllFilters(
  site: Site,
  filterState: FilterState
): boolean {
  return Object.entries(filterState).every(([filterId, value]) => {
    return applyFilter(site, filterId as FilterId, value);
  });
}

/**
 * Filter array of sites using filter state
 *
 * @param sites - Sites to filter
 * @param filterState - Current filter state
 * @returns Filtered array of sites
 *
 * @example
 * ```typescript
 * const filtered = filterSites(sites, {
 *   search: 'mosque',
 *   type: ['mosque'],
 *   status: [],
 *   dateRange: { start: '', end: '' },
 *   yearBuilt: { min: null, max: null }
 * });
 * ```
 */
export function filterSites(
  sites: Site[],
  filterState: FilterState
): Site[] {
  return sites.filter((site) => applyAllFilters(site, filterState));
}

/**
 * Get default filter state
 *
 * @returns Default filter state with all filters set to default values
 *
 * @example
 * ```typescript
 * const initialState = getDefaultFilterState();
 * // { search: '', type: [], status: [], dateRange: {...}, yearBuilt: {...} }
 * ```
 */
export function getDefaultFilterState(): FilterState {
  const state: Partial<FilterState> = {};

  getAllFilters().forEach((filter) => {
    state[filter.id] = filter.defaultValue;
  });

  return state as FilterState;
}

/**
 * Reset a specific filter to its default value
 *
 * @param filterId - Filter to reset
 * @param currentState - Current filter state
 * @returns Updated filter state
 *
 * @example
 * ```typescript
 * const newState = resetFilter('search', currentState);
 * ```
 */
export function resetFilter(
  filterId: FilterId,
  currentState: FilterState
): FilterState {
  const filter = getFilter(filterId);
  if (!filter) return currentState;

  return {
    ...currentState,
    [filterId]: filter.defaultValue,
  };
}

/**
 * Reset all filters to default values
 *
 * @returns Default filter state
 *
 * @example
 * ```typescript
 * const resetState = resetAllFilters();
 * ```
 */
export function resetAllFilters(): FilterState {
  return getDefaultFilterState();
}

/**
 * Count active filters (non-default values)
 *
 * @param filterState - Current filter state
 * @returns Number of active filters
 *
 * @example
 * ```typescript
 * const count = countActiveFilters(filterState); // 2
 * ```
 */
export function countActiveFilters(filterState: FilterState): number {
  return Object.entries(filterState).filter(([filterId, value]) => {
    const filter = getFilter(filterId as FilterId);
    if (!filter) return false;

    // Compare current value to default value
    const defaultValue = filter.defaultValue;

    // Handle different value types
    if (typeof value === "string") {
      return value !== defaultValue;
    }
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    if (typeof value === "object" && value !== null) {
      // Check if any property is non-default
      return Object.values(value).some((v) => v !== null && v !== "");
    }

    return false;
  }).length;
}
