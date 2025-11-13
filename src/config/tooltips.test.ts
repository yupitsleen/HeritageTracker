import { describe, it, expect } from "vitest";
import { TOOLTIPS } from "./tooltips";

describe("Tooltip Configuration", () => {
  describe("Structure", () => {
    it("exports TOOLTIPS object with all categories", () => {
      expect(TOOLTIPS).toBeDefined();
      expect(TOOLTIPS.HEADER).toBeDefined();
      expect(TOOLTIPS.NAVIGATION).toBeDefined();
      expect(TOOLTIPS.TIMELINE).toBeDefined();
      expect(TOOLTIPS.WAYBACK).toBeDefined();
      expect(TOOLTIPS.FILTERS).toBeDefined();
      expect(TOOLTIPS.TABLE).toBeDefined();
      expect(TOOLTIPS.MAP).toBeDefined();
    });
  });

  describe("Header Tooltips", () => {
    it("has all header tooltips defined", () => {
      expect(TOOLTIPS.HEADER.HOME).toBe("Return to Dashboard");
      expect(TOOLTIPS.HEADER.HELP).toBe("View page instructions and keyboard shortcuts");
      expect(TOOLTIPS.HEADER.LANGUAGE).toBe("Switch language");
      expect(TOOLTIPS.HEADER.DARK_MODE_ON).toBe("Switch to light mode");
      expect(TOOLTIPS.HEADER.DARK_MODE_OFF).toBe("Switch to dark mode");
      expect(TOOLTIPS.HEADER.MENU_OPEN).toBe("Open navigation menu");
      expect(TOOLTIPS.HEADER.MENU_CLOSE).toBe("Close navigation menu");
    });

    it("header tooltips are non-empty strings", () => {
      Object.values(TOOLTIPS.HEADER).forEach((tooltip) => {
        expect(typeof tooltip).toBe("string");
        expect(tooltip.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Navigation Tooltips", () => {
    it("has all navigation tooltips defined", () => {
      expect(TOOLTIPS.NAVIGATION.DASHBOARD).toBe("Interactive map and timeline overview");
      expect(TOOLTIPS.NAVIGATION.TIMELINE).toBe("Satellite comparison with historical imagery");
      expect(TOOLTIPS.NAVIGATION.DATA).toBe("Full table view with export options");
      expect(TOOLTIPS.NAVIGATION.STATS).toBe("Statistical analysis and impact data");
      expect(TOOLTIPS.NAVIGATION.ABOUT).toBe("Project information and methodology");
      expect(TOOLTIPS.NAVIGATION.RESOURCES).toBe("Donation links and external resources");
    });

    it("navigation tooltips are non-empty strings", () => {
      Object.values(TOOLTIPS.NAVIGATION).forEach((tooltip) => {
        expect(typeof tooltip).toBe("string");
        expect(tooltip.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Timeline Tooltips", () => {
    it("has all timeline tooltips defined", () => {
      expect(TOOLTIPS.TIMELINE.PAUSE).toBe("Pause timeline animation");
      expect(TOOLTIPS.TIMELINE.RESET).toBe("Reset timeline to beginning");
      expect(TOOLTIPS.TIMELINE.PREV_EVENT).toBe("Jump to previous destruction event");
      expect(TOOLTIPS.TIMELINE.NEXT_EVENT).toBe("Jump to next destruction event");
      expect(TOOLTIPS.TIMELINE.SPEED).toBe("Timeline animation playback speed");
      expect(TOOLTIPS.TIMELINE.SYNC_MAP).toBe("Automatically update satellite imagery to match timeline date");
      expect(TOOLTIPS.TIMELINE.ZOOM_TO_SITE).toBe("Automatically zoom map to selected heritage site");
      expect(TOOLTIPS.TIMELINE.SHOW_MARKERS).toBe("Display markers for all heritage sites on map");
    });

    it("timeline tooltips are non-empty strings", () => {
      Object.values(TOOLTIPS.TIMELINE).forEach((tooltip) => {
        expect(typeof tooltip).toBe("string");
        expect(tooltip.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Wayback Tooltips", () => {
    it("has all wayback tooltips defined", () => {
      expect(TOOLTIPS.WAYBACK.PREV_RELEASE).toBe("Go to previous satellite image release");
      expect(TOOLTIPS.WAYBACK.NEXT_RELEASE).toBe("Go to next satellite image release");
      expect(TOOLTIPS.WAYBACK.COMPARISON_MODE).toBe("Show before/after satellite maps side-by-side");
      expect(TOOLTIPS.WAYBACK.INTERVAL).toBe("Time gap between before/after satellite images");
      expect(TOOLTIPS.WAYBACK.SYNC_VERSION).toBe("Auto-sync map imagery when clicking timeline events");
    });

    it("wayback tooltips are non-empty strings", () => {
      Object.values(TOOLTIPS.WAYBACK).forEach((tooltip) => {
        expect(typeof tooltip).toBe("string");
        expect(tooltip.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Filter Tooltips", () => {
    it("has all filter tooltips defined", () => {
      expect(TOOLTIPS.FILTERS.CLEAR_SEARCH).toBe("Clear search");
      expect(TOOLTIPS.FILTERS.TYPE_FILTER).toBe("Filter by heritage site type (mosque, church, archaeological site, etc.)");
      expect(TOOLTIPS.FILTERS.STATUS_FILTER).toBe("Filter by damage status (destroyed, heavily damaged, etc.)");
      expect(TOOLTIPS.FILTERS.DATE_FILTER).toBe("Filter by date of destruction");
      expect(TOOLTIPS.FILTERS.YEAR_FILTER).toBe("Filter by year built (supports BCE dates)");
      expect(TOOLTIPS.FILTERS.CLEAR_ALL).toBe("Remove all active filters");
      expect(TOOLTIPS.FILTERS.OPEN_MOBILE).toBe("Open filters panel");
      expect(TOOLTIPS.FILTERS.REMOVE_PILL).toBe("Remove this filter");
    });

    it("filter tooltips are non-empty strings", () => {
      Object.values(TOOLTIPS.FILTERS).forEach((tooltip) => {
        expect(typeof tooltip).toBe("string");
        expect(tooltip.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Table Tooltips", () => {
    it("has all table tooltips defined", () => {
      expect(TOOLTIPS.TABLE.EXPAND).toBe("Open full table view in new page");
      expect(TOOLTIPS.TABLE.EXPORT_FORMAT).toBe("Choose export file format (CSV, JSON, or GeoJSON)");
      expect(TOOLTIPS.TABLE.EXPORT_BUTTON).toBe("Download filtered sites");
      expect(TOOLTIPS.TABLE.SORT_COLUMN).toBe("Click to sort");
      expect(TOOLTIPS.TABLE.SORT_ASC).toBe("Sorted ascending - click to reverse");
      expect(TOOLTIPS.TABLE.SORT_DESC).toBe("Sorted descending - click to reverse");
    });

    it("table tooltips are non-empty strings", () => {
      Object.values(TOOLTIPS.TABLE).forEach((tooltip) => {
        expect(typeof tooltip).toBe("string");
        expect(tooltip.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Map Tooltips", () => {
    it("has all map tooltips defined", () => {
      expect(TOOLTIPS.MAP.ZOOM_TO_SITE).toBe("Automatically zoom to selected heritage sites");
      expect(TOOLTIPS.MAP.SHOW_MARKERS).toBe("Display markers for all heritage sites on map");
    });

    it("map tooltips are non-empty strings", () => {
      Object.values(TOOLTIPS.MAP).forEach((tooltip) => {
        expect(typeof tooltip).toBe("string");
        expect(tooltip.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Content Quality", () => {
    it("all tooltips start with capital letter", () => {
      const allTooltips = [
        ...Object.values(TOOLTIPS.HEADER),
        ...Object.values(TOOLTIPS.NAVIGATION),
        ...Object.values(TOOLTIPS.TIMELINE),
        ...Object.values(TOOLTIPS.WAYBACK),
        ...Object.values(TOOLTIPS.FILTERS),
        ...Object.values(TOOLTIPS.TABLE),
        ...Object.values(TOOLTIPS.MAP),
      ];

      allTooltips.forEach((tooltip) => {
        expect(tooltip[0]).toBe(tooltip[0].toUpperCase());
      });
    });

    it("no tooltips are excessively long (> 200 chars)", () => {
      const allTooltips = [
        ...Object.values(TOOLTIPS.HEADER),
        ...Object.values(TOOLTIPS.NAVIGATION),
        ...Object.values(TOOLTIPS.TIMELINE),
        ...Object.values(TOOLTIPS.WAYBACK),
        ...Object.values(TOOLTIPS.FILTERS),
        ...Object.values(TOOLTIPS.TABLE),
        ...Object.values(TOOLTIPS.MAP),
      ];

      allTooltips.forEach((tooltip) => {
        expect(tooltip.length).toBeLessThanOrEqual(200);
      });
    });

    it("tooltips are concise (average < 80 chars)", () => {
      const allTooltips = [
        ...Object.values(TOOLTIPS.HEADER),
        ...Object.values(TOOLTIPS.NAVIGATION),
        ...Object.values(TOOLTIPS.TIMELINE),
        ...Object.values(TOOLTIPS.WAYBACK),
        ...Object.values(TOOLTIPS.FILTERS),
        ...Object.values(TOOLTIPS.TABLE),
        ...Object.values(TOOLTIPS.MAP),
      ];

      const avgLength = allTooltips.reduce((sum, t) => sum + t.length, 0) / allTooltips.length;
      expect(avgLength).toBeLessThan(80);
    });
  });
});
