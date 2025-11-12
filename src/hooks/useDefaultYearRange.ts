import { useMemo } from "react";
import type { Site } from "../types";
import { parseYearBuilt } from "../utils/siteFilters";

/**
 * Calculates default year range from sites' creation years
 * Handles BCE/CE eras and formats years for display
 *
 * @param sites - Array of heritage sites
 * @returns Object with defaultStartYear, defaultEndYear, and defaultStartEra
 *
 * @example
 * ```tsx
 * const { defaultStartYear, defaultEndYear, defaultStartEra } = useDefaultYearRange(sites);
 * ```
 */
export function useDefaultYearRange(sites: Site[]) {
  return useMemo(() => {
    const creationYears = sites
      .filter(site => site.yearBuilt)
      .map(site => parseYearBuilt(site.yearBuilt))
      .filter((year): year is number => year !== null);

    if (creationYears.length === 0) {
      return {
        defaultStartYear: "",
        defaultEndYear: new Date().getFullYear().toString(),
        defaultStartEra: "CE" as const
      };
    }

    const minYear = Math.min(...creationYears);
    const maxYear = Math.max(...creationYears);

    // Format the years for display
    const formatYear = (year: number): string => {
      if (year < 0) {
        return Math.abs(year).toString(); // Will be shown with BCE dropdown
      }
      return year.toString();
    };

    return {
      defaultStartYear: formatYear(minYear),
      defaultEndYear: formatYear(maxYear),
      defaultStartEra: minYear < 0 ? ("BCE" as const) : ("CE" as const),
    };
  }, [sites]);
}
