import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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
}

/**
 * Interactive map displaying heritage sites in Gaza
 * Automatically switches between English/Arabic tiles based on browser language
 */
export function HeritageMap({ sites, onSiteClick }: HeritageMapProps) {
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
   * Create custom marker icons based on site status
   */
  const getMarkerIcon = (status: GazaSite["status"]) => {
    const color =
      status === "destroyed" ? "red" : status === "heavily-damaged" ? "orange" : "yellow";

    return new Icon({
      iconUrl: `${MARKER_ICON_BASE_URL}/marker-icon-2x-${color}.png`,
      shadowUrl: MARKER_SHADOW_URL,
      iconSize: MARKER_CONFIG.iconSize,
      iconAnchor: MARKER_CONFIG.iconAnchor,
      popupAnchor: MARKER_CONFIG.popupAnchor,
      shadowSize: MARKER_CONFIG.shadowSize,
    });
  };

  return (
    <MapContainer
      center={GAZA_CENTER}
      zoom={DEFAULT_ZOOM}
      className={components.map.container}
      scrollWheelZoom={true}
    >
      {/* Map Tiles - Language adapts to browser setting */}
      <TileLayer
        attribution={tileConfig.attribution}
        url={tileConfig.url}
        subdomains={tileConfig.subdomains}
      />

      {/* Heritage Site Markers */}
      {sites.map((site) => (
        <Marker
          key={site.id}
          position={site.coordinates}
          icon={getMarkerIcon(site.status)}
          eventHandlers={{
            click: () => onSiteClick?.(site),
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

              <p className="text-xs text-gray-700 mt-2">{site.description}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
