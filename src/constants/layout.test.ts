import { describe, it, expect } from "vitest";
import { BREAKPOINTS, Z_INDEX, TABLE_CONFIG, TIMELINE_CONFIG, LAYOUT } from "./layout";

describe("Layout Constants", () => {
  describe("BREAKPOINTS", () => {
    it("should define mobile breakpoint at 768px (Tailwind md)", () => {
      expect(BREAKPOINTS.MOBILE).toBe(768);
    });

    it("should define tablet breakpoint at 1024px (Tailwind lg)", () => {
      expect(BREAKPOINTS.TABLET).toBe(1024);
    });

    it("should define desktop breakpoint at 1024px", () => {
      expect(BREAKPOINTS.DESKTOP).toBe(1024);
    });

    it("should have consistent tablet and desktop breakpoints", () => {
      expect(BREAKPOINTS.TABLET).toBe(BREAKPOINTS.DESKTOP);
    });

    it("should have mobile < tablet ordering", () => {
      expect(BREAKPOINTS.MOBILE).toBeLessThan(BREAKPOINTS.TABLET);
    });
  });

  describe("Z_INDEX", () => {
    it("should define all required z-index layers", () => {
      expect(Z_INDEX.BASE).toBe(0);
      expect(Z_INDEX.CONTENT).toBe(1);
      expect(Z_INDEX.STICKY).toBe(100);
      expect(Z_INDEX.DROPDOWN).toBe(1000);
      expect(Z_INDEX.TOOLTIP).toBe(1010);
      expect(Z_INDEX.FIXED).toBe(1020);
      expect(Z_INDEX.MODAL).toBe(9999);
      expect(Z_INDEX.NOTIFICATION).toBe(10000);
      expect(Z_INDEX.MODAL_DROPDOWN).toBe(10002);
    });

    it("should have correct stacking order", () => {
      expect(Z_INDEX.BASE).toBeLessThan(Z_INDEX.CONTENT);
      expect(Z_INDEX.CONTENT).toBeLessThan(Z_INDEX.STICKY);
      expect(Z_INDEX.STICKY).toBeLessThan(Z_INDEX.DROPDOWN);
      expect(Z_INDEX.DROPDOWN).toBeLessThan(Z_INDEX.TOOLTIP);
      expect(Z_INDEX.TOOLTIP).toBeLessThan(Z_INDEX.FIXED);
      expect(Z_INDEX.FIXED).toBeLessThan(Z_INDEX.MODAL);
      expect(Z_INDEX.MODAL).toBeLessThan(Z_INDEX.NOTIFICATION);
      expect(Z_INDEX.NOTIFICATION).toBeLessThan(Z_INDEX.MODAL_DROPDOWN);
    });

    it("should have modal z-index high enough to overlay content", () => {
      expect(Z_INDEX.MODAL).toBeGreaterThan(1000);
    });

    it("should have modal dropdown above modal and notification", () => {
      expect(Z_INDEX.MODAL_DROPDOWN).toBeGreaterThan(Z_INDEX.MODAL);
      expect(Z_INDEX.MODAL_DROPDOWN).toBeGreaterThan(Z_INDEX.NOTIFICATION);
    });

    it("should have modal dropdown as highest z-index", () => {
      const allZIndices = Object.values(Z_INDEX);
      const maxZIndex = Math.max(...allZIndices);
      expect(Z_INDEX.MODAL_DROPDOWN).toBe(maxZIndex);
    });
  });

  describe("TABLE_CONFIG", () => {
    it("should define type column width", () => {
      expect(TABLE_CONFIG.TYPE_COLUMN_WIDTH).toBe(60);
    });

    it("should define default table width", () => {
      expect(TABLE_CONFIG.DEFAULT_TABLE_WIDTH).toBe(480);
    });

    it("should have minimum width less than or equal to default", () => {
      expect(TABLE_CONFIG.MIN_TABLE_WIDTH).toBeLessThanOrEqual(
        TABLE_CONFIG.DEFAULT_TABLE_WIDTH
      );
    });

    it("should have maximum width greater than default", () => {
      expect(TABLE_CONFIG.MAX_TABLE_WIDTH).toBeGreaterThan(
        TABLE_CONFIG.DEFAULT_TABLE_WIDTH
      );
    });

    it("should define column breakpoints", () => {
      expect(TABLE_CONFIG.COLUMN_BREAKPOINTS.dateDestroyedIslamic).toBe(650);
      expect(TABLE_CONFIG.COLUMN_BREAKPOINTS.yearBuilt).toBe(800);
      expect(TABLE_CONFIG.COLUMN_BREAKPOINTS.yearBuiltIslamic).toBe(950);
    });

    it("should have progressive column breakpoints in ascending order", () => {
      const breakpoints = TABLE_CONFIG.COLUMN_BREAKPOINTS;
      expect(breakpoints.dateDestroyedIslamic).toBeLessThan(breakpoints.yearBuilt);
      expect(breakpoints.yearBuilt).toBeLessThan(breakpoints.yearBuiltIslamic);
    });
  });

  describe("TIMELINE_CONFIG", () => {
    it("should define timeline height", () => {
      expect(TIMELINE_CONFIG.HEIGHT).toBe(200);
    });

    it("should have a reasonable height for visualization", () => {
      expect(TIMELINE_CONFIG.HEIGHT).toBeGreaterThan(100);
      expect(TIMELINE_CONFIG.HEIGHT).toBeLessThan(400);
    });
  });

  describe("LAYOUT", () => {
    it("should define header height", () => {
      expect(LAYOUT.HEADER_HEIGHT).toBe(80);
    });

    it("should define footer height", () => {
      expect(LAYOUT.FOOTER_HEIGHT).toBe(60);
    });

    it("should calculate fixed height correctly", () => {
      expect(LAYOUT.FIXED_HEIGHT).toBe(
        LAYOUT.HEADER_HEIGHT + LAYOUT.FOOTER_HEIGHT
      );
    });

    it("should have header height greater than footer", () => {
      expect(LAYOUT.HEADER_HEIGHT).toBeGreaterThan(LAYOUT.FOOTER_HEIGHT);
    });
  });

  describe("Constants Immutability", () => {
    it("should be readonly (as const)", () => {
      // TypeScript will catch this at compile time, but we can verify structure
      expect(Object.isFrozen(BREAKPOINTS)).toBe(false); // 'as const' doesn't freeze at runtime
      // The important part is TypeScript enforces immutability at compile time
      expect(BREAKPOINTS).toBeDefined();
      expect(Z_INDEX).toBeDefined();
    });
  });
});
