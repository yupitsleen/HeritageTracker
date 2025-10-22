import type { GazaSite } from "../types";
import type { WaybackRelease } from "../contexts/WaybackContext";

/**
 * Event marker interface for timeline visualization
 */
export interface EventMarkerGroup {
  position: number; // Position as percentage (0-100)
  sites: Array<{
    siteId: string;
    siteName: string;
    date: string;
    status: string;
  }>;
}

/**
 * Finds the closest Wayback release index for a given date
 * @param releases - Array of Wayback releases
 * @param targetDate - ISO date string to find closest release for
 * @returns Index of the closest release
 */
export function findClosestReleaseIndex(releases: WaybackRelease[], targetDate: string): number {
  const target = new Date(targetDate).getTime();
  let closestIndex = 0;
  let smallestDiff = Infinity;

  releases.forEach((release, index) => {
    const releaseTime = new Date(release.releaseDate).getTime();
    const diff = Math.abs(releaseTime - target);
    if (diff < smallestDiff) {
      smallestDiff = diff;
      closestIndex = index;
    }
  });

  return closestIndex;
}

/**
 * Groups destruction events by their closest Wayback release for timeline visualization
 * This enables stacking multiple events that occurred near the same release date
 *
 * @param sites - Array of heritage sites with potential destruction dates
 * @param releases - Array of Wayback satellite imagery releases
 * @returns Array of event marker groups with position and stacked sites
 */
export function groupEventsByRelease(
  sites: GazaSite[],
  releases: WaybackRelease[]
): EventMarkerGroup[] {
  if (sites.length === 0 || releases.length === 0) {
    return [];
  }

  // Extract sites with destruction dates
  const destructionEvents = sites
    .filter((site) => site.dateDestroyed)
    .map((site) => ({
      siteId: site.id,
      siteName: site.name,
      date: site.dateDestroyed!,
      status: site.status,
    }));

  // Group events by their closest Wayback release (enables stacking)
  const eventsByRelease = new Map<number, typeof destructionEvents>();

  destructionEvents.forEach((event) => {
    const releaseIndex = findClosestReleaseIndex(releases, event.date);
    if (!eventsByRelease.has(releaseIndex)) {
      eventsByRelease.set(releaseIndex, []);
    }
    eventsByRelease.get(releaseIndex)!.push(event);
  });

  // Convert to marker groups with calculated positions
  const markerGroups: EventMarkerGroup[] = [];

  eventsByRelease.forEach((events, releaseIndex) => {
    const position = (releaseIndex / (releases.length - 1)) * 100;
    markerGroups.push({
      position,
      sites: events,
    });
  });

  return markerGroups;
}
