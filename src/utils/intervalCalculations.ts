/**
 * Interval Calculation Utilities
 *
 * Helpers for calculating date intervals for comparison mode.
 * Provides both pure date calculations and Wayback-specific release selection.
 */

import type { ComparisonInterval } from "../types/waybackTimelineTypes";
import type { WaybackRelease } from "../services/waybackService";
import { WAYBACK_FALLBACKS } from "../config/waybackTimeline";

/**
 * Calculate a date offset from a base date using a comparison interval.
 *
 * This is a **pure function** that performs only date arithmetic without any
 * external dependencies. It does not consider Wayback releases or satellite
 * imagery availability.
 *
 * Use this function when you need simple date calculations independent of
 * actual imagery data, such as setting initial comparison dates or calculating
 * fallback values.
 *
 * Calculation rules:
 * - **as_large_as_possible**: Returns {@link WAYBACK_FALLBACKS.LARGE_INTERVAL_YEARS}
 *   years before base date (default: 10 years)
 * - **as_small_as_possible**: Returns {@link WAYBACK_FALLBACKS.SMALL_INTERVAL_DAYS}
 *   days before base date (default: 7 days)
 * - **1_month**: Returns {@link WAYBACK_FALLBACKS.ONE_MONTH_DAYS} days before
 *   (default: 30 days)
 * - **1_year**: Returns exactly 1 year before
 * - **5_years**: Returns exactly 5 years before
 *
 * @param baseDate - The reference date to calculate from
 * @param interval - The comparison interval type
 * @returns A new Date object representing the calculated "before" date
 *
 * @example
 * ```typescript
 * const destructionDate = new Date('2024-01-15');
 *
 * // Calculate 1 month before (30 days)
 * const oneMonthBefore = calculateIntervalDate(destructionDate, '1_month');
 * // Returns: 2023-12-16
 *
 * // Calculate 5 years before
 * const fiveYearsBefore = calculateIntervalDate(destructionDate, '5_years');
 * // Returns: 2019-01-15
 * ```
 *
 * @see {@link findBeforeRelease} - For Wayback-aware date selection
 * @see {@link WAYBACK_FALLBACKS} - Configuration for fallback intervals
 */
export function calculateIntervalDate(
  baseDate: Date,
  interval: ComparisonInterval
): Date {
  const time = baseDate.getTime();

  switch (interval) {
    case "as_large_as_possible": {
      const date = new Date(baseDate);
      const targetYear = date.getFullYear() - WAYBACK_FALLBACKS.LARGE_INTERVAL_YEARS;
      const month = date.getMonth();
      const day = date.getDate();

      // Handle leap year edge case (Feb 29 -> Feb 28 in non-leap year)
      date.setFullYear(targetYear, month, Math.min(day, new Date(targetYear, month + 1, 0).getDate()));
      return date;
    }

    case "as_small_as_possible": {
      const date = new Date(time - WAYBACK_FALLBACKS.SMALL_INTERVAL_DAYS * 24 * 60 * 60 * 1000);
      return date;
    }

    case "1_month": {
      const date = new Date(time - WAYBACK_FALLBACKS.ONE_MONTH_DAYS * 24 * 60 * 60 * 1000);
      return date;
    }

    case "1_year": {
      const date = new Date(baseDate);
      const targetYear = date.getFullYear() - 1;
      const month = date.getMonth();
      const day = date.getDate();

      // Handle leap year edge case (Feb 29 -> Feb 28 in non-leap year)
      date.setFullYear(targetYear, month, Math.min(day, new Date(targetYear, month + 1, 0).getDate()));
      return date;
    }

    case "5_years": {
      const date = new Date(baseDate);
      const targetYear = date.getFullYear() - 5;
      const month = date.getMonth();
      const day = date.getDate();

      // Handle leap year edge case (Feb 29 -> Feb 28 in non-leap year)
      date.setFullYear(targetYear, month, Math.min(day, new Date(targetYear, month + 1, 0).getDate()));
      return date;
    }

    default: {
      // Default to 1 month
      const date = new Date(time - WAYBACK_FALLBACKS.ONE_MONTH_DAYS * 24 * 60 * 60 * 1000);
      return date;
    }
  }
}

/**
 * Find the optimal "before" date using available Wayback releases.
 *
 * This function combines pure date calculation with Wayback release selection.
 * It prioritizes actual satellite imagery availability over exact intervals,
 * ensuring users can view real imagery whenever possible.
 *
 * **Decision logic:**
 * 1. For "as_large_as_possible": Use earliest release if available,
 *    otherwise fallback to calculated interval
 * 2. For "as_small_as_possible": Use latest release before destruction if available,
 *    otherwise fallback to calculated interval
 * 3. For other intervals: Use calculated interval (no release consideration)
 *
 * @param destructionDate - The date when the heritage site was destroyed
 * @param interval - The selected comparison interval
 * @param releases - Array of available Wayback releases (chronologically ordered)
 * @returns The optimal "before" date for comparison
 *
 * @example
 * ```typescript
 * const releases = await fetchWaybackReleases();
 * const destructionDate = new Date('2024-01-15');
 *
 * // Get earliest available imagery
 * const beforeDate = findBeforeRelease(
 *   destructionDate,
 *   'as_large_as_possible',
 *   releases
 * );
 * // Returns: First release date (e.g., 2014-02-20)
 * ```
 *
 * @see {@link calculateIntervalDate} - Pure date calculation used as fallback
 * @see {@link findClosestReleaseIndex} - Used to find nearest release
 */
