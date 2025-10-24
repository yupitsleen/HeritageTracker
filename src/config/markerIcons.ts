/**
 * Marker Icon CDN Configuration Registry
 *
 * Central registry for marker icon CDN URL configurations.
 * Allows dynamic registration and switching of icon CDN sources.
 *
 * @example
 * ```typescript
 * // Get current icon URLs
 * const config = getDefaultMarkerIconConfig();
 * const iconUrl = `${config.iconBaseUrl}/marker-icon-2x-red.png`;
 *
 * // Register custom CDN
 * registerMarkerIconConfig({
 *   id: "custom-cdn",
 *   label: "Custom CDN",
 *   iconBaseUrl: "https://my-cdn.com/icons",
 *   shadowUrl: "https://my-cdn.com/shadow.png",
 * });
 * ```
 */

import type {
  MarkerIconConfig,
  MarkerIconRegistry,
} from "../types/markerIconTypes";

/**
 * Global marker icon configuration registry
 */
export const MARKER_ICON_REGISTRY: MarkerIconRegistry = {
  "leaflet-color-markers": {
    id: "leaflet-color-markers",
    label: "Leaflet Color Markers",
    labelArabic: "علامات الخريطة الملونة",
    isDefault: true,
    iconBaseUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    description:
      "Colored marker icons from the leaflet-color-markers library on GitHub",
    metadata: {
      author: "Heritage Tracker Team",
      version: "1.0.0",
      notes:
        "Uses pointhi/leaflet-color-markers for colored icons and Leaflet CDN for shadows",
    },
  },
};

// ============================================================================
// CRUD Operations
// ============================================================================

/**
 * Register a new marker icon configuration
 *
 * @param config - The marker icon configuration to register
 * @throws Error if configuration with same ID already exists
 *
 * @example
 * ```typescript
 * registerMarkerIconConfig({
 *   id: "custom-icons",
 *   label: "Custom Icons",
 *   iconBaseUrl: "https://my-cdn.com/icons",
 *   shadowUrl: "https://my-cdn.com/shadow.png",
 * });
 * ```
 */
export function registerMarkerIconConfig(config: MarkerIconConfig): void {
  MARKER_ICON_REGISTRY[config.id] = config;
}

/**
 * Get all marker icon configurations
 *
 * @returns Array of all registered marker icon configurations
 *
 * @example
 * ```typescript
 * const configs = getAllMarkerIconConfigs();
 * console.log(`Found ${configs.length} icon configurations`);
 * ```
 */
export function getAllMarkerIconConfigs(): MarkerIconConfig[] {
  return Object.values(MARKER_ICON_REGISTRY);
}

/**
 * Get a marker icon configuration by ID
 *
 * @param id - Configuration ID
 * @returns The marker icon configuration, or undefined if not found
 *
 * @example
 * ```typescript
 * const config = getMarkerIconConfig("leaflet-color-markers");
 * if (config) {
 *   console.log(`Icon base URL: ${config.iconBaseUrl}`);
 * }
 * ```
 */
export function getMarkerIconConfig(id: string): MarkerIconConfig | undefined {
  return MARKER_ICON_REGISTRY[id];
}

/**
 * Get the default marker icon configuration
 *
 * @returns The default marker icon configuration
 *
 * @example
 * ```typescript
 * const defaultConfig = getDefaultMarkerIconConfig();
 * const iconUrl = `${defaultConfig.iconBaseUrl}/marker-icon-2x-red.png`;
 * ```
 */
export function getDefaultMarkerIconConfig(): MarkerIconConfig {
  const defaultConfig = Object.values(MARKER_ICON_REGISTRY).find(
    (config) => config.isDefault
  );

  // Fallback to first config if no default is set
  return defaultConfig || Object.values(MARKER_ICON_REGISTRY)[0];
}

/**
 * Update an existing marker icon configuration
 *
 * @param id - Configuration ID
 * @param updates - Partial configuration to merge with existing
 * @throws Error if configuration not found
 *
 * @example
 * ```typescript
 * updateMarkerIconConfig("leaflet-color-markers", {
 *   iconBaseUrl: "https://new-cdn.com/icons",
 * });
 * ```
 */
