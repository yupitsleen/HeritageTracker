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

// Map color names to hex values
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
 */
export function MapMarkers({
  sites,
  highlightedSiteId,
  onSiteClick,
  onSiteHighlight,
  currentTimestamp,
}: MapMarkersProps) {
  /**
   * Check if a site has been "destroyed" in the timeline
   * (timeline has passed its destruction date)
   */
  const isDestroyed = (site: GazaSite): boolean => {
    if (!currentTimestamp || !site.dateDestroyed) return false;
    return currentTimestamp >= new Date(site.dateDestroyed);
  };

  return (
    <>
      {sites.map((site) => {
        const isHighlighted = site.id === highlightedSiteId;
        const color = getMarkerColor(site.status);
        const destroyed = isDestroyed(site);

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
        // When destroyed: turn black and shrink to a tiny point
        return (
          <CircleMarker
            key={site.id}
            center={site.coordinates}
            radius={destroyed ? 2 : 6} // Shrink from 6 to 2 when destroyed
            pathOptions={{
              fillColor: destroyed ? "#000000" : COLOR_MAP[color], // Turn black when destroyed
              fillOpacity: destroyed ? 1 : 0.8, // Full opacity when black
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
    </>
  );
}
