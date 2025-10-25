/**
 * Site Status Registry
 *
 * Central registry for all site damage statuses. Allows dynamic registration
 * of new statuses without code changes.
 *
 * @example
 * ```typescript
 * // Add a new status:
 * registerStatus({
 *   id: 'partially-restored',
 *   label: 'Partially Restored',
 *   labelArabic: 'تم ترميمه جزئيا',
 *   severity: 30,
 *   markerColor: 'green',
 *   description: 'Restoration work in progress'
 * });
 * ```
 */

import type { StatusConfig } from '../types/siteStatus';

/**
 * Site status registry - stores all registered statuses
 */
export const STATUS_REGISTRY: Record<string, StatusConfig> = {
  "destroyed": {
    id: "destroyed",
    label: "Destroyed",
    labelArabic: "مدمر",
    severity: 100,
    markerColor: "red",
    description: "Completely destroyed, no structural integrity remaining"
  },
  "heavily-damaged": {
    id: "heavily-damaged",
    label: "Heavily Damaged",
    labelArabic: "تضررت بشدة",
    severity: 75,
    markerColor: "orange",
    description: "Major structural damage, may not be repairable"
  },
  "looted": {
    id: "looted",
    label: "Looted",
    labelArabic: "منهوب",
    severity: 60,
    markerColor: "purple",
    description: "Artifacts or valuables stolen or removed"
  },
  "damaged": {
    id: "damaged",
    label: "Damaged",
    labelArabic: "تضرر",
    severity: 50,
    markerColor: "yellow",
    description: "Partial damage, repairable with restoration work"
  },
  "abandoned": {
    id: "abandoned",
    label: "Abandoned",
    labelArabic: "مهجور",
    severity: 25,
    markerColor: "gray",
    description: "No longer in use or maintained, but structurally intact"
  },
  "unknown": {
    id: "unknown",
    label: "Unknown",
    labelArabic: "غير معروف",
    severity: 10,
    markerColor: "lightgray",
    description: "Status cannot be verified or is uncertain"
  },
  "unharmed": {
    id: "unharmed",
    label: "Unharmed",
    labelArabic: "سليم",
    severity: 0,
    markerColor: "green",
    description: "No damage, fully intact and preserved"
  },
};

/**
 * Register a new status dynamically
 *
 * @param config - Status configuration
 */
export function registerStatus(config: StatusConfig): void {
  STATUS_REGISTRY[config.id] = config;
}

/**
 * Get all registered statuses, sorted by severity (highest first)
 *
 * @returns Array of all status configurations
 */
export function getStatuses(): StatusConfig[] {
  return Object.values(STATUS_REGISTRY)
    .sort((a, b) => b.severity - a.severity);
}

/**
 * Get status configuration by ID
 *
 * Returns a default configuration if status is not registered,
 * ensuring graceful degradation.
 *
 * @param statusId - Status identifier
 * @returns Status configuration
 */
export function getStatusConfig(statusId: string): StatusConfig {
  return STATUS_REGISTRY[statusId] || {
    id: statusId,
    label: statusId,
    severity: 0,
    markerColor: "grey",
    description: "Unknown status"
  };
}

/**
 * Get status label by ID and locale
 *
 * @param statusId - Status identifier
 * @param locale - Language code ('en' or 'ar')
 * @returns Localized label
 */
export function getStatusLabel(statusId: string, locale: string = 'en'): string {
  const config = getStatusConfig(statusId);

  if (locale === 'ar' && config.labelArabic) {
    return config.labelArabic;
  }

  return config.label;
}

/**
 * Check if a status is registered
 *
 * @param statusId - Status identifier
 * @returns True if status is registered
 */
export function isStatusRegistered(statusId: string): boolean {
  return statusId in STATUS_REGISTRY;
}

/**
 * Get marker color for a status
 *
 * @param statusId - Status identifier
 * @returns Marker color (e.g., 'red', 'orange', 'yellow')
 */
export function getMarkerColor(statusId: string): string {
  return getStatusConfig(statusId).markerColor;
}
