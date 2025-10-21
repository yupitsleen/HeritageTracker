import { useMemo } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { GAZA_CENTER, DEFAULT_ZOOM } from "../../constants/map";
import { MapUpdater, ScrollWheelHandler } from "../Map/MapHelperComponents";
import { useWayback } from "../../contexts/WaybackContext";
import "leaflet/dist/leaflet.css";

/**
 * WaybackMap - Satellite map displaying current Wayback imagery release
 * Reuses patterns from SiteDetailView.tsx
 * Simplified version without site markers or time period toggles
 */
export function WaybackMap() {
  const { currentRelease } = useWayback();

  // Map configuration
  const { center, zoom, tileUrl, maxZoom } = useMemo(() => {
    // Always center on Gaza
    const mapCenter = GAZA_CENTER;
    const mapZoom = DEFAULT_ZOOM;

    // Use current release tile URL, or fallback to empty string if loading
    const url = currentRelease?.tileUrl || "";
    const maxZ = currentRelease?.maxZoom || 19;

    return {
      center: mapCenter,
      zoom: mapZoom,
      tileUrl: url,
      maxZoom: maxZ,
    };
  }, [currentRelease]);

  // Don't render map until we have a release
  if (!currentRelease) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="text-xl mb-2">Loading map...</div>
          <div className="text-sm text-gray-400">Waiting for Wayback release data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full"
        scrollWheelZoom={false}
        zoomControl={true}
        attributionControl={true}
      >
        {/* Custom scroll wheel handler for Ctrl+Scroll zoom */}
        <ScrollWheelHandler />

        {/* Map updater for smooth transitions */}
        <MapUpdater center={center} zoom={zoom} />

        {/* Wayback satellite tile layer */}
        <TileLayer
          key={currentRelease.releaseNum} // Force re-render when release changes
          url={tileUrl}
          attribution='&copy; <a href="https://www.esri.com/">Esri</a> Wayback Imagery'
          maxZoom={maxZoom}
          minZoom={1}
        />
      </MapContainer>
    </div>
  );
}
