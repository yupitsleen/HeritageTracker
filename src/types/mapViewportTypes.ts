/**
 * Map Viewport Type Definitions
 *
 * Defines extensible map viewport configuration for center coordinates
 * and zoom levels.
 */

/**
 * Map center coordinates [latitude, longitude]
 */
export type MapCenter = [number, number];

/**
 * Zoom level (valid Leaflet range: 0-20+)
 */
export type ZoomLevel = number;

/**
 * Map viewport configuration
 */
export interface MapViewportConfig {
  /** Unique viewport identifier */
  id: string;

  /** Display label (English) */
  label: string;

  /** Display label (Arabic) */
  labelArabic?: string;

  /** Center coordinates [lat, lng] */
  center: MapCenter;

  /** Default zoom level */
  zoom: number;

  /** Minimum allowed zoom level */
  minZoom?: number;

  /** Maximum allowed zoom level */
  maxZoom?: number;

  /** Whether this is the default viewport */
  isDefault?: boolean;

  /** Description for documentation/tooltips */
  description?: string;

  /** Bounds (optional, for restricting pan area) */
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

/**
 * Zoom level configuration
 */
export interface ZoomLevelConfig {
  /** Unique zoom level identifier */
  id: string;

  /** Display label (English) */
  label: string;

  /** Display label (Arabic) */
  labelArabic?: string;

  /** Zoom level value */
  zoom: number;

  /** Description for documentation/tooltips */
  description?: string;

  /** Context where this zoom is used */
  context?: "overview" | "detail" | "site" | "custom";
}
