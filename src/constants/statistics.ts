/**
 * Statistics Constants
 * External data sources and verified counts for StatsDashboard
 */

/**
 * UNESCO verified count of damaged cultural sites in Gaza
 * Source: UNESCO press release, verified as of 2024
 * https://whc.unesco.org/en/news/2697
 */
export const UNESCO_VERIFIED_SITES = 110;

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
export const LAST_UPDATED = "October 2025";
