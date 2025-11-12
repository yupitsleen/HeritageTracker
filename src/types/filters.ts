import type { Site } from "./index";

/**
 * Filter state interface
 * Represents the active filters applied to the sites list
 */
export interface FilterState {
  selectedTypes: Array<Site["type"]>;
  selectedStatuses: Array<Site["status"]>;
  destructionDateStart: Date | null;
  destructionDateEnd: Date | null;
  creationYearStart: number | null;
  creationYearEnd: number | null;
  searchTerm: string;
}

/**
 * Creates an empty filter state with all filters cleared
 */
export function createEmptyFilterState(): FilterState {
  return {
    selectedTypes: [],
    selectedStatuses: [],
    destructionDateStart: null,
    destructionDateEnd: null,
    creationYearStart: null,
    creationYearEnd: null,
    searchTerm: "",
  };
}

/**
 * Checks if a filter state is empty (no filters applied)
 */
export function isFilterStateEmpty(state: FilterState): boolean {
  return (
    state.selectedTypes.length === 0 &&
    state.selectedStatuses.length === 0 &&
    state.destructionDateStart === null &&
    state.destructionDateEnd === null &&
    state.creationYearStart === null &&
    state.creationYearEnd === null &&
    state.searchTerm.trim().length === 0
  );
}

/**
 * Compares two filter states for equality
 * Used to detect if filters have changed (e.g., unapplied changes in modal)
 *
 * @param a - First filter state
 * @param b - Second filter state
 * @returns true if filter states are equal
 */
export function areFiltersEqual(a: FilterState, b: FilterState): boolean {
  // Compare arrays (order-independent)
  const typesEqual =
    JSON.stringify([...a.selectedTypes].sort()) ===
    JSON.stringify([...b.selectedTypes].sort());

  const statusesEqual =
    JSON.stringify([...a.selectedStatuses].sort()) ===
    JSON.stringify([...b.selectedStatuses].sort());

  // Compare dates (by timestamp)
  const startDateEqual =
    a.destructionDateStart?.getTime() === b.destructionDateStart?.getTime();

  const endDateEqual =
    a.destructionDateEnd?.getTime() === b.destructionDateEnd?.getTime();

  // Compare numbers and strings
  const creationStartEqual = a.creationYearStart === b.creationYearStart;
  const creationEndEqual = a.creationYearEnd === b.creationYearEnd;
  const searchEqual = a.searchTerm === b.searchTerm;

  return (
    typesEqual &&
    statusesEqual &&
    startDateEqual &&
    endDateEqual &&
    creationStartEqual &&
    creationEndEqual &&
    searchEqual
  );
}
