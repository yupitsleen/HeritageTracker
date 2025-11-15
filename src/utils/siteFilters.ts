import type { Site } from "../types";
import { getEffectiveDestructionDate } from "./format";

/**
 * Filter sites by type and status
 * Returns all sites if no filters are selected
 */
export const filterSitesByTypeAndStatus = (
  sites: Site[],
  selectedTypes: Array<Site["type"]>,
  selectedStatuses: Array<Site["status"]>
): Site[] => {
  return sites.filter((site) => {
    // Type filter (only filter if types are selected)
    if (selectedTypes.length > 0 && !selectedTypes.includes(site.type)) {
      return false;
    }

    // Status filter (only filter if statuses are selected)
    if (selectedStatuses.length > 0 && !selectedStatuses.includes(site.status)) {
      return false;
    }

    return true;
  });
};

/**
 * Filter sites by destruction date range
 * Returns all sites if no date range is specified
 * Uses effective destruction date (dateDestroyed or sourceAssessmentDate fallback)
 */
export const filterSitesByDestructionDate = (
  sites: Site[],
  startDate: Date | null,
  endDate: Date | null
): Site[] => {
  if (!startDate && !endDate) return sites;

  return sites.filter((site) => {
    // Use effective destruction date (fallback to sourceAssessmentDate)
    const effectiveDate = getEffectiveDestructionDate(site);
    if (!effectiveDate) return false;

    const destroyedDate = new Date(effectiveDate);

    // Check start date
    if (startDate && destroyedDate < startDate) {
      return false;
    }

    // Check end date
    if (endDate && destroyedDate > endDate) {
      return false;
    }

    return true;
  });
};

/**
 * Parse yearBuilt string to numeric year
 *
 * Supports multiple formats:
 * - Explicit years: "800 BCE", "1200 CE", "1950"
 * - Ranges: "800-900 CE" (returns midpoint)
 * - Approximations: "circa 1200", "~1500", "ca. 1200"
 * - Islamic calendar: "750 AH" (converts to Gregorian)
 * - Centuries: "7th century" (returns midpoint)
 *
 * Exported for use in heritageCalculations.ts and filters
 *
 * @param yearBuilt - Year built string from site data
 * @returns Numeric year (negative for BCE) or null if unparseable
 */
export const parseYearBuilt = (yearBuilt: string): number | null => {
  if (!yearBuilt || typeof yearBuilt !== 'string') {
    return null;
  }

  const normalized = yearBuilt.trim();

  // Handle date ranges (e.g., "800-900 CE", "1200-1300")
  const rangeMatch = normalized.match(/(\d+)\s*-\s*(\d+)\s*(BCE|BC|CE|AD)?/i);
  if (rangeMatch) {
    const start = parseInt(rangeMatch[1]);
    const end = parseInt(rangeMatch[2]);
    const era = rangeMatch[3]?.toUpperCase();
    const midpoint = Math.floor((start + end) / 2);

    if (era === 'BCE' || era === 'BC') {
      return -midpoint;
    }
    return midpoint;
  }

  // Handle approximations (circa, ~, ca.) - strip markers and continue parsing
  const approximationMatch = normalized.match(/(?:circa|ca\.|~)\s*(.+)/i);
  const parseString = approximationMatch ? approximationMatch[1] : normalized;

  // Handle Islamic calendar (AH/Hijri) - approximate conversion
  // AH year 1 ≈ 622 CE, Islamic year ≈ 0.97 Gregorian years
  const ahMatch = parseString.match(/(\d+)\s*AH/i);
  if (ahMatch) {
    const hijriYear = parseInt(ahMatch[1]);
    return Math.round(622 + (hijriYear * 0.97));
  }

  // Try to extract explicit year with BCE/BC
  const bceMatch = parseString.match(/(\d+)\s*(BCE|BC)/i);
  if (bceMatch) {
    return -parseInt(bceMatch[1]);
  }

  // Try to extract explicit year with CE/AD
  const ceMatch = parseString.match(/(\d+)\s*(CE|AD)/i);
  if (ceMatch) {
    return parseInt(ceMatch[1]);
  }

  // Try to extract standalone 3-4 digit year (e.g., "425" or "1200")
  const yearMatch = parseString.match(/\b(\d{3,4})\b/);
  if (yearMatch) {
    return parseInt(yearMatch[1]);
  }

  // Handle century format (e.g., "7th century", "16th century")
  const centuryMatch = parseString.match(/(\d+)(st|nd|rd|th)\s+century/i);
  if (centuryMatch) {
    const century = parseInt(centuryMatch[1]);
    // Convert century to approximate midpoint year
    // 7th century = 601-700, midpoint = 650
    return (century - 1) * 100 + 50;
  }

  return null;
};

/**
 * Filter sites by creation year range
 * Returns all sites if no year range is specified
 */
export const filterSitesByCreationYear = (
  sites: Site[],
  startYear: number | null,
  endYear: number | null
): Site[] => {
  if (!startYear && !endYear) return sites;

  return sites.filter((site) => {
    if (!site.yearBuilt) return true;

    const builtYear = parseYearBuilt(site.yearBuilt);
    if (builtYear === null) return true;

    // Check start year
    if (startYear !== null && builtYear < startYear) {
      return false;
    }

    // Check end year
    if (endYear !== null && builtYear > endYear) {
      return false;
    }

    return true;
  });
};

/**
 * Filter sites by search term (searches English and Arabic names)
 * Returns all sites if search term is empty
 */
export const filterSitesBySearch = (
  sites: Site[],
  searchTerm: string
): Site[] => {
  if (!searchTerm || searchTerm.trim().length === 0) return sites;

  const lowerSearch = searchTerm.toLowerCase().trim();

  return sites.filter((site) => {
    // Search in English name
    if (site.name.toLowerCase().includes(lowerSearch)) {
      return true;
    }

    // Search in Arabic name if it exists
    if (site.nameArabic && site.nameArabic.includes(searchTerm.trim())) {
      return true;
    }

    return false;
  });
};
