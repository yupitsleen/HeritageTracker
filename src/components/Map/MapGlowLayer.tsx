import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";
import type { GlowContribution } from "../../hooks/useMapGlow";

/**
 * Leaflet.heat extended interface
 * The leaflet.heat plugin adds HeatLayer to L namespace
 */
declare module "leaflet" {
  function heatLayer(
    latlngs: Array<[number, number, number]>,
    options?: HeatMapOptions
  ): HeatLayer;

  interface HeatMapOptions {
    minOpacity?: number;
    maxZoom?: number;
    max?: number;
    radius?: number;
    blur?: number;
    gradient?: Record<number, string>;
  }

  interface HeatLayer extends Layer {
    setLatLngs(latlngs: Array<[number, number, number]>): this;
    addLatLng(latlng: [number, number, number]): this;
    setOptions(options: HeatMapOptions): this;
  }
}

interface MapGlowLayerProps {
  glowContributions: GlowContribution[];
  maxGlow: number;
}

/**
 * MapGlowLayer - Renders ambient heritage glow using Leaflet.heat
 * Part of Phase 2: "Dimming Gaza" visual system
 *
 * As sites are destroyed through the timeline, their glow contribution
 * decreases, creating a visual "dimming" effect on the map.
 *
 * Uses Leaflet's heat map plugin for performance and visual quality.
 */
export function MapGlowLayer({ glowContributions, maxGlow }: MapGlowLayerProps) {
  const map = useMap();

  useEffect(() => {
    // Convert glow contributions to heat map data format
    // Format: [lat, lng, intensity]
    const heatData = glowContributions
      .filter((contrib) => contrib.currentGlow > 0) // Only show sites with glow
      .map((contrib) => {
        const [lat, lng] = contrib.coordinates;
        // Normalize intensity (0-1 range) based on max glow
        const intensity = maxGlow > 0 ? contrib.currentGlow / maxGlow : 0;
        return [lat, lng, intensity] as [number, number, number];
      });

    // Create heat layer with custom styling
    // Gradient: warm gold (#FFD700) → cool grey (#6B7280)
    const heatLayer = L.heatLayer(heatData, {
      minOpacity: 0.2,
      maxZoom: 18,
      max: 1.0,
      radius: 40, // Larger radius for ambient glow effect
      blur: 50, // High blur for soft, diffused look
      gradient: {
        // Custom gradient: warm to cool as intensity decreases
        0.0: "#6B7280", // Cool grey (low intensity = destroyed areas)
        0.3: "#9CA3AF", // Medium grey
        0.5: "#D4A574", // Warm beige
        0.7: "#E5C07B", // Golden beige
        1.0: "#FFD700", // Pure gold (high intensity = intact heritage)
      },
    });

    // Add layer to map
    heatLayer.addTo(map);

    // Cleanup: remove layer on unmount or when data changes
    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, glowContributions, maxGlow]);

  return null; // This is a non-visual component (renders via Leaflet)
}