import { useMemo } from "react";
import { MapContainer } from "react-leaflet";
import type { GazaSite } from "../../types";
import { GAZA_CENTER, DEFAULT_ZOOM } from "../../constants/map";
import { useMapGlow } from "../../hooks/useMapGlow";
import { useAnimation } from "../../contexts/AnimationContext";
import { MapCenterHandler, ZoomLogger, ScrollWheelHandler } from "./MapHelperComponents";
import { MapTileLayers } from "./MapTileLayers";
import { MapGlowLayer } from "./MapGlowLayer";
import { MapMarkers } from "./MapMarkers";
import "leaflet/dist/leaflet.css";

interface HeritageMapProps {
  sites: GazaSite[];
  onSiteClick?: (site: GazaSite) => void;
  highlightedSiteId?: string | null;
  onSiteHighlight?: (siteId: string | null) => void;
}

/**
 * Interactive map displaying heritage sites in Gaza
 * Automatically switches between English/Arabic tiles based on browser language
 * Phase 2: Includes MapGlowLayer for "Dimming Gaza" effect
 */
export function HeritageMap({
  sites,
  onSiteClick,
  highlightedSiteId,
  onSiteHighlight,
}: HeritageMapProps) {
  const { currentTimestamp } = useAnimation();

  // Calculate glow contributions based on timeline position
  const { glowContributions } = useMapGlow(sites, currentTimestamp);

  // Find max BASE glow for normalization (not current glow)
  // This ensures each site shows at 100% intensity when intact,
  // and dims proportionally as it's destroyed
  const maxGlow = useMemo(() => {
    if (glowContributions.length === 0) return 1;
    return Math.max(...glowContributions.map((gc) => gc.baseGlow));
  }, [glowContributions]);

  return (
    <div className="relative h-full">
      {/* Map interaction hint */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md text-xs text-gray-700 pointer-events-none">
        Use <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-[10px] font-semibold">Ctrl</kbd>{" "}
        + scroll to zoom • Click markers for details
      </div>

      <MapContainer
        center={GAZA_CENTER}
        zoom={DEFAULT_ZOOM}
        className="h-full w-full rounded-lg shadow-md border border-[#e5e5e5]"
        scrollWheelZoom={false}
      >
        {/* Custom scroll wheel handler for Ctrl+Scroll zoom */}
        <ScrollWheelHandler />

        {/* Map center handler for highlighted sites */}
        <MapCenterHandler sites={sites} highlightedSiteId={highlightedSiteId} />

        {/* Zoom level logger for debugging */}
        <ZoomLogger />

        {/* Layer Control for switching between Street and Satellite views */}
        <MapTileLayers />

        {/* Phase 2: Ambient heritage glow layer - dims as sites are destroyed */}
        <MapGlowLayer glowContributions={glowContributions} maxGlow={maxGlow} />

        {/* Heritage Site Markers */}
        <MapMarkers
          sites={sites}
          highlightedSiteId={highlightedSiteId}
          onSiteClick={onSiteClick}
          onSiteHighlight={onSiteHighlight}
        />
      </MapContainer>
    </div>
  );
}
