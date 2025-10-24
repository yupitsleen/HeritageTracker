/**
 * Marker Size Configuration Registry
 *
 * Central registry for marker size configurations with responsive breakpoints.
 * Allows dynamic marker sizing based on screen width for optimal mobile/desktop UX.
 *
 * @example
 * ```typescript
 * // Get current marker size
 * const size = getMarkerSize(false, 375); // mobile width
 * const icon = new Icon({ iconSize: size.iconSize, ... });
 *
 * // Register custom responsive config
 * registerMarkerSizeConfig({
 *   id: "custom-sizes",
 *   label: "Custom Sizes",
 *   default: { iconSize: [10, 16], ... },
 *   highlighted: { iconSize: [20, 32], ... },
 *   mobile: { default: { iconSize: [14, 22], ... } },
 * });
 * ```
 */

import type {
  MarkerSizeConfig,
  MarkerSizeRegistry,
  MarkerSizeDimensions,
  Breakpoint,
} from "../types/markerSizeTypes";

/**
 * Breakpoint thresholds (in pixels)
 */
export const BREAKPOINTS = {
  mobile: 768, // width < 768px
  tablet: 1024, // 768px ≤ width < 1024px
  // desktop: width ≥ 1024px
} as const;

/**
 * Global marker size configuration registry
 */
export const MARKER_SIZE_REGISTRY: MarkerSizeRegistry = {
  "heritage-tracker-v1": {
    id: "heritage-tracker-v1",
    label: "Heritage Tracker Default Sizes",
    labelArabic: "أحجام متتبع التراث الافتراضية",
    isDefault: true,
    default: {
      iconSize: [12, 20],
      iconAnchor: [6, 20],
      popupAnchor: [0, -17],
      shadowSize: [20, 20],
    },
    highlighted: {
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    },
    description:
      "Default marker sizes: small dots (12x20) for normal state, regular markers (25x41) for highlighted state",
    metadata: {
      author: "Heritage Tracker Team",
      version: "1.0.0",
      notes: "Optimized for desktop use with small default markers to reduce clutter",
    },
  },
};

// ============================================================================
// CRUD Operations
// ============================================================================

/**
 * Register a new marker size configuration
 *
 * @param config - The marker size configuration to register
 *
 * @example
 * ```typescript
 * registerMarkerSizeConfig({
 *   id: "large-markers",
 *   label: "Large Markers",
 *   default: { iconSize: [20, 32], ... },
 *   highlighted: { iconSize: [40, 65], ... },
 * });
 * ```
 */
export function registerMarkerSizeConfig(config: MarkerSizeConfig): void {
  MARKER_SIZE_REGISTRY[config.id] = config;
}

/**
 * Get all marker size configurations
 *
 * @returns Array of all registered marker size configurations
 *
 * @example
 * ```typescript
 * const configs = getAllMarkerSizeConfigs();
 * console.log(`Found ${configs.length} size configurations`);
 * ```
 */
export function getAllMarkerSizeConfigs(): MarkerSizeConfig[] {
  return Object.values(MARKER_SIZE_REGISTRY);
}

/**
 * Get a marker size configuration by ID
 *
 * @param id - Configuration ID
 * @returns The marker size configuration, or undefined if not found
 *
 * @example
 * ```typescript
 * const config = getMarkerSizeConfig("heritage-tracker-v1");
 * if (config) {
 *   console.log(`Default icon size: ${config.default.iconSize}`);
 * }
 * ```
 */
export function getMarkerSizeConfig(id: string): MarkerSizeConfig | undefined {
  return MARKER_SIZE_REGISTRY[id];
}

/**
 * Get the default marker size configuration
 *
 * @returns The default marker size configuration
 *
 * @example
 * ```typescript
 * const defaultConfig = getDefaultMarkerSizeConfig();
 * const size = defaultConfig.default.iconSize;
 * ```
 */
export function getDefaultMarkerSizeConfig(): MarkerSizeConfig {
  const defaultConfig = Object.values(MARKER_SIZE_REGISTRY).find(
    (config) => config.isDefault
  );

  // Fallback to first config if no default is set
  return defaultConfig || Object.values(MARKER_SIZE_REGISTRY)[0];
}

/**
 * Update an existing marker size configuration
 *
 * @param id - Configuration ID
 * @param updates - Partial configuration to merge with existing
 * @throws Error if configuration not found
 *
 * @example
 * ```typescript
 * updateMarkerSizeConfig("heritage-tracker-v1", {
 *   default: { iconSize: [14, 22], ... },
 * });
 * ```
 */
export function updateMarkerSizeConfig(
  id: string,
  updates: Partial<MarkerSizeConfig>
): void {
  if (!MARKER_SIZE_REGISTRY[id]) {
    throw new Error(`Marker size configuration '${id}' not found in registry`);
  }
  MARKER_SIZE_REGISTRY[id] = { ...MARKER_SIZE_REGISTRY[id], ...updates };
}

/**
 * Remove a marker size configuration from the registry
 *
 * @param id - Configuration ID to remove
 *
 * @example
 * ```typescript
 * removeMarkerSizeConfig("custom-sizes");
 * ```
 */
export function removeMarkerSizeConfig(id: string): void {
  delete MARKER_SIZE_REGISTRY[id];
}

