import { describe, it, expect } from "vitest";
import {
  CSV_COLUMN_REGISTRY,
  getCSVColumn,
  getAllCSVColumns,
  getDefaultCSVColumns,
  getCSVColumnsByIds,
  getRequiredCSVColumns,
  getColumnIds,
  isValidCSVColumn,
  getCSVColumnLabel,
} from "./csvColumns";
import type { GazaSite } from "../types";

// Mock site for testing
const mockSite: GazaSite = {
  id: "test-site",
  name: "Test Site",
  nameArabic: "موقع اختبار",
  type: "mosque",
  yearBuilt: "1200 CE",
  yearBuiltIslamic: "597 AH",
  coordinates: [31.5, 34.4],
  status: "destroyed",
  dateDestroyed: "2023-12-07",
  dateDestroyedIslamic: "22 Jumada al-Awwal 1445",
  description: "Test description",
  historicalSignificance: "Test historical significance",
  culturalValue: "Test cultural value",
  verifiedBy: ["UNESCO", "Heritage for Peace"],
  images: { before: { url: "/test.jpg", credit: "Test" } },
  sources: [],
};

describe("CSV_COLUMN_REGISTRY", () => {
  it("contains all expected columns", () => {
    const expectedColumns = [
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
    ];

    expectedColumns.forEach((column) => {
      expect(CSV_COLUMN_REGISTRY).toHaveProperty(column);
    });
  });

  it("has valid structure for all columns", () => {
    Object.values(CSV_COLUMN_REGISTRY).forEach((column) => {
      expect(column.id).toBeTruthy();
      expect(column.label).toBeTruthy();
      expect(column.getValue).toBeInstanceOf(Function);
      expect(typeof column.defaultIncluded).toBe("boolean");
      expect(typeof column.order).toBe("number");
    });
  });

  it("has Arabic labels for all columns", () => {
    Object.values(CSV_COLUMN_REGISTRY).forEach((column) => {
      expect(column.labelArabic).toBeTruthy();
    });
  });

  it("has unique order values", () => {
    const orders = Object.values(CSV_COLUMN_REGISTRY).map((col) => col.order);
    const uniqueOrders = [...new Set(orders)];
    expect(orders.length).toBe(uniqueOrders.length);
  });

  it("has exactly one required column (name)", () => {
    const requiredColumns = Object.values(CSV_COLUMN_REGISTRY).filter((col) => col.required);
    expect(requiredColumns).toHaveLength(1);
    expect(requiredColumns[0].id).toBe("name");
  });
});

describe("getCSVColumn", () => {
  it("returns correct column by ID", () => {
    const nameColumn = getCSVColumn("name");
    expect(nameColumn?.id).toBe("name");
    expect(nameColumn?.label).toBe("Name");
  });

  it("returns undefined for invalid column ID", () => {
    expect(getCSVColumn("invalid" as unknown as CSVColumnId)).toBeUndefined();
  });

  it("returns column with getValue function", () => {
    const typeColumn = getCSVColumn("type");
    expect(typeColumn?.getValue(mockSite)).toBe("mosque");
  });
});

describe("getAllCSVColumns", () => {
  it("returns all 13 columns", () => {
    const columns = getAllCSVColumns();
    expect(columns).toHaveLength(13);
  });

  it("returns array of CSVColumnConfig objects", () => {
    const columns = getAllCSVColumns();
    columns.forEach((column) => {
      expect(column).toHaveProperty("id");
      expect(column).toHaveProperty("label");
      expect(column).toHaveProperty("getValue");
      expect(column).toHaveProperty("defaultIncluded");
      expect(column).toHaveProperty("order");
    });
  });
});

describe("getDefaultCSVColumns", () => {
  it("returns only columns with defaultIncluded = true", () => {
    const defaultColumns = getDefaultCSVColumns();
    defaultColumns.forEach((column) => {
      expect(column.defaultIncluded).toBe(true);
    });
  });

  it("returns columns sorted by order", () => {
    const defaultColumns = getDefaultCSVColumns();
    const orders = defaultColumns.map((col) => col.order);
    const sortedOrders = [...orders].sort((a, b) => a - b);
    expect(orders).toEqual(sortedOrders);
  });

  it("includes name, type, status, yearBuilt", () => {
    const defaultColumns = getDefaultCSVColumns();
    const ids = defaultColumns.map((col) => col.id);
    expect(ids).toContain("name");
    expect(ids).toContain("type");
    expect(ids).toContain("status");
    expect(ids).toContain("yearBuilt");
  });

  it("excludes description and historicalSignificance by default", () => {
    const defaultColumns = getDefaultCSVColumns();
    const ids = defaultColumns.map((col) => col.id);
    expect(ids).not.toContain("description");
    expect(ids).not.toContain("historicalSignificance");
    expect(ids).not.toContain("culturalValue");
  });
});

