import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { MapContainer } from "react-leaflet";
import { MapGlowLayer } from "./MapGlowLayer";
import type { GlowContribution } from "../../hooks/useMapGlow";
import L from "leaflet";

/**
 * Smoke tests for MapGlowLayer - Leaflet.heat heat map implementation
 * Tests that the component integrates with Leaflet.heat without crashing
 */

// Mock Leaflet.heat
const mockHeatLayer = {
  addTo: vi.fn().mockReturnThis(),
  setLatLngs: vi.fn().mockReturnThis(),
  setOptions: vi.fn().mockReturnThis(),
};

vi.mock("leaflet.heat", () => ({
  default: {},
}));

L.heatLayer = vi.fn(() => mockHeatLayer as unknown as L.HeatLayer);

// Helper to create mock glow contributions
const createGlowContribution = (
  overrides?: Partial<GlowContribution>
): GlowContribution => ({
  siteId: "test-site-1",
  siteName: "Test Site",
  baseGlow: 100,
  currentGlow: 100,
  coordinates: [31.5, 34.5],
  status: "destroyed",
  dateDestroyed: "2023-10-15",
  isDestroyed: false, // Default to not destroyed (intact)
  ...overrides,
});

describe("MapGlowLayer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Smoke Tests", () => {
    it("renders without crashing", () => {
      const glowContributions = [createGlowContribution()];

      const { container } = render(
        <MapContainer center={[31.5, 34.5]} zoom={10}>
          <MapGlowLayer glowContributions={glowContributions} maxGlow={100} />
        </MapContainer>
      );

      expect(container).toBeInTheDocument();
    });

    it("handles empty glowContributions array", () => {
      const { container } = render(
        <MapContainer center={[31.5, 34.5]} zoom={10}>
          <MapGlowLayer glowContributions={[]} maxGlow={100} />
        </MapContainer>
      );

      expect(container).toBeInTheDocument();
    });

    it("handles zero maxGlow", () => {
      const glowContributions = [createGlowContribution({ currentGlow: 0 })];

      const { container } = render(
        <MapContainer center={[31.5, 34.5]} zoom={10}>
          <MapGlowLayer glowContributions={glowContributions} maxGlow={0} />
        </MapContainer>
      );

      expect(container).toBeInTheDocument();
    });

    it("creates heat layer via Leaflet API", () => {
      const glowContributions = [createGlowContribution()];

      render(
        <MapContainer center={[31.5, 34.5]} zoom={10}>
          <MapGlowLayer glowContributions={glowContributions} maxGlow={100} />
        </MapContainer>
      );

      // Verify Leaflet.heat API was called
      expect(L.heatLayer).toHaveBeenCalled();
      expect(mockHeatLayer.addTo).toHaveBeenCalled();
    });

    it("separates intact and destroyed sites into different layers", () => {
      const glowContributions = [
        createGlowContribution({ siteId: "site-1", isDestroyed: false, status: "destroyed" }),
        createGlowContribution({ siteId: "site-2", isDestroyed: true, status: "destroyed" }),
        createGlowContribution({ siteId: "site-3", isDestroyed: false, status: "heavily-damaged" }),
      ];

      render(
        <MapContainer center={[31.5, 34.5]} zoom={10}>
          <MapGlowLayer glowContributions={glowContributions} maxGlow={100} />
        </MapContainer>
      );

      // Should create 2 heat layers: gold for intact, grey for destroyed
      expect(L.heatLayer).toHaveBeenCalledTimes(2);

      const goldLayerCall = (L.heatLayer as ReturnType<typeof vi.fn>).mock.calls[0];
      const greyLayerCall = (L.heatLayer as ReturnType<typeof vi.fn>).mock.calls[1];

      const goldData = goldLayerCall[0];
      const greyData = greyLayerCall[0];

      // 2 intact sites in gold layer
      expect(goldData).toHaveLength(2);
      // 1 destroyed site in grey layer
      expect(greyData).toHaveLength(1);
    });

    it("updates when glowContributions change", () => {
      const glowContributions1 = [
        createGlowContribution({ siteId: "site-1" }),
      ];

      const { rerender } = render(
        <MapContainer center={[31.5, 34.5]} zoom={10}>
          <MapGlowLayer glowContributions={glowContributions1} maxGlow={100} />
        </MapContainer>
      );

      const initialCallCount = (L.heatLayer as ReturnType<typeof vi.fn>).mock
        .calls.length;

      const glowContributions2 = [
        createGlowContribution({ siteId: "site-1", currentGlow: 50 }),
      ];

      rerender(
        <MapContainer center={[31.5, 34.5]} zoom={10}>
          <MapGlowLayer glowContributions={glowContributions2} maxGlow={100} />
        </MapContainer>
      );

      const finalCallCount = (L.heatLayer as ReturnType<typeof vi.fn>).mock
        .calls.length;

      // Should recreate heat layer on data change
      expect(finalCallCount).toBeGreaterThan(initialCallCount);
    });

    it("handles 25+ sites efficiently", () => {
      const glowContributions = Array.from({ length: 25 }, (_, i) =>
        createGlowContribution({
          siteId: `site-${i}`,
          coordinates: [31.5 + i * 0.01, 34.5 + i * 0.01],
          currentGlow: 100 - i * 2,
        })
      );

      const startTime = performance.now();

      render(
        <MapContainer center={[31.5, 34.5]} zoom={10}>
          <MapGlowLayer glowContributions={glowContributions} maxGlow={100} />
        </MapContainer>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      console.log(`\n✓ MapGlowLayer rendered 25 sites in ${renderTime.toFixed(2)}ms`);

      // Should render reasonably fast
      expect(renderTime).toBeLessThan(200);
    });
  });
});
