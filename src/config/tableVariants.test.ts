/**
 * Table Variant Configuration Registry Tests
 *
 * Comprehensive test suite for table variant configuration registry.
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  TABLE_VARIANT_REGISTRY,
  registerTableVariantConfig,
  getAllTableVariantConfigs,
  getTableVariantConfig,
  getDefaultTableVariantConfig,
  updateTableVariantConfig,
  removeTableVariantConfig,
  getTableVariantConfigIds,
  isValidTableVariantConfig,
  getTableVariantConfigLabel,
  getVisibleColumns,
  isColumnVisible,
  getDefaultSort,
  DEFAULT_TABLE_VARIANT_CONFIG,
  COMPACT_VISIBLE_COLUMNS,
  EXPANDED_VISIBLE_COLUMNS,
  MOBILE_VISIBLE_COLUMNS,
} from "./tableVariants";
import type { TableVariantConfig } from "../types/tableVariantTypes";

describe("Table Variant Configuration Registry", () => {
  // ============================================================================
  // Registry Validation Tests
  // ============================================================================

  describe("Registry Validation", () => {
    it("should contain compact variant configuration", () => {
      expect(TABLE_VARIANT_REGISTRY["compact"]).toBeDefined();
      expect(TABLE_VARIANT_REGISTRY["compact"].label).toBe("Compact Sidebar");
    });

    it("should contain expanded variant configuration", () => {
      expect(TABLE_VARIANT_REGISTRY["expanded"]).toBeDefined();
      expect(TABLE_VARIANT_REGISTRY["expanded"].label).toBe("Expanded Modal");
    });

    it("should contain mobile variant configuration", () => {
      expect(TABLE_VARIANT_REGISTRY["mobile"]).toBeDefined();
      expect(TABLE_VARIANT_REGISTRY["mobile"].label).toBe("Mobile Accordion");
    });

    it("should have default configuration (compact)", () => {
      expect(TABLE_VARIANT_REGISTRY["compact"].isDefault).toBe(true);
    });

    it("should have Arabic labels for all variants", () => {
      expect(TABLE_VARIANT_REGISTRY["compact"].labelArabic).toBe(
        "الشريط الجانبي المدمج"
      );
      expect(TABLE_VARIANT_REGISTRY["expanded"].labelArabic).toBe(
        "النافذة المنبثقة الموسعة"
      );
      expect(TABLE_VARIANT_REGISTRY["mobile"].labelArabic).toBe(
        "الأكورديون المحمول"
      );
    });

    it("compact variant should have 4 visible columns", () => {
      const columns = TABLE_VARIANT_REGISTRY["compact"].visibleColumns;
      expect(columns).toHaveLength(4);
      expect(columns).toEqual(["type", "name", "status", "dateDestroyed"]);
    });

    it("expanded variant should have 7 visible columns", () => {
      const columns = TABLE_VARIANT_REGISTRY["expanded"].visibleColumns;
      expect(columns).toHaveLength(7);
      expect(columns).toEqual([
        "type",
        "name",
        "status",
        "dateDestroyed",
        "dateDestroyedIslamic",
        "yearBuilt",
        "yearBuiltIslamic",
      ]);
    });

    it("mobile variant should have 3 visible columns", () => {
      const columns = TABLE_VARIANT_REGISTRY["mobile"].visibleColumns;
      expect(columns).toHaveLength(3);
      expect(columns).toEqual(["name", "status", "dateDestroyed"]);
    });

    it("compact variant should enable sort but disable export", () => {
      const config = TABLE_VARIANT_REGISTRY["compact"];
      expect(config.enableSort).toBe(true);
      expect(config.enableExport).toBe(false);
    });

    it("expanded variant should enable both sort and export", () => {
      const config = TABLE_VARIANT_REGISTRY["expanded"];
      expect(config.enableSort).toBe(true);
      expect(config.enableExport).toBe(true);
    });

    it("all variants should have default sort configuration", () => {
      expect(TABLE_VARIANT_REGISTRY["compact"].defaultSortColumn).toBe(
        "dateDestroyed"
      );
      expect(TABLE_VARIANT_REGISTRY["compact"].defaultSortDirection).toBe("desc");
      expect(TABLE_VARIANT_REGISTRY["expanded"].defaultSortColumn).toBe(
        "dateDestroyed"
      );
      expect(TABLE_VARIANT_REGISTRY["mobile"].defaultSortColumn).toBe(
        "dateDestroyed"
      );
    });

    it("all variants should have metadata", () => {
      expect(TABLE_VARIANT_REGISTRY["compact"].metadata).toBeDefined();
      expect(TABLE_VARIANT_REGISTRY["compact"].metadata?.author).toBe(
        "Heritage Tracker Team"
      );
      expect(TABLE_VARIANT_REGISTRY["expanded"].metadata).toBeDefined();
      expect(TABLE_VARIANT_REGISTRY["mobile"].metadata).toBeDefined();
    });
  });

  // ============================================================================
  // CRUD Operations Tests
  // ============================================================================

  describe("CRUD Operations", () => {
    const customConfig: TableVariantConfig = {
      id: "test-variant",
      label: "Test Variant",
      labelArabic: "متغير الاختبار",
      description: "Test table variant",
      visibleColumns: ["name", "status"],
      enableSort: true,
      enableExport: false,
      defaultSortColumn: "name",
      defaultSortDirection: "asc",
    };

    beforeEach(() => {
      // Clean up test config if it exists
      if (isValidTableVariantConfig("test-variant")) {
        removeTableVariantConfig("test-variant");
      }
    });

    it("should register a new configuration", () => {
      registerTableVariantConfig(customConfig);
      expect(TABLE_VARIANT_REGISTRY["test-variant"]).toBeDefined();
      expect(TABLE_VARIANT_REGISTRY["test-variant"].label).toBe("Test Variant");
    });

    it("should get configuration by ID", () => {
      registerTableVariantConfig(customConfig);
      const config = getTableVariantConfig("test-variant");
      expect(config).toBeDefined();
      expect(config?.label).toBe("Test Variant");
    });

    it("should return undefined for non-existent configuration", () => {
      const config = getTableVariantConfig("non-existent");
      expect(config).toBeUndefined();
    });

    it("should update existing configuration", () => {
      registerTableVariantConfig(customConfig);
      updateTableVariantConfig("test-variant", {
        visibleColumns: ["type", "name", "status"],
      });
      expect(TABLE_VARIANT_REGISTRY["test-variant"].visibleColumns).toEqual([
        "type",
        "name",
        "status",
      ]);
    });

    it("should throw error when updating non-existent configuration", () => {
      expect(() =>
        updateTableVariantConfig("non-existent", { label: "Test" })
      ).toThrow("Table variant configuration 'non-existent' not found in registry");
    });

    it("should remove configuration", () => {
      registerTableVariantConfig(customConfig);
      expect(TABLE_VARIANT_REGISTRY["test-variant"]).toBeDefined();
      removeTableVariantConfig("test-variant");
      expect(TABLE_VARIANT_REGISTRY["test-variant"]).toBeUndefined();
    });

    it("should get all configuration IDs", () => {
      const ids = getTableVariantConfigIds();
      expect(ids).toContain("compact");
      expect(ids).toContain("expanded");
      expect(ids).toContain("mobile");
    });

    it("should validate configuration ID", () => {
      expect(isValidTableVariantConfig("compact")).toBe(true);
      expect(isValidTableVariantConfig("non-existent")).toBe(false);
    });

    it("should preserve all properties when updating", () => {
      registerTableVariantConfig(customConfig);
      updateTableVariantConfig("test-variant", { label: "Updated Test" });
      const config = getTableVariantConfig("test-variant");
      expect(config?.label).toBe("Updated Test");
      expect(config?.visibleColumns).toEqual(["name", "status"]);
      expect(config?.enableSort).toBe(true);
    });
  });

  // ============================================================================
  // Query Function Tests
  // ============================================================================

  describe("Query Functions", () => {
    it("should get all configurations", () => {
      const configs = getAllTableVariantConfigs();
      expect(configs.length).toBeGreaterThanOrEqual(3);
      expect(configs.some((c) => c.id === "compact")).toBe(true);
      expect(configs.some((c) => c.id === "expanded")).toBe(true);
      expect(configs.some((c) => c.id === "mobile")).toBe(true);
    });

    it("should get default configuration", () => {
      const defaultConfig = getDefaultTableVariantConfig();
      expect(defaultConfig).toBeDefined();
      expect(defaultConfig.id).toBe("compact");
      expect(defaultConfig.isDefault).toBe(true);
    });

    it("should get label in English", () => {
      const label = getTableVariantConfigLabel("compact", "en");
      expect(label).toBe("Compact Sidebar");
    });

    it("should get label in Arabic", () => {
      const label = getTableVariantConfigLabel("compact", "ar");
      expect(label).toBe("الشريط الجانبي المدمج");
    });

    it("should fallback to English if Arabic not available", () => {
      const customConfig: TableVariantConfig = {
        ...TABLE_VARIANT_REGISTRY["compact"],
        id: "test-no-arabic",
        label: "Test No Arabic",
        labelArabic: undefined,
      };
      registerTableVariantConfig(customConfig);
      const label = getTableVariantConfigLabel("test-no-arabic", "ar");
      expect(label).toBe("Test No Arabic");
      removeTableVariantConfig("test-no-arabic");
    });

    it("should return ID for non-existent configuration", () => {
      const label = getTableVariantConfigLabel("non-existent", "en");
      expect(label).toBe("non-existent");
    });

    it("should get visible columns for compact variant", () => {
      const columns = getVisibleColumns("compact");
      expect(columns).toEqual(["type", "name", "status", "dateDestroyed"]);
    });

    it("should get visible columns for expanded variant", () => {
      const columns = getVisibleColumns("expanded");
      expect(columns).toEqual([
        "type",
        "name",
        "status",
        "dateDestroyed",
        "dateDestroyedIslamic",
        "yearBuilt",
        "yearBuiltIslamic",
      ]);
    });

    it("should get visible columns for mobile variant", () => {
      const columns = getVisibleColumns("mobile");
      expect(columns).toEqual(["name", "status", "dateDestroyed"]);
    });

    it("should check if column is visible in variant", () => {
      expect(isColumnVisible("type", "compact")).toBe(true);
      expect(isColumnVisible("yearBuiltIslamic", "compact")).toBe(false);
      expect(isColumnVisible("yearBuiltIslamic", "expanded")).toBe(true);
      expect(isColumnVisible("type", "mobile")).toBe(false);
    });

    it("should get default sort configuration", () => {
      const sortConfig = getDefaultSort("compact");
      expect(sortConfig.sortColumn).toBe("dateDestroyed");
      expect(sortConfig.sortDirection).toBe("desc");
    });

    it("should get visible columns from default variant when no ID provided", () => {
      const columns = getVisibleColumns();
      expect(columns).toEqual(["type", "name", "status", "dateDestroyed"]);
    });

    it("should get default sort from default variant when no ID provided", () => {
      const sortConfig = getDefaultSort();
      expect(sortConfig.sortColumn).toBe("dateDestroyed");
      expect(sortConfig.sortDirection).toBe("desc");
    });
  });

  // ============================================================================
  // Backward Compatibility Tests
  // ============================================================================

  describe("Backward Compatibility", () => {
    it("should export DEFAULT_TABLE_VARIANT_CONFIG constant", () => {
      expect(DEFAULT_TABLE_VARIANT_CONFIG).toBeDefined();
      expect(DEFAULT_TABLE_VARIANT_CONFIG.id).toBe("compact");
    });

    it("should export COMPACT_VISIBLE_COLUMNS constant", () => {
      expect(COMPACT_VISIBLE_COLUMNS).toBeDefined();
      expect(COMPACT_VISIBLE_COLUMNS).toEqual([
        "type",
        "name",
        "status",
        "dateDestroyed",
      ]);
    });

    it("should export EXPANDED_VISIBLE_COLUMNS constant", () => {
      expect(EXPANDED_VISIBLE_COLUMNS).toBeDefined();
      expect(EXPANDED_VISIBLE_COLUMNS).toEqual([
        "type",
        "name",
        "status",
        "dateDestroyed",
        "dateDestroyedIslamic",
        "yearBuilt",
        "yearBuiltIslamic",
      ]);
    });

    it("should export MOBILE_VISIBLE_COLUMNS constant", () => {
      expect(MOBILE_VISIBLE_COLUMNS).toBeDefined();
      expect(MOBILE_VISIBLE_COLUMNS).toEqual([
        "name",
        "status",
        "dateDestroyed",
      ]);
    });

    it("COMPACT_VISIBLE_COLUMNS should match compact config", () => {
      const compactConfig = getTableVariantConfig("compact");
      expect(COMPACT_VISIBLE_COLUMNS).toEqual(compactConfig?.visibleColumns);
    });

    it("EXPANDED_VISIBLE_COLUMNS should match expanded config", () => {
      const expandedConfig = getTableVariantConfig("expanded");
      expect(EXPANDED_VISIBLE_COLUMNS).toEqual(expandedConfig?.visibleColumns);
    });

    it("MOBILE_VISIBLE_COLUMNS should match mobile config", () => {
      const mobileConfig = getTableVariantConfig("mobile");
      expect(MOBILE_VISIBLE_COLUMNS).toEqual(mobileConfig?.visibleColumns);
    });
  });

  // ============================================================================
  // Integration Tests
  // ============================================================================

  describe("Integration Tests", () => {
    it("should allow dynamic variant switching", () => {
      const compactColumns = getVisibleColumns("compact");
      const expandedColumns = getVisibleColumns("expanded");

      expect(compactColumns.length).toBeLessThan(expandedColumns.length);
      expect(expandedColumns).toContain("yearBuiltIslamic");
      expect(compactColumns).not.toContain("yearBuiltIslamic");
    });

    it("should maintain column order consistency", () => {
      const columns = getVisibleColumns("expanded");
      expect(columns[0]).toBe("type");
      expect(columns[1]).toBe("name");
      expect(columns[columns.length - 1]).toBe("yearBuiltIslamic");
    });

    it("should support custom variants with subset of columns", () => {
      const minimalConfig: TableVariantConfig = {
        id: "test-minimal",
        label: "Minimal View",
        visibleColumns: ["name", "status"],
        enableSort: false,
        enableExport: false,
        defaultSortColumn: "name",
        defaultSortDirection: "asc",
      };

      registerTableVariantConfig(minimalConfig);

      const columns = getVisibleColumns("test-minimal");
      expect(columns).toHaveLength(2);
      expect(columns).toEqual(["name", "status"]);

      const sortConfig = getDefaultSort("test-minimal");
      expect(sortConfig.sortColumn).toBe("name");
      expect(sortConfig.sortDirection).toBe("asc");

      removeTableVariantConfig("test-minimal");
    });
  });

  // ============================================================================
  // Edge Cases Tests
  // ============================================================================

  describe("Edge Cases", () => {
    it("should handle fallback when no default configuration set", () => {
      // Temporarily remove isDefault flag
      const originalConfig = TABLE_VARIANT_REGISTRY["compact"];
      const originalDefault = originalConfig.isDefault;
      originalConfig.isDefault = undefined;

      const defaultConfig = getDefaultTableVariantConfig();
      expect(defaultConfig).toBeDefined();

      // Restore
      originalConfig.isDefault = originalDefault;
    });

    it("should handle empty visible columns array", () => {
      const emptyConfig: TableVariantConfig = {
        id: "test-empty",
        label: "Empty Columns",
        visibleColumns: [],
        enableSort: false,
        enableExport: false,
        defaultSortColumn: "name",
        defaultSortDirection: "asc",
      };
      registerTableVariantConfig(emptyConfig);

      const columns = getVisibleColumns("test-empty");
      expect(columns).toHaveLength(0);

      removeTableVariantConfig("test-empty");
    });

    it("should handle variant with all columns", () => {
      const allColumnsConfig: TableVariantConfig = {
        id: "test-all",
        label: "All Columns",
        visibleColumns: [
          "type",
          "name",
          "status",
          "dateDestroyed",
          "dateDestroyedIslamic",
          "yearBuilt",
          "yearBuiltIslamic",
        ],
        enableSort: true,
        enableExport: true,
        defaultSortColumn: "name",
        defaultSortDirection: "asc",
      };
      registerTableVariantConfig(allColumnsConfig);

      const columns = getVisibleColumns("test-all");
      expect(columns).toHaveLength(7);

      removeTableVariantConfig("test-all");
    });

    it("should handle variant with all unique columns", () => {
      const allUniqueConfig: TableVariantConfig = {
        id: "test-unique",
        label: "All Unique Columns",
        visibleColumns: ["name", "status", "type"],
        enableSort: true,
        enableExport: false,
        defaultSortColumn: "name",
        defaultSortDirection: "asc",
      };
      registerTableVariantConfig(allUniqueConfig);

      const columns = getVisibleColumns("test-unique");
      expect(columns).toHaveLength(3);
      expect(columns).toEqual(["name", "status", "type"]);

      removeTableVariantConfig("test-unique");
    });

    it("should validate all default variants have required properties", () => {
      const variants = ["compact", "expanded", "mobile"];
      variants.forEach((id) => {
        const config = getTableVariantConfig(id);
        expect(config).toBeDefined();
        expect(config?.label).toBeDefined();
        expect(config?.visibleColumns).toBeDefined();
        expect(config?.enableSort).toBeDefined();
        expect(config?.enableExport).toBeDefined();
        expect(config?.defaultSortColumn).toBeDefined();
        expect(config?.defaultSortDirection).toBeDefined();
      });
    });
  });
});
