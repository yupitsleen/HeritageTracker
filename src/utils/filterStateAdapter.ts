/**
 * Filter State Adapter
 *
 * Provides bridge between legacy FilterState (src/types/filters.ts)
 * and new filter registry system (src/config/filters.ts).
 *
 * This adapter enables gradual migration to the filter registry
 * while maintaining backward compatibility.
 */

import type { GazaSite } from "../types";
import type { FilterState as LegacyFilterState } from "../types/filters";
import type { FilterState as RegistryFilterState } from "../types/filterConfig";
import {
  filterSites as registryFilterSites,
  getDefaultFilterState as getRegistryDefaults,
  countActiveFilters as registryCountActive,
} from "../config/filters";

/**
 * Convert legacy FilterState to registry FilterState
 *
 * @param legacyState - Legacy filter state from useFilterState hook
 * @returns Registry-compatible filter state
 *
 * @example
 * ```typescript
 * const legacyFilters = useFilterState();
 * const registryFilters = legacyToRegistryState(legacyFilters.filters);
 * const filtered = filterSites(sites, registryFilters);
 * ```
 */
export function legacyToRegistryState(
  legacyState: LegacyFilterState
): RegistryFilterState {
  return {
    search: legacyState.searchTerm,
    type: legacyState.selectedTypes,
    status: legacyState.selectedStatuses,
    dateRange: {
      start: legacyState.destructionDateStart?.toISOString().split("T")[0] || "",
      end: legacyState.destructionDateEnd?.toISOString().split("T")[0] || "",
    },
    yearBuilt: {
      min: legacyState.creationYearStart,
      max: legacyState.creationYearEnd,
    },
  };
}

/**
 * Convert registry FilterState to legacy FilterState
 *
 * @param registryState - Registry filter state
 * @returns Legacy-compatible filter state
 *
 * @example
 * ```typescript
 * const registryFilters = getDefaultFilterState();
 * const legacyFilters = registryToLegacyState(registryFilters);
 * ```
 */
export function registryToLegacyState(
  registryState: RegistryFilterState
): LegacyFilterState {
  return {
    searchTerm: typeof registryState.search === "string" ? registryState.search : "",
    selectedTypes: Array.isArray(registryState.type) ? registryState.type : [],
    selectedStatuses: Array.isArray(registryState.status) ? registryState.status : [],
    destructionDateStart:
      typeof registryState.dateRange === "object" &&
      !Array.isArray(registryState.dateRange) &&
      registryState.dateRange !== null &&
      "start" in registryState.dateRange &&
      registryState.dateRange.start
        ? new Date(registryState.dateRange.start)
        : null,
    destructionDateEnd:
      typeof registryState.dateRange === "object" &&
      !Array.isArray(registryState.dateRange) &&
      registryState.dateRange !== null &&
      "end" in registryState.dateRange &&
      registryState.dateRange.end
        ? new Date(registryState.dateRange.end)
        : null,
    creationYearStart:
      typeof registryState.yearBuilt === "object" &&
      !Array.isArray(registryState.yearBuilt) &&
      registryState.yearBuilt !== null &&
      "min" in registryState.yearBuilt
        ? registryState.yearBuilt.min
        : null,
    creationYearEnd:
      typeof registryState.yearBuilt === "object" &&
      !Array.isArray(registryState.yearBuilt) &&
      registryState.yearBuilt !== null &&
      "max" in registryState.yearBuilt
        ? registryState.yearBuilt.max
        : null,
  };
}

/**
 * Filter sites using legacy FilterState
 *
 * This function provides a unified filtering API that works with
 * the legacy state but uses the new registry internally.
 *
 * @param sites - Array of sites to filter
 * @param legacyState - Legacy filter state
 * @returns Filtered array of sites
 *
 * @example
 * ```typescript
 * const appState = useAppState();
 * const filtered = filterSitesWithLegacyState(mockSites, appState.filters);
 * ```
 */
export function filterSitesWithLegacyState(
  sites: GazaSite[],
  legacyState: LegacyFilterState
): GazaSite[] {
  const registryState = legacyToRegistryState(legacyState);
  return registryFilterSites(sites, registryState);
}

/**
 * Count active filters from legacy FilterState
 *
 * @param legacyState - Legacy filter state
 * @returns Number of active filters
 *
 * @example
 * ```typescript
 * const appState = useAppState();
 * const count = countActiveFiltersLegacy(appState.filters); // 3
 * ```
 */
export function countActiveFiltersLegacy(
  legacyState: LegacyFilterState
): number {
  const registryState = legacyToRegistryState(legacyState);
  return registryCountActive(registryState);
}

/**
 * Get default legacy filter state from registry
 *
 * @returns Empty legacy filter state with default values
 *
 * @example
 * ```typescript
 * const defaults = getDefaultLegacyState();
 * setFilters(defaults); // Reset to defaults
 * ```
 */
export function getDefaultLegacyState(): LegacyFilterState {
  const registryDefaults = getRegistryDefaults();
  return registryToLegacyState(registryDefaults);
}

/**
 * Check if legacy filter state is empty (all filters at default values)
 *
 * @param legacyState - Legacy filter state
 * @returns True if no filters are active
 *
 * @example
 * ```typescript
 * const appState = useAppState();
 * const isEmpty = isLegacyStateEmpty(appState.filters); // true/false
 * ```
 */
export function isLegacyStateEmpty(legacyState: LegacyFilterState): boolean {
  const count = countActiveFiltersLegacy(legacyState);
  return count === 0;
}
