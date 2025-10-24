/**
 * Wayback Timeline Configuration Registry
 *
 * Central registry for wayback timeline configurations. Enables dynamic
 * configuration switching without code changes.
 *
 * @example
 * ```typescript
 * // Get default configuration:
 * const config = getWaybackTimelineConfig('heritage-tracker-v1');
 *
 * // Register custom configuration:
 * registerWaybackTimelineConfig({
 *   id: 'custom-config',
 *   label: 'Custom Config',
 *   markerConfig: { ... },
 *   playbackConfig: { ... },
 *   layoutConfig: { ... }
 * });
 * ```
 */

import type { WaybackTimelineConfig } from "../types/waybackTimelineTypes";

/**
 * Wayback timeline configuration registry - stores all registered configurations
 */
export const WAYBACK_TIMELINE_REGISTRY: Record<string, WaybackTimelineConfig> = {
  "heritage-tracker-v1": {
    id: "heritage-tracker-v1",
    label: "Heritage Tracker Configuration v1",
    labelArabic: "تكوين متتبع التراث الإصدار 1",
    isDefault: true,
    description: "Original wayback timeline configuration for Advanced Animation page",
    metadata: {
      author: "Heritage Tracker Team",
      version: "1.0.0",
      notes: "Optimized for visual clarity and smooth playback experience",
    },

    markerConfig: {
      majorMarkerInterval: 10, // Every 10th release gets a major marker
      eventMarkerStackSpacing: 6, // Pixels between stacked destruction event dots
      minorMarker: {
        height: 4, // Height in pixels (h-4)
        width: 0.5, // Width in rem (w-0.5)
      },
      majorMarker: {
        height: 8, // Height in pixels (h-8)
        width: 0.5, // Width in rem (w-0.5)
      },
      yearMarker: {
        height: 2, // Height in pixels (h-2)
        width: 0.5, // Width in rem (w-0.5)
      },
    },

    playbackConfig: {
      yearAdvanceIntervalMs: 2000, // 2 seconds at each year
      initialPauseMs: 1000, // 1 second pause at start
      loopPlayback: false, // Don't loop by default
      showYearMarkers: true, // Show year markers
    },

    layoutConfig: {
      yearLabel: {
        top: 3, // Tailwind: top-3 (12px)
        height: 6, // Tailwind: h-6 (24px)
        topOffset: -6, // Tailwind: -top-6 (-24px)
      },
      markerContainer: {
        top: -6, // Tailwind: -top-6 (-24px)
        height: 8, // Tailwind: h-8 (32px)
      },
      tooltip: {
        bottom: 6, // Tailwind: bottom-6 (24px)
      },
      scrubberTooltip: {
        top: 8, // Tailwind: top-8 (32px)
        height: 6, // Tailwind: h-6 (24px)
      },
    },
  },
};

// ============================================================================
// Wayback Timeline Configuration Helper Functions
// ============================================================================

/**
 * Register a new wayback timeline configuration
 *
 * @param config - Wayback timeline configuration
 *
 * @example
 * ```typescript
 * registerWaybackTimelineConfig({
 *   id: 'fast-playback',
 *   label: 'Fast Playback',
 *   markerConfig: { ... },
 *   playbackConfig: { yearAdvanceIntervalMs: 500 },
 *   layoutConfig: { ... }
 * });
 * ```
 */
export function registerWaybackTimelineConfig(
  config: WaybackTimelineConfig
): void {
  WAYBACK_TIMELINE_REGISTRY[config.id] = config;
}

/**
 * Get all registered wayback timeline configurations
 *
 * @returns Array of all configurations
 *
 * @example
 * ```typescript
 * const configs = getAllWaybackTimelineConfigs();
 * configs.forEach(c => console.log(c.label));
 * ```
 */
export function getAllWaybackTimelineConfigs(): WaybackTimelineConfig[] {
  return Object.values(WAYBACK_TIMELINE_REGISTRY);
}

/**
 * Get wayback timeline configuration by ID
 *
 * @param id - Configuration identifier
 * @returns Configuration or undefined if not found
 *
 * @example
 * ```typescript
 * const config = getWaybackTimelineConfig('heritage-tracker-v1');
 * if (config) {
 *   console.log(config.playbackConfig.yearAdvanceIntervalMs); // 2000
 * }
 * ```
 */
export function getWaybackTimelineConfig(
  id: string
): WaybackTimelineConfig | undefined {
  return WAYBACK_TIMELINE_REGISTRY[id];
}

/**
 * Get default wayback timeline configuration
 *
 * @returns Default configuration or first configuration
 *
 * @example
 * ```typescript
 * const defaultConfig = getDefaultWaybackTimelineConfig();
 * // Returns config with isDefault: true
 * ```
 */
export function getDefaultWaybackTimelineConfig(): WaybackTimelineConfig {
  const defaultConfig = getAllWaybackTimelineConfigs().find((c) => c.isDefault);
  if (defaultConfig) return defaultConfig;

  // Fallback to first config
  const configs = getAllWaybackTimelineConfigs();
  if (configs.length > 0) return configs[0];

  // Final fallback to heritage-tracker-v1
  return WAYBACK_TIMELINE_REGISTRY["heritage-tracker-v1"];
}

/**
 * Update wayback timeline configuration
 *
 * @param id - Configuration identifier
 * @param updates - Partial configuration to update
 *
 * @example
 * ```typescript
 * updateWaybackTimelineConfig('heritage-tracker-v1', {
 *   playbackConfig: { yearAdvanceIntervalMs: 1000 }
 * });
 * ```
 */
