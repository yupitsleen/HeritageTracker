/**
 * Imagery Period Registry
 *
 * Central registry for historical satellite imagery periods.
 * Enables dynamic imagery period configuration for temporal analysis.
 *
 * @example
 * ```typescript
 * // Add a new imagery period:
 * registerImageryPeriod({
 *   id: 'oct-2023',
 *   label: 'October 2023',
 *   category: 'pre-conflict',
 *   date: '2023-10-01',
 *   url: 'https://wayback.maptiles.arcgis.com/.../tile/12345/{z}/{y}/{x}',
 *   maxZoom: 18,
 *   order: 2
 * });
 * ```
 */

import type {
  // @ts-expect-error - Used in JSDoc comments
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ImageryPeriodConfig,
  ImageryPeriodId,
  ExtendedImageryPeriodConfig,
  ImageryPeriodCategory,
} from "../types/imageryPeriodTypes";

/**
 * Imagery period registry - stores all registered periods
 */
export const IMAGERY_PERIOD_REGISTRY: Record<
  ImageryPeriodId,
  ExtendedImageryPeriodConfig
> = {
  "baseline-2014": {
    id: "baseline-2014",
    label: "2014 Baseline",
    labelArabic: "خط الأساس 2014",
    category: "baseline",
    date: "2014-02-20",
    url: "https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/10/{z}/{y}/{x}",
    maxZoom: 17,
    minZoom: 1,
    releaseNum: 10,
    order: 1,
    enabled: true,
    description: "Earliest available ESRI Wayback imagery (February 2014)",
    metadata: {
      source: "ESRI Wayback Archive",
      resolution: 1.0,
      quality: 3,
    },
  },

  "early-2024": {
    id: "early-2024",
    label: "January 2024",
    labelArabic: "يناير 2024",
    category: "conflict",
    date: "2024-01-18",
    url: "https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/41468/{z}/{y}/{x}",
    maxZoom: 18,
    minZoom: 1,
    releaseNum: 41468,
    order: 2,
    enabled: true,
    description: "Earliest 2024 imagery showing conflict impact",
    event: "Gaza Conflict 2023-2024",
    metadata: {
      source: "ESRI Wayback Archive",
      resolution: 0.6,
      quality: 4,
    },
  },

  current: {
    id: "current",
    label: "Current",
    labelArabic: "الحالي",
    category: "current",
    date: "current",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    maxZoom: 19,
    minZoom: 1,
    releaseNum: null,
    order: 3,
    isDefault: true,
    enabled: true,
    description: "Latest available ESRI World Imagery",
    metadata: {
      source: "ESRI World Imagery",
      resolution: 0.3,
      quality: 5,
    },
  },
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Register a new imagery period
 *
 * @param config - Imagery period configuration
 *
 * @example
 * ```typescript
 * registerImageryPeriod({
 *   id: 'aug-2023',
 *   label: 'August 2023',
 *   category: 'pre-conflict',
 *   date: '2023-08-31',
 *   url: 'https://...',
 *   maxZoom: 18,
 *   order: 1.5
 * });
 * ```
 */
export function registerImageryPeriod(
  config: ExtendedImageryPeriodConfig
): void {
  IMAGERY_PERIOD_REGISTRY[config.id] = config;
}

/**
 * Get all registered imagery periods
 *
 * @returns Array of all imagery periods, sorted by order
 *
 * @example
 * ```typescript
 * const periods = getAllImageryPeriods();
 * periods.forEach(period => console.log(period.label));
 * ```
 */
export function getAllImageryPeriods(): ExtendedImageryPeriodConfig[] {
  return Object.values(IMAGERY_PERIOD_REGISTRY).sort(
    (a, b) => a.order - b.order
  );
}

/**
 * Get imagery period by ID
 *
 * @param id - Imagery period identifier
 * @returns Imagery period configuration or undefined if not found
 *
 * @example
 * ```typescript
 * const period = getImageryPeriod('baseline-2014');
 * if (period) {
 *   console.log(period.url);
 * }
 * ```
 */
export function getImageryPeriod(
  id: ImageryPeriodId
): ExtendedImageryPeriodConfig | undefined {
  return IMAGERY_PERIOD_REGISTRY[id];
}

/**
 * Get enabled imagery periods
 *
 * @returns Array of enabled imagery periods, sorted by order
 *
 * @example
 * ```typescript
 * const enabled = getEnabledImageryPeriods();
 * // Only periods with enabled !== false
 * ```
 */
export function getEnabledImageryPeriods(): ExtendedImageryPeriodConfig[] {
  return getAllImageryPeriods().filter((period) => period.enabled !== false);
}

/**
 * Get default imagery period
 *
 * @returns Default imagery period or most recent period
 *
 * @example
 * ```typescript
 * const defaultPeriod = getDefaultImageryPeriod();
 * // Returns period with isDefault: true
 * ```
 */
export function getDefaultImageryPeriod(): ExtendedImageryPeriodConfig {
  const defaultPeriod = getAllImageryPeriods().find(
    (period) => period.isDefault
  );
  if (defaultPeriod) return defaultPeriod;

  // Fallback to most recent period (highest order)
  const periods = getEnabledImageryPeriods();
  if (periods.length > 0) return periods[periods.length - 1];

  // Final fallback to current
  return IMAGERY_PERIOD_REGISTRY["current"];
}

/**
 * Get imagery periods by category
 *
 * @param category - Imagery period category
 * @returns Array of imagery periods matching the category
 *
 * @example
 * ```typescript
 * const baseline = getImageryPeriodsByCategory('baseline');
 * const conflictPeriods = getImageryPeriodsByCategory('conflict');
 * ```
 */
export function getImageryPeriodsByCategory(
  category: ImageryPeriodCategory
): ExtendedImageryPeriodConfig[] {
  return getAllImageryPeriods().filter(
    (period) => period.category === category
  );
}

/**
 * Get imagery periods by date range
 *
 * @param startDate - Start date (ISO string or Date)
 * @param endDate - End date (ISO string or Date)
 * @returns Array of imagery periods within the range
 *
 * @example
 * ```typescript
 * const periods = getImageryPeriodsByDateRange('2014-01-01', '2024-01-01');
 * ```
 */
export function getImageryPeriodsByDateRange(
  startDate: string | Date,
  endDate: string | Date
): ExtendedImageryPeriodConfig[] {
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;

  return getAllImageryPeriods().filter((period) => {
    if (period.date === "current") return true;

    const periodDate = new Date(period.date);
    return periodDate >= start && periodDate <= end;
  });
}

/**
 * Check if an imagery period ID is valid
 *
 * @param id - Imagery period identifier
 * @returns True if period exists in registry
 *
 * @example
 * ```typescript
 * if (isValidImageryPeriod('baseline-2014')) {
 *   // Period exists
 * }
 * ```
 */
export function isValidImageryPeriod(id: string): id is ImageryPeriodId {
  return id in IMAGERY_PERIOD_REGISTRY;
}

/**
 * Get imagery period label (localized)
 *
 * @param id - Imagery period identifier
 * @param locale - Locale code ('en' or 'ar')
 * @returns Localized label or period ID if not found
 *
 * @example
 * ```typescript
 * const label = getImageryPeriodLabel('baseline-2014', 'ar'); // 'خط الأساس 2014'
 * ```
 */
export function getImageryPeriodLabel(
  id: ImageryPeriodId,
  locale: "en" | "ar" = "en"
): string {
  const period = getImageryPeriod(id);
  if (!period) return id;

  return locale === "ar" && period.labelArabic
    ? period.labelArabic
    : period.label;
}

/**
 * Update imagery period configuration
 *
 * @param id - Imagery period identifier
 * @param updates - Partial configuration to update
 *
 * @example
 * ```typescript
 * updateImageryPeriod('baseline-2014', { enabled: false });
 * ```
 */
export function updateImageryPeriod(
  id: ImageryPeriodId,
  updates: Partial<ExtendedImageryPeriodConfig>
): void {
  const existing = IMAGERY_PERIOD_REGISTRY[id];
  if (!existing) {
    throw new Error(`Imagery period '${id}' not found in registry`);
  }

  IMAGERY_PERIOD_REGISTRY[id] = {
    ...existing,
    ...updates,
  };
}

/**
 * Remove imagery period from registry
 *
 * @param id - Imagery period identifier
 *
 * @example
 * ```typescript
 * removeImageryPeriod('custom-period');
 * ```
 */
export function removeImageryPeriod(id: ImageryPeriodId): void {
  delete IMAGERY_PERIOD_REGISTRY[id];
}

/**
 * Get imagery period IDs
 *
 * @returns Array of all imagery period IDs
 *
 * @example
 * ```typescript
 * const ids = getImageryPeriodIds();
 * // ['baseline-2014', 'early-2024', 'current']
 * ```
 */
export function getImageryPeriodIds(): ImageryPeriodId[] {
  return Object.keys(IMAGERY_PERIOD_REGISTRY);
}

/**
 * Get earliest imagery period
 *
 * @returns Earliest imagery period by date
 *
 * @example
 * ```typescript
 * const earliest = getEarliestImageryPeriod();
 * ```
 */
export function getEarliestImageryPeriod(): ExtendedImageryPeriodConfig {
  const periods = getAllImageryPeriods().filter((p) => p.date !== "current");

  if (periods.length === 0) {
    return IMAGERY_PERIOD_REGISTRY["current"];
  }

  return periods.reduce((earliest, current) => {
    const earliestDate = new Date(earliest.date);
    const currentDate = new Date(current.date);
    return currentDate < earliestDate ? current : earliest;
  });
}

/**
 * Get latest imagery period (excluding "current")
 *
 * @returns Latest dated imagery period
 *
 * @example
 * ```typescript
 * const latest = getLatestImageryPeriod();
 * ```
 */
export function getLatestImageryPeriod(): ExtendedImageryPeriodConfig {
  const periods = getAllImageryPeriods().filter((p) => p.date !== "current");

  if (periods.length === 0) {
    return IMAGERY_PERIOD_REGISTRY["current"];
  }

  return periods.reduce((latest, current) => {
    const latestDate = new Date(latest.date);
    const currentDate = new Date(current.date);
    return currentDate > latestDate ? current : latest;
  });
}
