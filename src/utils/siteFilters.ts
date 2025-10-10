import type { GazaSite } from "../types";

/**
 * Filter sites by type and status
 * Returns all sites if no filters are selected
 */
export const filterSitesByTypeAndStatus = (
  sites: GazaSite[],
  selectedTypes: Array<GazaSite["type"]>,
  selectedStatuses: Array<GazaSite["status"]>
): GazaSite[] => {
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
 */
export const filterSitesByDestructionDate = (
  sites: GazaSite[],
  startDate: Date | null,
  endDate: Date | null
): GazaSite[] => {
  if (!startDate && !endDate) return sites;

  return sites.filter((site) => {
    if (!site.dateDestroyed) return true;

    const destroyedDate = new Date(site.dateDestroyed);

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
 * Handles formats like: "7th century", "425 CE", "16th century", "5th century (425 CE)", "800 BCE - 1100 CE"
 */
const parseYearBuilt = (yearBuilt: string): number | null => {
  // Try to extract explicit year with BCE/BC
  const bceMatch = yearBuilt.match(/(\d+)\s*(BCE|BC)/i);
  if (bceMatch) {
    return -parseInt(bceMatch[1]);
  }

  // Try to extract explicit year with CE/AD
  const ceMatch = yearBuilt.match(/(\d+)\s*(CE|AD)/i);
  if (ceMatch) {
    return parseInt(ceMatch[1]);
  }

  // Try to extract standalone 3-4 digit year (e.g., "425" or "1200")
  const yearMatch = yearBuilt.match(/\b(\d{3,4})\b/);
  if (yearMatch) {
    return parseInt(yearMatch[1]);
  }

  // Handle century format (e.g., "7th century", "16th century")
  const centuryMatch = yearBuilt.match(/(\d+)(st|nd|rd|th)\s+century/i);
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
  sites: GazaSite[],
  startYear: number | null,
  endYear: number | null
): GazaSite[] => {
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
  sites: GazaSite[],
  searchTerm: string
): GazaSite[] => {
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
