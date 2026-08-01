import type { Site } from "./index";

/**
 * Default destruction-date start for the initial view.
 * Users can expand/change via the date-range picker (min reaches back to the
 * earliest data) or "Clear all".
 */
export const DEFAULT_DESTRUCTION_DATE_START = new Date("2023-10-01");

/** Default destruction-date end for the initial view. */
export const DEFAULT_DESTRUCTION_DATE_END = new Date("2024-10-01");

/**
 * Whether the destruction-date range is a real user filter, i.e. it deviates
 * from the defaults. The default range on its own is NOT active.
 */
export function isDestructionDateFilterActive(
  start: Date | null,
  end: Date | null
): boolean {
  const startDeviates =
    start != null &&
    start.getTime() !== DEFAULT_DESTRUCTION_DATE_START.getTime();
  const endDeviates =
    end == null || end.getTime() !== DEFAULT_DESTRUCTION_DATE_END.getTime();
  return startDeviates || endDeviates;
}

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
  showUnknownDates: boolean; // Show sites without destruction dates (using sourceAssessmentDate)
}

/**
 * Creates an empty filter state with all filters cleared
 */
export function createEmptyFilterState(): FilterState {
  return {
    selectedTypes: [],
    selectedStatuses: [],
    destructionDateStart: DEFAULT_DESTRUCTION_DATE_START,
    destructionDateEnd: DEFAULT_DESTRUCTION_DATE_END,
    creationYearStart: null,
    creationYearEnd: null,
    searchTerm: "",
    showUnknownDates: true, // Default to showing sites without destruction dates
  };
}

/**
 * Checks if a filter state is empty (no filters applied)
 */
export function isFilterStateEmpty(state: FilterState): boolean {
  return (
    state.selectedTypes.length === 0 &&
    state.selectedStatuses.length === 0 &&
    // The default destruction-date range counts as "empty"
    state.destructionDateStart?.getTime() ===
      DEFAULT_DESTRUCTION_DATE_START.getTime() &&
    state.destructionDateEnd?.getTime() ===
      DEFAULT_DESTRUCTION_DATE_END.getTime() &&
    state.creationYearStart === null &&
    state.creationYearEnd === null &&
    state.searchTerm.trim().length === 0 &&
    state.showUnknownDates === true // showUnknownDates=true is the default state
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
  const showUnknownDatesEqual = a.showUnknownDates === b.showUnknownDates;

  return (
    typesEqual &&
    statusesEqual &&
    startDateEqual &&
    endDateEqual &&
    creationStartEqual &&
    creationEndEqual &&
    searchEqual &&
    showUnknownDatesEqual
  );
}
