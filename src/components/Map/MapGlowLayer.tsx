import { useEffect, useState } from "react";
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

  // State to track zoom level and trigger re-renders
  const [zoomLevel, setZoomLevel] = useState(map.getZoom());

  // Debug log on mount and whenever props change
  console.log('🔥 MapGlowLayer Render:', {
    totalContributions: glowContributions.length,
    maxGlow,
    zoomLevel,
    firstSite: glowContributions[0],
  });

  useEffect(() => {
    // Get current zoom level
    const zoom = map.getZoom();

    // Calculate dynamic radius based on zoom level
    // At zoom 16+: radius = 40 (looks good)
    // At zoom 13-: radius = 15 (much smaller for zoomed out view)
    // Linear interpolation between zoom 13 and 16
    let radius: number;
    let blur: number;
    if (zoom >= 16) {
      radius = 40;
      blur = 50;
    } else if (zoom <= 13) {
      radius = 15;
      blur = 20;
    } else {
      // Linear interpolation between zoom 13-16
      const zoomFactor = (zoom - 13) / (16 - 13); // 0 at zoom 13, 1 at zoom 16
      radius = 15 + (40 - 15) * zoomFactor;
      blur = 20 + (50 - 20) * zoomFactor;
    }

    // Separate intact and destroyed sites
    const intactSites = glowContributions.filter((contrib) => !contrib.isDestroyed);
    const destroyedSites = glowContributions.filter((contrib) => contrib.isDestroyed);

    // Create gold heat layer for intact sites
    const goldHeatData = intactSites.map((contrib) => {
      const [lat, lng] = contrib.coordinates;
      const intensity = maxGlow > 0 ? contrib.baseGlow / maxGlow : 0;
      return [lat, lng, intensity] as [number, number, number];
    });

    // Create grey/black heat layer for destroyed sites
    // Intensity based on damage level: destroyed=1.0 (black), heavily-damaged=0.6, damaged=0.3
    const greyHeatData = destroyedSites.map((contrib) => {
      const [lat, lng] = contrib.coordinates;
      let intensity = 0.3; // Default for "damaged"
      if (contrib.status === "destroyed") intensity = 1.0; // Black
      else if (contrib.status === "heavily-damaged") intensity = 0.6; // Dark grey
      return [lat, lng, intensity] as [number, number, number];
    });

    // Debug logging
    console.log('🔥 MapGlowLayer Debug:', {
      zoom,
      radius,
      blur,
      totalContributions: glowContributions.length,
      intactSites: goldHeatData.length,
      destroyedSites: greyHeatData.length,
    });

    // Create gold heat layer for intact heritage
    const goldLayer = L.heatLayer(goldHeatData, {
      minOpacity: 0.3,
      maxZoom: 18,
      max: 1.0,
      radius,
      blur,
      gradient: {
        0.0: "#E5C07B", // Golden beige (low importance)
        0.5: "#FFD700", // Pure gold (medium importance)
        1.0: "#FFD700", // Pure gold (high importance)
      },
    });

    // Create grey/black heat layer for destroyed sites
    const greyLayer = L.heatLayer(greyHeatData, {
      minOpacity: 0.4,
      maxZoom: 18,
      max: 1.0,
      radius,
      blur,
      gradient: {
        0.0: "#9CA3AF", // Light grey (damaged)
        0.3: "#9CA3AF", // Light grey (damaged)
        0.6: "#4B5563", // Dark grey (heavily-damaged)
        1.0: "#1F2937", // Almost black (destroyed)
      },
    });

    // Add layers to map
    goldLayer.addTo(map);
    if (greyHeatData.length > 0) {
      greyLayer.addTo(map);
    }

    // Listen for zoom changes and update state to trigger re-render
    const handleZoomEnd = () => {
      setZoomLevel(map.getZoom());
    };

    map.on('zoomend', handleZoomEnd);

    // Cleanup: remove layers on unmount or when data changes
    return () => {
      map.off('zoomend', handleZoomEnd);
      map.removeLayer(goldLayer);
      if (greyHeatData.length > 0) {
        map.removeLayer(greyLayer);
      }
    };
  }, [map, glowContributions, maxGlow, zoomLevel]);

  return null; // This is a non-visual component (renders via Leaflet)
}