/**
 * Map Viewport Registry
 *
 * Central registry for map viewport configurations (center coordinates + zoom).
 * Enables dynamic viewport switching without code changes.
 *
 * @example
 * ```typescript
 * // Get Gaza viewport:
 * const gaza = getViewport('gaza-overview');
 * map.setView(gaza.center, gaza.zoom);
 *
 * // Register custom viewport:
 * registerViewport({
 *   id: 'custom-region',
 *   label: 'Custom Region',
 *   center: [32.0, 35.0],
 *   zoom: 12
 * });
 * ```
 */

import type {
  MapViewportConfig,
  ZoomLevelConfig,
} from "../types/mapViewportTypes";

/**
 * Viewport registry - stores all registered viewports
 */
export const VIEWPORT_REGISTRY: Record<string, MapViewportConfig> = {
  "gaza-overview": {
    id: "gaza-overview",
    label: "Gaza Strip Overview",
    labelArabic: "نظرة عامة على قطاع غزة",
    center: [31.42, 34.38] as [number, number],
    zoom: 10.5,
    minZoom: 1,
    maxZoom: 19,
    isDefault: true,
    description: "Balanced full-strip visibility in wide containers",
    bounds: {
      north: 31.58,
      south: 31.22,
      east: 34.57,
      west: 34.20,
    },
  },
};

/**
 * Zoom level registry - stores all registered zoom levels
 */
export const ZOOM_LEVEL_REGISTRY: Record<string, ZoomLevelConfig> = {
  "default-overview": {
    id: "default-overview",
    label: "Default Overview",
    labelArabic: "العرض الافتراضي",
    zoom: 10.5,
    context: "overview",
    description: "Default zoom for Gaza Strip overview",
  },
  "site-detail": {
    id: "site-detail",
    label: "Site Detail",
    labelArabic: "تفاصيل الموقع",
    zoom: 17,
    context: "site",
    description:
      "Zoom for satellite detail view (consistent across all historical imagery)",
  },
};

// ============================================================================
// Viewport Helper Functions
// ============================================================================

/**
 * Register a new viewport
 *
 * @param config - Viewport configuration
 *
 * @example
 * ```typescript
 * registerViewport({
 *   id: 'rafah',
 *   label: 'Rafah City',
 *   center: [31.28, 34.25],
 *   zoom: 14
 * });
 * ```
 */
export function registerViewport(config: MapViewportConfig): void {
  VIEWPORT_REGISTRY[config.id] = config;
}

/**
 * Get all registered viewports
 *
 * @returns Array of all viewports
 *
 * @example
 * ```typescript
 * const viewports = getAllViewports();
 * viewports.forEach(v => console.log(v.label));
 * ```
 */
export function getAllViewports(): MapViewportConfig[] {
  return Object.values(VIEWPORT_REGISTRY);
}

/**
 * Get viewport by ID
 *
 * @param id - Viewport identifier
 * @returns Viewport configuration or undefined if not found
 *
 * @example
 * ```typescript
 * const viewport = getViewport('gaza-overview');
 * if (viewport) {
 *   map.setView(viewport.center, viewport.zoom);
 * }
 * ```
 */
export function getViewport(id: string): MapViewportConfig | undefined {
  return VIEWPORT_REGISTRY[id];
}

/**
 * Get default viewport
 *
 * @returns Default viewport or first viewport
 *
 * @example
 * ```typescript
 * const defaultViewport = getDefaultViewport();
 * // Returns viewport with isDefault: true
 * ```
 */
export function getDefaultViewport(): MapViewportConfig {
  const defaultViewport = getAllViewports().find((v) => v.isDefault);
  if (defaultViewport) return defaultViewport;

  // Fallback to first viewport
  const viewports = getAllViewports();
  if (viewports.length > 0) return viewports[0];

  // Final fallback to gaza-overview
  return VIEWPORT_REGISTRY["gaza-overview"];
}

/**
 * Update viewport configuration
 *
 * @param id - Viewport identifier
 * @param updates - Partial configuration to update
 *
 * @example
 * ```typescript
 * updateViewport('gaza-overview', { zoom: 11 });
 * ```
 */
export function updateViewport(
  id: string,
  updates: Partial<MapViewportConfig>
): void {
  const existing = VIEWPORT_REGISTRY[id];
  if (!existing) {
    throw new Error(`Viewport '${id}' not found in registry`);
  }

  VIEWPORT_REGISTRY[id] = {
    ...existing,
    ...updates,
  };
}

/**
 * Remove viewport from registry
 *
 * @param id - Viewport identifier
 *
 * @example
 * ```typescript
 * removeViewport('custom-viewport');
 * ```
 */
export function removeViewport(id: string): void {
  delete VIEWPORT_REGISTRY[id];
}

/**
 * Get viewport IDs
 *
 * @returns Array of all viewport IDs
 *
 * @example
 * ```typescript
 * const ids = getViewportIds();
 * // ['gaza-overview', 'custom-viewport']
 * ```
 */
export function getViewportIds(): string[] {
  return Object.keys(VIEWPORT_REGISTRY);
}

/**
 * Check if a viewport ID is valid
 *
 * @param id - Viewport identifier
 * @returns True if viewport exists in registry
 *
 * @example
 * ```typescript
 * if (isValidViewport('gaza-overview')) {
 *   // Viewport exists
 * }
 * ```
 */
export function isValidViewport(id: string): boolean {
  return id in VIEWPORT_REGISTRY;
}

