/**
 * Filter Helper Functions
 *
 * Utilities for working with filter state updates.
 * Reduces duplication in filter handling logic.
 */

import type { FilterState } from '../types';

/**
 * Mapping of FilterState keys to their setter function names
 */
type SetterMap = {
  [K in keyof FilterState]: string;
};

const FILTER_SETTER_MAP: SetterMap = {
  selectedTypes: 'setSelectedTypes',
  selectedStatuses: 'setSelectedStatuses',
  destructionDateStart: 'setDestructionDateStart',
  destructionDateEnd: 'setDestructionDateEnd',
  creationYearStart: 'setCreationYearStart',
  creationYearEnd: 'setCreationYearEnd',
  searchTerm: 'setSearchTerm',
};

const TEMP_FILTER_SETTER_MAP: SetterMap = {
  selectedTypes: 'setTempSelectedTypes',
  selectedStatuses: 'setTempSelectedStatuses',
  destructionDateStart: 'setTempDestructionDateStart',
  destructionDateEnd: 'setTempDestructionDateEnd',
  creationYearStart: 'setTempCreationYearStart',
  creationYearEnd: 'setTempCreationYearEnd',
  searchTerm: 'setSearchTerm', // Note: searchTerm doesn't have a "temp" version
};

/**
 * Apply filter updates to app state using dynamic setters
 *
 * Replaces 7 individual if-statements with a single loop.
 *
 * @param updates Partial filter state updates
 * @param appState App state object with setter methods
 * @param useTemp If true, use "Temp" setter variants (for modal filters)
 *
 * @example
 * ```tsx
 * // Instead of:
 * if (updates.selectedTypes !== undefined) appState.setSelectedTypes(updates.selectedTypes);
 * if (updates.selectedStatuses !== undefined) appState.setSelectedStatuses(updates.selectedStatuses);
 * // ... 5 more
 *
 * // Use:
 * applyFilterUpdates(updates, appState, false);
 * ```
 */
export function applyFilterUpdates(
  updates: Partial<FilterState>,
  appState: any,
  useTemp = false
): void {
  const setterMap = useTemp ? TEMP_FILTER_SETTER_MAP : FILTER_SETTER_MAP;

  Object.keys(updates).forEach((key) => {
    const filterKey = key as keyof FilterState;
    const value = updates[filterKey];

    if (value !== undefined) {
      const setterName = setterMap[filterKey];
      const setter = appState[setterName];

      if (typeof setter === 'function') {
        setter(value);
      } else {
        console.warn(`Setter "${setterName}" not found in appState`);
      }
    }
  });
}