// ============================================================================
// Query Functions
// ============================================================================

/**
 * Get all marker size configuration IDs
 *
 * @returns Array of all configuration IDs
 *
 * @example
 * ```typescript
 * const ids = getMarkerSizeConfigIds();
 * console.log(`Available configs: ${ids.join(", ")}`);
 * ```
 */
export function getMarkerSizeConfigIds(): string[] {
  return Object.keys(MARKER_SIZE_REGISTRY);
}

/**
 * Check if a marker size configuration ID exists in the registry
 *
 * @param id - Configuration ID to check
 * @returns True if configuration exists, false otherwise
 *
 * @example
 * ```typescript
 * if (isValidMarkerSizeConfig("heritage-tracker-v1")) {
 *   console.log("Configuration exists");
 * }
 * ```
 */
export function isValidMarkerSizeConfig(id: string): boolean {
  return id in MARKER_SIZE_REGISTRY;
}

/**
 * Get marker size configuration label in specified language
 *
 * @param id - Configuration ID
 * @param locale - Language code ('en' or 'ar')
 * @returns The label in the requested language, or English fallback, or the ID
 *
 * @example
 * ```typescript
 * const label = getMarkerSizeConfigLabel("heritage-tracker-v1", "ar");
 * console.log(label); // "أحجام متتبع التراث الافتراضية"
 * ```
 */
export function getMarkerSizeConfigLabel(
  id: string,
  locale: "en" | "ar" = "en"
): string {
  const config = MARKER_SIZE_REGISTRY[id];
  if (!config) return id;

  if (locale === "ar" && config.labelArabic) {
    return config.labelArabic;
  }

  return config.label;
}

/**
 * Determine current breakpoint based on screen width
 *
 * @param width - Screen width in pixels (defaults to window.innerWidth)
 * @returns The current breakpoint
 *
 * @example
 * ```typescript
 * const breakpoint = getCurrentBreakpoint(375); // "mobile"
 * const breakpoint = getCurrentBreakpoint(800); // "tablet"
 * const breakpoint = getCurrentBreakpoint(1440); // "desktop"
 * ```
 */
export function getCurrentBreakpoint(
  width: number = typeof window !== "undefined" ? window.innerWidth : 1024
): Breakpoint {
  if (width < BREAKPOINTS.mobile) return "mobile";
  if (width < BREAKPOINTS.tablet) return "tablet";
  return "desktop";
}

/**
 * Get marker size dimensions for a given state and screen width
 *
 * @param isHighlighted - Whether the marker is highlighted/selected
 * @param width - Screen width in pixels (defaults to window.innerWidth)
 * @param configId - Configuration ID (defaults to default configuration)
 * @returns Marker size dimensions
 *
 * @example
 * ```typescript
 * // Get default marker size for mobile
 * const size = getMarkerSize(false, 375);
 * const icon = new Icon({ iconSize: size.iconSize, ... });
 *
 * // Get highlighted marker size for desktop
 * const highlightedSize = getMarkerSize(true, 1440);
 * ```
 */
export function getMarkerSize(
  isHighlighted: boolean,
  width?: number,
  configId?: string
): MarkerSizeDimensions {
  const config = configId
    ? getMarkerSizeConfig(configId)
    : getDefaultMarkerSizeConfig();

  if (!config) {
    // Fallback dimensions if config not found
    return isHighlighted
      ? {
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        }
      : {
          iconSize: [12, 20],
          iconAnchor: [6, 20],
          popupAnchor: [0, -17],
          shadowSize: [20, 20],
        };
  }

  const breakpoint = getCurrentBreakpoint(width);
  const state = isHighlighted ? "highlighted" : "default";

  // Check for breakpoint-specific configuration
  if (breakpoint === "mobile" && config.mobile) {
    return config.mobile[state];
  }
  if (breakpoint === "tablet" && config.tablet) {
    return config.tablet[state];
  }
  if (breakpoint === "desktop" && config.desktop) {
    return config.desktop[state];
  }

  // Fall back to default size
  return config[state];
}

// ============================================================================
// Backward Compatibility
// ============================================================================

/**
 * @deprecated Use getDefaultMarkerSizeConfig() instead
 * Exported for backward compatibility with existing code
 */
export const DEFAULT_MARKER_SIZE_CONFIG = getDefaultMarkerSizeConfig();

/**
 * Legacy MARKER_CONFIG object for backward compatibility
 * Maps to the default configuration's dimensions
 *
 * @deprecated Use getMarkerSize() instead for responsive sizing
 */
export const MARKER_CONFIG = {
  iconSize: DEFAULT_MARKER_SIZE_CONFIG.default.iconSize,
  iconAnchor: DEFAULT_MARKER_SIZE_CONFIG.default.iconAnchor,
  popupAnchor: DEFAULT_MARKER_SIZE_CONFIG.default.popupAnchor,
  shadowSize: DEFAULT_MARKER_SIZE_CONFIG.default.shadowSize,
  highlightedIconSize: DEFAULT_MARKER_SIZE_CONFIG.highlighted.iconSize,
  highlightedIconAnchor: DEFAULT_MARKER_SIZE_CONFIG.highlighted.iconAnchor,
  highlightedPopupAnchor: DEFAULT_MARKER_SIZE_CONFIG.highlighted.popupAnchor,
} as const;