describe("getCSVColumnsByIds", () => {
  it("returns columns for specified IDs", () => {
    const columns = getCSVColumnsByIds(["name", "type", "status"]);
    expect(columns).toHaveLength(3);
    expect(columns.map((c) => c.id)).toEqual(["name", "type", "status"]);
  });

  it("returns columns sorted by order", () => {
    const columns = getCSVColumnsByIds(["status", "name", "type"]);
    expect(columns[0].id).toBe("name"); // order: 1
    expect(columns[1].id).toBe("type"); // order: 3
    expect(columns[2].id).toBe("status"); // order: 4
  });

  it("filters out invalid column IDs", () => {
    const columns = getCSVColumnsByIds(["name", "invalid" as unknown as CSVColumnId, "type"]);
    expect(columns).toHaveLength(2);
    expect(columns.map((c) => c.id)).toEqual(["name", "type"]);
  });

  it("handles empty array", () => {
    const columns = getCSVColumnsByIds([]);
    expect(columns).toHaveLength(0);
  });
});

describe("getRequiredCSVColumns", () => {
  it("returns columns with required = true", () => {
    const requiredColumns = getRequiredCSVColumns();
    requiredColumns.forEach((column) => {
      expect(column.required).toBe(true);
    });
  });

  it("includes name column", () => {
    const requiredColumns = getRequiredCSVColumns();
    const ids = requiredColumns.map((col) => col.id);
    expect(ids).toContain("name");
  });
});

describe("getColumnIds", () => {
  it("extracts column IDs from configurations", () => {
    const columns = getDefaultCSVColumns();
    const ids = getColumnIds(columns);
    expect(ids).toContain("name");
    expect(ids).toContain("type");
    expect(ids).toContain("status");
  });

  it("handles empty array", () => {
    const ids = getColumnIds([]);
    expect(ids).toHaveLength(0);
  });
});

describe("isValidCSVColumn", () => {
  it("returns true for valid column IDs", () => {
    expect(isValidCSVColumn("name")).toBe(true);
    expect(isValidCSVColumn("type")).toBe(true);
    expect(isValidCSVColumn("status")).toBe(true);
  });

  it("returns false for invalid column IDs", () => {
    expect(isValidCSVColumn("invalid")).toBe(false);
    expect(isValidCSVColumn("random")).toBe(false);
    expect(isValidCSVColumn("")).toBe(false);
  });
});

describe("getCSVColumnLabel", () => {
  it("returns English label by default", () => {
    expect(getCSVColumnLabel("name")).toBe("Name");
    expect(getCSVColumnLabel("type")).toBe("Type");
  });

  it("returns English label when locale is 'en'", () => {
    expect(getCSVColumnLabel("name", "en")).toBe("Name");
  });

  it("returns Arabic label when locale is 'ar'", () => {
    expect(getCSVColumnLabel("name", "ar")).toBe("الاسم");
    expect(getCSVColumnLabel("type", "ar")).toBe("النوع");
  });

  it("returns column ID for invalid column", () => {
    expect(getCSVColumnLabel("invalid" as unknown as CSVColumnId)).toBe("invalid");
  });
});

describe("Column getValue functions", () => {
  it("name column extracts site name", () => {
    const column = getCSVColumn("name");
    expect(column?.getValue(mockSite)).toBe("Test Site");
  });

  it("nameArabic column extracts Arabic name", () => {
    const column = getCSVColumn("nameArabic");
    expect(column?.getValue(mockSite)).toBe("موقع اختبار");
  });

  it("type column extracts site type", () => {
    const column = getCSVColumn("type");
    expect(column?.getValue(mockSite)).toBe("mosque");
  });

  it("coordinates column formats lat/lng", () => {
    const column = getCSVColumn("coordinates");
    expect(column?.getValue(mockSite)).toBe("31.5, 34.4");
  });

  it("verifiedBy column joins array with semicolons", () => {
    const column = getCSVColumn("verifiedBy");
    expect(column?.getValue(mockSite)).toBe("UNESCO; Heritage for Peace");
  });

  it("handles undefined values gracefully", () => {
    const siteWithoutArabic = { ...mockSite, nameArabic: undefined };
    const column = getCSVColumn("nameArabic");
    expect(column?.getValue(siteWithoutArabic)).toBeUndefined();
  });
});

describe("Column ordering", () => {
  it("columns are ordered sequentially", () => {
    const allColumns = getAllCSVColumns();
    const sorted = allColumns.sort((a, b) => a.order - b.order);

    // First few should be core fields
    expect(sorted[0].id).toBe("name");
    expect(sorted[1].id).toBe("nameArabic");
    expect(sorted[2].id).toBe("type");
  });
});
