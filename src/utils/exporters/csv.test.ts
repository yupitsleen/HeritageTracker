import { describe, it, expect } from "vitest";
import { exportCSV, exportCSVWithOptions, getDefaultCSVColumnIds } from "./csv";
import type { GazaSite } from "../../types";

// Mock site data
const mockSites: GazaSite[] = [
  {
    id: "site-1",
    name: "Test Mosque",
    nameArabic: "مسجد الاختبار",
    type: "mosque",
    yearBuilt: "1200 CE",
    yearBuiltIslamic: "597 AH",
    coordinates: [31.5, 34.4],
    status: "destroyed",
    dateDestroyed: "2023-12-07",
    dateDestroyedIslamic: "22 Jumada al-Awwal 1445",
    description: "Historic mosque",
    historicalSignificance: "Important religious site",
    culturalValue: "Significant cultural heritage",
    verifiedBy: ["UNESCO", "Heritage for Peace"],
    images: { before: { url: "/test.jpg", credit: "Test" } },
    sources: [],
  },
  {
    id: "site-2",
    name: "Ancient Church",
    nameArabic: "الكنيسة القديمة",
    type: "church",
    yearBuilt: "425 CE",
    coordinates: [31.6, 34.5],
    status: "heavily-damaged",
    dateDestroyed: "2024-01-15",
    description: "Byzantine church",
    historicalSignificance: "Early Christian architecture",
    culturalValue: "Archaeological importance",
    verifiedBy: ["Forensic Architecture"],
    images: { before: { url: "/test2.jpg", credit: "Test" } },
    sources: [],
  },
];

describe("exportCSV", () => {
  it("exports sites with default columns", () => {
    const csv = exportCSV(mockSites);

    expect(csv).toContain("Name");
    expect(csv).toContain("Type");
    expect(csv).toContain("Status");
    expect(csv).toContain("Test Mosque");
    expect(csv).toContain("Ancient Church");
  });

  it("includes headers by default", () => {
    const csv = exportCSV(mockSites);
    const lines = csv.split("\n");
    expect(lines[0]).toContain("Name");
  });

  it("includes default columns only", () => {
    const csv = exportCSV(mockSites);

    // Should include default columns
    expect(csv).toContain("Name");
    expect(csv).toContain("Type");
    expect(csv).toContain("Coordinates");

    // Should NOT include non-default columns by default
    // (description, historicalSignificance, culturalValue are not default)
    const lines = csv.split("\n");
    const headerLine = lines[0];
    expect(headerLine).not.toContain("Historical Significance");
    expect(headerLine).not.toContain("Cultural Value");
  });

  it("escapes CSV special characters", () => {
    const siteWithComma: GazaSite = {
      ...mockSites[0],
      name: 'Site, with "comma"',
    };

    const csv = exportCSV([siteWithComma]);
    expect(csv).toContain('"Site, with ""comma"""');
  });

  it("handles empty array", () => {
    const csv = exportCSV([]);
    const lines = csv.split("\n");

    // Should still have headers
    expect(lines.length).toBe(1);
    expect(lines[0]).toContain("Name");
  });

  it("formats coordinates correctly", () => {
    const csv = exportCSV(mockSites);
    expect(csv).toContain("31.5, 34.4");
    expect(csv).toContain("31.6, 34.5");
  });

  it("joins verifiedBy array with semicolons", () => {
    const csv = exportCSV(mockSites);
    expect(csv).toContain("UNESCO; Heritage for Peace");
  });
});

describe("exportCSVWithOptions", () => {
  it("exports with custom column selection", () => {
    const csv = exportCSVWithOptions(mockSites, {
      columns: ["name", "type", "status"],
    });

    const lines = csv.split("\n");
    const headerLine = lines[0];

    expect(headerLine).toBe("Name,Type,Status");
    expect(lines[1]).toContain("Test Mosque");
    expect(lines[1]).toContain("mosque");
    expect(lines[1]).toContain("destroyed");
  });

  it("respects column order from registry", () => {
    const csv = exportCSVWithOptions(mockSites, {
      columns: ["status", "name", "type"], // Specified out of order
    });

    const lines = csv.split("\n");
    // Should be ordered by registry order: name (1), type (3), status (4)
    expect(lines[0]).toBe("Name,Type,Status");
  });

  it("excludes headers when includeHeaders = false", () => {
    const csv = exportCSVWithOptions(mockSites, {
      columns: ["name", "type"],
      includeHeaders: false,
    });

    const lines = csv.split("\n");
    expect(lines[0]).not.toContain("Name");
    expect(lines[0]).toContain("Test Mosque");
  });

  it("includes headers when includeHeaders = true", () => {
    const csv = exportCSVWithOptions(mockSites, {
      columns: ["name", "type"],
      includeHeaders: true,
    });

    const lines = csv.split("\n");
    expect(lines[0]).toBe("Name,Type");
  });

  it("exports with single column", () => {
    const csv = exportCSVWithOptions(mockSites, {
      columns: ["name"],
    });

    const lines = csv.split("\n");
    expect(lines[0]).toBe("Name");
    expect(lines[1]).toBe("Test Mosque");
    expect(lines[2]).toBe("Ancient Church");
  });

  it("exports with all columns", () => {
    const csv = exportCSVWithOptions(mockSites, {
      columns: [
        "name",
        "nameArabic",
        "type",
        "status",
        "yearBuilt",
        "yearBuiltIslamic",
        "dateDestroyed",
        "dateDestroyedIslamic",
        "description",
        "coordinates",
        "verifiedBy",
        "historicalSignificance",
        "culturalValue",
      ],
    });

    const lines = csv.split("\n");
    const headerLine = lines[0];

    expect(headerLine).toContain("Name");
    expect(headerLine).toContain("Description");
    expect(headerLine).toContain("Historical Significance");
    expect(headerLine).toContain("Cultural Value");
  });

  it("handles undefined/null values gracefully", () => {
    const siteWithNulls: GazaSite = {
      ...mockSites[0],
      nameArabic: undefined,
      yearBuiltIslamic: undefined,
      dateDestroyedIslamic: undefined,
    };

    const csv = exportCSVWithOptions([siteWithNulls], {
      columns: ["name", "nameArabic", "yearBuiltIslamic"],
    });

    const lines = csv.split("\n");
    // Empty fields should be empty strings
    expect(lines[1]).toBe("Test Mosque,,");
  });

  it("uses default columns when no columns specified", () => {
    const csvWithOptions = exportCSVWithOptions(mockSites, {});
    const csvDefault = exportCSV(mockSites);

    expect(csvWithOptions).toBe(csvDefault);
  });

  it("filters out invalid column IDs", () => {
    const csv = exportCSVWithOptions(mockSites, {
      columns: ["name", "invalid" as unknown as CSVColumnId, "type"],
    });

    const lines = csv.split("\n");
    expect(lines[0]).toBe("Name,Type");
  });
});

