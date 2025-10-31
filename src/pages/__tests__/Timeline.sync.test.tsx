import { describe, it, expect } from "vitest";

/**
 * Tests for the findNearestWaybackRelease algorithm
 * This algorithm finds the EARLIEST Wayback release that occurred AFTER a destruction date
 */

// Mock Wayback releases (sorted chronologically)
const mockReleases = [
  { releaseNum: 1, releaseDate: "2014-02-20", label: "2014-02-20", tileUrl: "url1", maxZoom: 19 },
  { releaseNum: 2, releaseDate: "2023-10-01", label: "2023-10-01", tileUrl: "url2", maxZoom: 19 },
  { releaseNum: 3, releaseDate: "2023-11-15", label: "2023-11-15", tileUrl: "url3", maxZoom: 19 },
  { releaseNum: 4, releaseDate: "2023-12-10", label: "2023-12-10", tileUrl: "url4", maxZoom: 19 },
  { releaseNum: 5, releaseDate: "2024-01-10", label: "2024-01-10", tileUrl: "url5", maxZoom: 19 },
];

/**
 * Implementation of the algorithm (copied from Timeline.tsx)
 */
function findNearestWaybackRelease(releases: typeof mockReleases, targetDate: Date): number {
  if (releases.length === 0) return 0;

  if (!targetDate || isNaN(targetDate.getTime())) {
    return releases.length - 1;
  }

  const targetTime = targetDate.getTime();

  // Find the EARLIEST release that occurred AFTER the target date
  for (let i = 0; i < releases.length; i++) {
    const releaseTime = new Date(releases[i].releaseDate).getTime();

    // Return the first release that's after the target date
    if (releaseTime > targetTime) {
      return i;
    }
  }

  // If no release found after the target date, return the last release
  return releases.length - 1;
}

describe("findNearestWaybackRelease Algorithm", () => {
  describe("Normal Case", () => {
    it("finds the earliest release after destruction date", () => {
      // Site destroyed on 2023-11-20 (between releases 3 and 4)
      const destructionDate = new Date("2023-11-20");
      const result = findNearestWaybackRelease(mockReleases, destructionDate);

      // Should return index 3 (2023-12-10), the earliest release AFTER 2023-11-20
      expect(result).toBe(3);
      expect(mockReleases[result].releaseDate).toBe("2023-12-10");
    });
  });
});
