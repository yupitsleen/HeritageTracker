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
 * Filter sites by date (on or before selected date)
 * Returns all sites if no date is selected
 */
export const filterSitesByDate = (
  sites: GazaSite[],
  selectedDate: Date | null
): GazaSite[] => {
  if (!selectedDate) return sites;

  return sites.filter((site) => {
    // Date filter
    if (site.dateDestroyed) {
      return new Date(site.dateDestroyed) <= selectedDate;
    }
    return true;
  });
};
