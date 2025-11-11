/**
 * Statistics Constants
 * External data sources and verified counts for StatsDashboard
 */

/**
 * UNESCO verified count of damaged cultural sites in Gaza
 * Source: UNESCO Gaza Heritage Damage Assessment (October 2024)
 * https://www.unesco.org/en/gaza/assessment
 */
export const UNESCO_VERIFIED_SITES = 114;

/**
 * External verification sources for heritage damage documentation
 */
export const EXTERNAL_SOURCES = {
  unesco: "https://whc.unesco.org/en/news/2697",
  forensicArchitecture: "https://forensic-architecture.org/",
  heritageForPeace: "https://www.heritageforpeace.org/",
} as const;

/**
 * Last verification/update date for statistics
 */
export const LAST_UPDATED = "November 2025";

/**
 * Default oldest site age display value when no data available
 */
export const DEFAULT_OLDEST_AGE_DISPLAY = "5,000";

/**
 * Age Formatting Utilities
 */

/**
 * Formats age in thousands with decimal precision (e.g., 5432 → "5.4k")
 * @param age - Age in years
 * @returns Formatted string with "k" suffix
 */
export function formatAgeInThousands(age: number): string {
  return `${Math.floor(age / 100) / 10}k`;
}

/**
 * Formats age rounded to nearest value (e.g., 5432 → "5400" when roundTo=100)
 * @param age - Age in years
 * @param roundTo - Rounding interval (default: 100)
 * @returns Formatted string
 */
export function formatAgeRounded(age: number, roundTo = 100): string {
  return `${Math.floor(age / roundTo) * roundTo}`;
}

/**
 * Formats age in thousands with "+" suffix (e.g., 5432 → "5k+")
 * @param age - Age in years
 * @returns Formatted string with "k+" suffix
 */
export function formatAgeInThousandsPlus(age: number): string {
  return `${Math.floor(age / 1000)}k+`;
}
