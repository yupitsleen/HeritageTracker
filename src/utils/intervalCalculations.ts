/**
 * Interval Calculation Utilities
 *
 * Helpers for calculating date intervals for comparison mode
 */

import type { ComparisonInterval } from "../types/waybackTimelineTypes";
import type { WaybackRelease } from "../services/waybackService";
import { WAYBACK_FALLBACKS } from "../config/waybackTimeline";

/**
 * Calculate the "before" date based on the selected interval
 *
 * @param destructionDate - The date of site destruction
 * @param interval - The selected comparison interval
 * @param releases - Available Wayback releases
 * @returns The calculated "before" date
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
 * Find the closest Wayback release to a target date
 *
 * @param releases - Available Wayback releases
 * @param targetDate - The target date to find the closest release to
 * @returns The index of the closest release
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