describe("getDefaultCSVColumnIds", () => {
  it("returns array of default column IDs", () => {
    const ids = getDefaultCSVColumnIds();

    expect(ids).toContain("name");
    expect(ids).toContain("type");
    expect(ids).toContain("status");
    expect(ids).toContain("yearBuilt");
  });

  it("does not include non-default columns", () => {
    const ids = getDefaultCSVColumnIds();

    expect(ids).not.toContain("description");
    expect(ids).not.toContain("historicalSignificance");
    expect(ids).not.toContain("culturalValue");
  });

  it("returns IDs in order", () => {
    const ids = getDefaultCSVColumnIds();

    // First should be name (order: 1)
    expect(ids[0]).toBe("name");
  });
});

describe("CSV RFC 4180 Compliance", () => {
  it("escapes quotes by doubling them", () => {
    const siteWithQuotes: GazaSite = {
      ...mockSites[0],
      name: 'Site with "quotes"',
    };

    const csv = exportCSV([siteWithQuotes]);
    expect(csv).toContain('"Site with ""quotes"""');
  });

  it("wraps fields with commas in quotes", () => {
    const siteWithComma: GazaSite = {
      ...mockSites[0],
      description: "Description, with comma",
    };

    const csv = exportCSVWithOptions([siteWithComma], {
      columns: ["name", "description"],
    });

    expect(csv).toContain('"Description, with comma"');
  });

  it("wraps fields with newlines in quotes", () => {
    const siteWithNewline: GazaSite = {
      ...mockSites[0],
      description: "Line 1\nLine 2",
    };

    const csv = exportCSVWithOptions([siteWithNewline], {
      columns: ["name", "description"],
    });

    expect(csv).toContain('"Line 1\nLine 2"');
  });

  it("does not wrap simple fields", () => {
    const csv = exportCSVWithOptions(mockSites, {
      columns: ["name", "type"],
    });

    const lines = csv.split("\n");
    // Simple fields without special chars should not be quoted
    expect(lines[1]).toBe("Test Mosque,mosque");
  });
});

describe("Column Customization Integration", () => {
  it("allows minimal export with just required columns", () => {
    const csv = exportCSVWithOptions(mockSites, {
      columns: ["name"],
    });

    const lines = csv.split("\n");
    expect(lines).toHaveLength(3); // header + 2 sites
    expect(lines[0]).toBe("Name");
  });

  it("allows full export with all columns", () => {
    const csv = exportCSVWithOptions(mockSites, {
      columns: [
        "name",
        "nameArabic",
        "type",
        "status",
        "yearBuilt",
        "yearBuiltIslamic",
        "dateDestroyed",
        "dateDestroyedIslamic",
        "description",
        "coordinates",
        "verifiedBy",
        "historicalSignificance",
        "culturalValue",
      ],
    });

    const lines = csv.split("\n");
    // Check headers - all 13 columns should be present
    const headerLine = lines[0];
    expect(headerLine).toContain("Name");
    expect(headerLine).toContain("Coordinates");
    expect(headerLine).toContain("Historical Significance");

    // Verify we have the right number of data lines
    expect(lines.length).toBe(3); // header + 2 sites
  });

  it("exports data correctly for each column type", () => {
    const csv = exportCSVWithOptions([mockSites[0]], {
      columns: ["name", "coordinates", "verifiedBy"],
    });

    const lines = csv.split("\n");
    expect(lines[1]).toContain("Test Mosque");
    expect(lines[1]).toContain("31.5, 34.4");
    expect(lines[1]).toContain("UNESCO; Heritage for Peace");
  });
});
