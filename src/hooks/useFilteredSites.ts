import { useMemo } from "react";
import type { Site } from "../types";
import {
  filterSitesByTypeAndStatus,
  filterSitesByDestructionDate,
  filterSitesByCreationYear,
  filterSitesBySearch,
} from "../utils/siteFilters";
import type { FilterState } from "./useAppState";

/**
 * Hook to filter sites based on filter criteria
 * Implements memoized filter pipeline
 *
 * @param sites - Array of all sites
 * @param filters - Filter state object
 * @returns Filtered sites and counts
 */
export function useFilteredSites(
  sites: Site[],
  filters: FilterState
) {
  const {
    selectedTypes,
    selectedStatuses,
    destructionDateStart,
    destructionDateEnd,
    creationYearStart,
    creationYearEnd,
    searchTerm,
    showUnknownDates,
  } = filters;

  // Filter pipeline - each step depends on previous
  const typeAndStatusFiltered = useMemo(
    () => filterSitesByTypeAndStatus(sites, selectedTypes, selectedStatuses),
    [sites, selectedTypes, selectedStatuses]
  );

  const destructionDateFiltered = useMemo(
    () =>
      filterSitesByDestructionDate(
        typeAndStatusFiltered,
        destructionDateStart,
        destructionDateEnd
      ),
    [typeAndStatusFiltered, destructionDateStart, destructionDateEnd]
  );

  const yearFiltered = useMemo(
    () =>
      filterSitesByCreationYear(
        destructionDateFiltered,
        creationYearStart,
        creationYearEnd
      ),
    [destructionDateFiltered, creationYearStart, creationYearEnd]
  );

  const searchFiltered = useMemo(
    () => filterSitesBySearch(yearFiltered, searchTerm),
    [yearFiltered, searchTerm]
  );

  // Filter by showUnknownDates - if false, only show sites with destruction dates
  const unknownDatesFiltered = useMemo(
    () => {
      if (showUnknownDates) {
        return searchFiltered;
      }
      // Only show sites that have a destruction date (exclude sites that only have sourceAssessmentDate)
      return searchFiltered.filter(site => site.dateDestroyed != null);
    },
    [searchFiltered, showUnknownDates]
  );

  return {
    filteredSites: unknownDatesFiltered,
    count: unknownDatesFiltered.length,
    total: sites.length,
  };
}
