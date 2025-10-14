import type { GazaSite } from "../types";
import { parseYearBuilt } from "./siteFilters";

/**
 * Heritage value and glow contribution calculations
 * Part of Phase 2: "Dimming Gaza" visual system
 */

/**
 * Calculate heritage glow contribution value for a site
 * Higher values = more significant heritage = stronger glow
 *
 * Formula considers:
 * - Age (older = more weight)
 * - Significance (UNESCO, artifacts, uniqueness)
 * - Type (archaeological, museum, etc.)
 *
 * @param site - Gaza heritage site
 * @returns Numeric glow contribution value (100-2400+)
 */
export function calculateGlowContribution(site: GazaSite): number {
  let weight = 100; // Base value

  // Age factor (older = more weight)
  const yearBuilt = parseYearBuilt(site.yearBuilt);
  if (yearBuilt !== null) {
    const age = 2024 - yearBuilt;

    if (age > 2000) {
      weight *= 3; // Ancient (Bronze Age, Roman, Byzantine)
    } else if (age > 1000) {
      weight *= 2; // Medieval (Islamic Golden Age)
    } else if (age > 200) {
      weight *= 1.5; // Ottoman/Historic
    }
    // Modern sites (<200 years) keep base weight
  }

  // Significance multipliers
  if (site.unescoListed) {
    weight *= 2;
  }

  if (site.artifactCount && site.artifactCount > 100) {
    weight *= 1.5;
  }

  if (site.isUnique) {
    weight *= 2;
  }

  // Type-based weights
  switch (site.type) {
    case "archaeological":
      weight *= 1.8;
      break;
    case "museum":
      weight *= 1.6;
      break;
    // Note: "library" not in current GazaSite type, but spec mentions it
    // mosque, church, historic-building use base weight
    default:
      break;
  }

  // Religious significance bonus (mosques, churches)
  if (site.religiousSignificance) {
    weight *= 1.3;
  }

  // Community gathering place bonus
  if (site.communityGatheringPlace) {
    weight *= 1.2;
  }

  // Historical events bonus (more events = more significant)
  if (site.historicalEvents && site.historicalEvents.length > 0) {
    weight *= 1 + (site.historicalEvents.length * 0.1); // +10% per event
  }

  return Math.round(weight);
}

/**
 * Get color code for site based on age
 * Used for marker visualization before destruction
 *
 * @param site - Gaza heritage site
 * @returns Hex color code
 */
export function getAgeColorCode(site: GazaSite): string {
  const yearBuilt = parseYearBuilt(site.yearBuilt);

  if (yearBuilt === null) {
    return "#4A90E2"; // Blue for unknown age
  }

  const age = 2024 - yearBuilt;

  if (age > 2000) {
    return "#FFD700"; // Gold - Ancient (>2000 years)
  } else if (age > 500) {
    return "#CD7F32"; // Bronze - Medieval (500-2000 years)
  } else if (age > 200) {
    return "#C0C0C0"; // Silver - Ottoman/Historic (200-500 years)
  } else {
    return "#4A90E2"; // Blue - Modern (<200 years)
  }
}

/**
 * Calculate total heritage value for all sites
 * Sum of all glow contributions
 *
 * @param sites - Array of Gaza heritage sites
 * @returns Total heritage value
 */
export function calculateTotalHeritageValue(sites: GazaSite[]): number {
  return sites.reduce((sum, site) => sum + calculateGlowContribution(site), 0);
}

/**
 * Calculate heritage value lost from destroyed sites up to a specific date
 *
 * @param sites - Array of Gaza heritage sites
 * @param currentDate - Current timeline date
 * @returns Object with destroyed value and count
 */
export function calculateDestroyedValue(
  sites: GazaSite[],
  currentDate: Date
): { value: number; count: number } {
  const destroyedSites = sites.filter((site) => {
    if (!site.dateDestroyed) return false;
    const destructionDate = new Date(site.dateDestroyed);
    return destructionDate <= currentDate;
  });

  const value = destroyedSites.reduce(
    (sum, site) => sum + calculateGlowContribution(site),
    0
  );

  return {
    value,
    count: destroyedSites.length,
  };
}

/**
 * Calculate heritage integrity percentage
 * 100% = no destruction, 0% = all heritage destroyed
 *
 * @param sites - Array of Gaza heritage sites
 * @param currentDate - Current timeline date
 * @returns Integrity percentage (0-100)
 */
export function calculateHeritageIntegrity(
  sites: GazaSite[],
  currentDate: Date
): number {
  const totalValue = calculateTotalHeritageValue(sites);

  if (totalValue === 0) {
    return 100; // No sites = no heritage to destroy
  }

  const { value: destroyedValue } = calculateDestroyedValue(sites, currentDate);
  const remainingValue = totalValue - destroyedValue;

  return Math.round((remainingValue / totalValue) * 100);
}

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

/**
 * Get glow reduction percentage based on damage status
 *
 * @param status - Site damage status
 * @returns Percentage of glow to remove (0-100)
 */
export function getGlowReductionPercentage(
  status: "destroyed" | "heavily-damaged" | "damaged"
): number {
  switch (status) {
    case "destroyed":
      return 100; // Remove 100% of glow
    case "heavily-damaged":
      return 50; // Remove 50% of glow
    case "damaged":
      return 25; // Remove 25% of glow
    default:
      return 0;
  }
}
