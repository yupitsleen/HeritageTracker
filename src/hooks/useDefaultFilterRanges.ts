import type { Site } from "../types";
import { useDefaultDateRange } from "./useDefaultDateRange";
import { useDefaultYearRange } from "./useDefaultYearRange";

/**
 * Returns default filter ranges calculated from all sites
 * Used to initialize filter UI with min/max values
 *
 * This is a convenience hook that combines useDefaultDateRange and useDefaultYearRange.
 * It delegates to specialized hooks to avoid code duplication (DRY principle).
 *
 * @param sites - Array of all sites
 * @returns Default date and year ranges for filters
 *
 * @example
 * ```tsx
 * const { dateRange, yearRange } = useDefaultFilterRanges(sites);
 * // dateRange: { defaultStartDate, defaultEndDate }
 * // yearRange: { defaultStartYear, defaultEndYear, defaultStartEra }
 * ```
 *
 * @see useDefaultDateRange - For destruction date ranges
 * @see useDefaultYearRange - For creation year ranges
 */
export function useDefaultFilterRanges(sites: Site[]) {
  const dateRange = useDefaultDateRange(sites);
  const yearRange = useDefaultYearRange(sites);

  return {
    dateRange,
    yearRange,
  };
}
