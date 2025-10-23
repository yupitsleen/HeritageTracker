/**
 * Tile Layer Type Definitions
 *
 * Defines extensible tile layer system for map backgrounds.
 * Supports multiple providers (OpenStreetMap, CartoDB, ESRI, etc.)
 */

/**
 * Unique identifier for tile layer
 */
export type TileLayerId = string;

/**
 * Tile layer provider
 */
export type TileProvider =
  | "openstreetmap"
  | "carto"
  | "esri"
  | "mapbox"
  | "google"
  | "custom";

/**
 * Tile layer configuration
 */
export interface TileLayerConfig {
  /** Unique tile layer identifier */
  id: TileLayerId;

  /** Display label (English) */
  label: string;

  /** Display label (Arabic) */
  labelArabic?: string;

  /** Tile provider */
  provider: TileProvider;

  /** Tile URL template */
  url: string;

  /** Attribution text (HTML allowed) */
  attribution: string;

  /** Maximum zoom level */
  maxZoom: number;

  /** Minimum zoom level */
  minZoom?: number;

  /** Subdomains for load balancing (e.g., ['a', 'b', 'c']) */
  subdomains?: string[] | string;

  /** Whether this is the default layer */
  isDefault?: boolean;

  /** Display order in UI */
  order: number;

  /** Whether layer is enabled */
  enabled?: boolean;

  /** Description for documentation/tooltips */
  description?: string;

  /** API key required (for providers like Mapbox) */
  apiKey?: string;

  /** Additional options passed to Leaflet TileLayer */
  leafletOptions?: Record<string, unknown>;
}

/**
 * Tile layer type (categorization)
 */
export type TileLayerType = "street" | "satellite" | "terrain" | "hybrid";

/**
 * Extended tile layer with metadata
 */
export interface ExtendedTileLayerConfig extends TileLayerConfig {
  /** Layer type */
  type: TileLayerType;

  /** Language support */
  languages?: string[];

  /** Region optimized for */
  region?: string;
}