/**
 * Get viewport label (localized)
 *
 * @param id - Viewport identifier
 * @param locale - Locale code ('en' or 'ar')
 * @returns Localized label or viewport ID if not found
 *
 * @example
 * ```typescript
 * const label = getViewportLabel('gaza-overview', 'ar'); // 'نظرة عامة على قطاع غزة'
 * ```
 */
export function getViewportLabel(
  id: string,
  locale: "en" | "ar" = "en"
): string {
  const viewport = getViewport(id);
  if (!viewport) return id;

  return locale === "ar" && viewport.labelArabic
    ? viewport.labelArabic
    : viewport.label;
}

// ============================================================================
// Zoom Level Helper Functions
// ============================================================================

/**
 * Register a new zoom level
 *
 * @param config - Zoom level configuration
 *
 * @example
 * ```typescript
 * registerZoomLevel({
 *   id: 'street-level',
 *   label: 'Street Level',
 *   zoom: 18,
 *   context: 'detail'
 * });
 * ```
 */
export function registerZoomLevel(config: ZoomLevelConfig): void {
  ZOOM_LEVEL_REGISTRY[config.id] = config;
}

/**
 * Get all registered zoom levels
 *
 * @returns Array of all zoom levels
 *
 * @example
 * ```typescript
 * const zoomLevels = getAllZoomLevels();
 * zoomLevels.forEach(z => console.log(z.label));
 * ```
 */
export function getAllZoomLevels(): ZoomLevelConfig[] {
  return Object.values(ZOOM_LEVEL_REGISTRY);
}

/**
 * Get zoom level by ID
 *
 * @param id - Zoom level identifier
 * @returns Zoom level configuration or undefined if not found
 *
 * @example
 * ```typescript
 * const zoom = getZoomLevel('site-detail');
 * if (zoom) {
 *   map.setZoom(zoom.zoom);
 * }
 * ```
 */
export function getZoomLevel(id: string): ZoomLevelConfig | undefined {
  return ZOOM_LEVEL_REGISTRY[id];
}

/**
 * Get zoom levels by context
 *
 * @param context - Zoom level context
 * @returns Array of zoom levels matching the context
 *
 * @example
 * ```typescript
 * const overviewZooms = getZoomLevelsByContext('overview');
 * ```
 */
export function getZoomLevelsByContext(
  context: "overview" | "detail" | "site" | "custom"
): ZoomLevelConfig[] {
  return getAllZoomLevels().filter((z) => z.context === context);
}

/**
 * Update zoom level configuration
 *
 * @param id - Zoom level identifier
 * @param updates - Partial configuration to update
 *
 * @example
 * ```typescript
 * updateZoomLevel('site-detail', { zoom: 18 });
 * ```
 */
export function updateZoomLevel(
  id: string,
  updates: Partial<ZoomLevelConfig>
): void {
  const existing = ZOOM_LEVEL_REGISTRY[id];
  if (!existing) {
    throw new Error(`Zoom level '${id}' not found in registry`);
  }

  ZOOM_LEVEL_REGISTRY[id] = {
    ...existing,
    ...updates,
  };
}

/**
 * Remove zoom level from registry
 *
 * @param id - Zoom level identifier
 *
 * @example
 * ```typescript
 * removeZoomLevel('custom-zoom');
 * ```
 */
export function removeZoomLevel(id: string): void {
  delete ZOOM_LEVEL_REGISTRY[id];
}

/**
 * Get zoom level IDs
 *
 * @returns Array of all zoom level IDs
 *
 * @example
 * ```typescript
 * const ids = getZoomLevelIds();
 * // ['default-overview', 'site-detail']
 * ```
 */
export function getZoomLevelIds(): string[] {
  return Object.keys(ZOOM_LEVEL_REGISTRY);
}

/**
 * Check if a zoom level ID is valid
 *
 * @param id - Zoom level identifier
 * @returns True if zoom level exists in registry
 *
 * @example
 * ```typescript
 * if (isValidZoomLevel('site-detail')) {
 *   // Zoom level exists
 * }
 * ```
 */
export function isValidZoomLevel(id: string): boolean {
  return id in ZOOM_LEVEL_REGISTRY;
}

/**
 * Get zoom level label (localized)
 *
 * @param id - Zoom level identifier
 * @param locale - Locale code ('en' or 'ar')
 * @returns Localized label or zoom level ID if not found
 *
 * @example
 * ```typescript
 * const label = getZoomLevelLabel('site-detail', 'ar'); // 'تفاصيل الموقع'
 * ```
 */
export function getZoomLevelLabel(
  id: string,
  locale: "en" | "ar" = "en"
): string {
  const zoomLevel = getZoomLevel(id);
  if (!zoomLevel) return id;

  return locale === "ar" && zoomLevel.labelArabic
    ? zoomLevel.labelArabic
    : zoomLevel.label;
}

// ============================================================================
// Convenience Exports (for backward compatibility)
// ============================================================================

/**
 * Gaza Strip center coordinates (for backward compatibility)
 */
export const GAZA_CENTER = getDefaultViewport().center;

/**
 * Default zoom level (for backward compatibility)
 */
export const DEFAULT_ZOOM = getZoomLevel("default-overview")!.zoom;

/**
 * Site detail zoom level (for backward compatibility)
 */
export const SITE_DETAIL_ZOOM = getZoomLevel("site-detail")!.zoom;
