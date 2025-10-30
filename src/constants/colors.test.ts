import { describe, it, expect } from "vitest";
import { COLORS } from "./colors";

describe("COLORS constant", () => {
  describe("Structure and Type Safety", () => {
    it("should be defined", () => {
      expect(COLORS).toBeDefined();
      expect(typeof COLORS).toBe("object");
    });

    it("should contain all required Palestinian flag colors", () => {
      expect(COLORS.FLAG_RED).toBeDefined();
      expect(COLORS.FLAG_GREEN).toBeDefined();
      expect(COLORS.FLAG_BLACK).toBeDefined();
      expect(COLORS.FLAG_WHITE).toBeDefined();
    });

    it("should contain dark mode variants", () => {
      expect(COLORS.FLAG_RED_DARK).toBeDefined();
      expect(COLORS.FLAG_GREEN_DARK).toBeDefined();
    });

    it("should contain hover state variants", () => {
      expect(COLORS.FLAG_RED_HOVER).toBeDefined();
      expect(COLORS.FLAG_GREEN_HOVER).toBeDefined();
      expect(COLORS.FLAG_GREEN_HOVER_DARK).toBeDefined();
    });

    it("should contain gray scale colors", () => {
      expect(COLORS.GRAY_LIGHT).toBeDefined();
      expect(COLORS.GRAY_MEDIUM).toBeDefined();
      expect(COLORS.GRAY_DARK).toBeDefined();
      expect(COLORS.GRAY_SUBTLE).toBeDefined();
    });

    it("should contain border colors", () => {
      expect(COLORS.BORDER_DEFAULT_LIGHT).toBeDefined();
      expect(COLORS.BORDER_BLACK).toBeDefined();
    });
  });

  describe("Valid Hex Color Format", () => {
    const hexColorRegex = /^#[0-9a-fA-F]{6}$/;

    it("should have valid hex format for FLAG_RED", () => {
      expect(COLORS.FLAG_RED).toMatch(hexColorRegex);
    });

    it("should have valid hex format for FLAG_RED_DARK", () => {
      expect(COLORS.FLAG_RED_DARK).toMatch(hexColorRegex);
    });

    it("should have valid hex format for FLAG_RED_HOVER", () => {
      expect(COLORS.FLAG_RED_HOVER).toMatch(hexColorRegex);
    });

    it("should have valid hex format for FLAG_GREEN", () => {
      expect(COLORS.FLAG_GREEN).toMatch(hexColorRegex);
    });

    it("should have valid hex format for FLAG_GREEN_DARK", () => {
      expect(COLORS.FLAG_GREEN_DARK).toMatch(hexColorRegex);
    });

    it("should have valid hex format for FLAG_GREEN_HOVER", () => {
      expect(COLORS.FLAG_GREEN_HOVER).toMatch(hexColorRegex);
    });

    it("should have valid hex format for FLAG_GREEN_HOVER_DARK", () => {
      expect(COLORS.FLAG_GREEN_HOVER_DARK).toMatch(hexColorRegex);
    });

    it("should have valid hex format for FLAG_BLACK", () => {
      expect(COLORS.FLAG_BLACK).toMatch(hexColorRegex);
    });

    it("should have valid hex format for FLAG_WHITE", () => {
      expect(COLORS.FLAG_WHITE).toMatch(hexColorRegex);
    });

    it("should have valid hex format for all GRAY colors", () => {
      expect(COLORS.GRAY_LIGHT).toMatch(hexColorRegex);
      expect(COLORS.GRAY_MEDIUM).toMatch(hexColorRegex);
      expect(COLORS.GRAY_DARK).toMatch(hexColorRegex);
      expect(COLORS.GRAY_SUBTLE).toMatch(hexColorRegex);
    });

    it("should have valid hex format for BORDER colors", () => {
      expect(COLORS.BORDER_DEFAULT_LIGHT).toMatch(hexColorRegex);
      expect(COLORS.BORDER_BLACK).toMatch(hexColorRegex);
    });
  });

  describe("Palestinian Flag Color Values", () => {
    it("should have correct Palestinian flag red color", () => {
      expect(COLORS.FLAG_RED).toBe("#ed3039");
    });

    it("should have correct Palestinian flag green color", () => {
      expect(COLORS.FLAG_GREEN).toBe("#009639");
    });

    it("should have correct Palestinian flag black color", () => {
      expect(COLORS.FLAG_BLACK).toBe("#000000");
    });

    it("should have correct Palestinian flag white color", () => {
      expect(COLORS.FLAG_WHITE).toBe("#fefefe");
    });
  });

  describe("Dark Mode Variants", () => {
    it("should have darker red for dark mode", () => {
      expect(COLORS.FLAG_RED_DARK).toBe("#8b2a30");
      // Verify it's actually darker than standard red
      const redValue = parseInt(COLORS.FLAG_RED.slice(1, 3), 16);
      const darkRedValue = parseInt(COLORS.FLAG_RED_DARK.slice(1, 3), 16);
      expect(darkRedValue).toBeLessThan(redValue);
    });

    it("should have darker green for dark mode", () => {
      expect(COLORS.FLAG_GREEN_DARK).toBe("#2d5a38");
      // Verify it's actually darker than standard green
      const greenValue = parseInt(COLORS.FLAG_GREEN.slice(3, 5), 16);
      const darkGreenValue = parseInt(COLORS.FLAG_GREEN_DARK.slice(3, 5), 16);
      expect(darkGreenValue).toBeLessThan(greenValue);
    });
  });

  describe("Hover State Variants", () => {
    it("should have different hover color for red", () => {
      expect(COLORS.FLAG_RED_HOVER).toBe("#d4202a");
      expect(COLORS.FLAG_RED_HOVER).not.toBe(COLORS.FLAG_RED);
    });

    it("should have different hover color for green", () => {
      expect(COLORS.FLAG_GREEN_HOVER).toBe("#007b2f");
      expect(COLORS.FLAG_GREEN_HOVER).not.toBe(COLORS.FLAG_GREEN);
    });

    it("should have dark mode hover variant for green", () => {
      expect(COLORS.FLAG_GREEN_HOVER_DARK).toBe("#244a2e");
      expect(COLORS.FLAG_GREEN_HOVER_DARK).not.toBe(COLORS.FLAG_GREEN_HOVER);
    });
  });

  describe("Border Colors", () => {
    it("should have consistent black border color", () => {
      expect(COLORS.BORDER_BLACK).toBe(COLORS.FLAG_BLACK);
    });

    it("should have gray default border for light mode", () => {
      expect(COLORS.BORDER_DEFAULT_LIGHT).toBe("#404040");
      expect(COLORS.BORDER_DEFAULT_LIGHT).toBe(COLORS.GRAY_DARK);
    });
  });

  describe("No Unintended Duplicates", () => {
    it("should have unique primary flag colors", () => {
      const primaryColors = [
        COLORS.FLAG_RED,
        COLORS.FLAG_GREEN,
        COLORS.FLAG_BLACK,
        COLORS.FLAG_WHITE,
      ];
      const uniqueColors = new Set(primaryColors);
      expect(uniqueColors.size).toBe(primaryColors.length);
    });

    it("should have unique gray shades", () => {
      const grayColors = [
        COLORS.GRAY_LIGHT,
        COLORS.GRAY_MEDIUM,
        COLORS.GRAY_DARK,
        COLORS.GRAY_SUBTLE,
      ];
      const uniqueGrays = new Set(grayColors);
      expect(uniqueGrays.size).toBe(grayColors.length);
    });
  });
});
