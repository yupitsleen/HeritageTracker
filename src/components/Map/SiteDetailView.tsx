import { useMemo, useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { GazaSite } from "../../types";
import { GAZA_CENTER, DEFAULT_ZOOM, SITE_DETAIL_ZOOM, HISTORICAL_IMAGERY, type TimePeriod } from "../../constants/map";
import { SITE_MARKER_CONFIG } from "../../constants/timeline";
import { MapUpdater, ScrollWheelHandler } from "./MapHelperComponents";
import { TimeToggle } from "./TimeToggle";
import { SitePopup } from "./SitePopup";
import { MapMarkers } from "./MapMarkers";
import { useAnimation } from "../../contexts/AnimationContext";
import { getImageryPeriodForDate } from "../../utils/imageryPeriods";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface SiteDetailViewProps {
  sites: GazaSite[];
  highlightedSiteId: string | null;
  // Optional custom tile URL (e.g., for Wayback imagery)
  customTileUrl?: string;
  // Optional custom max zoom for custom tiles
  customMaxZoom?: number;
  // Optional date label to display at top of map
  dateLabel?: string;
  // Optional callback for when user clicks "See More" in popup
  onSiteClick?: (site: GazaSite) => void;
  // Optional flag to indicate if comparison mode is active (disables adaptive zoom)
  comparisonModeActive?: boolean;
}

/**
 * Satellite aerial view that zooms in on selected heritage sites
 * Shows Gaza overview when no site is selected
 * Desktop only - always displays satellite imagery
 * Supports historical imagery comparison (2014, Aug 2023, Current)
 * Can sync imagery periods with timeline playback when enabled
 */
export function SiteDetailView({
  sites,
  highlightedSiteId,
  customTileUrl,
  customMaxZoom,
  dateLabel,
  onSiteClick,
  comparisonModeActive = false,
}: SiteDetailViewProps) {
  // Get animation context for timeline sync and zoom toggle
  const { currentTimestamp, syncActive, zoomToSiteEnabled, mapMarkersVisible } = useAnimation();

  // Time period state for historical imagery
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("EARLY_2024");

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

  // Get tile URL and maxZoom
  // If custom URL provided (e.g., Wayback imagery), use that instead of period-based imagery
  const { url: tileUrl, maxZoom: periodMaxZoom } = useMemo(() => {
    if (customTileUrl) {
      return {
        url: customTileUrl,
        maxZoom: customMaxZoom || 19,
      };
    }
    // Otherwise use standard historical imagery periods
    return HISTORICAL_IMAGERY[selectedPeriod];
  }, [customTileUrl, customMaxZoom, selectedPeriod]);

  // Determine map center and zoom level (clamped to period's max zoom)
  // When zoomToSiteEnabled is OFF, only show marker without zooming in
  const { center, zoom } = useMemo(() => {
    if (highlightedSite && zoomToSiteEnabled) {
      // Adaptive zoom: Use closer zoom for newer imagery (2022-04-27+), but only when NOT in comparison mode
      // This provides better satellite detail when available, while keeping comparison maps at consistent zoom
      let targetZoom = SITE_DETAIL_ZOOM; // Default: 17

      if (!comparisonModeActive && dateLabel) {
        // Check if imagery is from 2022-04-27 or later (when higher zoom rendering became available)
        const imageryDate = new Date(dateLabel);
        const highResThreshold = new Date("2022-04-27");

        if (imageryDate >= highResThreshold) {
          // Use zoom 18 for newer imagery with better resolution
          targetZoom = 18;
        }
      }

      // Zoom in on selected site, but don't exceed the period's max zoom
      return {
        center: highlightedSite.coordinates,
        zoom: Math.min(targetZoom, periodMaxZoom),
      };
    }
    // Default: Gaza overview (or keep current position if zoomToSite is OFF)
    return {
      center: GAZA_CENTER,
      zoom: DEFAULT_ZOOM,
    };
  }, [highlightedSite, periodMaxZoom, zoomToSiteEnabled, comparisonModeActive, dateLabel]);

  // Create a custom marker icon for the highlighted site
  const markerIcon = useMemo(() => {
    return L.divIcon({
      className: "custom-marker-icon",
      html: `
        <div class="w-5 h-5 bg-[#ed3039] border-[3px] border-white rounded-full shadow-md"></div>
      `,
      iconSize: SITE_MARKER_CONFIG.ICON_SIZE,
      iconAnchor: SITE_MARKER_CONFIG.ICON_ANCHOR,
    });
  }, []);

  return (
    <div className="relative h-full">
      {/* Date label - shown when provided (e.g., from Wayback imagery) */}
      {dateLabel && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-[1000] pointer-events-none">
          <div className="px-3 py-0.75 bg-[#009639] text-white text-[15px] font-semibold rounded whitespace-nowrap shadow-lg opacity-70">
            {dateLabel}
          </div>
        </div>
      )}

      {/* Time period toggle - hide when using custom Wayback imagery */}
      {!customTileUrl && (
        <TimeToggle selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} />
      )}

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

        {/* Show markers - only if markers are visible */}
        {mapMarkersVisible && (
          <>
            {highlightedSite ? (
              /* Show single marker for highlighted site when zoomed in */
              <Marker position={highlightedSite.coordinates} icon={markerIcon}>
                <Popup className="heritage-popup" maxWidth={320} maxHeight={400}>
                  <SitePopup site={highlightedSite} onViewMore={() => onSiteClick?.(highlightedSite)} />
                </Popup>
              </Marker>
            ) : (
              /* Show all site markers when zoomed out (no site selected) */
              <MapMarkers
                sites={sites}
                highlightedSiteId={highlightedSiteId}
                onSiteClick={onSiteClick}
                currentTimestamp={currentTimestamp}
              />
            )}
          </>
        )}
      </MapContainer>
    </div>
  );
}
