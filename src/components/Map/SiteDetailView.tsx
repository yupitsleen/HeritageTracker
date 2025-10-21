import { useMemo, useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import type { GazaSite } from "../../types";
import { GAZA_CENTER, DEFAULT_ZOOM, SITE_DETAIL_ZOOM, HISTORICAL_IMAGERY, type TimePeriod } from "../../constants/map";
import { MapUpdater, ScrollWheelHandler } from "./MapHelperComponents";
import { TimeToggle } from "./TimeToggle";
import { useAnimation } from "../../contexts/AnimationContext";
import { getImageryPeriodForDate } from "../../utils/imageryPeriods";
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
 * Can sync imagery periods with timeline playback when enabled
 */
export function SiteDetailView({ sites, highlightedSiteId }: SiteDetailViewProps) {
  // Get animation context for timeline sync
  const { currentTimestamp, syncActive } = useAnimation();

  // Time period state for historical imagery
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("PRE_CONFLICT_2023");

  // Sync satellite imagery with timeline (only if syncActive is true)
  useEffect(() => {
    if (!syncActive) return; // Skip sync if not enabled or temporarily disabled

    // Use dynamic period calculation utility
    const period = getImageryPeriodForDate(currentTimestamp);
    setSelectedPeriod(period);
  }, [currentTimestamp, syncActive]);

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
