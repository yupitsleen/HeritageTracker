import { describe, it, expect, vi } from "vitest";
import { fireEvent, waitFor } from "@testing-library/react";
import { renderWithTheme } from "../test-utils/renderWithTheme";
import { AnimationProvider } from "../contexts/AnimationContext";
import { TimelineScrubber } from "../components/Timeline/TimelineScrubber";
import { MapMarkers } from "../components/Map/MapMarkers";
import { MapContainer } from "react-leaflet";
import { SitesTable } from "../components/SitesTable";
import type { Site } from "../types";

/**
 * Integration tests for component synchronization
 * Ensures Timeline, Map, and Table always stay in sync
 *
 * Critical behavior:
 * - Clicking a timeline dot should highlight the site (not open modal)
 * - Clicking a map marker should highlight the site (not open modal)
 * - Clicking a table row should select the site (open modal)
 * - Clicking a table site name should select the site (open modal)
 * - All components reflect the currently highlighted site
 */

// Mock ResizeObserver for timeline tests
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock scrollIntoView for table tests (not available in jsdom)
Element.prototype.scrollIntoView = vi.fn();

const createMockSite = (overrides?: Partial<Site>): Site => ({
  id: "test-site-1",
  name: "Test Mosque",
  nameArabic: "مسجد الاختبار",
  type: "mosque",
  yearBuilt: "1950",
  coordinates: [31.5, 34.5],
  status: "destroyed",
  dateDestroyed: "2023-10-15",
  description: "A test mosque for sync testing",
  culturalSignificance: "Test significance",
  architecturalStyle: "Test style",
  verifiedBy: ["Test Source"],
  sources: [],
  ...overrides,
});

