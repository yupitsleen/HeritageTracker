import { describe, it, expect } from "vitest";
import {
  filterSitesByTypeAndStatus,
  filterSitesByDestructionDate,
  filterSitesByCreationYear,
  parseYearBuilt,
} from "./siteFilters";
import type { GazaSite } from "../types";

const mockSites: GazaSite[] = [
  {
    id: "ancient-site",
    name: "Ancient Site",
    type: "archaeological",
    yearBuilt: "800 BCE - 1100 CE",
    coordinates: [31.5, 34.4],
    status: "destroyed",
    dateDestroyed: "2023-10-15",
    description: "Ancient site",
    historicalSignificance: "Test",
    culturalValue: "Test",
    verifiedBy: ["UNESCO"],
    images: { before: { url: "/test.jpg", credit: "Test" } },
    sources: [],
  },
  {
    id: "medieval-site",
    name: "Medieval Site",
    type: "mosque",
    yearBuilt: "7th century",
    coordinates: [31.5, 34.4],
    status: "heavily-damaged",
    dateDestroyed: "2023-12-01",
    description: "Medieval site",
    historicalSignificance: "Test",
    culturalValue: "Test",
    verifiedBy: ["UNESCO"],
    images: { before: { url: "/test.jpg", credit: "Test" } },
    sources: [],
  },
  {
    id: "modern-site",
    name: "Modern Site",
    type: "museum",
    yearBuilt: "1950",
    coordinates: [31.5, 34.4],
    status: "damaged",
    dateDestroyed: "2024-01-15",
    description: "Modern site",
    historicalSignificance: "Test",
    culturalValue: "Test",
    verifiedBy: ["UNESCO"],
    images: { before: { url: "/test.jpg", credit: "Test" } },
    sources: [],
  },
];

describe("filterSitesByTypeAndStatus", () => {
  it("returns all sites when no filters selected", () => {
    const result = filterSitesByTypeAndStatus(mockSites, [], []);
    expect(result).toHaveLength(3);
  });

  it("filters by type", () => {
    const result = filterSitesByTypeAndStatus(mockSites, ["mosque"], []);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("medieval-site");
  });

  it("filters by status", () => {
    const result = filterSitesByTypeAndStatus(mockSites, [], ["destroyed"]);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("ancient-site");
  });

  it("filters by both type and status", () => {
    const result = filterSitesByTypeAndStatus(mockSites, ["mosque"], ["heavily-damaged"]);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("medieval-site");
  });
});

describe("filterSitesByDestructionDate", () => {
  it("returns all sites when no date range specified", () => {
    const result = filterSitesByDestructionDate(mockSites, null, null);
    expect(result).toHaveLength(3);
  });

  it("filters by start date", () => {
    const result = filterSitesByDestructionDate(
      mockSites,
      new Date("2023-12-01"),
      null
    );
    expect(result).toHaveLength(2);
    expect(result.map((s) => s.id)).toContain("medieval-site");
    expect(result.map((s) => s.id)).toContain("modern-site");
  });

  it("filters by end date", () => {
    const result = filterSitesByDestructionDate(
      mockSites,
      null,
      new Date("2023-12-31")
    );
    expect(result).toHaveLength(2);
    expect(result.map((s) => s.id)).toContain("ancient-site");
    expect(result.map((s) => s.id)).toContain("medieval-site");
  });

  it("filters by date range", () => {
    const result = filterSitesByDestructionDate(
      mockSites,
      new Date("2023-11-01"),
      new Date("2023-12-31")
    );
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("medieval-site");
  });
});

describe("filterSitesByCreationYear", () => {
  it("returns all sites when no year range specified", () => {
    const result = filterSitesByCreationYear(mockSites, null, null);
    expect(result).toHaveLength(3);
  });

  it("filters by start year (BCE)", () => {
    // Start year -1000 should include sites from -1000 onwards
    // ancient-site: "800 BCE - 1100 CE" extracts 800 BCE = -800, which is > -1000 ✓
    // medieval-site: "7th century" = 650 CE, which is > -1000 ✓
    // modern-site: "1950" = 1950 CE, which is > -1000 ✓
    // All sites should pass because they're all after -1000
    const result = filterSitesByCreationYear(mockSites, -1000, null);
    expect(result).toHaveLength(3);

    // Test with -500 to filter out only ancient site
    const result2 = filterSitesByCreationYear(mockSites, -500, null);
    expect(result2).toHaveLength(2); // medieval and modern (ancient is -800, before -500)
  });

  it("filters by end year", () => {
    const result = filterSitesByCreationYear(mockSites, null, 1000);
    expect(result).toHaveLength(2);
    expect(result.map((s) => s.id)).toContain("ancient-site");
    expect(result.map((s) => s.id)).toContain("medieval-site");
  });

  it("filters by year range including BCE dates", () => {
    const result = filterSitesByCreationYear(mockSites, -1000, 1000);
    expect(result).toHaveLength(2);
    expect(result.map((s) => s.id)).toContain("ancient-site");
    expect(result.map((s) => s.id)).toContain("medieval-site");
  });

  it("handles century format correctly", () => {
    // 7th century = ~650 CE (midpoint)
    const result = filterSitesByCreationYear(mockSites, 600, 700);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("medieval-site");
  });

  it("filters modern sites by CE year", () => {
    const result = filterSitesByCreationYear(mockSites, 1900, 2000);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("modern-site");
  });
});

