import { describe, it, expect } from "vitest";
import { mockSites } from "./mockSites";
import type { GazaSite } from "../types";

/**
 * Data validation tests to ensure all sites meet schema requirements
 * Run these tests before adding new sites to catch errors early
 */

// Gaza bounds (approximate)
const GAZA_BOUNDS = {
  minLat: 31.2,
  maxLat: 31.6,
  minLng: 34.2,
  maxLng: 34.6,
};

describe("Site Data Validation", () => {
  describe("Schema Validation", () => {
    it("all sites have required fields", () => {
      mockSites.forEach((site) => {
        expect(site.id, `Site ${site.name} missing id`).toBeDefined();
        expect(site.type, `Site ${site.name} missing type`).toBeDefined();
        expect(site.name, `Site ${site.name} missing name`).toBeDefined();
        expect(site.yearBuilt, `Site ${site.name} missing yearBuilt`).toBeDefined();
        expect(site.description, `Site ${site.name} missing description`).toBeDefined();
        expect(site.historicalSignificance, `Site ${site.name} missing historicalSignificance`).toBeDefined();
        expect(site.culturalValue, `Site ${site.name} missing culturalValue`).toBeDefined();
        expect(site.coordinates, `Site ${site.name} missing coordinates`).toBeDefined();
        expect(site.status, `Site ${site.name} missing status`).toBeDefined();
        expect(site.sources, `Site ${site.name} missing sources`).toBeDefined();
        expect(site.verifiedBy, `Site ${site.name} missing verifiedBy`).toBeDefined();
      });
    });

    it("all sites have unique IDs", () => {
      const ids = mockSites.map((site) => site.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("all sites have valid types", () => {
      const validTypes: Array<GazaSite["type"]> = [
        "mosque",
        "church",
        "archaeological",
        "museum",
        "historic-building",
      ];

      mockSites.forEach((site) => {
        expect(validTypes).toContain(site.type);
      });
    });

    it("all sites have valid status", () => {
      const validStatuses: Array<GazaSite["status"]> = [
        "destroyed",
        "heavily-damaged",
        "damaged",
      ];

      mockSites.forEach((site) => {
        expect(validStatuses, `Site ${site.name} has invalid status: ${site.status}`).toContain(
          site.status
        );
      });
    });
  });

  describe("Coordinate Validation", () => {
    it("all sites have valid coordinate format [lat, lng]", () => {
      mockSites.forEach((site) => {
        expect(Array.isArray(site.coordinates), `Site ${site.name} coordinates not an array`).toBe(
          true
        );
        expect(site.coordinates.length, `Site ${site.name} coordinates length not 2`).toBe(2);
        expect(
          typeof site.coordinates[0],
          `Site ${site.name} latitude not a number`
        ).toBe("number");
        expect(
          typeof site.coordinates[1],
          `Site ${site.name} longitude not a number`
        ).toBe("number");
      });
    });

    it("all sites have coordinates within Gaza bounds", () => {
      mockSites.forEach((site) => {
        const [lat, lng] = site.coordinates;
        expect(
          lat,
          `Site ${site.name} latitude ${lat} outside Gaza bounds (${GAZA_BOUNDS.minLat}-${GAZA_BOUNDS.maxLat})`
        ).toBeGreaterThanOrEqual(GAZA_BOUNDS.minLat);
        expect(
          lat,
          `Site ${site.name} latitude ${lat} outside Gaza bounds (${GAZA_BOUNDS.minLat}-${GAZA_BOUNDS.maxLat})`
        ).toBeLessThanOrEqual(GAZA_BOUNDS.maxLat);
        expect(
          lng,
          `Site ${site.name} longitude ${lng} outside Gaza bounds (${GAZA_BOUNDS.minLng}-${GAZA_BOUNDS.maxLng})`
        ).toBeGreaterThanOrEqual(GAZA_BOUNDS.minLng);
        expect(
          lng,
          `Site ${site.name} longitude ${lng} outside Gaza bounds (${GAZA_BOUNDS.minLng}-${GAZA_BOUNDS.maxLng})`
        ).toBeLessThanOrEqual(GAZA_BOUNDS.maxLng);
      });
    });
  });

  describe("Date Validation", () => {
    it("all sites with dateDestroyed have valid ISO format", () => {
      const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

      mockSites.forEach((site) => {
        if (site.dateDestroyed) {
          expect(
            isoDateRegex.test(site.dateDestroyed),
            `Site ${site.name} dateDestroyed "${site.dateDestroyed}" not in ISO format (YYYY-MM-DD)`
          ).toBe(true);

          // Verify date is valid
          const date = new Date(site.dateDestroyed);
          expect(
            date.toString(),
            `Site ${site.name} dateDestroyed "${site.dateDestroyed}" is invalid`
          ).not.toBe("Invalid Date");
        }
      });
    });

    it("all destruction dates are between 2023-2024", () => {
      mockSites.forEach((site) => {
        if (site.dateDestroyed) {
          const date = new Date(site.dateDestroyed);
          const year = date.getFullYear();
          expect(
            year,
            `Site ${site.name} destroyed in ${year}, expected 2023-2024`
          ).toBeGreaterThanOrEqual(2023);
          expect(
            year,
            `Site ${site.name} destroyed in ${year}, expected 2023-2024`
          ).toBeLessThanOrEqual(2025); // Allow 2025 for recent events
        }
      });
    });

    it("all sites have non-empty yearBuilt", () => {
      mockSites.forEach((site) => {
        expect(
          site.yearBuilt.trim().length,
          `Site ${site.name} has empty yearBuilt`
        ).toBeGreaterThan(0);
      });
    });
  });

  describe("Source Validation", () => {
    it("all sites have at least one source", () => {
      mockSites.forEach((site) => {
        expect(
          site.sources.length,
          `Site ${site.name} has no sources`
        ).toBeGreaterThan(0);
      });
    });

    it("all sources have required fields", () => {
      mockSites.forEach((site) => {
        site.sources.forEach((source, index) => {
          expect(
            source.organization,
            `Site ${site.name} source ${index + 1} missing organization`
          ).toBeDefined();
          expect(
            source.title,
            `Site ${site.name} source ${index + 1} missing title`
          ).toBeDefined();
          expect(
            source.type,
            `Site ${site.name} source ${index + 1} missing type`
          ).toBeDefined();
        });
      });
    });

    it("all source URLs (if provided) are valid", () => {
      const urlRegex = /^https?:\/\/.+/;

      mockSites.forEach((site) => {
        site.sources.forEach((source, index) => {
          if (source.url) {
            expect(
              urlRegex.test(source.url),
              `Site ${site.name} source ${index + 1} URL "${source.url}" is invalid`
            ).toBe(true);
          }
        });
      });
    });
  });

  describe("Text Content Validation", () => {
    it("all sites have meaningful descriptions (min 50 chars)", () => {
      mockSites.forEach((site) => {
        expect(
          site.description.length,
          `Site ${site.name} description too short (${site.description.length} chars, min 50)`
        ).toBeGreaterThanOrEqual(50);
      });
    });

    it("all sites have verifiedBy array with at least one entry", () => {
      mockSites.forEach((site) => {
        expect(
          site.verifiedBy.length,
          `Site ${site.name} has no verification sources`
        ).toBeGreaterThan(0);
      });
    });
  });

  describe("Islamic Calendar Validation (Optional)", () => {
    it("if dateDestroyedIslamic exists, it should be non-empty", () => {
      mockSites.forEach((site) => {
        if (site.dateDestroyedIslamic) {
          expect(
            site.dateDestroyedIslamic.trim().length,
            `Site ${site.name} has empty dateDestroyedIslamic`
          ).toBeGreaterThan(0);
        }
      });
    });

    it("if yearBuiltIslamic exists, it should be non-empty", () => {
      mockSites.forEach((site) => {
        if (site.yearBuiltIslamic) {
          expect(
            site.yearBuiltIslamic.trim().length,
            `Site ${site.name} has empty yearBuiltIslamic`
          ).toBeGreaterThan(0);
        }
      });
    });
  });

  describe("Data Quality Metrics", () => {
    it("reports total site count", () => {
      console.log(`\n✓ Total sites validated: ${mockSites.length}`);
      expect(mockSites.length).toBeGreaterThan(0);
    });

    it("reports sites by type", () => {
      const typeCount = mockSites.reduce(
        (acc, site) => {
          acc[site.type] = (acc[site.type] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      console.log("\n✓ Sites by type:");
      Object.entries(typeCount).forEach(([type, count]) => {
        console.log(`  - ${type}: ${count}`);
      });

      expect(Object.keys(typeCount).length).toBeGreaterThan(0);
    });

    it("reports sites by status", () => {
      const statusCount = mockSites.reduce(
        (acc, site) => {
          acc[site.status] = (acc[site.status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      console.log("\n✓ Sites by status:");
      Object.entries(statusCount).forEach(([status, count]) => {
        console.log(`  - ${status}: ${count}`);
      });

      expect(Object.keys(statusCount).length).toBeGreaterThan(0);
    });

    it("reports Islamic calendar coverage", () => {
      const withIslamicDate = mockSites.filter((site) => site.dateDestroyedIslamic).length;
      const withIslamicYear = mockSites.filter((site) => site.yearBuiltIslamic).length;

      console.log("\n✓ Islamic calendar coverage:");
      console.log(`  - Sites with Islamic destruction date: ${withIslamicDate}/${mockSites.length}`);
      console.log(`  - Sites with Islamic year built: ${withIslamicYear}/${mockSites.length}`);

      // No assertions - Islamic dates are optional
    });
  });
});
