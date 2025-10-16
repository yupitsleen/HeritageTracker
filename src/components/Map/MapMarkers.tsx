import { Marker, CircleMarker, Popup } from "react-leaflet";
import type { GazaSite } from "../../types";
import { createMarkerIcon, getMarkerColor } from "../../utils/mapHelpers";
import { SitePopup } from "./SitePopup";

interface MapMarkersProps {
  sites: GazaSite[];
  highlightedSiteId?: string | null;
  onSiteClick?: (site: GazaSite) => void;
  onSiteHighlight?: (siteId: string | null) => void;
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
 */
export function MapMarkers({
  sites,
  highlightedSiteId,
  onSiteClick,
  onSiteHighlight,
}: MapMarkersProps) {
  return (
    <>
      {sites.map((site) => {
        const isHighlighted = site.id === highlightedSiteId;
        const color = getMarkerColor(site.status);

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
              fillColor: COLOR_MAP[color],
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
    </>
  );
}
