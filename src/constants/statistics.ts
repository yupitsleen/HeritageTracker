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
 * Human casualty statistics for Gaza (October 7, 2023 - November 2025)
 *
 * Death toll reported by Gaza Ministry of Health, verified by UN OCHA
 * Source: UN Office for the Coordination of Humanitarian Affairs (OCHA)
 * https://www.unocha.org/
 *
 * Displacement figures from UNRWA Situation Reports
 * Source: United Nations Relief and Works Agency (UNRWA)
 * https://www.unrwa.org/resources/reports
 *
 * See docs/research/CASUALTY_STATISTICS.md for detailed source documentation
 */
export const HUMAN_CASUALTIES = {
  /**
   * Palestinians killed (as of November 2025)
   * Source: Gaza Ministry of Health via UN OCHA
   * Note: Conservative estimate - actual toll likely higher (see Lancet study)
   */
  deaths: "69,000+",

  /**
   * Percentage of deaths that are women and children
   * Source: Gaza Ministry of Health via UN OCHA
   */
  womenAndChildrenPercent: "70%",

  /**
   * Palestinians forcibly displaced
   * Source: UNRWA Situation Reports (consistent through 2025)
   */
  displaced: "1.9M",

  /**
   * Percentage of Gaza's population displaced
   * Gaza pre-war population: ~2.1 million
   */
  displacedPercent: "90%",
} as const;

/**
 * Targeted killings of specific professional groups
 * These figures document systematic targeting of journalists, aid workers, and healthcare professionals
 *
 * Sources documented in docs/research/CASUALTY_STATISTICS.md
 */
export const TARGETED_CASUALTIES = {
  /**
   * Journalists and media workers killed
   * Source: Committee to Protect Journalists (CPJ)
   * Note: CPJ states this is "the deadliest and most deliberate effort to kill
   * and silence journalists that CPJ has ever documented"
   */
  journalists: {
    killed: "165+",
    injured: "49",
    missing: "2",
    arrested: "75",
    directlyTargeted: "11+", // CPJ classifies as murder
    source: "Committee to Protect Journalists",
    url: "https://cpj.org/full-coverage-israel-gaza-war/",
  },

  /**
   * Humanitarian aid workers killed
   * Source: UN OCHA
   * Note: Deadliest year on record for global humanitarian community
   */
  aidWorkers: {
    killed: "565+",
    unrwaStaff: "370+", // 306 UNRWA + 72 supporting personnel
    averagePerWeek: "4", // in 2025
    source: "UN OCHA / UNRWA",
    url: "https://www.unocha.org/",
  },

  /**
   * Healthcare workers killed
   * Source: Gaza Ministry of Health, verified by WHO and UN
   * Note: Includes systematic targeting of hospitals and medical facilities
   */
  healthcareWorkers: {
    killed: "1,722+",
    injured: "1,411+",
    detained: "95", // 80 Gaza + 15 West Bank
    attacksOnHealthcare: "735+", // WHO documented
    hospitalsAffected: "34",
    source: "Gaza MoH / WHO / UN OHCHR",
    url: "https://www.who.int/",
  },
} as const;

/**
 * External verification sources for heritage damage documentation
 */
export const EXTERNAL_SOURCES = {
  unesco: "https://whc.unesco.org/en/news/2697",
  forensicArchitecture: "https://forensic-architecture.org/",
  heritageForPeace: "https://www.heritageforpeace.org/",
  unOcha: "https://www.unocha.org/",
  unrwa: "https://www.unrwa.org/resources/reports",
} as const;

/**
 * Last verification/update date for statistics
 * Next scheduled update: December 1, 2025
 */
export const LAST_UPDATED = "November 11, 2025";

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
