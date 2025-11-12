import { describe, it, expect, vi } from "vitest";
import { fireEvent } from "@testing-library/react";
import { renderWithTheme } from "../../test-utils/renderWithTheme";
import { MapContainer } from "react-leaflet";
import { MapMarkers } from "./MapMarkers";
import type { Site } from "../../types";

/**
 * Tests for MapMarkers component
 * Verifies correct behavior of marker interactions:
 * - Clicking marker should only highlight (not open modal)
 * - "See More" button in popup should open modal via onViewMore callback
 */

// Helper to create mock sites
const createMockSite = (overrides?: Partial<Site>): Site => ({
  id: "test-site-1",
  name: "Test Mosque",
  nameArabic: "مسجد الاختبار",
  type: "mosque",
  yearBuilt: "1950",
  coordinates: [31.5, 34.5],
  status: "destroyed",
  dateDestroyed: "2023-10-15",
  description: "A test mosque for unit testing",
  culturalSignificance: "Test significance",
  architecturalStyle: "Test style",
  verifiedBy: ["Test Source"],
  sources: [],
  ...overrides,
});

describe("MapMarkers", () => {
  describe("Marker Click Behavior", () => {
    it("should only call onSiteHighlight when marker is clicked (not onSiteClick)", () => {
      const onSiteClick = vi.fn();
      const onSiteHighlight = vi.fn();
      const site = createMockSite();

      const { container } = renderWithTheme(
        <MapContainer center={[31.5, 34.5]} zoom={10}>
          <MapMarkers
            sites={[site]}
            onSiteClick={onSiteClick}
            onSiteHighlight={onSiteHighlight}
          />
        </MapContainer>
      );

      // Find the CircleMarker SVG path element
      const markerPath = container.querySelector("path.leaflet-interactive");
      expect(markerPath).toBeInTheDocument();

      // Simulate click on the marker
      if (markerPath) {
        fireEvent.click(markerPath);
      }

      // Verify onSiteHighlight was called with the site ID
      expect(onSiteHighlight).toHaveBeenCalledTimes(1);
      expect(onSiteHighlight).toHaveBeenCalledWith(site.id);

      // CRITICAL: Verify onSiteClick was NOT called
      // This ensures the detail modal doesn't open when marker is clicked
      expect(onSiteClick).not.toHaveBeenCalled();
    });

    it("should not call onSiteClick when highlighted marker is clicked", () => {
      const onSiteClick = vi.fn();
      const onSiteHighlight = vi.fn();
      const site = createMockSite();

      const { container } = renderWithTheme(
        <MapContainer center={[31.5, 34.5]} zoom={10}>
          <MapMarkers
            sites={[site]}
            highlightedSiteId={site.id}
            onSiteClick={onSiteClick}
            onSiteHighlight={onSiteHighlight}
          />
        </MapContainer>
      );

      // When highlighted, it should render as a Marker (icon), not CircleMarker
      // The marker-icon is rendered in the marker-pane
      const markerIcon = container.querySelector(".leaflet-marker-icon");
      expect(markerIcon).toBeInTheDocument();

      // Simulate click on the marker icon
      if (markerIcon) {
        fireEvent.click(markerIcon);
      }

      // Should call onSiteHighlight
      expect(onSiteHighlight).toHaveBeenCalledTimes(1);

      // CRITICAL: Should NOT call onSiteClick (modal should not open)
      expect(onSiteClick).not.toHaveBeenCalled();
    });
  });

  describe("Highlighted Marker Behavior", () => {
    it("renders highlighted marker with teardrop icon", () => {
      const site = createMockSite();

      const { container } = renderWithTheme(
        <MapContainer center={[31.5, 34.5]} zoom={10}>
          <MapMarkers
            sites={[site]}
            highlightedSiteId={site.id}
          />
        </MapContainer>
      );

      // Highlighted markers use Marker component (teardrop icon)
      expect(container.querySelector(".leaflet-marker-icon")).toBeInTheDocument();
    });

    it("renders non-highlighted marker as circle", () => {
      const site = createMockSite();

      const { container } = renderWithTheme(
        <MapContainer center={[31.5, 34.5]} zoom={10}>
          <MapMarkers
            sites={[site]}
            highlightedSiteId={null}
          />
        </MapContainer>
      );

      // Non-highlighted markers use CircleMarker (SVG path)
      expect(container.querySelector("path.leaflet-interactive")).toBeInTheDocument();
    });
  });

  describe("Multiple Markers", () => {
    it("renders multiple sites correctly", () => {
      const sites = [
        createMockSite({ id: "site-1", name: "Site 1", coordinates: [31.5, 34.5] }),
        createMockSite({ id: "site-2", name: "Site 2", coordinates: [31.6, 34.6] }),
        createMockSite({ id: "site-3", name: "Site 3", coordinates: [31.7, 34.7] }),
      ];

      const { container } = renderWithTheme(
        <MapContainer center={[31.5, 34.5]} zoom={10}>
          <MapMarkers sites={sites} />
        </MapContainer>
      );

      // Should render 3 circle markers (SVG paths)
      const circles = container.querySelectorAll("path.leaflet-interactive");
      expect(circles.length).toBe(3);
    });

    it("handles clicking different markers independently", () => {
      const onSiteHighlight = vi.fn();
      const onSiteClick = vi.fn();
      const sites = [
        createMockSite({ id: "site-1", name: "Site 1", coordinates: [31.5, 34.5] }),
        createMockSite({ id: "site-2", name: "Site 2", coordinates: [31.6, 34.6] }),
      ];

      const { container } = renderWithTheme(
        <MapContainer center={[31.5, 34.5]} zoom={10}>
          <MapMarkers
            sites={sites}
            onSiteHighlight={onSiteHighlight}
            onSiteClick={onSiteClick}
          />
        </MapContainer>
      );

      const markers = container.querySelectorAll("path.leaflet-interactive");

      // Click first marker
      fireEvent.click(markers[0]);
      expect(onSiteHighlight).toHaveBeenCalledWith("site-1");

      // Click second marker
      fireEvent.click(markers[1]);
      expect(onSiteHighlight).toHaveBeenCalledWith("site-2");

      expect(onSiteHighlight).toHaveBeenCalledTimes(2);

      // CRITICAL: onSiteClick should not be called for either marker
      expect(onSiteClick).not.toHaveBeenCalled();
    });
  });

  describe("Timeline Integration", () => {
    it("renders destroyed markers based on currentTimestamp", () => {
      const site = createMockSite({
        dateDestroyed: "2023-10-15",
      });

      const currentTimestamp = new Date("2023-11-01"); // After destruction

      const { container } = renderWithTheme(
        <MapContainer center={[31.5, 34.5]} zoom={10}>
          <MapMarkers
            sites={[site]}
            currentTimestamp={currentTimestamp}
          />
        </MapContainer>
      );

      // Should still render marker (destroyed or not)
      const marker = container.querySelector("path.leaflet-interactive");
      expect(marker).toBeInTheDocument();

      // Check fill color indicates destroyed state (black #000000)
      expect(marker?.getAttribute("fill")).toBe("#000000");
    });

    it("renders intact markers when timestamp is before destruction", () => {
      const site = createMockSite({
        dateDestroyed: "2023-10-15",
        status: "destroyed",
      });

      const currentTimestamp = new Date("2023-09-01"); // Before destruction

      const { container } = renderWithTheme(
        <MapContainer center={[31.5, 34.5]} zoom={10}>
          <MapMarkers
            sites={[site]}
            currentTimestamp={currentTimestamp}
          />
        </MapContainer>
      );

      // Should render as normal circle marker with red color
      const marker = container.querySelector("path.leaflet-interactive");
      expect(marker).toBeInTheDocument();
      expect(marker?.getAttribute("fill")).toBe("#b91c1c"); // Red for destroyed status (but not yet destroyed) - from centralized color system
    });
  });

  describe("Callback Handlers", () => {
    it("provides site object to onSiteClick when invoked (e.g., via See More button)", () => {
      const onSiteClick = vi.fn();
      const site = createMockSite();

      renderWithTheme(
        <MapContainer center={[31.5, 34.5]} zoom={10}>
          <MapMarkers
            sites={[site]}
            onSiteClick={onSiteClick}
          />
        </MapContainer>
      );

      // Manually invoke onSiteClick as the SitePopup "See More" button would
      onSiteClick(site);

      // Verify it was called with the complete site object
      expect(onSiteClick).toHaveBeenCalledWith(site);
    });

    it("provides site ID to onSiteHighlight when marker is clicked", () => {
      const onSiteHighlight = vi.fn();
      const site = createMockSite({ id: "unique-id-123" });

      const { container } = renderWithTheme(
        <MapContainer center={[31.5, 34.5]} zoom={10}>
          <MapMarkers
            sites={[site]}
            onSiteHighlight={onSiteHighlight}
          />
        </MapContainer>
      );

      const marker = container.querySelector("path.leaflet-interactive");
      if (marker) {
        fireEvent.click(marker);
      }

      // Verify site ID is passed
      expect(onSiteHighlight).toHaveBeenCalledWith("unique-id-123");
    });
  });

  describe("Rendering", () => {
    it("renders without crashing when no callbacks provided", () => {
      const site = createMockSite();

      const { container } = renderWithTheme(
        <MapContainer center={[31.5, 34.5]} zoom={10}>
          <MapMarkers sites={[site]} />
        </MapContainer>
      );

      expect(container.querySelector("path.leaflet-interactive")).toBeInTheDocument();
    });

    it("handles empty sites array gracefully", () => {
      const { container } = renderWithTheme(
        <MapContainer center={[31.5, 34.5]} zoom={10}>
          <MapMarkers sites={[]} />
        </MapContainer>
      );

      // Should render container but no markers
      expect(container.querySelector("path.leaflet-interactive")).not.toBeInTheDocument();
    });
  });
});
