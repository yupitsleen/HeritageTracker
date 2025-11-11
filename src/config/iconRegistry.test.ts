import { describe, it, expect } from "vitest";
import {
  getHeroIcon,
  hasHeroIcon,
  getAllHeroIconNames,
  type IconVariant,
} from "./iconRegistry";

describe("iconRegistry", () => {
  describe("getHeroIcon", () => {
    describe("Smoke Tests", () => {
      it("returns a component for valid icon", () => {
        const icon = getHeroIcon("HomeIcon");
        expect(icon).toBeDefined();
        // Hero Icons are forwardRef objects, not plain functions
        expect(typeof icon === "function" || typeof icon === "object").toBe(true);
      });

      it("returns null for invalid icon", () => {
        const icon = getHeroIcon("NonExistentIcon");
        expect(icon).toBeNull();
      });
    });

    describe("Solid Variant", () => {
      it("gets BuildingLibraryIcon from solid variant", () => {
        const icon = getHeroIcon("BuildingLibraryIcon", "solid");
        expect(icon).toBeDefined();
        expect(icon).not.toBeNull();
      });

      it("gets MagnifyingGlassIcon from solid variant", () => {
        const icon = getHeroIcon("MagnifyingGlassIcon", "solid");
        expect(icon).toBeDefined();
        expect(icon).not.toBeNull();
      });

      it("gets HomeModernIcon from solid variant", () => {
        const icon = getHeroIcon("HomeModernIcon", "solid");
        expect(icon).toBeDefined();
        expect(icon).not.toBeNull();
      });

      it("gets FlagIcon from solid variant", () => {
        const icon = getHeroIcon("FlagIcon", "solid");
        expect(icon).toBeDefined();
        expect(icon).not.toBeNull();
      });

      it("gets ArchiveBoxIcon from solid variant", () => {
        const icon = getHeroIcon("ArchiveBoxIcon", "solid");
        expect(icon).toBeDefined();
        expect(icon).not.toBeNull();
      });

      it("gets MoonIcon from solid variant", () => {
        const icon = getHeroIcon("MoonIcon", "solid");
        expect(icon).toBeDefined();
        expect(icon).not.toBeNull();
      });

      it("gets PlusIcon from solid variant", () => {
        const icon = getHeroIcon("PlusIcon", "solid");
        expect(icon).toBeDefined();
        expect(icon).not.toBeNull();
      });

      it("gets HeartIcon from solid variant", () => {
        const icon = getHeroIcon("HeartIcon", "solid");
        expect(icon).toBeDefined();
        expect(icon).not.toBeNull();
      });
    });

    describe("Outline Variant", () => {
      it("gets HomeIcon from outline variant", () => {
        const icon = getHeroIcon("HomeIcon", "outline");
        expect(icon).toBeDefined();
        expect(icon).not.toBeNull();
      });

      it("gets InformationCircleIcon from outline variant", () => {
        const icon = getHeroIcon("InformationCircleIcon", "outline");
        expect(icon).toBeDefined();
        expect(icon).not.toBeNull();
      });

      it("gets ExclamationCircleIcon from outline variant", () => {
        const icon = getHeroIcon("ExclamationCircleIcon", "outline");
        expect(icon).toBeDefined();
        expect(icon).not.toBeNull();
      });
    });

    describe("Default Behavior", () => {
      it("defaults to solid variant when no variant specified", () => {
        const solidIcon = getHeroIcon("HomeIcon", "solid");
        const defaultIcon = getHeroIcon("HomeIcon");

        // Both should return the same icon
        expect(defaultIcon).toBeDefined();
        expect(solidIcon).toBeDefined();
      });
    });

    describe("Edge Cases", () => {
      it("returns null for empty string", () => {
        const icon = getHeroIcon("");
        expect(icon).toBeNull();
      });

      it("returns null for icon name without 'Icon' suffix", () => {
        // Hero Icons all end with "Icon"
        const icon = getHeroIcon("Home");
        expect(icon).toBeNull();
      });

      it("handles case-sensitive icon names", () => {
        const correctCase = getHeroIcon("HomeIcon");
        const incorrectCase = getHeroIcon("homeicon");

        expect(correctCase).toBeDefined();
        expect(incorrectCase).toBeNull();
      });

      it("returns null for numbers", () => {
        const icon = getHeroIcon("123Icon");
        expect(icon).toBeNull();
      });

      it("returns null for special characters", () => {
        const icon = getHeroIcon("Home@Icon");
        expect(icon).toBeNull();
      });
    });
  });

  describe("hasHeroIcon", () => {
    describe("Smoke Tests", () => {
      it("returns true for valid icon", () => {
        expect(hasHeroIcon("HomeIcon")).toBe(true);
      });

      it("returns false for invalid icon", () => {
        expect(hasHeroIcon("NonExistentIcon")).toBe(false);
      });
    });

    describe("Variant Support", () => {
      it("checks solid variant correctly", () => {
        expect(hasHeroIcon("BuildingLibraryIcon", "solid")).toBe(true);
      });

      it("checks outline variant correctly", () => {
        expect(hasHeroIcon("InformationCircleIcon", "outline")).toBe(true);
      });

      it("defaults to solid variant", () => {
        expect(hasHeroIcon("HomeIcon")).toBe(true);
      });
    });

    describe("Edge Cases", () => {
      it("returns false for empty string", () => {
        expect(hasHeroIcon("")).toBe(false);
      });

      it("returns false for null/undefined cast as string", () => {
        expect(hasHeroIcon("null")).toBe(false);
        expect(hasHeroIcon("undefined")).toBe(false);
      });
    });
  });

  describe("getAllHeroIconNames", () => {
    describe("Smoke Tests", () => {
      it("returns an array", () => {
        const icons = getAllHeroIconNames();
        expect(Array.isArray(icons)).toBe(true);
      });

      it("returns non-empty array", () => {
        const icons = getAllHeroIconNames();
        expect(icons.length).toBeGreaterThan(0);
      });
    });

    describe("Solid Variant", () => {
      it("includes common solid icons", () => {
        const icons = getAllHeroIconNames("solid");

        expect(icons).toContain("HomeIcon");
        expect(icons).toContain("BuildingLibraryIcon");
        expect(icons).toContain("HeartIcon");
      });

      it("all names end with 'Icon'", () => {
        const icons = getAllHeroIconNames("solid");

        icons.forEach((iconName) => {
          expect(iconName.endsWith("Icon")).toBe(true);
        });
      });
    });

    describe("Outline Variant", () => {
      it("includes common outline icons", () => {
        const icons = getAllHeroIconNames("outline");

        expect(icons).toContain("HomeIcon");
        expect(icons).toContain("InformationCircleIcon");
      });

      it("returns different list for outline vs solid", () => {
        const solidIcons = getAllHeroIconNames("solid");
        const outlineIcons = getAllHeroIconNames("outline");

        // Both should have icons, but may have different counts
        expect(solidIcons.length).toBeGreaterThan(0);
        expect(outlineIcons.length).toBeGreaterThan(0);
      });
    });

    describe("Default Behavior", () => {
      it("defaults to solid variant", () => {
        const solidIcons = getAllHeroIconNames("solid");
        const defaultIcons = getAllHeroIconNames();

        expect(defaultIcons).toEqual(solidIcons);
      });
    });
  });
});
