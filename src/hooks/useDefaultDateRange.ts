import { useMemo } from "react";
import type { GazaSite } from "../types";

/**
 * Calculates default date range from sites' destruction dates
 * Used by date range filters to show meaningful defaults
 *
 * @param sites - Array of heritage sites
 * @returns Object with defaultStartDate and defaultEndDate
 *
 * @example
 * ```tsx
 * const { defaultStartDate, defaultEndDate } = useDefaultDateRange(sites);
 * ```
 */
export function useDefaultDateRange(sites: GazaSite[]) {
  return useMemo(() => {
    const destructionDates = sites
      .filter(site => site.dateDestroyed)
      .map(site => new Date(site.dateDestroyed!));

    if (destructionDates.length === 0) {
      const fallbackStart = new Date("2023-10-07"); // Conflict start date
      const fallbackEnd = new Date();
      return { defaultStartDate: fallbackStart, defaultEndDate: fallbackEnd };
    }

    const timestamps = destructionDates.map(d => d.getTime());
    return {
      defaultStartDate: new Date(Math.min(...timestamps)),
      defaultEndDate: new Date(Math.max(...timestamps)),
    };
  }, [sites]);
}
