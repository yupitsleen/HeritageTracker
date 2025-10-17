import { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import type { GazaSite } from "../../types";
import { GAZA_CENTER, DEFAULT_ZOOM, SITE_DETAIL_ZOOM, HISTORICAL_IMAGERY, type TimePeriod } from "../../constants/map";
import { MapUpdater, ScrollWheelHandler } from "./MapHelperComponents";
import { TimeToggle } from "./TimeToggle";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface SiteDetailViewProps {
  sites: GazaSite[];
  highlightedSiteId: string | null;
}

/**
 * Satellite aerial view that zooms in on selected heritage sites
 * Shows Gaza overview when no site is selected
 * Desktop only - always displays satellite imagery
 * Supports historical imagery comparison (2014, Aug 2023, Current)
 */
export function SiteDetailView({ sites, highlightedSiteId }: SiteDetailViewProps) {
  // Time period state for historical imagery
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("PRE_CONFLICT_2023");

  // Find the highlighted site
  const highlightedSite = useMemo(() => {
    if (!highlightedSiteId) return null;
    return sites.find((site) => site.id === highlightedSiteId) || null;
  }, [sites, highlightedSiteId]);

  // Get tile URL and maxZoom for selected time period
  const { tileUrl, maxZoom: periodMaxZoom } = useMemo(() => {
    const period = HISTORICAL_IMAGERY[selectedPeriod];
    return {
      tileUrl: period.url,
      maxZoom: period.maxZoom,
    };
  }, [selectedPeriod]);

  // Get label for selected time period
  const periodLabel = useMemo(() => {
    return HISTORICAL_IMAGERY[selectedPeriod].label;
  }, [selectedPeriod]);

  // Determine map center and zoom level (clamped to period's max zoom)
  const { center, zoom } = useMemo(() => {
    if (highlightedSite) {
      // Zoom in on selected site, but don't exceed the period's max zoom
      return {
        center: highlightedSite.coordinates,
        zoom: Math.min(SITE_DETAIL_ZOOM, periodMaxZoom),
      };
    }
    // Default: Gaza overview
    return {
      center: GAZA_CENTER,
      zoom: DEFAULT_ZOOM,
    };
  }, [highlightedSite, periodMaxZoom]);

  // Create a custom marker icon for the highlighted site
  const markerIcon = useMemo(() => {
    return L.divIcon({
      className: "custom-marker-icon",
      html: `
        <div class="w-5 h-5 bg-[#ed3039] border-[3px] border-white rounded-full shadow-md"></div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  }, []);

  return (
    <div className="relative h-full">
      {/* Time period toggle */}
      <TimeToggle selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} />

      {/* Label for the detail view */}
      <div className="absolute top-2 left-2 z-[1000] bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md pointer-events-none">
        <div className="text-xs font-semibold text-gray-900">
          {highlightedSite ? "Site Detail (Satellite)" : "Gaza Overview (Satellite)"}
        </div>
        <div className="text-[10px] text-gray-600 mt-0.5">
          {highlightedSite ? highlightedSite.name : periodLabel}
        </div>
      </div>

      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full rounded-xl shadow-lg border border-gray-200"
        scrollWheelZoom={false}
        zoomControl={true}
        attributionControl={true}
      >
        {/* Custom scroll wheel handler for Ctrl+Scroll zoom */}
        <ScrollWheelHandler />

        {/* Map updater for smooth transitions */}
        <MapUpdater center={center} zoom={zoom} />

        {/* Satellite tile layer - supports historical imagery via Wayback */}
        <TileLayer
          key={selectedPeriod} // Force re-render when time period changes
          url={tileUrl}
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
          maxZoom={periodMaxZoom}
          minZoom={1}
        />

        {/* Show marker for highlighted site */}
        {highlightedSite && (
          <Marker position={highlightedSite.coordinates} icon={markerIcon} />
        )}
      </MapContainer>
    </div>
  );
}
