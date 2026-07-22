import { describe, it, expect } from "vitest";
import {
  getHeroIcon,
  hasHeroIcon,
  getAllHeroIconNames,
} from "./iconRegistry";

// ponytail: one unknown-key case covers every not-in-registry input (numbers,
// symbols, wrong case, empty string all hit the same lookup path)
describe("iconRegistry", () => {
  describe("getHeroIcon", () => {
    it("returns a component for a valid icon", () => {
      const icon = getHeroIcon("HomeIcon");
      expect(icon).toBeDefined();
      // Hero Icons are forwardRef objects, not plain functions
      expect(typeof icon === "function" || typeof icon === "object").toBe(true);
    });

    it("returns null for unknown icon names", () => {
      expect(getHeroIcon("NonExistentIcon")).toBeNull();
      expect(getHeroIcon("")).toBeNull();
    });

    it("defaults to solid variant", () => {
      expect(getHeroIcon("HomeIcon")).toBe(getHeroIcon("HomeIcon", "solid"));
    });
  });

  describe("hasHeroIcon", () => {
    it("returns true for icons present in each variant", () => {
      expect(hasHeroIcon("HomeIcon")).toBe(true);
      expect(hasHeroIcon("BuildingLibraryIcon", "solid")).toBe(true);
      expect(hasHeroIcon("InformationCircleIcon", "outline")).toBe(true);
    });

    it("returns false for unknown icon names", () => {
      expect(hasHeroIcon("NonExistentIcon")).toBe(false);
    });
  });

  describe("getAllHeroIconNames", () => {
    it("returns a non-empty array of Icon-suffixed names", () => {
      const icons = getAllHeroIconNames();
      expect(icons.length).toBeGreaterThan(0);
      icons.forEach((name) => expect(name.endsWith("Icon")).toBe(true));
    });

    it("supports both variants and defaults to solid", () => {
      expect(getAllHeroIconNames("outline").length).toBeGreaterThan(0);
      expect(getAllHeroIconNames()).toEqual(getAllHeroIconNames("solid"));
    });
  });
});
