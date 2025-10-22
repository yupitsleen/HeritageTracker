import { describe, it, expect } from "vitest";

/**
 * Tests for the findNearestWaybackRelease algorithm
 * This algorithm finds the LATEST Wayback release that occurred BEFORE (or on) a destruction date
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
 * Implementation of the algorithm (copied from AdvancedAnimation.tsx)
 */
function findNearestWaybackRelease(releases: typeof mockReleases, targetDate: Date): number {
  if (releases.length === 0) return 0;

  const targetTime = targetDate.getTime();
  let nearestIndex = 0;

  // Find the LATEST release that occurred BEFORE or ON the target date
  // We iterate through all releases and keep updating to the latest one that's still before/on target
  for (let i = 0; i < releases.length; i++) {
    const releaseTime = new Date(releases[i].releaseDate).getTime();

    // Only consider releases that are before or on the target date
    if (releaseTime <= targetTime) {
      nearestIndex = i; // This is valid, keep it
    } else {
      // We've passed the target date, stop looking
      break;
    }
  }

  return nearestIndex;
}

describe("findNearestWaybackRelease Algorithm", () => {
  describe("Normal Cases", () => {
    it("finds the latest release before destruction date", () => {
      // Site destroyed on 2023-11-20 (between releases 3 and 4)
      const destructionDate = new Date("2023-11-20");
      const result = findNearestWaybackRelease(mockReleases, destructionDate);

      // Should return index 2 (2023-11-15), the latest release BEFORE 2023-11-20
      expect(result).toBe(2);
      expect(mockReleases[result].releaseDate).toBe("2023-11-15");
    });

    it("finds the latest release when destruction date is exactly on a release date", () => {
      // Site destroyed exactly on release date
      const destructionDate = new Date("2023-12-10");
      const result = findNearestWaybackRelease(mockReleases, destructionDate);

      // Should return index 3 (2023-12-10), the exact match
      expect(result).toBe(3);
      expect(mockReleases[result].releaseDate).toBe("2023-12-10");
    });

    it("finds the latest release when destruction is after the last release", () => {
      // Site destroyed after the last Wayback release
      const destructionDate = new Date("2024-06-15");
      const result = findNearestWaybackRelease(mockReleases, destructionDate);

      // Should return index 4 (2024-01-10), the last/latest release
      expect(result).toBe(4);
      expect(mockReleases[result].releaseDate).toBe("2024-01-10");
    });

    it("returns first release when destruction is before all releases", () => {
      // Site destroyed before any Wayback releases exist
      const destructionDate = new Date("2010-01-01");
      const result = findNearestWaybackRelease(mockReleases, destructionDate);

      // Should return index 0 (2014-02-20), the only available release
      expect(result).toBe(0);
      expect(mockReleases[result].releaseDate).toBe("2014-02-20");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty releases array", () => {
      const destructionDate = new Date("2023-12-07");
      const result = findNearestWaybackRelease([], destructionDate);

      // Should return 0 as fallback
      expect(result).toBe(0);
    });

    it("handles single release before destruction", () => {
      const singleRelease = [mockReleases[0]];
      const destructionDate = new Date("2023-12-07");
      const result = findNearestWaybackRelease(singleRelease, destructionDate);

      // Should return index 0
      expect(result).toBe(0);
    });

    it("handles single release after destruction", () => {
      const singleRelease = [mockReleases[4]]; // 2024-01-10
      const destructionDate = new Date("2023-12-07");
      const result = findNearestWaybackRelease(singleRelease, destructionDate);

      // Should return index 0 (even though it's after - it's the only option)
      expect(result).toBe(0);
    });
  });

  describe("Specific Heritage Site Scenarios", () => {
    it("finds correct release for Great Omari Mosque (destroyed 2023-12-07)", () => {
      // Great Omari Mosque was destroyed on 2023-12-07
      const destructionDate = new Date("2023-12-07");
      const result = findNearestWaybackRelease(mockReleases, destructionDate);

      // Should return index 2 (2023-11-15), showing imagery from before destruction
      expect(result).toBe(2);
      expect(mockReleases[result].releaseDate).toBe("2023-11-15");
    });

    it("finds correct release for site destroyed in October 2023", () => {
      // Site destroyed early in the conflict (Oct 2023)
      const destructionDate = new Date("2023-10-15");
      const result = findNearestWaybackRelease(mockReleases, destructionDate);

      // Should return index 1 (2023-10-01), the latest before mid-October
      expect(result).toBe(1);
      expect(mockReleases[result].releaseDate).toBe("2023-10-01");
    });

    it("finds correct release for site destroyed just after a release", () => {
      // Site destroyed one day after a release
      const destructionDate = new Date("2023-10-02");
      const result = findNearestWaybackRelease(mockReleases, destructionDate);

      // Should return index 1 (2023-10-01), NOT index 2
      expect(result).toBe(1);
      expect(mockReleases[result].releaseDate).toBe("2023-10-01");
    });
  });

  describe("Algorithm Correctness", () => {
    it("never returns a release AFTER the destruction date", () => {
      // Test multiple dates to ensure we NEVER get a future release
      const testDates = [
        new Date("2023-10-20"),
        new Date("2023-11-20"),
        new Date("2023-12-05"),
        new Date("2024-01-05"),
      ];

      testDates.forEach((destructionDate) => {
        const result = findNearestWaybackRelease(mockReleases, destructionDate);
        const selectedRelease = mockReleases[result];
        const selectedTime = new Date(selectedRelease.releaseDate).getTime();
        const destructionTime = destructionDate.getTime();

        // The selected release must NEVER be after the destruction date
        expect(selectedTime).toBeLessThanOrEqual(destructionTime);
      });
    });

    it("always returns the LATEST release before destruction (not earliest)", () => {
      // Site destroyed on 2023-12-07
      const destructionDate = new Date("2023-12-07");
      const result = findNearestWaybackRelease(mockReleases, destructionDate);

      // Should be index 2 (2023-11-15), not index 0 or 1
      expect(result).toBe(2);
      expect(result).not.toBe(0); // Not the earliest (2014-02-20)
      expect(result).not.toBe(1); // Not an older one (2023-10-01)
    });

    it("is monotonic - later destruction dates never return earlier releases", () => {
      // Test that as destruction dates increase, the selected release index increases or stays the same
      const date1 = new Date("2023-10-05");
      const date2 = new Date("2023-11-20");
      const date3 = new Date("2023-12-15");

      const result1 = findNearestWaybackRelease(mockReleases, date1);
      const result2 = findNearestWaybackRelease(mockReleases, date2);
      const result3 = findNearestWaybackRelease(mockReleases, date3);

      // Later dates should have equal or higher indices
      expect(result2).toBeGreaterThanOrEqual(result1);
      expect(result3).toBeGreaterThanOrEqual(result2);
    });
  });
});
