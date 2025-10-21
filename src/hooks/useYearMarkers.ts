import { useMemo } from "react";
import { findClosestReleaseIndex } from "../services/waybackService";
import type { WaybackRelease } from "../services/waybackService";

/**
 * Year marker for timeline visualization
 */
export interface YearMarker {
  year: number;
  releaseIndex: number;
  position: number; // 0-100 percentage for visual positioning
}

/**
 * useYearMarkers - Calculate year markers for Wayback timeline
 *
 * Generates a marker for each year in the releases range, where each marker
 * points to the Wayback release closest to January 1st of that year.
 *
 * @param releases - Array of Wayback releases sorted by date
 * @returns Array of year markers with position data for visualization
 *
 * @example
 * const yearMarkers = useYearMarkers(releases);
 * // Returns: [{ year: 2014, releaseIndex: 0, position: 0 }, ...]
 */
export function useYearMarkers(releases: WaybackRelease[]): YearMarker[] {
  return useMemo(() => {
    if (releases.length === 0) return [];

    const startDate = new Date(releases[0].releaseDate);
    const endDate = new Date(releases[releases.length - 1].releaseDate);
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();

    const markers: YearMarker[] = [];

    for (let year = startYear; year <= endYear; year++) {
      const releaseIndex = findClosestReleaseIndex(releases, `${year}-01-01`);
      const position = (releaseIndex / (releases.length - 1)) * 100;

      markers.push({ year, releaseIndex, position });
    }

    return markers;
  }, [releases]);
}
