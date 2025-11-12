import type { Site } from "../../types";
import { calculateGlowContribution } from "./glowContributions";

/**
 * Heritage metrics and integrity calculations
 * For stats dashboards and timeline animation
 */

/**
 * Calculate total heritage value for all sites
 * Sum of all glow contributions
 *
 * @param sites - Array of Gaza heritage sites
 * @returns Total heritage value
 */
export function calculateTotalHeritageValue(sites: Site[]): number {
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
  sites: Site[],
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
  sites: Site[],
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
