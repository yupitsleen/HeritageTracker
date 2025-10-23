import { useMemo } from "react";
import type { GazaSite } from "../types";
import type { TimelineEvent } from "../utils/d3Timeline";

/**
 * Extract and process timeline data from sites
 * - Filters sites with destruction dates
 * - Sorts events chronologically
 * - Returns structured timeline events
 */
export function useTimelineData(sites: GazaSite[]) {
  return useMemo(() => {
    const destructionDates: TimelineEvent[] = sites
      .filter((site) => site.dateDestroyed)
      .map((site) => ({
        date: new Date(site.dateDestroyed!),
        siteName: site.name,
        siteId: site.id,
        status: site.status as "destroyed" | "heavily-damaged" | "damaged" | undefined,
      }))
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
  }, [sites]);
}
