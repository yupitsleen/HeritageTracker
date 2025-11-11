/**
 * Interval Calculation Utilities
 *
 * Helpers for calculating date intervals for comparison mode
 */

import type { ComparisonInterval } from "../types/waybackTimelineTypes";
import type { WaybackRelease } from "../services/waybackService";
import { WAYBACK_FALLBACKS } from "../config/waybackTimeline";

/**
 * Calculate the "before" date for comparison mode based on the selected interval.
 *
 * This function determines the optimal "before" date for side-by-side satellite
 * imagery comparison. It prioritizes actual Wayback release dates when available,
 * falling back to calculated intervals based on the configured values.
 *
 * Behavior by interval type:
 * - **as_large_as_possible**: Returns the earliest available Wayback release date.
 *   If no releases are available, falls back to {@link WAYBACK_FALLBACKS.LARGE_INTERVAL_YEARS}
 *   years before the destruction date (default: 10 years).
 *
 * - **as_small_as_possible**: Returns the most recent Wayback release that occurred
 *   before the destruction date. If no such release exists, falls back to
 *   {@link WAYBACK_FALLBACKS.SMALL_INTERVAL_DAYS} days before (default: 7 days).
 *
 * - **1_month**: Returns exactly {@link WAYBACK_FALLBACKS.ONE_MONTH_DAYS} days
 *   before the destruction date (default: 30 days).
 *
 * - **1_year**: Returns exactly 1 year before the destruction date.
 *
 * - **5_years**: Returns exactly 5 years before the destruction date.
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
 *
 * // Get earliest available imagery
 * const earliestDate = calculateBeforeDate(
 *   destructionDate,
 *   'as_large_as_possible',
 *   releases
 * );
 * // Returns: First release date (e.g., 2014-02-20)
 * ```
 *
 * @see {@link findClosestReleaseIndex} - Used to find the actual Wayback release
 * @see {@link WAYBACK_FALLBACKS} - Configuration for fallback intervals
 */
export function calculateBeforeDate(
  destructionDate: Date,
  interval: ComparisonInterval,
  releases: WaybackRelease[]
): Date {
  const destructionTime = destructionDate.getTime();

  switch (interval) {
    case "as_large_as_possible": {
      // Use the earliest available release
      if (releases.length > 0) {
        return new Date(releases[0].releaseDate);
      }
      // Fallback: Use configured large interval before destruction
      const fallbackDate = new Date(destructionTime);
      fallbackDate.setFullYear(
        fallbackDate.getFullYear() - WAYBACK_FALLBACKS.LARGE_INTERVAL_YEARS
      );
      return fallbackDate;
    }

    case "as_small_as_possible": {
      // Use the release immediately before destruction
      // Find the latest release before destruction date
      const releasesBeforeDestruction = releases.filter(
        (release) => new Date(release.releaseDate).getTime() < destructionTime
      );

      if (releasesBeforeDestruction.length > 0) {
        // Return the most recent release before destruction
        return new Date(
          releasesBeforeDestruction[releasesBeforeDestruction.length - 1].releaseDate
        );
      }

      // Fallback: Use configured small interval before destruction
      const fallbackDate = new Date(destructionTime);
      fallbackDate.setDate(fallbackDate.getDate() - WAYBACK_FALLBACKS.SMALL_INTERVAL_DAYS);
      return fallbackDate;
    }

    case "1_month": {
      // Use configured days for one month before destruction
      const beforeDate = new Date(destructionTime);
      beforeDate.setDate(beforeDate.getDate() - WAYBACK_FALLBACKS.ONE_MONTH_DAYS);
      return beforeDate;
    }

    case "1_year": {
      // 1 year before destruction
      const beforeDate = new Date(destructionTime);
      beforeDate.setFullYear(beforeDate.getFullYear() - 1);
      return beforeDate;
    }

    case "5_years": {
      // 5 years before destruction
      const beforeDate = new Date(destructionTime);
      beforeDate.setFullYear(beforeDate.getFullYear() - 5);
      return beforeDate;
    }

    default: {
      // Default to 1 month (using configured days)
      const beforeDate = new Date(destructionTime);
      beforeDate.setDate(beforeDate.getDate() - WAYBACK_FALLBACKS.ONE_MONTH_DAYS);
      return beforeDate;
    }
  }
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
