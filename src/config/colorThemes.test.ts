/**
 * Color Theme Registry Tests
 *
 * Comprehensive test suite for color theme registry and helper functions.
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  COLOR_THEME_REGISTRY,
  registerColorTheme,
  getAllColorThemes,
  getColorTheme,
  getDefaultColorTheme,
  updateColorTheme,
  removeColorTheme,
  getColorThemeIds,
  isValidColorTheme,
  getColorThemeLabel,
  getColorScheme,
  getStatusColor,
  getPalette,
  DEFAULT_COLOR_THEME,
  PALESTINIAN_FLAG_COLORS,
} from "./colorThemes";
import type { ColorThemeConfig } from "../types/colorThemeTypes";

describe("Color Theme Registry", () => {
  // ============================================================================
  // Registry Validation Tests
  // ============================================================================

  describe("Registry Validation", () => {
    it("should contain palestinian-flag theme", () => {
      expect(COLOR_THEME_REGISTRY["palestinian-flag"]).toBeDefined();
      expect(COLOR_THEME_REGISTRY["palestinian-flag"].label).toBe(
        "Palestinian Flag"
      );
    });

    it("should have default theme", () => {
      expect(COLOR_THEME_REGISTRY["palestinian-flag"].isDefault).toBe(true);
    });

    it("should have Arabic labels", () => {
      expect(COLOR_THEME_REGISTRY["palestinian-flag"].labelArabic).toBe(
        "علم فلسطين"
      );
    });

    it("should have all four palettes", () => {
      const theme = COLOR_THEME_REGISTRY["palestinian-flag"];
      expect(theme.palettes.red).toBeDefined();
      expect(theme.palettes.green).toBeDefined();
      expect(theme.palettes.black).toBeDefined();
      expect(theme.palettes.white).toBeDefined();
    });

    it("should have correct Palestinian flag colors", () => {
      const theme = COLOR_THEME_REGISTRY["palestinian-flag"];
      expect(theme.palettes.red.colors[500]).toBe("#ed3039");
      expect(theme.palettes.green.colors[500]).toBe("#009639");
      expect(theme.palettes.black.colors[900]).toBe("#000000");
      expect(theme.palettes.white.colors[50]).toBe("#fefefe");
    });

    it("should have status colors defined", () => {
      const theme = COLOR_THEME_REGISTRY["palestinian-flag"];
      expect(theme.statusColors.destroyed).toBeDefined();
      expect(theme.statusColors.heavilyDamaged).toBeDefined();
      expect(theme.statusColors.damaged).toBeDefined();
    });

    it("should have light and dark schemes", () => {
      const theme = COLOR_THEME_REGISTRY["palestinian-flag"];
      expect(theme.lightScheme).toBeDefined();
      expect(theme.darkScheme).toBeDefined();
    });

    it("should have metadata", () => {
      const theme = COLOR_THEME_REGISTRY["palestinian-flag"];
      expect(theme.metadata).toBeDefined();
      expect(theme.metadata?.author).toBe("Heritage Tracker Team");
      expect(theme.metadata?.culturalSignificance).toBeDefined();
    });

    it("should have complete color palettes (50-900)", () => {
      const theme = COLOR_THEME_REGISTRY["palestinian-flag"];
      const scales = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

      Object.values(theme.palettes).forEach((palette) => {
        scales.forEach((scale) => {
          expect(palette.colors[scale]).toBeDefined();
          expect(palette.colors[scale]).toMatch(/^#[0-9a-f]{6}$/i);
        });
      });
    });

    it("should have valid hex colors for status colors", () => {
      const theme = COLOR_THEME_REGISTRY["palestinian-flag"];
      Object.values(theme.statusColors).forEach((status) => {
        expect(status.hex).toMatch(/^#[0-9a-f]{6}$/i);
        expect(status.bgClass).toContain("bg-[");
        expect(status.textClass).toContain("text-[");
      });
    });
  });

  // ============================================================================
  // CRUD Operations Tests
  // ============================================================================

  describe("CRUD Operations", () => {
    const customTheme: ColorThemeConfig = {
      id: "test-theme",
      label: "Test Theme",
      labelArabic: "سمة اختبارية",
      description: "Test theme for testing",
      palettes: {
        red: {
          id: "test-red",
          label: "Test Red",
          colors: {
            50: "#ff0000",
            100: "#ff0000",
            200: "#ff0000",
            300: "#ff0000",
            400: "#ff0000",
            500: "#ff0000",
            600: "#ff0000",
            700: "#ff0000",
            800: "#ff0000",
            900: "#ff0000",
          },
        },
        green: {
          id: "test-green",
          label: "Test Green",
          colors: {
            50: "#00ff00",
            100: "#00ff00",
            200: "#00ff00",
            300: "#00ff00",
            400: "#00ff00",
            500: "#00ff00",
            600: "#00ff00",
            700: "#00ff00",
            800: "#00ff00",
            900: "#00ff00",
          },
        },
        black: {
          id: "test-black",
          label: "Test Black",
          colors: {
            50: "#000000",
            100: "#000000",
            200: "#000000",
            300: "#000000",
            400: "#000000",
            500: "#000000",
            600: "#000000",
            700: "#000000",
            800: "#000000",
            900: "#000000",
          },
        },
        white: {
          id: "test-white",
          label: "Test White",
          colors: {
            50: "#ffffff",
            100: "#ffffff",
            200: "#ffffff",
            300: "#ffffff",
            400: "#ffffff",
            500: "#ffffff",
            600: "#ffffff",
            700: "#ffffff",
            800: "#ffffff",
            900: "#ffffff",
          },
        },
      },
      statusColors: {
        destroyed: {
          id: "destroyed",
          label: "Destroyed",
          hex: "#ff0000",
          bgClass: "bg-red-500",
          textClass: "text-red-500",
        },
        heavilyDamaged: {
          id: "heavily-damaged",
          label: "Heavily Damaged",
          hex: "#ff8800",
          bgClass: "bg-orange-500",
          textClass: "text-orange-500",
        },
        damaged: {
          id: "damaged",
          label: "Damaged",
          hex: "#ffff00",
          bgClass: "bg-yellow-500",
          textClass: "text-yellow-500",
        },
      },
      lightScheme: {
        id: "light",
        label: "Light",
        text: { heading: "", subheading: "", body: "", muted: "", subtle: "" },
        bg: { primary: "", secondary: "", tertiary: "", hover: "", active: "" },
        border: { default: "", subtle: "", strong: "", primary: "", primary2: "" },
        input: { base: "", focus: "" },
        icon: { default: "", muted: "" },
        card: { base: "" },
        layout: { appBackground: "", loadingText: "", modalHeading: "" },
        tooltip: { base: "", border: "", text: "" },
        marker: { minor: "", major: "" },
        containerBg: { semiTransparent: "", opaque: "", solid: "" },
        kbd: { base: "" },
      },
      darkScheme: {
        id: "dark",
        label: "Dark",
        text: { heading: "", subheading: "", body: "", muted: "", subtle: "" },
        bg: { primary: "", secondary: "", tertiary: "", hover: "", active: "" },
        border: { default: "", subtle: "", strong: "", primary: "", primary2: "" },
        input: { base: "", focus: "" },
        icon: { default: "", muted: "" },
        card: { base: "" },
        layout: { appBackground: "", loadingText: "", modalHeading: "" },
        tooltip: { base: "", border: "", text: "" },
        marker: { minor: "", major: "" },
        containerBg: { semiTransparent: "", opaque: "", solid: "" },
        kbd: { base: "" },
      },
    };

    beforeEach(() => {
      // Clean up test theme if it exists
      if (isValidColorTheme("test-theme")) {
        removeColorTheme("test-theme");
      }
    });

    it("should register a new color theme", () => {
      registerColorTheme(customTheme);
      expect(COLOR_THEME_REGISTRY["test-theme"]).toBeDefined();
      expect(COLOR_THEME_REGISTRY["test-theme"].label).toBe("Test Theme");
    });

    it("should get color theme by ID", () => {
      registerColorTheme(customTheme);
      const theme = getColorTheme("test-theme");
      expect(theme).toBeDefined();
      expect(theme?.label).toBe("Test Theme");
    });

    it("should return undefined for non-existent theme", () => {
      const theme = getColorTheme("non-existent");
      expect(theme).toBeUndefined();
    });

    it("should update existing theme", () => {
      registerColorTheme(customTheme);
      updateColorTheme("test-theme", { label: "Updated Test Theme" });
      expect(COLOR_THEME_REGISTRY["test-theme"].label).toBe(
        "Updated Test Theme"
      );
    });

    it("should throw error when updating non-existent theme", () => {
      expect(() =>
        updateColorTheme("non-existent", { label: "Test" })
      ).toThrow("Color theme 'non-existent' not found in registry");
    });

    it("should remove color theme", () => {
      registerColorTheme(customTheme);
      expect(COLOR_THEME_REGISTRY["test-theme"]).toBeDefined();
      removeColorTheme("test-theme");
      expect(COLOR_THEME_REGISTRY["test-theme"]).toBeUndefined();
    });

    it("should get all theme IDs", () => {
      const ids = getColorThemeIds();
      expect(ids).toContain("palestinian-flag");
    });

    it("should validate theme ID", () => {
      expect(isValidColorTheme("palestinian-flag")).toBe(true);
      expect(isValidColorTheme("non-existent")).toBe(false);
    });

    it("should preserve all properties when updating", () => {
      registerColorTheme(customTheme);
      updateColorTheme("test-theme", { description: "Updated description" });
      const theme = getColorTheme("test-theme");
      expect(theme?.description).toBe("Updated description");
      expect(theme?.label).toBe("Test Theme");
      expect(theme?.palettes.red.colors[500]).toBe("#ff0000");
    });
  });

  // ============================================================================
  // Query Function Tests
  // ============================================================================

  describe("Query Functions", () => {
    it("should get all color themes", () => {
      const themes = getAllColorThemes();
      expect(themes.length).toBeGreaterThanOrEqual(1);
      expect(themes.some((t) => t.id === "palestinian-flag")).toBe(true);
    });

    it("should get default color theme", () => {
      const defaultTheme = getDefaultColorTheme();
      expect(defaultTheme).toBeDefined();
      expect(defaultTheme.id).toBe("palestinian-flag");
      expect(defaultTheme.isDefault).toBe(true);
    });

    it("should get label in English", () => {
      const label = getColorThemeLabel("palestinian-flag", "en");
      expect(label).toBe("Palestinian Flag");
    });

    it("should get label in Arabic", () => {
      const label = getColorThemeLabel("palestinian-flag", "ar");
      expect(label).toBe("علم فلسطين");
    });

    it("should fallback to English if Arabic not available", () => {
      const customTheme: ColorThemeConfig = {
        ...COLOR_THEME_REGISTRY["palestinian-flag"],
        id: "test-no-arabic",
        label: "Test No Arabic",
        labelArabic: undefined,
      };
      registerColorTheme(customTheme);
      const label = getColorThemeLabel("test-no-arabic", "ar");
      expect(label).toBe("Test No Arabic");
      removeColorTheme("test-no-arabic");
    });

    it("should return ID for non-existent theme", () => {
      const label = getColorThemeLabel("non-existent", "en");
      expect(label).toBe("non-existent");
    });

    it("should get light color scheme", () => {
      const scheme = getColorScheme("palestinian-flag", "light");
      expect(scheme).toBeDefined();
      expect(scheme?.id).toBe("light");
      expect(scheme?.text.heading).toBe("text-gray-900");
    });

    it("should get dark color scheme", () => {
      const scheme = getColorScheme("palestinian-flag", "dark");
      expect(scheme).toBeDefined();
      expect(scheme?.id).toBe("dark");
      expect(scheme?.text.heading).toBe("text-gray-100");
    });

    it("should return undefined for non-existent theme scheme", () => {
      const scheme = getColorScheme("non-existent", "light");
      expect(scheme).toBeUndefined();
    });

    it("should get status color (destroyed)", () => {
      const color = getStatusColor("palestinian-flag", "destroyed");
      expect(color).toBeDefined();
      expect(color?.hex).toBe("#b91c1c");
      expect(color?.bgClass).toBe("bg-[#b91c1c]");
      expect(color?.textClass).toBe("text-[#b91c1c]");
    });

    it("should get status color (heavily damaged)", () => {
      const color = getStatusColor("palestinian-flag", "heavilyDamaged");
      expect(color).toBeDefined();
      expect(color?.hex).toBe("#d97706");
    });

    it("should get status color (damaged)", () => {
      const color = getStatusColor("palestinian-flag", "damaged");
      expect(color).toBeDefined();
      expect(color?.hex).toBe("#ca8a04");
    });

    it("should return undefined for non-existent theme status", () => {
      const color = getStatusColor("non-existent", "destroyed");
      expect(color).toBeUndefined();
    });

    it("should get palette (red)", () => {
      const palette = getPalette("palestinian-flag", "red");
      expect(palette).toBeDefined();
      expect(palette?.colors[500]).toBe("#ed3039");
    });

    it("should get palette (green)", () => {
      const palette = getPalette("palestinian-flag", "green");
      expect(palette).toBeDefined();
      expect(palette?.colors[500]).toBe("#009639");
    });

    it("should get palette (black)", () => {
      const palette = getPalette("palestinian-flag", "black");
      expect(palette).toBeDefined();
      expect(palette?.colors[900]).toBe("#000000");
    });

    it("should get palette (white)", () => {
      const palette = getPalette("palestinian-flag", "white");
      expect(palette).toBeDefined();
      expect(palette?.colors[50]).toBe("#fefefe");
    });

    it("should return undefined for non-existent theme palette", () => {
      const palette = getPalette("non-existent", "red");
      expect(palette).toBeUndefined();
    });
  });

  // ============================================================================
  // Backward Compatibility Tests
  // ============================================================================

  describe("Backward Compatibility", () => {
    it("should export DEFAULT_COLOR_THEME constant", () => {
      expect(DEFAULT_COLOR_THEME).toBeDefined();
      expect(DEFAULT_COLOR_THEME.id).toBe("palestinian-flag");
    });

    it("should export PALESTINIAN_FLAG_COLORS constant", () => {
      expect(PALESTINIAN_FLAG_COLORS).toBeDefined();
      expect(PALESTINIAN_FLAG_COLORS.red).toBe("#ed3039");
      expect(PALESTINIAN_FLAG_COLORS.green).toBe("#009639");
      expect(PALESTINIAN_FLAG_COLORS.black).toBe("#000000");
      expect(PALESTINIAN_FLAG_COLORS.white).toBe("#fefefe");
    });

    it("PALESTINIAN_FLAG_COLORS should match theme colors", () => {
      const theme = getDefaultColorTheme();
      expect(PALESTINIAN_FLAG_COLORS.red).toBe(theme.palettes.red.colors[500]);
      expect(PALESTINIAN_FLAG_COLORS.green).toBe(theme.palettes.green.colors[500]);
      expect(PALESTINIAN_FLAG_COLORS.black).toBe(theme.palettes.black.colors[900]);
      expect(PALESTINIAN_FLAG_COLORS.white).toBe(theme.palettes.white.colors[50]);
    });
  });

  // ============================================================================
  // Integration Tests
  // ============================================================================

  describe("Integration Tests", () => {
    it("should allow dynamic theme switching", () => {
      const customTheme: ColorThemeConfig = {
        ...COLOR_THEME_REGISTRY["palestinian-flag"],
        id: "test-integration",
        label: "Test Integration",
      };

      registerColorTheme(customTheme);
      const theme = getColorTheme("test-integration");
      expect(theme).toBeDefined();
      expect(theme?.id).toBe("test-integration");

      removeColorTheme("test-integration");
    });

    it("should maintain color consistency across schemes", () => {
      const theme = getColorTheme("palestinian-flag")!;
      const lightScheme = theme.lightScheme;
      const darkScheme = theme.darkScheme;

      // Verify both schemes have all required properties
      expect(lightScheme.text).toBeDefined();
      expect(darkScheme.text).toBeDefined();
      expect(lightScheme.bg).toBeDefined();
      expect(darkScheme.bg).toBeDefined();
      expect(lightScheme.border).toBeDefined();
      expect(darkScheme.border).toBeDefined();
    });
  });

  // ============================================================================
  // Edge Cases Tests
  // ============================================================================

  describe("Edge Cases", () => {
    it("should handle fallback when no default theme set", () => {
      // Temporarily remove isDefault flag
      const originalTheme = COLOR_THEME_REGISTRY["palestinian-flag"];
      const originalDefault = originalTheme.isDefault;
      originalTheme.isDefault = undefined;

      const defaultTheme = getDefaultColorTheme();
      expect(defaultTheme).toBeDefined();

      // Restore
      originalTheme.isDefault = originalDefault;
    });

    it("should validate all status colors have required fields", () => {
      const theme = getColorTheme("palestinian-flag")!;
      Object.values(theme.statusColors).forEach((status) => {
        expect(status.id).toBeDefined();
        expect(status.label).toBeDefined();
        expect(status.hex).toBeDefined();
        expect(status.bgClass).toBeDefined();
        expect(status.textClass).toBeDefined();
      });
    });

    it("should validate all palettes have Arabic labels", () => {
      const theme = getColorTheme("palestinian-flag")!;
      Object.values(theme.palettes).forEach((palette) => {
        expect(palette.labelArabic).toBeDefined();
      });
    });
  });
});
