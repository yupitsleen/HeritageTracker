import { useMemo, memo } from "react";
import { Marker, CircleMarker, Popup } from "react-leaflet";
import type { GazaSite } from "../../types";
import { createMarkerIcon, getMarkerColor } from "../../utils/mapHelpers";
import { SitePopup } from "./SitePopup";

interface MapMarkersProps {
  sites: GazaSite[];
  highlightedSiteId?: string | null;
  onSiteClick?: (site: GazaSite) => void;
  onSiteHighlight?: (siteId: string | null) => void;
  currentTimestamp?: Date;
}

const COLOR_MAP: Record<string, string> = {
  red: "#ed3039",
  orange: "#D97706",
  yellow: "#CA8A04",
};

/**
 * MapMarkers - Renders heritage site markers on the map
 * - Highlighted sites: Teardrop marker (Marker component)
 * - Default sites: Circle marker (CircleMarker component)
 * - Color-coded by status (destroyed/heavily-damaged/damaged)
 * - Animates markers when timeline passes their destruction date
 *
 * PERFORMANCE OPTIMIZATIONS:
 * - Memoized with React.memo to prevent unnecessary re-renders
 * - Destroyed sites pre-computed as Set for O(1) lookups (critical for 1000+ sites)
 */
export const MapMarkers = memo(function MapMarkers({
  sites,
  highlightedSiteId,
  onSiteClick,
  onSiteHighlight,
  currentTimestamp,
}: MapMarkersProps) {
  /**
   * Pre-compute destroyed site IDs as a Set for O(1) lookup
   * Without this, checking isDestroyed(site) is O(n) per marker = O(n²) total
   * With memoization: O(n) once, then O(1) per lookup
   */
  const destroyedSiteIds = useMemo(() => {
    if (!currentTimestamp) return new Set<string>();

    return new Set(
      sites
        .filter(site => site.dateDestroyed && currentTimestamp >= new Date(site.dateDestroyed))
        .map(site => site.id)
    );
  }, [sites, currentTimestamp]);

  return (
    <>
      {sites.map((site) => {
        const isHighlighted = site.id === highlightedSiteId;
        const color = getMarkerColor(site.status);
        const destroyed = destroyedSiteIds.has(site.id);

        if (isHighlighted) {
          return (
            <Marker
              key={site.id}
              position={site.coordinates}
              icon={createMarkerIcon(site.status, isHighlighted)}
              eventHandlers={{
                click: () => {
                  onSiteClick?.(site);
                  onSiteHighlight?.(site.id);
                },
              }}
            >
              <Popup className="heritage-popup" maxWidth={320} maxHeight={400}>
                <SitePopup site={site} onViewMore={() => onSiteClick?.(site)} />
              </Popup>
            </Marker>
          );
        }

        return (
          <CircleMarker
            key={site.id}
            center={site.coordinates}
            radius={destroyed ? 2 : 6}
            pathOptions={{
              fillColor: destroyed ? "#000000" : COLOR_MAP[color],
              fillOpacity: destroyed ? 1 : 0.8,
              color: "#000000",
              weight: 1,
            }}
            eventHandlers={{
              click: () => {
                onSiteClick?.(site);
                onSiteHighlight?.(site.id);
              },
            }}
          >
            <Popup className="heritage-popup" maxWidth={320} maxHeight={400}>
              <SitePopup site={site} onViewMore={() => onSiteClick?.(site)} />
            </Popup>
          </CircleMarker>
        );
      })}
    </>
  );
});
