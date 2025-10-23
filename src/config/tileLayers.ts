/**
 * Tile Layer Registry
 *
 * Central registry for map tile layers. Enables dynamic tile layer
 * configuration and provider switching without code changes.
 *
 * @example
 * ```typescript
 * // Add a new tile layer:
 * registerTileLayer({
 *   id: 'mapbox-streets',
 *   label: 'Mapbox Streets',
 *   provider: 'mapbox',
 *   url: 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
 *   attribution: '© Mapbox',
 *   maxZoom: 19,
 *   order: 3
 * });
 * ```
 */

import type {
  TileLayerConfig,
  TileLayerId,
  ExtendedTileLayerConfig,
  TileLayerType,
} from "../types/tileLayerTypes";

/**
 * Tile layer registry - stores all registered tile layers
 */
export const TILE_LAYER_REGISTRY: Record<TileLayerId, ExtendedTileLayerConfig> =
  {
    "osm-standard": {
      id: "osm-standard",
      label: "OpenStreetMap",
      labelArabic: "خريطة الشارع المفتوحة",
      provider: "openstreetmap",
      type: "street",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
      minZoom: 1,
      subdomains: ["a", "b", "c"],
      isDefault: true,
      order: 1,
      enabled: true,
      description: "Standard OpenStreetMap layer with street-level detail",
      languages: ["ar", "en"],
    },

    "carto-light": {
      id: "carto-light",
      label: "CartoDB Light",
      labelArabic: "خريطة كارتو الفاتحة",
      provider: "carto",
      type: "street",
      url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
      minZoom: 1,
      subdomains: ["a", "b", "c", "d"],
      order: 2,
      enabled: true,
      description: "Light-themed base map optimized for data visualization",
      languages: ["en"],
    },

    "carto-dark": {
      id: "carto-dark",
      label: "CartoDB Dark",
      labelArabic: "خريطة كارتو الداكنة",
      provider: "carto",
      type: "street",
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
      minZoom: 1,
      subdomains: ["a", "b", "c", "d"],
      order: 3,
      enabled: true,
      description: "Dark-themed base map for nighttime viewing",
      languages: ["en"],
    },

    "esri-world-imagery": {
      id: "esri-world-imagery",
      label: "ESRI Satellite",
      labelArabic: "صور الأقمار الصناعية",
      provider: "esri",
      type: "satellite",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
      maxZoom: 19,
      minZoom: 1,
      order: 4,
      enabled: true,
      description: "High-resolution satellite imagery from ESRI",
    },

    "esri-world-street": {
      id: "esri-world-street",
      label: "ESRI Street Map",
      labelArabic: "خريطة شوارع ESRI",
      provider: "esri",
      type: "street",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012",
      maxZoom: 19,
      minZoom: 1,
      order: 5,
      enabled: true,
      description: "Detailed street map with labels from ESRI",
    },

    "esri-topo": {
      id: "esri-topo",
      label: "ESRI Topographic",
      labelArabic: "خريطة طبوغرافية",
      provider: "esri",
      type: "terrain",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
      attribution:
        "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community",
      maxZoom: 19,
      minZoom: 1,
      order: 6,
      enabled: true,
      description: "Topographic map with terrain and elevation data",
    },
  };

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Register a new tile layer
 *
 * @param config - Tile layer configuration
 *
 * @example
 * ```typescript
 * registerTileLayer({
 *   id: 'custom-layer',
 *   label: 'Custom Layer',
 *   provider: 'custom',
 *   type: 'street',
 *   url: 'https://example.com/{z}/{x}/{y}.png',
 *   attribution: '© Example',
 *   maxZoom: 18,
 *   order: 10
 * });
 * ```
 */
export function registerTileLayer(config: ExtendedTileLayerConfig): void {
  TILE_LAYER_REGISTRY[config.id] = config;
}

/**
 * Get all registered tile layers
 *
 * @returns Array of all tile layers, sorted by order
 *
 * @example
 * ```typescript
 * const layers = getAllTileLayers();
 * layers.forEach(layer => console.log(layer.label));
 * ```
 */
export function getAllTileLayers(): ExtendedTileLayerConfig[] {
  return Object.values(TILE_LAYER_REGISTRY).sort((a, b) => a.order - b.order);
}

/**
 * Get tile layer by ID
 *
 * @param id - Tile layer identifier
 * @returns Tile layer configuration or undefined if not found
 *
 * @example
 * ```typescript
 * const layer = getTileLayer('osm-standard');
 * if (layer) {
 *   console.log(layer.url);
 * }
 * ```
 */
