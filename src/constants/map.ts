/**
 * Map configuration constants
 */

/**
 * Gaza Strip center coordinates [latitude, longitude]
 */
export const GAZA_CENTER: [number, number] = [31.5, 34.45] as const;

/**
 * Default zoom level for Gaza Strip view
 */
export const DEFAULT_ZOOM = 11;

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
  iconSize: [25, 41] as [number, number],
  iconAnchor: [12, 41] as [number, number],
  popupAnchor: [1, -34] as [number, number],
  shadowSize: [41, 41] as [number, number],
} as const;
