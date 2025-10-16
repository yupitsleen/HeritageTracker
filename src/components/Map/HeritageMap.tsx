import React, { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, CircleMarker, Popup, useMapEvents, useMap } from "react-leaflet";
import type { GazaSite } from "../../types";
import { components } from "../../styles/theme";
import { GAZA_CENTER, DEFAULT_ZOOM } from "../../constants/map";
import { createMarkerIcon, getMarkerColor } from "../../utils/mapHelpers";
import { useTileConfig } from "../../hooks/useTileConfig";
import { SitePopup } from "./SitePopup";
import { MapGlowLayer } from "./MapGlowLayer";
import { useMapGlow } from "../../hooks/useMapGlow";
import { useAnimation } from "../../contexts/AnimationContext";
import "leaflet/dist/leaflet.css";

interface HeritageMapProps {
  sites: GazaSite[];
  onSiteClick?: (site: GazaSite) => void;
  highlightedSiteId?: string | null;
  onSiteHighlight?: (siteId: string | null) => void;
}

/**
 * Component to handle map centering when a site is highlighted
 */
function MapCenterHandler({
  sites,
  highlightedSiteId,
}: {
  sites: GazaSite[];
  highlightedSiteId?: string | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (highlightedSiteId) {
      const site = sites.find((s) => s.id === highlightedSiteId);
      if (site) {
        // Close any open popups
        map.closePopup();

        // Smoothly pan to the site without scrolling the page
        map.flyTo(site.coordinates, map.getZoom(), {
          duration: 0.8,
          easeLinearity: 0.25,
        });
      }
    }
  }, [highlightedSiteId, sites, map]);

  return null;
}

/**
 * Component to log zoom level changes
 */
function ZoomLogger() {
  const map = useMap();

  useEffect(() => {
    const logZoom = () => {
      console.log('🔍 Current Zoom Level:', map.getZoom());
    };

    // Log initial zoom
    logZoom();

    // Log on zoom changes
    map.on('zoomend', logZoom);

    return () => {
      map.off('zoomend', logZoom);
    };
  }, [map]);

  return null;
}

/**
 * Component to handle Ctrl+Scroll zoom behavior
 */
function ScrollWheelHandler() {
  const map = useMapEvents({});

  // Use useEffect to add direct DOM event listener for better control
  React.useEffect(() => {
    const container = map.getContainer();

    const handleWheel = (e: WheelEvent) => {
      // Only zoom if Ctrl (or Cmd on Mac) is pressed
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault(); // Prevent browser zoom
        e.stopPropagation(); // Stop event from bubbling

        const delta = e.deltaY;
        const currentZoom = map.getZoom();

        // Use a smaller increment for smoother zooming
        if (delta < 0) {
          // Scroll up = zoom in
          map.setZoom(currentZoom + 1);
        } else if (delta > 0) {
          // Scroll down = zoom out
          map.setZoom(currentZoom - 1);
        }
      }
      // If Ctrl/Cmd not pressed, do nothing (allow normal page scroll)
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [map]);

  return null;
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
  const tileConfig = useTileConfig();
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
    <div className="relative">
      {/* Map interaction hint */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md text-xs text-gray-700 pointer-events-none">
        Use <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-[10px] font-semibold">Ctrl</kbd>{" "}
        + scroll to zoom • Click markers for details
      </div>

      <MapContainer
        center={GAZA_CENTER}
        zoom={DEFAULT_ZOOM}
        className={components.map.container}
        scrollWheelZoom={false}
      >
        {/* Custom scroll wheel handler for Ctrl+Scroll zoom */}
        <ScrollWheelHandler />

        {/* Map center handler for highlighted sites */}
        <MapCenterHandler sites={sites} highlightedSiteId={highlightedSiteId} />

        {/* Zoom level logger for debugging */}
        <ZoomLogger />

        {/* Map Tiles - Language adapts to browser setting */}
        <TileLayer
          attribution={tileConfig.attribution}
          url={tileConfig.url}
          subdomains={tileConfig.subdomains}
        />

        {/* Phase 2: Ambient heritage glow layer - dims as sites are destroyed */}
        <MapGlowLayer glowContributions={glowContributions} maxGlow={maxGlow} />

        {/* Heritage Site Markers */}
        {sites.map((site) => {
          const isHighlighted = site.id === highlightedSiteId;
          const color = getMarkerColor(site.status);

          // Map color names to hex values
          const colorMap: Record<string, string> = {
            red: "#ed3039",
            orange: "#D97706",
            yellow: "#CA8A04",
          };

          // If highlighted, show teardrop marker; otherwise show circle
          if (isHighlighted) {
            return (
              <Marker
                key={site.id}
                position={site.coordinates}
                icon={createMarkerIcon(site.status, isHighlighted)}
                eventHandlers={{
                  click: () => onSiteHighlight?.(site.id),
                }}
              >
                <Popup className="heritage-popup" maxWidth={320} maxHeight={400}>
                  <SitePopup site={site} onViewMore={() => onSiteClick?.(site)} />
                </Popup>
              </Marker>
            );
          }

          // Default: show circle marker (dot)
          return (
            <CircleMarker
              key={site.id}
              center={site.coordinates}
              radius={6}
              pathOptions={{
                fillColor: colorMap[color],
                fillOpacity: 0.8,
                color: "#000000",
                weight: 1,
              }}
              eventHandlers={{
                click: () => onSiteHighlight?.(site.id),
              }}
            >
              <Popup className="heritage-popup" maxWidth={320} maxHeight={400}>
                <SitePopup site={site} onViewMore={() => onSiteClick?.(site)} />
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
