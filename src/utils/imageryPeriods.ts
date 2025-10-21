import { HISTORICAL_IMAGERY, type TimePeriod } from "../constants/map";

/**
 * Dynamically determines which satellite imagery period to display based on a given date
 * Uses the HISTORICAL_IMAGERY constants to ensure extensibility as new periods are added
 *
 * Algorithm:
 * 1. Sort all imagery periods by date (ascending)
 * 2. Find the latest period whose date is <= the given date
 * 3. Default to earliest period if date is before all periods
 *
 * @param date - The timeline date to match against imagery periods
 * @returns The appropriate TimePeriod key (e.g., "BASELINE_2014", "PRE_CONFLICT_2023", "CURRENT")
 *
 * @example
 * getImageryPeriodForDate(new Date("2015-06-15")) // Returns "BASELINE_2014"
 * getImageryPeriodForDate(new Date("2023-09-20")) // Returns "PRE_CONFLICT_2023"
 * getImageryPeriodForDate(new Date("2024-01-10")) // Returns "CURRENT"
 */
export function getImageryPeriodForDate(date: Date): TimePeriod {
  // Convert HISTORICAL_IMAGERY object to sorted array of [key, period] entries
  const periods = Object.entries(HISTORICAL_IMAGERY) as [TimePeriod, typeof HISTORICAL_IMAGERY[TimePeriod]][];

  // Separate "current" from dated periods
  const datedPeriods = periods.filter(([, period]) => period.date !== "current");
  const currentPeriod = periods.find(([, period]) => period.date === "current");

  // Sort dated periods by date ascending (earliest first)
  const sortedDatedPeriods = datedPeriods.sort(([, a], [, b]) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  // Find the latest dated period whose date is <= the given date
  let matchedPeriod: TimePeriod = sortedDatedPeriods[0][0]; // Default to earliest period

  for (const [key, period] of sortedDatedPeriods) {
    const periodDate = new Date(period.date);

    if (date >= periodDate) {
      matchedPeriod = key;
      // Continue to find the latest matching period
    } else {
      // Stop when we find a period date that's after our target date
      break;
    }
  }

  // If "current" period exists and the date is strictly after all dated periods, use "current"
  if (currentPeriod && sortedDatedPeriods.length > 0) {
    const lastDatedPeriodDate = new Date(sortedDatedPeriods[sortedDatedPeriods.length - 1][1].date);
    // Only switch to CURRENT if date is strictly AFTER the last dated period (not equal to it)
    if (date.getTime() > lastDatedPeriodDate.getTime()) {
      matchedPeriod = currentPeriod[0];
    }
  }

  return matchedPeriod;
}
