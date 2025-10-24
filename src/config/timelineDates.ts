/**
 * Timeline Date Configuration Registry
 *
 * Central registry for timeline date range configurations. Enables dynamic
 * date range switching without code changes.
 *
 * @example
 * ```typescript
 * // Get default configuration:
 * const config = getTimelineDateConfig('gaza-conflict-2023');
 *
 * // Register custom configuration:
 * registerTimelineDateConfig({
 *   id: 'custom-period',
 *   label: 'Custom Period',
 *   fallbackStartDate: new Date('2020-01-01'),
 *   fallbackEndDate: new Date('2024-12-31')
 * });
 * ```
 */

import type { TimelineDateConfig } from "../types/timelineDateTypes";

/**
 * Timeline date configuration registry - stores all registered configurations
 */
export const TIMELINE_DATE_REGISTRY: Record<string, TimelineDateConfig> = {
  "gaza-conflict-2023": {
    id: "gaza-conflict-2023",
    label: "Gaza Conflict 2023-Present",
    labelArabic: "صراع غزة 2023-الحاضر",
    isDefault: true,
    description:
      "Timeline range for Gaza conflict starting October 7, 2023 to present",
    metadata: {
      author: "Heritage Tracker Team",
      version: "1.0.0",
      notes: "Covers the current conflict period with heritage destruction events",
    },

    fallbackStartDate: new Date("2023-10-07"), // Conflict start date
    fallbackEndDate: new Date(), // Current date (dynamic)
    minDate: new Date("2023-01-01"), // Allow viewing earlier in 2023
    maxDate: new Date("2026-12-31"), // Allow planning ahead
  },
};

// ============================================================================
// Timeline Date Configuration Helper Functions
// ============================================================================

/**
 * Register a new timeline date configuration
 *
 * @param config - Timeline date configuration
 *
 * @example
 * ```typescript
 * registerTimelineDateConfig({
 *   id: 'historical-period',
 *   label: 'Historical Period',
 *   fallbackStartDate: new Date('2000-01-01'),
 *   fallbackEndDate: new Date('2023-12-31')
 * });
 * ```
 */
export function registerTimelineDateConfig(config: TimelineDateConfig): void {
  TIMELINE_DATE_REGISTRY[config.id] = config;
}

/**
 * Get all registered timeline date configurations
 *
 * @returns Array of all configurations
 *
 * @example
 * ```typescript
 * const configs = getAllTimelineDateConfigs();
 * configs.forEach(c => console.log(c.label));
 * ```
 */
export function getAllTimelineDateConfigs(): TimelineDateConfig[] {
  return Object.values(TIMELINE_DATE_REGISTRY);
}

/**
 * Get timeline date configuration by ID
 *
 * @param id - Configuration identifier
 * @returns Configuration or undefined if not found
 *
 * @example
 * ```typescript
 * const config = getTimelineDateConfig('gaza-conflict-2023');
 * if (config) {
 *   console.log(config.fallbackStartDate); // Date object
 * }
 * ```
 */
export function getTimelineDateConfig(
  id: string
): TimelineDateConfig | undefined {
  return TIMELINE_DATE_REGISTRY[id];
}

/**
 * Get default timeline date configuration
 *
 * @returns Default configuration or first configuration
 *
 * @example
 * ```typescript
 * const defaultConfig = getDefaultTimelineDateConfig();
 * // Returns config with isDefault: true
 * ```
 */
export function getDefaultTimelineDateConfig(): TimelineDateConfig {
  const defaultConfig = getAllTimelineDateConfigs().find((c) => c.isDefault);
  if (defaultConfig) return defaultConfig;

  // Fallback to first config
  const configs = getAllTimelineDateConfigs();
  if (configs.length > 0) return configs[0];

  // Final fallback to gaza-conflict-2023
  return TIMELINE_DATE_REGISTRY["gaza-conflict-2023"];
}

/**
 * Update timeline date configuration
 *
 * @param id - Configuration identifier
 * @param updates - Partial configuration to update
 *
 * @example
 * ```typescript
 * updateTimelineDateConfig('gaza-conflict-2023', {
 *   fallbackEndDate: new Date('2025-12-31')
 * });
 * ```
 */