export function getTileLayer(
  id: TileLayerId
): ExtendedTileLayerConfig | undefined {
  return TILE_LAYER_REGISTRY[id];
}

/**
 * Get enabled tile layers
 *
 * @returns Array of enabled tile layers, sorted by order
 *
 * @example
 * ```typescript
 * const enabled = getEnabledTileLayers();
 * // Only layers with enabled !== false
 * ```
 */
export function getEnabledTileLayers(): ExtendedTileLayerConfig[] {
  return getAllTileLayers().filter((layer) => layer.enabled !== false);
}

/**
 * Get default tile layer
 *
 * @returns Default tile layer or first enabled layer
 *
 * @example
 * ```typescript
 * const defaultLayer = getDefaultTileLayer();
 * // Returns layer with isDefault: true
 * ```
 */
export function getDefaultTileLayer(): ExtendedTileLayerConfig {
  const defaultLayer = getAllTileLayers().find((layer) => layer.isDefault);
  if (defaultLayer) return defaultLayer;

  // Fallback to first enabled layer
  const enabledLayers = getEnabledTileLayers();
  if (enabledLayers.length > 0) return enabledLayers[0];

  // Fallback to OSM standard
  return TILE_LAYER_REGISTRY["osm-standard"];
}

/**
 * Get tile layers by type
 *
 * @param type - Tile layer type
 * @returns Array of tile layers matching the type
 *
 * @example
 * ```typescript
 * const satelliteLayers = getTileLayersByType('satellite');
 * const streetLayers = getTileLayersByType('street');
 * ```
 */
export function getTileLayersByType(
  type: TileLayerType
): ExtendedTileLayerConfig[] {
  return getAllTileLayers().filter((layer) => layer.type === type);
}

/**
 * Get tile layers by provider
 *
 * @param provider - Tile provider
 * @returns Array of tile layers from the provider
 *
 * @example
 * ```typescript
 * const esriLayers = getTileLayersByProvider('esri');
 * const cartoLayers = getTileLayersByProvider('carto');
 * ```
 */
export function getTileLayersByProvider(
  provider: string
): ExtendedTileLayerConfig[] {
  return getAllTileLayers().filter((layer) => layer.provider === provider);
}

/**
 * Check if a tile layer ID is valid
 *
 * @param id - Tile layer identifier
 * @returns True if layer exists in registry
 *
 * @example
 * ```typescript
 * if (isValidTileLayer('osm-standard')) {
 *   // Layer exists
 * }
 * ```
 */
export function isValidTileLayer(id: string): id is TileLayerId {
  return id in TILE_LAYER_REGISTRY;
}

/**
 * Get tile layer label (localized)
 *
 * @param id - Tile layer identifier
 * @param locale - Locale code ('en' or 'ar')
 * @returns Localized label or layer ID if not found
 *
 * @example
 * ```typescript
 * const label = getTileLayerLabel('osm-standard', 'ar'); // 'خريطة الشارع المفتوحة'
 * ```
 */
export function getTileLayerLabel(
  id: TileLayerId,
  locale: "en" | "ar" = "en"
): string {
  const layer = getTileLayer(id);
  if (!layer) return id;

  return locale === "ar" && layer.labelArabic
    ? layer.labelArabic
    : layer.label;
}

/**
 * Update tile layer configuration
 *
 * @param id - Tile layer identifier
 * @param updates - Partial configuration to update
 *
 * @example
 * ```typescript
 * updateTileLayer('osm-standard', { enabled: false });
 * ```
 */
export function updateTileLayer(
  id: TileLayerId,
  updates: Partial<ExtendedTileLayerConfig>
): void {
  const existing = TILE_LAYER_REGISTRY[id];
  if (!existing) {
    throw new Error(`Tile layer '${id}' not found in registry`);
  }

  TILE_LAYER_REGISTRY[id] = {
    ...existing,
    ...updates,
  };
}

/**
 * Remove tile layer from registry
 *
 * @param id - Tile layer identifier
 *
 * @example
 * ```typescript
 * removeTileLayer('custom-layer');
 * ```
 */
export function removeTileLayer(id: TileLayerId): void {
  delete TILE_LAYER_REGISTRY[id];
}

/**
 * Get tile layer IDs
 *
 * @returns Array of all tile layer IDs
 *
 * @example
 * ```typescript
 * const ids = getTileLayerIds();
 * // ['osm-standard', 'carto-light', ...]
 * ```
 */
export function getTileLayerIds(): TileLayerId[] {
  return Object.keys(TILE_LAYER_REGISTRY);
}
