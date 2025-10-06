import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import type { GazaSite } from "../../types";
import { StatusBadge } from "../StatusBadge";
import { formatLabel } from "../../utils/format";
import { components } from "../../styles/theme";
import {
  GAZA_CENTER,
  DEFAULT_ZOOM,
  MARKER_ICON_BASE_URL,
  MARKER_SHADOW_URL,
  MARKER_CONFIG,
} from "../../constants/map";
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
function MapCenterHandler({ sites, highlightedSiteId }: { sites: GazaSite[]; highlightedSiteId?: string | null }) {
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

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [map]);

  return null;
}

/**
 * Interactive map displaying heritage sites in Gaza
 * Automatically switches between English/Arabic tiles based on browser language
 */
export function HeritageMap({ sites, onSiteClick, highlightedSiteId, onSiteHighlight }: HeritageMapProps) {
  // Detect browser language
  const browserLang = navigator.language || navigator.languages?.[0] || "en";
  const isArabic = browserLang.startsWith("ar");

  // Tile configuration based on language
  const tileConfig = isArabic
    ? {
        // OpenStreetMap for Arabic labels
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    : {
        // CartoDB Positron for clean English labels
        url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
      };

  /**
   * Create custom marker icons based on site status and highlight state
   */
  const getMarkerIcon = (status: GazaSite["status"], isHighlighted: boolean) => {
    const color =
      status === "destroyed" ? "red" : status === "heavily-damaged" ? "orange" : "yellow";

    // Use larger icon size for highlighted markers
    const iconSize = isHighlighted
      ? [38, 61] as [number, number]  // 1.5x larger
      : MARKER_CONFIG.iconSize;
    const iconAnchor = isHighlighted
      ? [19, 61] as [number, number]
      : MARKER_CONFIG.iconAnchor;
    const popupAnchor = isHighlighted
      ? [1, -51] as [number, number]
      : MARKER_CONFIG.popupAnchor;

    return new Icon({
      iconUrl: `${MARKER_ICON_BASE_URL}/marker-icon-2x-${color}.png`,
      shadowUrl: MARKER_SHADOW_URL,
      iconSize,
      iconAnchor,
      popupAnchor,
      shadowSize: MARKER_CONFIG.shadowSize,
      className: isHighlighted ? 'highlighted-marker' : '',
    });
  };

  return (
    <div className="relative">
      {/* Map interaction hint */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md text-xs text-gray-700 pointer-events-none">
        Use <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-[10px] font-semibold">Ctrl</kbd> + scroll to zoom • Click markers for details
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

      {/* Map Tiles - Language adapts to browser setting */}
      <TileLayer
        attribution={tileConfig.attribution}
        url={tileConfig.url}
        subdomains={tileConfig.subdomains}
      />

      {/* Heritage Site Markers */}
      {sites.map((site) => {
        const isHighlighted = site.id === highlightedSiteId;
        return (
        <Marker
          key={site.id}
          position={site.coordinates}
          icon={getMarkerIcon(site.status, isHighlighted)}
          eventHandlers={{
            click: () => onSiteHighlight?.(site.id),
          }}
        >
          <Popup className="heritage-popup" maxWidth={320} maxHeight={400}>
            <div className="p-2 max-h-[350px] overflow-y-auto">
              {/* Status Badge */}
              <StatusBadge status={site.status} className="text-xs px-2 py-1 rounded mb-2" />

              {/* Site Info */}
              <h3 className="font-bold text-gray-900 mb-1">{site.name}</h3>
              {site.nameArabic && (
                <p className="text-gray-600 text-xs mb-2 text-right" dir="rtl">
                  {site.nameArabic}
                </p>
              )}

              <div className="text-xs text-gray-600 space-y-1">
                <p>
                  <span className="font-semibold">Type:</span> {formatLabel(site.type)}
                </p>
                <p>
                  <span className="font-semibold">Built:</span> {site.yearBuilt}
                </p>
                {site.dateDestroyed && (
                  <p>
                    <span className="font-semibold">Destroyed:</span> {site.dateDestroyed}
                  </p>
                )}
              </div>

              <p className="text-xs text-gray-700 mt-2 mb-3">{site.description}</p>

              {/* See More Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => onSiteClick?.(site)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline"
                >
                  See More →
                </button>
              </div>
            </div>
          </Popup>
        </Marker>
        );
      })}
    </MapContainer>
    </div>
  );
}