export function updateMarkerIconConfig(
  id: string,
  updates: Partial<MarkerIconConfig>
): void {
  if (!MARKER_ICON_REGISTRY[id]) {
    throw new Error(`Marker icon configuration '${id}' not found in registry`);
  }
  MARKER_ICON_REGISTRY[id] = { ...MARKER_ICON_REGISTRY[id], ...updates };
}

/**
 * Remove a marker icon configuration from the registry
 *
 * @param id - Configuration ID to remove
 *
 * @example
 * ```typescript
 * removeMarkerIconConfig("custom-icons");
 * ```
 */
export function removeMarkerIconConfig(id: string): void {
  delete MARKER_ICON_REGISTRY[id];
}

// ============================================================================
// Query Functions
// ============================================================================

/**
 * Get all marker icon configuration IDs
 *
 * @returns Array of all configuration IDs
 *
 * @example
 * ```typescript
 * const ids = getMarkerIconConfigIds();
 * console.log(`Available configs: ${ids.join(", ")}`);
 * ```
 */
export function getMarkerIconConfigIds(): string[] {
  return Object.keys(MARKER_ICON_REGISTRY);
}

/**
 * Check if a marker icon configuration ID exists in the registry
 *
 * @param id - Configuration ID to check
 * @returns True if configuration exists, false otherwise
 *
 * @example
 * ```typescript
 * if (isValidMarkerIconConfig("leaflet-color-markers")) {
 *   console.log("Configuration exists");
 * }
 * ```
 */
export function isValidMarkerIconConfig(id: string): boolean {
  return id in MARKER_ICON_REGISTRY;
}

/**
 * Get marker icon configuration label in specified language
 *
 * @param id - Configuration ID
 * @param locale - Language code ('en' or 'ar')
 * @returns The label in the requested language, or English fallback, or the ID
 *
 * @example
 * ```typescript
 * const label = getMarkerIconConfigLabel("leaflet-color-markers", "ar");
 * console.log(label); // "علامات الخريطة الملونة"
 * ```
 */
export function getMarkerIconConfigLabel(
  id: string,
  locale: "en" | "ar" = "en"
): string {
  const config = MARKER_ICON_REGISTRY[id];
  if (!config) return id;

  if (locale === "ar" && config.labelArabic) {
    return config.labelArabic;
  }

  return config.label;
}

/**
 * Get the icon base URL for a configuration
 *
 * @param id - Configuration ID (defaults to default configuration)
 * @returns The icon base URL
 *
 * @example
 * ```typescript
 * const baseUrl = getIconBaseUrl();
 * const redIcon = `${baseUrl}/marker-icon-2x-red.png`;
 * ```
 */
export function getIconBaseUrl(id?: string): string {
  const config = id
    ? getMarkerIconConfig(id)
    : getDefaultMarkerIconConfig();
  return config?.iconBaseUrl || "";
}

/**
 * Get the shadow URL for a configuration
 *
 * @param id - Configuration ID (defaults to default configuration)
 * @returns The shadow URL
 *
 * @example
 * ```typescript
 * const shadowUrl = getShadowUrl();
 * ```
 */
export function getShadowUrl(id?: string): string {
  const config = id
    ? getMarkerIconConfig(id)
    : getDefaultMarkerIconConfig();
  return config?.shadowUrl || "";
}

// ============================================================================
// Backward Compatibility
// ============================================================================

/**
 * @deprecated Use getDefaultMarkerIconConfig() instead
 * Exported for backward compatibility with existing code
 */
export const DEFAULT_MARKER_ICON_CONFIG = getDefaultMarkerIconConfig();

/**
 * @deprecated Use getIconBaseUrl() instead
 * Exported for backward compatibility with existing code
 */
export const MARKER_ICON_BASE_URL = getIconBaseUrl();

/**
 * @deprecated Use getShadowUrl() instead
 * Exported for backward compatibility with existing code
 */
export const MARKER_SHADOW_URL = getShadowUrl();
