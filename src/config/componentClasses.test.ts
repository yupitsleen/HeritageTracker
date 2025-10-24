/**
 * Component Class Configuration Registry Tests
 *
 * Comprehensive test suite for component class configuration registry.
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  COMPONENT_CLASS_REGISTRY,
  registerComponentClassConfig,
  getAllComponentClassConfigs,
  getComponentClassConfig,
  getDefaultComponentClassConfig,
  updateComponentClassConfig,
  removeComponentClassConfig,
  getComponentClassConfigIds,
  isValidComponentClassConfig,
  getComponentClassConfigLabel,
  getCategoryClasses,
  DEFAULT_COMPONENT_CLASS_CONFIG,
  COMPACT_SPACING,
  COMPACT_TYPOGRAPHY,
  COMPACT_BUTTON,
  COMPACT_TABLE,
  COMPACT_HEADER,
  COMPACT_FILTER_BAR,
  COMPACT_MODAL,
  COMPACT_LAYOUT,
} from "./componentClasses";
import type { ComponentClassConfig } from "../types/componentClassTypes";

describe("Component Class Configuration Registry", () => {
  // ============================================================================
  // Registry Validation Tests
  // ============================================================================

  describe("Registry Validation", () => {
    it("should contain compact configuration", () => {
      expect(COMPONENT_CLASS_REGISTRY["compact"]).toBeDefined();
      expect(COMPONENT_CLASS_REGISTRY["compact"].label).toBe(
        "Compact Design System"
      );
    });

    it("should have default configuration (compact)", () => {
      expect(COMPONENT_CLASS_REGISTRY["compact"].isDefault).toBe(true);
    });

    it("should have Arabic label", () => {
      expect(COMPONENT_CLASS_REGISTRY["compact"].labelArabic).toBe(
        "نظام التصميم المدمج"
      );
    });

    it("should have spacing configuration", () => {
      const spacing = COMPONENT_CLASS_REGISTRY["compact"].spacing;
      expect(spacing.xs).toBe("p-1");
      expect(spacing.sm).toBe("p-2");
      expect(spacing.md).toBe("p-3");
      expect(spacing.lg).toBe("p-4");
      expect(spacing.gapXs).toBe("gap-1");
    });

    it("should have typography configuration", () => {
      const typography = COMPONENT_CLASS_REGISTRY["compact"].typography;
      expect(typography.xs).toBe("text-[10px]");
      expect(typography.sm).toBe("text-xs");
      expect(typography.base).toBe("text-sm");
    });

    it("should have button configuration", () => {
      const button = COMPONENT_CLASS_REGISTRY["compact"].button;
      expect(button.xs).toBe("px-2 py-0.5 text-xs");
      expect(button.sm).toBe("px-3 py-1 text-xs");
      expect(button.md).toBe("px-4 py-1.5 text-sm");
    });

    it("should have table configuration", () => {
      const table = COMPONENT_CLASS_REGISTRY["compact"].table;
      expect(table.cellX).toBe("px-1");
      expect(table.cellY).toBe("py-1.5");
      expect(table.text).toBe("text-xs");
    });

    it("should have header configuration", () => {
      const header = COMPONENT_CLASS_REGISTRY["compact"].header;
      expect(header.py).toBe("py-2");
      expect(header.title).toBe("text-lg md:text-xl");
    });

    it("should have filterBar configuration", () => {
      const filterBar = COMPONENT_CLASS_REGISTRY["compact"].filterBar;
      expect(filterBar.padding).toBe("p-2");
      expect(filterBar.inputHeight).toBe("h-7");
    });

    it("should have modal configuration", () => {
      const modal = COMPONENT_CLASS_REGISTRY["compact"].modal;
      expect(modal.padding).toBe("p-4");
      expect(modal.gap).toBe("gap-3");
    });

    it("should have layout configuration", () => {
      const layout = COMPONENT_CLASS_REGISTRY["compact"].layout;
      expect(layout.FILTER_BAR_HEIGHT).toBe(80);
      expect(layout.TIMELINE_HEIGHT).toBe(100);
      expect(layout.MAPS_HEIGHT_OFFSET).toBe(185);
    });

    it("should have metadata", () => {
      expect(COMPONENT_CLASS_REGISTRY["compact"].metadata).toBeDefined();
      expect(COMPONENT_CLASS_REGISTRY["compact"].metadata?.author).toBe(
        "Heritage Tracker Team"
      );
    });
  });

  // ============================================================================
  // CRUD Operations Tests
  // ============================================================================

  describe("CRUD Operations", () => {
    const customConfig: ComponentClassConfig = {
      id: "test-design",
      label: "Test Design",
      labelArabic: "تصميم اختباري",
      description: "Test design system",
      spacing: {
        xs: "p-2",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
        gapXs: "gap-2",
        gapSm: "gap-4",
        gapMd: "gap-6",
        gapLg: "gap-8",
      },
      typography: {
        xs: "text-xs",
        sm: "text-sm",
        base: "text-base",
        lg: "text-lg",
        xl: "text-2xl",
      },
      button: {
        xs: "px-3 py-1 text-sm",
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
      },
      table: {
        cellX: "px-2",
        cellY: "py-2",
        headerX: "px-2",
        headerY: "py-3",
        text: "text-sm",
        headerText: "text-sm font-bold",
      },
      header: {
        py: "py-4",
        title: "text-2xl md:text-3xl",
        subtitle: "text-sm md:text-base",
        buttonGap: "gap-4",
      },
      filterBar: {
        padding: "p-4",
        inputHeight: "h-10",
        inputText: "text-sm",
        inputPadding: "px-4 py-2",
        buttonPadding: "px-4 py-2",
        gap: "gap-4",
      },
      modal: {
        padding: "p-6",
        headerPadding: "p-4",
        contentPadding: "p-4",
        gap: "gap-4",
      },
      layout: {
        FILTER_BAR_HEIGHT: 100,
        TIMELINE_HEIGHT: 120,
        FOOTER_CLEARANCE: 32,
        MAPS_HEIGHT_OFFSET: 220,
      },
    };

    beforeEach(() => {
      // Clean up test config if it exists
      if (isValidComponentClassConfig("test-design")) {
        removeComponentClassConfig("test-design");
      }
    });

    it("should register a new configuration", () => {
      registerComponentClassConfig(customConfig);
      expect(COMPONENT_CLASS_REGISTRY["test-design"]).toBeDefined();
      expect(COMPONENT_CLASS_REGISTRY["test-design"].label).toBe("Test Design");
    });

    it("should get configuration by ID", () => {
      registerComponentClassConfig(customConfig);
      const config = getComponentClassConfig("test-design");
      expect(config).toBeDefined();
      expect(config?.label).toBe("Test Design");
    });

    it("should return undefined for non-existent configuration", () => {
      const config = getComponentClassConfig("non-existent");
      expect(config).toBeUndefined();
    });

    it("should update existing configuration", () => {
      registerComponentClassConfig(customConfig);
      updateComponentClassConfig("test-design", {
        spacing: {
          xs: "p-3",
          sm: "p-5",
          md: "p-7",
          lg: "p-9",
          gapXs: "gap-3",
          gapSm: "gap-5",
          gapMd: "gap-7",
          gapLg: "gap-9",
        },
      });
      expect(COMPONENT_CLASS_REGISTRY["test-design"].spacing.xs).toBe("p-3");
    });

    it("should throw error when updating non-existent configuration", () => {
      expect(() =>
        updateComponentClassConfig("non-existent", { label: "Test" })
      ).toThrow(
        "Component class configuration 'non-existent' not found in registry"
      );
    });

    it("should remove configuration", () => {
      registerComponentClassConfig(customConfig);
      expect(COMPONENT_CLASS_REGISTRY["test-design"]).toBeDefined();
      removeComponentClassConfig("test-design");
      expect(COMPONENT_CLASS_REGISTRY["test-design"]).toBeUndefined();
    });

    it("should get all configuration IDs", () => {
      const ids = getComponentClassConfigIds();
      expect(ids).toContain("compact");
    });

    it("should validate configuration ID", () => {
      expect(isValidComponentClassConfig("compact")).toBe(true);
      expect(isValidComponentClassConfig("non-existent")).toBe(false);
    });

    it("should preserve all properties when updating", () => {
      registerComponentClassConfig(customConfig);
      updateComponentClassConfig("test-design", { label: "Updated Test" });
      const config = getComponentClassConfig("test-design");
      expect(config?.label).toBe("Updated Test");
      expect(config?.spacing.xs).toBe("p-2");
      expect(config?.typography.xs).toBe("text-xs");
    });
  });

  // ============================================================================
  // Query Function Tests
  // ============================================================================

  describe("Query Functions", () => {
    it("should get all configurations", () => {
      const configs = getAllComponentClassConfigs();
      expect(configs.length).toBeGreaterThanOrEqual(1);
      expect(configs.some((c) => c.id === "compact")).toBe(true);
    });

    it("should get default configuration", () => {
      const defaultConfig = getDefaultComponentClassConfig();
      expect(defaultConfig).toBeDefined();
      expect(defaultConfig.id).toBe("compact");
      expect(defaultConfig.isDefault).toBe(true);
    });

    it("should get label in English", () => {
      const label = getComponentClassConfigLabel("compact", "en");
      expect(label).toBe("Compact Design System");
    });

    it("should get label in Arabic", () => {
      const label = getComponentClassConfigLabel("compact", "ar");
      expect(label).toBe("نظام التصميم المدمج");
    });

    it("should fallback to English if Arabic not available", () => {
      const customConfig: ComponentClassConfig = {
        ...COMPONENT_CLASS_REGISTRY["compact"],
        id: "test-no-arabic",
        label: "Test No Arabic",
        labelArabic: undefined,
      };
      registerComponentClassConfig(customConfig);
      const label = getComponentClassConfigLabel("test-no-arabic", "ar");
      expect(label).toBe("Test No Arabic");
      removeComponentClassConfig("test-no-arabic");
    });

    it("should return ID for non-existent configuration", () => {
      const label = getComponentClassConfigLabel("non-existent", "en");
      expect(label).toBe("non-existent");
    });

    it("should get category classes", () => {
      const spacing = getCategoryClasses("spacing");
      expect(spacing.xs).toBe("p-1");
      expect(spacing.sm).toBe("p-2");
    });

    it("should get category classes for specific config", () => {
      const spacing = getCategoryClasses("spacing", "compact");
      expect(spacing.xs).toBe("p-1");
    });

    it("should get all category types", () => {
      const spacing = getCategoryClasses("spacing");
      const typography = getCategoryClasses("typography");
      const button = getCategoryClasses("button");
      const table = getCategoryClasses("table");
      const header = getCategoryClasses("header");
      const filterBar = getCategoryClasses("filterBar");
      const modal = getCategoryClasses("modal");
      const layout = getCategoryClasses("layout");

      expect(spacing).toBeDefined();
      expect(typography).toBeDefined();
      expect(button).toBeDefined();
      expect(table).toBeDefined();
      expect(header).toBeDefined();
      expect(filterBar).toBeDefined();
      expect(modal).toBeDefined();
      expect(layout).toBeDefined();
    });
  });

  // ============================================================================
  // Backward Compatibility Tests
  // ============================================================================

  describe("Backward Compatibility", () => {
    it("should export DEFAULT_COMPONENT_CLASS_CONFIG constant", () => {
      expect(DEFAULT_COMPONENT_CLASS_CONFIG).toBeDefined();
      expect(DEFAULT_COMPONENT_CLASS_CONFIG.id).toBe("compact");
    });

    it("should export COMPACT_SPACING constant", () => {
      expect(COMPACT_SPACING).toBeDefined();
      expect(COMPACT_SPACING.xs).toBe("p-1");
    });

    it("should export COMPACT_TYPOGRAPHY constant", () => {
      expect(COMPACT_TYPOGRAPHY).toBeDefined();
      expect(COMPACT_TYPOGRAPHY.xs).toBe("text-[10px]");
    });

    it("should export COMPACT_BUTTON constant", () => {
      expect(COMPACT_BUTTON).toBeDefined();
      expect(COMPACT_BUTTON.xs).toBe("px-2 py-0.5 text-xs");
    });

    it("should export COMPACT_TABLE constant", () => {
      expect(COMPACT_TABLE).toBeDefined();
      expect(COMPACT_TABLE.cellX).toBe("px-1");
    });

    it("should export COMPACT_HEADER constant", () => {
      expect(COMPACT_HEADER).toBeDefined();
      expect(COMPACT_HEADER.py).toBe("py-2");
    });

    it("should export COMPACT_FILTER_BAR constant", () => {
      expect(COMPACT_FILTER_BAR).toBeDefined();
      expect(COMPACT_FILTER_BAR.padding).toBe("p-2");
    });

    it("should export COMPACT_MODAL constant", () => {
      expect(COMPACT_MODAL).toBeDefined();
      expect(COMPACT_MODAL.padding).toBe("p-4");
    });

    it("should export COMPACT_LAYOUT constant", () => {
      expect(COMPACT_LAYOUT).toBeDefined();
      expect(COMPACT_LAYOUT.FILTER_BAR_HEIGHT).toBe(80);
    });

    it("COMPACT_* constants should match compact config", () => {
      const compactConfig = getComponentClassConfig("compact");
      expect(COMPACT_SPACING).toEqual(compactConfig?.spacing);
      expect(COMPACT_TYPOGRAPHY).toEqual(compactConfig?.typography);
      expect(COMPACT_BUTTON).toEqual(compactConfig?.button);
      expect(COMPACT_TABLE).toEqual(compactConfig?.table);
    });
  });

  // ============================================================================
  // Integration Tests
  // ============================================================================

  describe("Integration Tests", () => {
    it("should allow dynamic design system switching", () => {
      const compactSpacing = getCategoryClasses("spacing", "compact");
      expect(compactSpacing.xs).toBe("p-1");

      // Register spacious design
      const spaciousConfig: ComponentClassConfig = {
        ...COMPONENT_CLASS_REGISTRY["compact"],
        id: "spacious",
        label: "Spacious Design",
        spacing: {
          xs: "p-3",
          sm: "p-5",
          md: "p-7",
          lg: "p-10",
          gapXs: "gap-3",
          gapSm: "gap-5",
          gapMd: "gap-7",
          gapLg: "gap-10",
        },
      };
      registerComponentClassConfig(spaciousConfig);

      const spaciousSpacing = getCategoryClasses("spacing", "spacious");
      expect(spaciousSpacing.xs).toBe("p-3");
      expect(spaciousSpacing.lg).toBe("p-10");

      removeComponentClassConfig("spacious");
    });

    it("should maintain consistency across all categories", () => {
      const config = getComponentClassConfig("compact")!;

      expect(config.spacing).toBeDefined();
      expect(config.typography).toBeDefined();
      expect(config.button).toBeDefined();
      expect(config.table).toBeDefined();
      expect(config.header).toBeDefined();
      expect(config.filterBar).toBeDefined();
      expect(config.modal).toBeDefined();
      expect(config.layout).toBeDefined();
    });
  });

  // ============================================================================
  // Edge Cases Tests
  // ============================================================================

  describe("Edge Cases", () => {
    it("should handle fallback when no default configuration set", () => {
      // Temporarily remove isDefault flag
      const originalConfig = COMPONENT_CLASS_REGISTRY["compact"];
      const originalDefault = originalConfig.isDefault;
      originalConfig.isDefault = undefined;

      const defaultConfig = getDefaultComponentClassConfig();
      expect(defaultConfig).toBeDefined();

      // Restore
      originalConfig.isDefault = originalDefault;
    });

    it("should validate all spacing values are Tailwind classes", () => {
      const spacing = getCategoryClasses("spacing");
      expect(spacing.xs).toMatch(/^p-\d+$/);
      expect(spacing.gapXs).toMatch(/^gap-\d+$/);
    });

    it("should validate all typography values are text classes", () => {
      const typography = getCategoryClasses("typography");
      expect(typography.xs).toMatch(/^text-/);
      expect(typography.sm).toMatch(/^text-/);
    });

    it("should validate layout values are numbers", () => {
      const layout = getCategoryClasses("layout");
      expect(typeof layout.FILTER_BAR_HEIGHT).toBe("number");
      expect(typeof layout.TIMELINE_HEIGHT).toBe("number");
      expect(layout.FILTER_BAR_HEIGHT).toBeGreaterThan(0);
    });

    it("should validate all default config has required properties", () => {
      const config = COMPONENT_CLASS_REGISTRY["compact"];
      expect(config.label).toBeDefined();
      expect(config.spacing).toBeDefined();
      expect(config.typography).toBeDefined();
      expect(config.button).toBeDefined();
      expect(config.table).toBeDefined();
      expect(config.header).toBeDefined();
      expect(config.filterBar).toBeDefined();
      expect(config.modal).toBeDefined();
      expect(config.layout).toBeDefined();
    });
  });
});
