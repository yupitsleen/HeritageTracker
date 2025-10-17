/**
 * Map configuration constants
 */

/**
 * Gaza Strip center coordinates [latitude, longitude]
 * Adjusted slightly north to better center the strip in the viewport
 */
export const GAZA_CENTER: [number, number] = [31.42, 34.38] as const;

/**
 * Default zoom level for Gaza Strip view
 * Zoom 10.5 provides balanced full-strip visibility in wide containers
 */
export const DEFAULT_ZOOM = 10.5;

/**
 * CDN URLs for Leaflet marker icons
 */
export const MARKER_ICON_BASE_URL =
  "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img";

export const MARKER_SHADOW_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png";

/**
 * Marker icon configuration
 */
export const MARKER_CONFIG = {
  // Small dots for default state
  iconSize: [12, 20] as [number, number],
  iconAnchor: [6, 20] as [number, number],
  popupAnchor: [0, -17] as [number, number],
  shadowSize: [20, 20] as [number, number],
  // Regular marker size when selected (not enlarged)
  highlightedIconSize: [25, 41] as [number, number],
  highlightedIconAnchor: [12, 41] as [number, number],
  highlightedPopupAnchor: [1, -34] as [number, number],
} as const;

/**
 * Tile layer configurations for different languages
 */
export const TILE_CONFIGS = {
  arabic: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: undefined,
  },
  english: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
  },
} as const;