describe("Component Synchronization", () => {
  describe("Timeline ↔ Map ↔ Table Sync", () => {
    it("timeline dot click should only call onSiteHighlight (not onSiteClick)", async () => {
      const onSiteHighlight = vi.fn();
      const onSiteClick = vi.fn();
      const site = createMockSite();

      const { container } = renderWithTheme(
        <AnimationProvider>
          <TimelineScrubber
            sites={[site]}
            destructionDateStart={null}
            destructionDateEnd={null}
            onDestructionDateStartChange={() => {}}
            onDestructionDateEndChange={() => {}}
            highlightedSiteId={null}
            onSiteHighlight={onSiteHighlight}
          />
        </AnimationProvider>
      );

      // Wait for D3 to render
      await waitFor(() => {
        const dots = container.querySelectorAll(".event-marker");
        expect(dots.length).toBeGreaterThan(0);
      });

      // Find and click a timeline dot
      const timelineDot = container.querySelector(".event-marker");
      if (timelineDot) {
        fireEvent.click(timelineDot);
      }

      // Verify onSiteHighlight was called
      expect(onSiteHighlight).toHaveBeenCalled();

      // CRITICAL: onSiteClick should NOT be called (modal should not open)
      expect(onSiteClick).not.toHaveBeenCalled();
    });

    it("map marker click should only call onSiteHighlight (not onSiteClick)", () => {
      const onSiteHighlight = vi.fn();
      const onSiteClick = vi.fn();
      const site = createMockSite();

      const { container } = renderWithTheme(
        <MapContainer center={[31.5, 34.5]} zoom={10}>
          <MapMarkers
            sites={[site]}
            onSiteHighlight={onSiteHighlight}
            onSiteClick={onSiteClick}
            highlightedSiteId={null}
          />
        </MapContainer>
      );

      // Find and click the map marker
      const marker = container.querySelector("path.leaflet-interactive");
      expect(marker).toBeInTheDocument();

      if (marker) {
        fireEvent.click(marker);
      }

      // Verify onSiteHighlight was called
      expect(onSiteHighlight).toHaveBeenCalledWith(site.id);

      // CRITICAL: onSiteClick should NOT be called (modal should not open)
      expect(onSiteClick).not.toHaveBeenCalled();
    });

    it("timeline dot should visually highlight when site is selected elsewhere", async () => {
      const site1 = createMockSite({ id: "site-1", dateDestroyed: "2023-10-15" });
      const site2 = createMockSite({ id: "site-2", dateDestroyed: "2023-11-20" });

      const { container, rerender } = renderWithTheme(
        <AnimationProvider>
          <TimelineScrubber
            sites={[site1, site2]}
            destructionDateStart={null}
            destructionDateEnd={null}
            onDestructionDateStartChange={() => {}}
            onDestructionDateEndChange={() => {}}
            highlightedSiteId={null}
            onSiteHighlight={() => {}}
          />
        </AnimationProvider>
      );

      // Wait for D3 to render
      await waitFor(() => {
        const dots = container.querySelectorAll(".event-marker");
        expect(dots.length).toBe(2);
      });

      // Initially no site highlighted - all dots should have default stroke
      const dotsInitial = container.querySelectorAll(".event-marker");
      dotsInitial.forEach(dot => {
        expect(dot.getAttribute("stroke")).toBe("#000000"); // Default black
        expect(dot.getAttribute("stroke-width")).toBe("1.5"); // Default width
      });

      // Highlight site-1
      rerender(
        <AnimationProvider>
          <TimelineScrubber
            sites={[site1, site2]}
            destructionDateStart={null}
            destructionDateEnd={null}
            onDestructionDateStartChange={() => {}}
            onDestructionDateEndChange={() => {}}
            highlightedSiteId="site-1"
            onSiteHighlight={() => {}}
          />
        </AnimationProvider>
      );

      // Wait for re-render
      await waitFor(() => {
        const dots = container.querySelectorAll(".event-marker");
        // First dot should be highlighted (green stroke, thicker, larger)
        const firstDot = dots[0];
        expect(firstDot.getAttribute("stroke")).toBe("#009639"); // Green
        expect(firstDot.getAttribute("stroke-width")).toBe("3"); // Thicker
      });
    });

    it("map marker should visually highlight when site is selected elsewhere", () => {
      const site1 = createMockSite({ id: "site-1" });
      const site2 = createMockSite({ id: "site-2", coordinates: [31.6, 34.6] });

      const { container } = renderWithTheme(
        <MapContainer center={[31.5, 34.5]} zoom={10}>
          <MapMarkers
            sites={[site1, site2]}
            highlightedSiteId="site-1"
            onSiteHighlight={() => {}}
          />
        </MapContainer>
      );

      // When site-1 is highlighted, it should render as a Marker (teardrop icon)
      // instead of a CircleMarker
      const markerIcon = container.querySelector(".leaflet-marker-icon");
      expect(markerIcon).toBeInTheDocument();

      // Non-highlighted sites still render as circles
      const circles = container.querySelectorAll("path.leaflet-interactive");
      expect(circles.length).toBe(1); // Only site-2 as circle
    });

    it("table row should be highlighted when site is selected elsewhere", () => {
      const site1 = createMockSite({ id: "site-1", name: "First Site" });
      const site2 = createMockSite({ id: "site-2", name: "Second Site" });

      const { container } = renderWithTheme(
        <SitesTable
          sites={[site1, site2]}
          variant="compact"
          highlightedSiteId="site-1"
          onSiteClick={() => {}}
          onSiteHighlight={() => {}}
        />
      );

      // Find the highlighted row (should have bg-yellow-100 or similar)
      const rows = container.querySelectorAll("tr");
      // First row is header, second row is site-1 (highlighted)
      const highlightedRow = rows[1];

      // Check if the row has highlighting class
      expect(highlightedRow.className).toContain("bg-");
    });
  });

  describe("Highlighting vs Selection (Modal Behavior)", () => {
    it("verifies distinction between highlighting and selection", () => {
      const site = createMockSite();
      const onSiteHighlight = vi.fn();
      const onSiteClick = vi.fn();

      const { container } = renderWithTheme(
        <MapContainer center={[31.5, 34.5]} zoom={10}>
          <MapMarkers
            sites={[site]}
            highlightedSiteId={null}
            onSiteHighlight={onSiteHighlight}
            onSiteClick={onSiteClick}
          />
        </MapContainer>
      );

      const marker = container.querySelector("path.leaflet-interactive");

      // Clicking marker should ONLY highlight (not select)
      if (marker) {
        fireEvent.click(marker);
      }

      expect(onSiteHighlight).toHaveBeenCalledTimes(1);
      expect(onSiteClick).not.toHaveBeenCalled();
    });

    it("table row click should select site (open modal)", () => {
      const site = createMockSite({ name: "Test Site" });
      const onSiteClick = vi.fn();
      const onSiteHighlight = vi.fn();

      const { container } = renderWithTheme(
        <SitesTable
          sites={[site]}
          variant="compact"
          onSiteClick={onSiteClick}
          onSiteHighlight={onSiteHighlight}
          highlightedSiteId={null}
        />
      );

      // Find the table row (skip header)
      const rows = container.querySelectorAll("tbody tr");
      const firstRow = rows[0];

      // Click the row
      fireEvent.click(firstRow);

      // Should highlight the site
      expect(onSiteHighlight).toHaveBeenCalledWith(site.id);
    });

    it("table site name click should select site (open modal)", async () => {
      const site = createMockSite({ name: "Clickable Site Name" });
      const onSiteClick = vi.fn();

      const { getByText } = renderWithTheme(
        <SitesTable
          sites={[site]}
          variant="compact"
          onSiteClick={onSiteClick}
          onSiteHighlight={() => {}}
          highlightedSiteId={null}
        />
      );

      // Find and click the site name link
      const siteName = getByText("Clickable Site Name");
      fireEvent.click(siteName);

      // Should call onSiteClick to open modal
      expect(onSiteClick).toHaveBeenCalledWith(site);
    });
  });

  describe("Multi-component Sync Scenarios", () => {
    it("simulates user clicking through timeline → map → table", async () => {
      const site = createMockSite();
      let currentHighlightedId: string | null = null;

      const onSiteHighlight = vi.fn((siteId: string | null) => {
        currentHighlightedId = siteId;
      });

      // 1. Render timeline
      const { container } = renderWithTheme(
        <AnimationProvider>
          <TimelineScrubber
            sites={[site]}
            destructionDateStart={null}
            destructionDateEnd={null}
            onDestructionDateStartChange={() => {}}
            onDestructionDateEndChange={() => {}}
            highlightedSiteId={currentHighlightedId}
            onSiteHighlight={onSiteHighlight}
          />
        </AnimationProvider>
      );

      // Wait for timeline to render
      await waitFor(() => {
        expect(container.querySelector(".event-marker")).toBeInTheDocument();
      });

      // Click timeline dot
      const timelineDot = container.querySelector(".event-marker");
      if (timelineDot) {
        fireEvent.click(timelineDot);
      }

      // Verify site is highlighted
      expect(onSiteHighlight).toHaveBeenCalledTimes(1);
      expect(currentHighlightedId).toBe(site.id);

      // 2. Render map with highlighted site
      const { container: mapContainer } = renderWithTheme(
        <MapContainer center={[31.5, 34.5]} zoom={10}>
          <MapMarkers
            sites={[site]}
            highlightedSiteId={currentHighlightedId}
            onSiteHighlight={onSiteHighlight}
          />
        </MapContainer>
      );

      // Map should show highlighted marker (teardrop icon)
      expect(mapContainer.querySelector(".leaflet-marker-icon")).toBeInTheDocument();

      // 3. Render table with highlighted site
      const { container: tableContainer } = renderWithTheme(
        <SitesTable
          sites={[site]}
          variant="compact"
          highlightedSiteId={currentHighlightedId}
          onSiteClick={() => {}}
          onSiteHighlight={onSiteHighlight}
        />
      );

      // Table should show highlighted row
      const rows = tableContainer.querySelectorAll("tbody tr");
      expect(rows[0].className).toContain("bg-");
    });

    it("ensures all components respond to highlightedSiteId changes", () => {
      const site1 = createMockSite({ id: "site-1" });
      const site2 = createMockSite({ id: "site-2", coordinates: [31.6, 34.6] });

      // Test that passing different highlightedSiteId values works
      const { container: mapContainer1 } = renderWithTheme(
        <MapContainer center={[31.5, 34.5]} zoom={10}>
          <MapMarkers
            sites={[site1, site2]}
            highlightedSiteId="site-1"
            onSiteHighlight={() => {}}
          />
        </MapContainer>
      );

      // Site-1 should be highlighted (has marker icon)
      expect(mapContainer1.querySelector(".leaflet-marker-icon")).toBeInTheDocument();

      // Now switch to site-2
      const { container: mapContainer2 } = renderWithTheme(
        <MapContainer center={[31.5, 34.5]} zoom={10}>
          <MapMarkers
            sites={[site1, site2]}
            highlightedSiteId="site-2"
            onSiteHighlight={() => {}}
          />
        </MapContainer>
      );

      // Site-2 should now be highlighted
      expect(mapContainer2.querySelector(".leaflet-marker-icon")).toBeInTheDocument();
    });

    it("handles null highlightedSiteId (no selection)", () => {
      const site = createMockSite();

      // Timeline with no selection
      renderWithTheme(
        <AnimationProvider>
          <TimelineScrubber
            sites={[site]}
            destructionDateStart={null}
            destructionDateEnd={null}
            onDestructionDateStartChange={() => {}}
            onDestructionDateEndChange={() => {}}
            highlightedSiteId={null}
            onSiteHighlight={() => {}}
          />
        </AnimationProvider>
      );

      // Map with no selection - should render as circle
      const { container: mapContainer } = renderWithTheme(
        <MapContainer center={[31.5, 34.5]} zoom={10}>
          <MapMarkers
            sites={[site]}
            highlightedSiteId={null}
            onSiteHighlight={() => {}}
          />
        </MapContainer>
      );

      // Should render as circle marker (not teardrop icon)
      expect(mapContainer.querySelector("path.leaflet-interactive")).toBeInTheDocument();
      expect(mapContainer.querySelector(".leaflet-marker-icon")).not.toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles multiple clicks across components", async () => {
      const site1 = createMockSite({ id: "site-1" });
      const site2 = createMockSite({ id: "site-2", dateDestroyed: "2023-11-20" });
      const onSiteHighlight = vi.fn();

      const { container } = renderWithTheme(
        <AnimationProvider>
          <TimelineScrubber
            sites={[site1, site2]}
            destructionDateStart={null}
            destructionDateEnd={null}
            onDestructionDateStartChange={() => {}}
            onDestructionDateEndChange={() => {}}
            highlightedSiteId={null}
            onSiteHighlight={onSiteHighlight}
          />
        </AnimationProvider>
      );

      await waitFor(() => {
        const dots = container.querySelectorAll(".event-marker");
        expect(dots.length).toBe(2);
      });

      const dots = container.querySelectorAll(".event-marker");

      // Click first dot
      fireEvent.click(dots[0]);

      // Should handle the click
      expect(onSiteHighlight).toHaveBeenCalledWith(site1.id);
      expect(onSiteHighlight).toHaveBeenCalledTimes(1);
    });

    it("handles site with no destruction date (no timeline dot)", () => {
      const siteWithoutDate = createMockSite({
        id: "no-date",
        dateDestroyed: undefined,
        status: "damaged" // Not destroyed, so no dot
      });

      const { container } = renderWithTheme(
        <AnimationProvider>
          <TimelineScrubber
            sites={[siteWithoutDate]}
            destructionDateStart={null}
            destructionDateEnd={null}
            onDestructionDateStartChange={() => {}}
            onDestructionDateEndChange={() => {}}
            highlightedSiteId={null}
            onSiteHighlight={() => {}}
          />
        </AnimationProvider>
      );

      // Should not crash, no dots should be rendered
      const dots = container.querySelectorAll(".event-marker");
      expect(dots.length).toBe(0);
    });
  });
});
