import { describe, it, expect } from "vitest";
import {
  filterSitesByTypeAndStatus,
  filterSitesByDestructionDate,
  filterSitesByCreationYear,
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