export function updateTimelineDateConfig(
  id: string,
  updates: Partial<TimelineDateConfig>
): void {
  const existing = TIMELINE_DATE_REGISTRY[id];
  if (!existing) {
    throw new Error(`Timeline date configuration '${id}' not found in registry`);
  }

  TIMELINE_DATE_REGISTRY[id] = {
    ...existing,
    ...updates,
  };
}

/**
 * Remove timeline date configuration from registry
 *
 * @param id - Configuration identifier
 *
 * @example
 * ```typescript
 * removeTimelineDateConfig('custom-period');
 * ```
 */
export function removeTimelineDateConfig(id: string): void {
  delete TIMELINE_DATE_REGISTRY[id];
}

/**
 * Get timeline date configuration IDs
 *
 * @returns Array of all configuration IDs
 *
 * @example
 * ```typescript
 * const ids = getTimelineDateConfigIds();
 * // ['gaza-conflict-2023', 'custom-period']
 * ```
 */
export function getTimelineDateConfigIds(): string[] {
  return Object.keys(TIMELINE_DATE_REGISTRY);
}

/**
 * Check if a timeline date configuration ID is valid
 *
 * @param id - Configuration identifier
 * @returns True if configuration exists in registry
 *
 * @example
 * ```typescript
 * if (isValidTimelineDateConfig('gaza-conflict-2023')) {
 *   // Configuration exists
 * }
 * ```
 */
export function isValidTimelineDateConfig(id: string): boolean {
  return id in TIMELINE_DATE_REGISTRY;
}

/**
 * Get timeline date configuration label (localized)
 *
 * @param id - Configuration identifier
 * @param locale - Locale code ('en' or 'ar')
 * @returns Localized label or configuration ID if not found
 *
 * @example
 * ```typescript
 * const label = getTimelineDateConfigLabel('gaza-conflict-2023', 'ar');
 * // 'صراع غزة 2023-الحاضر'
 * ```
 */
export function getTimelineDateConfigLabel(
  id: string,
  locale: "en" | "ar" = "en"
): string {
  const config = getTimelineDateConfig(id);
  if (!config) return id;

  return locale === "ar" && config.labelArabic
    ? config.labelArabic
    : config.label;
}

/**
 * Get date range from configuration
 *
 * @param id - Configuration identifier
 * @returns Object with start and end dates, or undefined if not found
 *
 * @example
 * ```typescript
 * const range = getDateRange('gaza-conflict-2023');
 * console.log(range?.startDate); // Date('2023-10-07')
 * console.log(range?.endDate); // Date() - current
 * ```
 */
export function getDateRange(
  id: string
): { startDate: Date; endDate: Date } | undefined {
  const config = getTimelineDateConfig(id);
  if (!config) return undefined;

  return {
    startDate: config.fallbackStartDate,
    endDate: config.fallbackEndDate,
  };
}

/**
 * Check if a date is within configuration bounds
 *
 * @param id - Configuration identifier
 * @param date - Date to check
 * @returns True if date is within min/max bounds (or no bounds set)
 *
 * @example
 * ```typescript
 * const isValid = isDateInBounds('gaza-conflict-2023', new Date('2024-01-01'));
 * // true (within bounds)
 * ```
 */
export function isDateInBounds(id: string, date: Date): boolean {
  const config = getTimelineDateConfig(id);
  if (!config) return false;

  if (config.minDate && date < config.minDate) return false;
  if (config.maxDate && date > config.maxDate) return false;

  return true;
}

// ============================================================================
// Convenience Exports (for backward compatibility)
// ============================================================================

/**
 * Default timeline date configuration (for backward compatibility)
 */
export const DEFAULT_TIMELINE_DATE_CONFIG = getDefaultTimelineDateConfig();

/**
 * Fallback start date (for backward compatibility)
 */
export const FALLBACK_START_DATE =
  DEFAULT_TIMELINE_DATE_CONFIG.fallbackStartDate;

/**
 * Fallback end date (for backward compatibility)
 */
export const FALLBACK_END_DATE = DEFAULT_TIMELINE_DATE_CONFIG.fallbackEndDate;
