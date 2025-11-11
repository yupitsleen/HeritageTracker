import { useMemo } from "react";
import type { GazaSite } from "../types";

/**
 * Returns default filter ranges calculated from all sites
 * Used to initialize filter UI with min/max values
 *
 * @param sites - Array of all sites
 * @returns Default date and year ranges for filters
 */
export function useDefaultFilterRanges(sites: GazaSite[]) {
  // Calculate default destruction date range
  const dateRange = useMemo(() => {
    const destructionDates = sites
      .filter((site) => site.dateDestroyed)
      .map((site) => new Date(site.dateDestroyed!));

    if (destructionDates.length === 0) {
      return {
        defaultStartDate: new Date("2023-10-07"),
        defaultEndDate: new Date(),
      };
    }

    const timestamps = destructionDates.map((d) => d.getTime());
    return {
      defaultStartDate: new Date(Math.min(...timestamps)),
      defaultEndDate: new Date(Math.max(...timestamps)),
    };
  }, [sites]);

  // Calculate default creation year range
  const yearRange = useMemo(() => {
    const creationYears = sites
      .filter((site) => site.yearBuilt)
      .map((site) => {
        const match = site.yearBuilt?.match(/^(?:BCE\s+)?(-?\d+)/);
        return match
          ? parseInt(match[1], 10) *
              (site.yearBuilt?.startsWith("BCE") ? -1 : 1)
          : null;
      })
      .filter((year): year is number => year !== null);

    if (creationYears.length === 0) {
      return {
        defaultStartYear: "",
        defaultEndYear: new Date().getFullYear().toString(),
        defaultStartEra: "CE" as const,
      };
    }

    const minYear = Math.min(...creationYears);
    const maxYear = Math.max(...creationYears);

    const formatYear = (year: number): string => {
      if (year < 0) return Math.abs(year).toString();
      return year.toString();
    };

    return {
      defaultStartYear: formatYear(minYear),
      defaultEndYear: formatYear(maxYear),
      defaultStartEra: minYear < 0 ? ("BCE" as const) : ("CE" as const),
    };
  }, [sites]);

  return {
    dateRange,
    yearRange,
  };
}