describe("parseYearBuilt", () => {
  describe("explicit years", () => {
    it("parses BCE years", () => {
      expect(parseYearBuilt("800 BCE")).toBe(-800);
      expect(parseYearBuilt("425 BC")).toBe(-425);
      expect(parseYearBuilt("1200 bce")).toBe(-1200);
    });

    it("parses CE years", () => {
      expect(parseYearBuilt("1200 CE")).toBe(1200);
      expect(parseYearBuilt("425 AD")).toBe(425);
      expect(parseYearBuilt("1950 ce")).toBe(1950);
    });

    it("parses standalone years", () => {
      expect(parseYearBuilt("1950")).toBe(1950);
      expect(parseYearBuilt("425")).toBe(425);
      expect(parseYearBuilt("1200")).toBe(1200);
    });
  });

  describe("date ranges", () => {
    it("parses CE ranges and returns midpoint", () => {
      expect(parseYearBuilt("800-900 CE")).toBe(850);
      expect(parseYearBuilt("1200-1300 CE")).toBe(1250);
      expect(parseYearBuilt("1400 - 1500 CE")).toBe(1450); // with spaces
    });

    it("parses BCE ranges and returns negative midpoint", () => {
      expect(parseYearBuilt("800-900 BCE")).toBe(-850);
      expect(parseYearBuilt("1200-1100 BC")).toBe(-1150);
    });

    it("parses ranges without era markers (assumes CE)", () => {
      expect(parseYearBuilt("1400-1500")).toBe(1450);
      expect(parseYearBuilt("800-900")).toBe(850);
    });

    it("handles ranges with no spacing", () => {
      expect(parseYearBuilt("1400-1500")).toBe(1450);
    });
  });

  describe("approximations", () => {
    it("parses 'circa' prefix", () => {
      expect(parseYearBuilt("circa 1200")).toBe(1200);
      expect(parseYearBuilt("circa 800 BCE")).toBe(-800);
      expect(parseYearBuilt("Circa 1500 CE")).toBe(1500);
    });

    it("parses 'ca.' prefix", () => {
      expect(parseYearBuilt("ca. 1200")).toBe(1200);
      expect(parseYearBuilt("ca. 800 BCE")).toBe(-800);
    });

    it("parses '~' prefix", () => {
      expect(parseYearBuilt("~1200")).toBe(1200);
      expect(parseYearBuilt("~ 1500 CE")).toBe(1500);
      expect(parseYearBuilt("~800 BCE")).toBe(-800);
    });

    it("parses approximations with century format", () => {
      expect(parseYearBuilt("circa 7th century")).toBe(650);
      expect(parseYearBuilt("~16th century")).toBe(1550);
    });
  });

  describe("Islamic calendar (AH)", () => {
    it("converts AH to Gregorian", () => {
      // AH 1 ≈ 622 CE
      expect(parseYearBuilt("1 AH")).toBe(623);

      // AH 100 ≈ 622 + (100 * 0.97) ≈ 719
      expect(parseYearBuilt("100 AH")).toBe(719);

      // AH 750 ≈ 622 + (750 * 0.97) ≈ 1350
      expect(parseYearBuilt("750 AH")).toBe(1350);

      // AH 1400 ≈ 622 + (1400 * 0.97) ≈ 1980
      expect(parseYearBuilt("1400 AH")).toBe(1980);
    });

    it("handles lowercase 'ah'", () => {
      expect(parseYearBuilt("750 ah")).toBe(1350);
    });

    it("handles AH with approximations", () => {
      expect(parseYearBuilt("circa 750 AH")).toBe(1350);
      expect(parseYearBuilt("~1000 AH")).toBe(1592);
    });
  });

  describe("centuries", () => {
    it("parses century format and returns midpoint", () => {
      expect(parseYearBuilt("7th century")).toBe(650);
      expect(parseYearBuilt("16th century")).toBe(1550);
      expect(parseYearBuilt("1st century")).toBe(50);
      expect(parseYearBuilt("21st century")).toBe(2050);
    });

    it("handles different ordinal suffixes", () => {
      expect(parseYearBuilt("1st century")).toBe(50);
      expect(parseYearBuilt("2nd century")).toBe(150);
      expect(parseYearBuilt("3rd century")).toBe(250);
      expect(parseYearBuilt("4th century")).toBe(350);
    });
  });

  describe("edge cases and error handling", () => {
    it("returns null for empty string", () => {
      expect(parseYearBuilt("")).toBeNull();
    });

    it("returns null for null input", () => {
      expect(parseYearBuilt(null as unknown as string)).toBeNull();
    });

    it("returns null for undefined input", () => {
      expect(parseYearBuilt(undefined as unknown as string)).toBeNull();
    });

    it("returns null for unparseable strings", () => {
      expect(parseYearBuilt("unknown")).toBeNull();
      expect(parseYearBuilt("ancient times")).toBeNull();
      expect(parseYearBuilt("???")).toBeNull();
    });

    it("handles whitespace correctly", () => {
      expect(parseYearBuilt("  1200 CE  ")).toBe(1200);
      expect(parseYearBuilt("   7th century   ")).toBe(650);
    });

    it("prioritizes ranges over standalone years", () => {
      // "800-900 CE" should parse as range (850), not as standalone 800
      expect(parseYearBuilt("800-900 CE")).toBe(850);
    });

    it("handles complex formats from existing data", () => {
      // From mockSites: "800 BCE - 1100 CE"
      expect(parseYearBuilt("800 BCE - 1100 CE")).toBe(-800); // Extracts first BCE match
    });
  });

  describe("backward compatibility", () => {
    it("maintains compatibility with existing test data", () => {
      // From mockSites
      expect(parseYearBuilt("800 BCE - 1100 CE")).toBe(-800);
      expect(parseYearBuilt("7th century")).toBe(650);
      expect(parseYearBuilt("1950")).toBe(1950);
    });
  });
});
