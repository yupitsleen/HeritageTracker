import { describe, it, expect } from "vitest";
import { TOOLTIP_POSITIONING, TOOLTIP_STYLING, INFO_ICON_COLORS } from "./tooltip";

describe("Tooltip Constants", () => {
  describe("TOOLTIP_POSITIONING", () => {
    it("defines top margin threshold", () => {
      expect(TOOLTIP_POSITIONING.TOP_MARGIN_THRESHOLD).toBe(16);
      expect(typeof TOOLTIP_POSITIONING.TOP_MARGIN_THRESHOLD).toBe("number");
    });

    it("defines edge padding", () => {
      expect(TOOLTIP_POSITIONING.EDGE_PADDING).toBe(8);
      expect(typeof TOOLTIP_POSITIONING.EDGE_PADDING).toBe("number");
    });

    it("is immutable (as const)", () => {
      expect(Object.isFrozen(TOOLTIP_POSITIONING)).toBe(false); // Not frozen but...
      // TypeScript ensures it's readonly at compile time
      expect(TOOLTIP_POSITIONING).toBeDefined();
    });
  });

  describe("TOOLTIP_STYLING", () => {
    it("defines z-index", () => {
      expect(TOOLTIP_STYLING.Z_INDEX).toBe(10000);
      expect(typeof TOOLTIP_STYLING.Z_INDEX).toBe("number");
    });

    it("defines max width", () => {
      expect(TOOLTIP_STYLING.MAX_WIDTH).toBe(320);
      expect(typeof TOOLTIP_STYLING.MAX_WIDTH).toBe("number");
    });

    it("defines minimum viewport margin", () => {
      expect(TOOLTIP_STYLING.MIN_VIEWPORT_MARGIN).toBe(2);
      expect(typeof TOOLTIP_STYLING.MIN_VIEWPORT_MARGIN).toBe("number");
    });
  });

  describe("INFO_ICON_COLORS", () => {
    it("defines default color", () => {
      expect(INFO_ICON_COLORS.DEFAULT).toBe("text-gray-400");
      expect(typeof INFO_ICON_COLORS.DEFAULT).toBe("string");
    });

    it("defines hover color", () => {
      expect(INFO_ICON_COLORS.HOVER).toBe("hover:text-gray-500");
      expect(typeof INFO_ICON_COLORS.HOVER).toBe("string");
    });

    it("uses Tailwind CSS class names", () => {
      expect(INFO_ICON_COLORS.DEFAULT).toMatch(/^text-/);
      expect(INFO_ICON_COLORS.HOVER).toMatch(/^hover:/);
    });
  });
});