export function findBeforeRelease(
  destructionDate: Date,
  interval: ComparisonInterval,
  releases: WaybackRelease[]
): Date {
  // Handle empty releases case - use pure calculation
  if (releases.length === 0) {
    return calculateIntervalDate(destructionDate, interval);
  }

  const destructionTime = destructionDate.getTime();

  switch (interval) {
    case "as_large_as_possible": {
      // Use the earliest available release
      return new Date(releases[0].releaseDate);
    }

    case "as_small_as_possible": {
      // Find the latest release before destruction
      const releasesBeforeDestruction = releases.filter(
        (release) => new Date(release.releaseDate).getTime() < destructionTime
      );

      if (releasesBeforeDestruction.length > 0) {
        return new Date(
          releasesBeforeDestruction[releasesBeforeDestruction.length - 1].releaseDate
        );
      }

      // No release before destruction - use fallback calculation
      return calculateIntervalDate(destructionDate, interval);
    }

    default: {
      // For fixed intervals (1_month, 1_year, 5_years), use pure calculation
      return calculateIntervalDate(destructionDate, interval);
    }
  }
}

/**
 * Calculate the "before" date for comparison mode based on the selected interval.
 *
 * **DEPRECATED:** This function is maintained for backwards compatibility.
 * New code should use {@link findBeforeRelease} instead.
 *
 * This function determines the optimal "before" date for side-by-side satellite
 * imagery comparison. It prioritizes actual Wayback release dates when available,
 * falling back to calculated intervals based on the configured values.
 *
 * @param destructionDate - The date when the heritage site was destroyed
 * @param interval - The selected comparison interval (determines time gap)
 * @param releases - Array of available Wayback satellite imagery releases,
 *                   ordered chronologically from earliest to latest
 * @returns The calculated "before" date for the left comparison map
 *
 * @example
 * ```typescript
 * const destructionDate = new Date('2024-01-15');
 * const releases = await fetchWaybackReleases();
 *
 * // Get date 1 month before destruction
 * const beforeDate = calculateBeforeDate(
 *   destructionDate,
 *   '1_month',
 *   releases
 * );
 * // Returns: 2023-12-16
 * ```
 *
 * @see {@link findBeforeRelease} - Preferred function for new code
 * @see {@link calculateIntervalDate} - Pure date calculation without releases
 */
export function calculateBeforeDate(
  destructionDate: Date,
  interval: ComparisonInterval,
  releases: WaybackRelease[]
): Date {
  // Delegate to new implementation for backwards compatibility
  return findBeforeRelease(destructionDate, interval, releases);
}

/**
 * Find the index of the Wayback release closest to a target date.
 *
 * This function searches through all available Wayback satellite imagery releases
 * to find the one with the minimum time difference from the target date. It considers
 * releases both before and after the target date, selecting whichever is temporally closer.
 *
 * The function uses absolute time differences, so a release 5 days before the target
 * is considered equally close to one 5 days after.
 *
 * Edge case handling:
 * - Empty releases array: Returns 0 (safe default index)
 * - Target date before all releases: Returns 0 (earliest release)
 * - Target date after all releases: Returns last index (most recent release)
 * - Multiple releases with same distance: Returns the first match found
 *
 * @param releases - Array of available Wayback releases, in any order
 *                   (function will work regardless of ordering)
 * @param targetDate - The date to search for (e.g., calculated "before" date)
 * @returns Zero-based index of the closest release in the releases array
 *
 * @example
 * ```typescript
 * const releases = await fetchWaybackReleases();
 * const targetDate = new Date('2023-06-15');
 *
 * const closestIndex = findClosestReleaseIndex(releases, targetDate);
 * const closestRelease = releases[closestIndex];
 *
 * console.log(closestRelease.releaseDate); // e.g., "2023-06-12"
 * ```
 *
 * @see {@link calculateBeforeDate} - Primary consumer of this function
 */
export function findClosestReleaseIndex(
  releases: WaybackRelease[],
  targetDate: Date
): number {
  if (releases.length === 0) return 0;

  const targetTime = targetDate.getTime();

  // Find the release with the minimum time difference
  let closestIndex = 0;
  let minDiff = Math.abs(new Date(releases[0].releaseDate).getTime() - targetTime);

  for (let i = 1; i < releases.length; i++) {
    const releaseTime = new Date(releases[i].releaseDate).getTime();
    const diff = Math.abs(releaseTime - targetTime);

    if (diff < minDiff) {
      minDiff = diff;
      closestIndex = i;
    }
  }

  return closestIndex;
}
