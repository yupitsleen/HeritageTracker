import { useMemo } from "react";
import type { Site } from "../types";
import type { TimelineEvent } from "../utils/d3Timeline";
import { getEffectiveDestructionDate, hasUnknownDestructionDate } from "../utils/format";

/**
 * Extract and process timeline data from sites
 * - Filters sites with destruction dates (or sourceAssessmentDate as fallback)
 * - Optionally filters out sites with unknown destruction dates (only survey date)
 * - Sorts events chronologically
 * - Returns structured timeline events
 *
 * @param sites - Array of heritage sites
 * @param showUnknownDestructionDates - If false, excludes sites with only sourceAssessmentDate
 */
export function useTimelineData(sites: Site[], showUnknownDestructionDates = true) {
  return useMemo(() => {
    const destructionDates: TimelineEvent[] = sites
      .filter((site) => {
        // Must have at least one date (destruction or survey)
        if (!getEffectiveDestructionDate(site)) return false;

        // If toggle is off, exclude sites with unknown destruction dates
        if (!showUnknownDestructionDates && hasUnknownDestructionDate(site)) {
          return false;
        }

        return true;
      })
      .map((site) => {
        const effectiveDate = getEffectiveDestructionDate(site);
        return {
          date: new Date(effectiveDate!),
          siteName: site.name,
          siteId: site.id,
          status: site.status as "destroyed" | "heavily-damaged" | "damaged" | undefined,
        };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    // Calculate event density for future visualizations
    const eventDensity =
      destructionDates.length > 0
        ? destructionDates.length /
          ((destructionDates[destructionDates.length - 1].date.getTime() -
            destructionDates[0].date.getTime()) /
            (1000 * 60 * 60 * 24)) // events per day
        : 0;

    return {
      events: destructionDates,
      totalEvents: destructionDates.length,
      eventDensity,
    };
  }, [sites, showUnknownDestructionDates]);
}
