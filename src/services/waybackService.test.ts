import { describe, it, expect } from "vitest";
import { fetchWaybackReleases, getClosestRelease, filterReleasesByDateRange, type WaybackRelease } from "./waybackService";

/**
 * Wayback Service Tests
 * Tests API integration, data parsing, and utility functions
 */

describe("waybackService", () => {
  describe("fetchWaybackReleases", () => {
    it("fetches releases from ESRI Wayback API", async () => {
      const releases = await fetchWaybackReleases();

      // Should return an array
      expect(Array.isArray(releases)).toBe(true);

      // Should have multiple releases (fallback has 3, real API has 150+)
      expect(releases.length).toBeGreaterThanOrEqual(3);
    });

    it("returns releases with correct structure", async () => {
      const releases = await fetchWaybackReleases();
      const firstRelease = releases[0];

      // Verify structure
      expect(firstRelease).toHaveProperty("releaseNum");
      expect(firstRelease).toHaveProperty("releaseDate");
      expect(firstRelease).toHaveProperty("label");
      expect(firstRelease).toHaveProperty("tileUrl");
      expect(firstRelease).toHaveProperty("maxZoom");

      // Verify types
      expect(typeof firstRelease.releaseNum).toBe("number");
      expect(typeof firstRelease.releaseDate).toBe("string");
      expect(typeof firstRelease.label).toBe("string");
      expect(typeof firstRelease.tileUrl).toBe("string");
      expect(typeof firstRelease.maxZoom).toBe("number");
    });

    it("returns releases sorted by date (oldest first)", async () => {
      const releases = await fetchWaybackReleases();

      for (let i = 1; i < releases.length; i++) {
        const prevDate = new Date(releases[i - 1].releaseDate);
        const currentDate = new Date(releases[i].releaseDate);
        expect(currentDate.getTime()).toBeGreaterThanOrEqual(prevDate.getTime());
      }
    });

    it("converts tile URLs to Leaflet format", async () => {
      const releases = await fetchWaybackReleases();
      const firstRelease = releases[0];

      // Should use {z}/{y}/{x} format, not {level}/{row}/{col}
      expect(firstRelease.tileUrl).toContain("{z}");
      expect(firstRelease.tileUrl).toContain("{y}");
      expect(firstRelease.tileUrl).toContain("{x}");
      expect(firstRelease.tileUrl).not.toContain("{level}");
      expect(firstRelease.tileUrl).not.toContain("{row}");
      expect(firstRelease.tileUrl).not.toContain("{col}");
    });

    it("extracts dates in YYYY-MM-DD format", async () => {
      const releases = await fetchWaybackReleases();
      const firstRelease = releases[0];

      // Date should match YYYY-MM-DD format
      expect(firstRelease.releaseDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe("getClosestRelease", () => {
    const mockReleases: WaybackRelease[] = [
      {
        releaseNum: 1,
        releaseDate: "2020-01-01",
        label: "2020-01-01",
        tileUrl: "https://example.com/tile/1/{z}/{y}/{x}",
        maxZoom: 19,
      },
      {
        releaseNum: 2,
        releaseDate: "2021-01-01",
        label: "2021-01-01",
        tileUrl: "https://example.com/tile/2/{z}/{y}/{x}",
        maxZoom: 19,
      },
      {
        releaseNum: 3,
        releaseDate: "2022-01-01",
        label: "2022-01-01",
        tileUrl: "https://example.com/tile/3/{z}/{y}/{x}",
        maxZoom: 19,
      },
    ];

    it("finds exact match", () => {
      const targetDate = new Date("2021-01-01");
      const closest = getClosestRelease(mockReleases, targetDate);
      expect(closest.releaseNum).toBe(2);
    });

    it("finds closest before target date", () => {
      const targetDate = new Date("2020-06-01");
      const closest = getClosestRelease(mockReleases, targetDate);
      expect(closest.releaseNum).toBe(1);
    });

    it("finds closest after target date", () => {
      const targetDate = new Date("2021-06-01");
      const closest = getClosestRelease(mockReleases, targetDate);
      expect(closest.releaseNum).toBe(2);
    });
  });

  describe("filterReleasesByDateRange", () => {
    const mockReleases: WaybackRelease[] = [
      {
        releaseNum: 1,
        releaseDate: "2020-01-01",
        label: "2020-01-01",
        tileUrl: "https://example.com/tile/1/{z}/{y}/{x}",
        maxZoom: 19,
      },
      {
        releaseNum: 2,
        releaseDate: "2021-01-01",
        label: "2021-01-01",
        tileUrl: "https://example.com/tile/2/{z}/{y}/{x}",
        maxZoom: 19,
      },
      {
        releaseNum: 3,
        releaseDate: "2022-01-01",
        label: "2022-01-01",
        tileUrl: "https://example.com/tile/3/{z}/{y}/{x}",
        maxZoom: 19,
      },
      {
        releaseNum: 4,
        releaseDate: "2023-01-01",
        label: "2023-01-01",
        tileUrl: "https://example.com/tile/4/{z}/{y}/{x}",
        maxZoom: 19,
      },
    ];

    it("filters releases within date range", () => {
      const startDate = new Date("2021-01-01");
      const endDate = new Date("2022-12-31");
      const filtered = filterReleasesByDateRange(mockReleases, startDate, endDate);

      expect(filtered.length).toBe(2);
      expect(filtered[0].releaseNum).toBe(2);
      expect(filtered[1].releaseNum).toBe(3);
    });

    it("includes boundary dates", () => {
      const startDate = new Date("2021-01-01");
      const endDate = new Date("2022-01-01");
      const filtered = filterReleasesByDateRange(mockReleases, startDate, endDate);

      expect(filtered.length).toBe(2);
      expect(filtered[0].releaseNum).toBe(2);
      expect(filtered[1].releaseNum).toBe(3);
    });

    it("returns empty array if no releases in range", () => {
      const startDate = new Date("2024-01-01");
      const endDate = new Date("2025-01-01");
      const filtered = filterReleasesByDateRange(mockReleases, startDate, endDate);

      expect(filtered.length).toBe(0);
    });
  });
});
