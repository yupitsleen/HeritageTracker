import type { GazaSite } from "../../types";
import { parseYearBuilt } from "../siteFilters";

/**
 * Site significance and marker size calculations
 */

/**
 * Get significance score for marker size calculation
 * Higher score = larger marker
 *
 * @param site - Gaza heritage site
 * @returns Significance score (normalized)
 */
export function calculateSignificanceScore(site: GazaSite): number {
  let score = 1; // Base score

  const yearBuilt = parseYearBuilt(site.yearBuilt);
  if (yearBuilt !== null) {
    const age = 2024 - yearBuilt;
    score += age / 1000; // +1 per millennium
  }

  if (site.unescoListed) score += 2;
  if (site.artifactCount) score += site.artifactCount / 100;
  if (site.isUnique) score += 3;
  if (site.religiousSignificance) score += 1;
  if (site.communityGatheringPlace) score += 1;
  if (site.historicalEvents) score += site.historicalEvents.length * 0.5;

  return score;
}