export function updateWaybackTimelineConfig(
  id: string,
  updates: Partial<WaybackTimelineConfig>
): void {
  const existing = WAYBACK_TIMELINE_REGISTRY[id];
  if (!existing) {
    throw new Error(
      `Wayback timeline configuration '${id}' not found in registry`
    );
  }

  WAYBACK_TIMELINE_REGISTRY[id] = {
    ...existing,
    ...updates,
  };
}

/**
 * Remove wayback timeline configuration from registry
 *
 * @param id - Configuration identifier
 *
 * @example
 * ```typescript
 * removeWaybackTimelineConfig('custom-config');
 * ```
 */
export function removeWaybackTimelineConfig(id: string): void {
  delete WAYBACK_TIMELINE_REGISTRY[id];
}

/**
 * Get wayback timeline configuration IDs
 *
 * @returns Array of all configuration IDs
 *
 * @example
 * ```typescript
 * const ids = getWaybackTimelineConfigIds();
 * // ['heritage-tracker-v1', 'custom-config']
 * ```
 */
export function getWaybackTimelineConfigIds(): string[] {
  return Object.keys(WAYBACK_TIMELINE_REGISTRY);
}

/**
 * Check if a wayback timeline configuration ID is valid
 *
 * @param id - Configuration identifier
 * @returns True if configuration exists in registry
 *
 * @example
 * ```typescript
 * if (isValidWaybackTimelineConfig('heritage-tracker-v1')) {
 *   // Configuration exists
 * }
 * ```
 */
export function isValidWaybackTimelineConfig(id: string): boolean {
  return id in WAYBACK_TIMELINE_REGISTRY;
}

/**
 * Get wayback timeline configuration label (localized)
 *
 * @param id - Configuration identifier
 * @param locale - Locale code ('en' or 'ar')
 * @returns Localized label or configuration ID if not found
 *
 * @example
 * ```typescript
 * const label = getWaybackTimelineConfigLabel('heritage-tracker-v1', 'ar');
 * // 'تكوين متتبع التراث الإصدار 1'
 * ```
 */
export function getWaybackTimelineConfigLabel(
  id: string,
  locale: "en" | "ar" = "en"
): string {
  const config = getWaybackTimelineConfig(id);
  if (!config) return id;

  return locale === "ar" && config.labelArabic
    ? config.labelArabic
    : config.label;
}

// ============================================================================
// Convenience Exports (for backward compatibility)
// ============================================================================

/**
 * Default wayback timeline configuration (for backward compatibility)
 */
export const DEFAULT_WAYBACK_TIMELINE_CONFIG = getDefaultWaybackTimelineConfig();

/**
 * Wayback timeline constants (for backward compatibility)
 */
export const WAYBACK_TIMELINE = {
  MAJOR_MARKER_INTERVAL:
    DEFAULT_WAYBACK_TIMELINE_CONFIG.markerConfig.majorMarkerInterval,
  EVENT_MARKER_STACK_SPACING:
    DEFAULT_WAYBACK_TIMELINE_CONFIG.markerConfig.eventMarkerStackSpacing,
  YEAR_ADVANCE_INTERVAL_MS:
    DEFAULT_WAYBACK_TIMELINE_CONFIG.playbackConfig.yearAdvanceIntervalMs,
  INITIAL_PAUSE_MS:
    DEFAULT_WAYBACK_TIMELINE_CONFIG.playbackConfig.initialPauseMs,
  MINOR_MARKER_HEIGHT:
    DEFAULT_WAYBACK_TIMELINE_CONFIG.markerConfig.minorMarker.height,
  MAJOR_MARKER_HEIGHT:
    DEFAULT_WAYBACK_TIMELINE_CONFIG.markerConfig.majorMarker.height,
  YEAR_MARKER_HEIGHT:
    DEFAULT_WAYBACK_TIMELINE_CONFIG.markerConfig.yearMarker.height,
  MINOR_MARKER_WIDTH:
    DEFAULT_WAYBACK_TIMELINE_CONFIG.markerConfig.minorMarker.width,
  MAJOR_MARKER_WIDTH:
    DEFAULT_WAYBACK_TIMELINE_CONFIG.markerConfig.majorMarker.width,
  YEAR_MARKER_WIDTH:
    DEFAULT_WAYBACK_TIMELINE_CONFIG.markerConfig.yearMarker.width,
  YEAR_LABEL_CONTAINER_TOP:
    DEFAULT_WAYBACK_TIMELINE_CONFIG.layoutConfig.yearLabel.top,
  YEAR_LABEL_CONTAINER_HEIGHT:
    DEFAULT_WAYBACK_TIMELINE_CONFIG.layoutConfig.yearLabel.height,
  YEAR_LABEL_TOP_OFFSET:
    DEFAULT_WAYBACK_TIMELINE_CONFIG.layoutConfig.yearLabel.topOffset,
  MARKER_CONTAINER_TOP:
    DEFAULT_WAYBACK_TIMELINE_CONFIG.layoutConfig.markerContainer.top,
  MARKER_CONTAINER_HEIGHT:
    DEFAULT_WAYBACK_TIMELINE_CONFIG.layoutConfig.markerContainer.height,
  TOOLTIP_BOTTOM_OFFSET:
    DEFAULT_WAYBACK_TIMELINE_CONFIG.layoutConfig.tooltip.bottom,
  SCRUBBER_TOOLTIP_TOP:
    DEFAULT_WAYBACK_TIMELINE_CONFIG.layoutConfig.scrubberTooltip.top,
  SCRUBBER_TOOLTIP_HEIGHT:
    DEFAULT_WAYBACK_TIMELINE_CONFIG.layoutConfig.scrubberTooltip.height,
} as const;
