import { describe, it, expect } from "vitest";
import { mockSites } from "./mockSites";
import type { Site } from "../types";

/**
 * Data validation tests to ensure all sites meet schema requirements
 * Run these tests before adding new sites to catch errors early
 */

// Historic Palestine bounds (Gaza, West Bank, Israel/Galilee/Jerusalem area) - approximate
const PALESTINE_BOUNDS = {
  minLat: 29.4,
  maxLat: 33.4,
  minLng: 34.2,
  maxLng: 35.7,
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
      const validTypes: Array<Site["type"]> = [
        "mosque",
        "church",
        "archaeological",
        "museum",
        "historic-building",
        "monument",
        "cemetery",
        "archive",
        "hospital",
        "school",
      ];

      mockSites.forEach((site) => {
        expect(validTypes).toContain(site.type);
      });
    });

    it("all sites have valid status", () => {
      const validStatuses: Array<Site["status"]> = [
        "destroyed",
        "heavily-damaged",
        "damaged",
        "abandoned",
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

    it("all sites have coordinates within historic Palestine bounds", () => {
      mockSites.forEach((site) => {
        const [lat, lng] = site.coordinates;
        expect(
          lat,
          `Site ${site.name} latitude ${lat} outside bounds (${PALESTINE_BOUNDS.minLat}-${PALESTINE_BOUNDS.maxLat})`
        ).toBeGreaterThanOrEqual(PALESTINE_BOUNDS.minLat);
        expect(
          lat,
          `Site ${site.name} latitude ${lat} outside bounds (${PALESTINE_BOUNDS.minLat}-${PALESTINE_BOUNDS.maxLat})`
        ).toBeLessThanOrEqual(PALESTINE_BOUNDS.maxLat);
        expect(
          lng,
          `Site ${site.name} longitude ${lng} outside bounds (${PALESTINE_BOUNDS.minLng}-${PALESTINE_BOUNDS.maxLng})`
        ).toBeGreaterThanOrEqual(PALESTINE_BOUNDS.minLng);
        expect(
          lng,
          `Site ${site.name} longitude ${lng} outside bounds (${PALESTINE_BOUNDS.minLng}-${PALESTINE_BOUNDS.maxLng})`
        ).toBeLessThanOrEqual(PALESTINE_BOUNDS.maxLng);
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

    it("all destruction dates are between 1948 and today", () => {
      mockSites.forEach((site) => {
        if (site.dateDestroyed) {
          const date = new Date(site.dateDestroyed);
          const year = date.getFullYear();
          expect(
            year,
            `Site ${site.name} destroyed in ${year}, expected 1948 or later`
          ).toBeGreaterThanOrEqual(1948);
          expect(
            year,
            `Site ${site.name} destroyed in ${year}, expected no later than current year`
          ).toBeLessThanOrEqual(new Date().getFullYear());
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

  describe("Data Integrity", () => {
    it("dateDestroyedIslamic matches dateDestroyed (Umm al-Qura ±1 day, any variant)", () => {
      const MONTH_NUM = (raw: string): number | null => {
        const t = raw.toLowerCase().replace(/[^a-z]/g, "");
        if (t.includes("muharram")) return 1;
        if (t.includes("safar")) return 2;
        if (t.includes("rabi")) return t.includes("thani") || t.includes("akhir") || /ii$/.test(t) ? 4 : 3;
        if (t.includes("jumada")) return t.includes("thani") || t.includes("akhir") || /ii$/.test(t) ? 6 : 5;
        if (t.includes("rajab")) return 7;
        if (t.includes("shaban")) return 8;
        if (t.includes("ramadan")) return 9;
        if (t.includes("shawwal")) return 10;
        if (t.includes("qidah") || t.includes("qada")) return 11;
        if (t.includes("hijjah")) return 12;
        return null;
      };
      const VARIANTS = ["islamic-umalqura", "islamic-civil", "islamic-tbla", "islamic"];
      const gregToIslamic = (iso: string, variant: string, offsetDays: number) => {
        const dt = new Date(`${iso}T12:00:00Z`);
        dt.setUTCDate(dt.getUTCDate() + offsetDays);
        const parts = new Intl.DateTimeFormat(`en-u-ca-${variant}`, {
          day: "numeric",
          month: "numeric",
          year: "numeric",
          timeZone: "UTC",
        }).formatToParts(dt);
        const get = (type: string): number =>
          Number(parts.find((p) => p.type === type)?.value);
        return { d: get("day"), m: get("month"), y: get("year") };
      };

      mockSites.forEach((site) => {
        if (!site.dateDestroyed || !site.dateDestroyedIslamic) return;
        if (!/^\d{4}-\d{2}-\d{2}$/.test(site.dateDestroyed)) return;

        const match = site.dateDestroyedIslamic.match(/^(\d{1,2})\s+(.+?)\s+(\d{3,4})\s*AH$/i);
        expect(
          match,
          `Site ${site.name} dateDestroyedIslamic "${site.dateDestroyedIslamic}" is not "<day> <month> <year> AH"`
        ).not.toBeNull();
        const claimedMonth = MONTH_NUM(match![2]);
        expect(
          claimedMonth,
          `Site ${site.name} has unrecognized Islamic month "${match![2]}"`
        ).not.toBeNull();
        const claimed = { d: Number(match![1]), m: claimedMonth, y: Number(match![3]) };

        const matched = VARIANTS.some((variant) =>
          [0, -1, 1].some((offset) => {
            const got = gregToIslamic(site.dateDestroyed!, variant, offset);
            return got.d === claimed.d && got.m === claimed.m && got.y === claimed.y;
          })
        );
        const reference = gregToIslamic(site.dateDestroyed, "islamic-umalqura", 0);
        expect(
          matched,
          `Site ${site.name}: dateDestroyedIslamic "${site.dateDestroyedIslamic}" does not match ` +
            `dateDestroyed ${site.dateDestroyed} (expected ~${reference.d}/${reference.m}/${reference.y} AH)`
        ).toBe(true);
      });
    });

    it("sourceAssessmentDate is not before dateDestroyed", () => {
      mockSites.forEach((site) => {
        if (!site.dateDestroyed || !site.sourceAssessmentDate) return;
        expect(
          site.sourceAssessmentDate >= site.dateDestroyed,
          `Site ${site.name} assessed ${site.sourceAssessmentDate}, before destruction ${site.dateDestroyed}`
        ).toBe(true);
      });
    });

    it("no two sites share exact coordinates unless documented as the same building", () => {
      // Same physical place, deliberately separate entries (two destruction events,
      // or a facility housed inside another listed building).
      const SAME_BUILDING_PAIRS = new Set(
        [
          ["ibn-marwan-mosque", "ali-ibn-marwan-shrine"],
          ["rashad-shawa-cultural-center", "diana-tamari-sabbagh-library"],
          ["central-archives-gaza", "old-gaza-municipality-building"],
          ["omari-mosque-jabaliya", "al-omari-mosque-jabaliya"],
          ["commonwealth-war-cemetery", "gaza-war-cemetery-al-tuffah"],
          ["islamic-university-central-library", "islamic-university-gaza-library"],
          ["sheikh-eid-mosque-mughrabi-quarter", "bou-medyan-zaouia"],
        ].map((pair) => pair.sort().join("|"))
      );

      const byCoord = new Map<string, string[]>();
      mockSites.forEach((site) => {
        const key = site.coordinates.join(",");
        byCoord.set(key, [...(byCoord.get(key) ?? []), site.id]);
      });

      byCoord.forEach((siteIds, coord) => {
        if (siteIds.length === 1) return;
        siteIds.forEach((idA, i) =>
          siteIds.slice(i + 1).forEach((idB) => {
            const pairKey = [idA, idB].sort().join("|");
            expect(
              SAME_BUILDING_PAIRS.has(pairKey),
              `Sites ${idA} and ${idB} share coordinates [${coord}] but are not a documented same-building pair — placeholder coordinates?`
            ).toBe(true);
          })
        );
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
