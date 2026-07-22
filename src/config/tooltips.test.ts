import { describe, it, expect } from "vitest";
import { TOOLTIPS } from "./tooltips";

// ponytail: structural checks only — tooltip copy is content, not behavior
describe("Tooltip Configuration", () => {
  const categories = ["HEADER", "NAVIGATION", "TIMELINE", "WAYBACK", "FILTERS", "TABLE", "MAP"] as const;

  it("exports all categories", () => {
    categories.forEach((category) => {
      expect(TOOLTIPS).toHaveProperty(category);
    });
  });

  it("all tooltips are non-empty strings of reasonable length", () => {
    categories.forEach((category) => {
      Object.values(TOOLTIPS[category]).forEach((tooltip) => {
        expect(typeof tooltip).toBe("string");
        expect(tooltip.trim().length).toBeGreaterThan(0);
        expect(tooltip.length).toBeLessThanOrEqual(200);
      });
    });
  });
});
