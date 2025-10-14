import { useMemo } from "react";
import type { GazaSite } from "../types";
import {
  calculateGlowContribution,
  calculateTotalHeritageValue,
  calculateDestroyedValue,
  calculateHeritageIntegrity,
  getGlowReductionPercentage,
} from "../utils/heritageCalculations";

/**
 * Hook to manage map glow state and calculations
 * Part of Phase 2: "Dimming Gaza" visual system
 *
 * Pre-calculates expensive glow values and provides
 * current glow state based on timeline position
 */

export interface GlowContribution {
  siteId: string;
  siteName: string;
  baseGlow: number;
  currentGlow: number; // Reduced based on damage/destruction
  coordinates: [number, number];
  status: "destroyed" | "heavily-damaged" | "damaged";
  dateDestroyed?: string;
}

export interface MapGlowState {
  // Pre-calculated glow contributions for all sites
  glowContributions: GlowContribution[];
  // Total heritage value (sum of all base glow values)
  totalHeritageValue: number;
  // Current state metrics based on timeline position
  currentMetrics: {
    destroyedValue: number;
    destroyedCount: number;
    integrityPercent: number;
    remainingValue: number;
  };
}

/**
 * Custom hook for managing map glow calculations
 *
 * @param sites - Array of all heritage sites
 * @param currentDate - Current timeline date position
 * @returns MapGlowState with pre-calculated values
 */
export function useMapGlow(sites: GazaSite[], currentDate: Date): MapGlowState {
  // Pre-calculate base glow contributions for all sites (expensive operation)
  // Only recalculates when sites array changes
  const glowContributions = useMemo<GlowContribution[]>(() => {
    return sites.map((site) => {
      const baseGlow = calculateGlowContribution(site);

      // Calculate current glow based on damage status and timeline position
      let currentGlow = baseGlow;

      if (site.dateDestroyed) {
        const destructionDate = new Date(site.dateDestroyed);

        // Only reduce glow if destruction has occurred by current date
        if (destructionDate <= currentDate) {
          const reductionPercent = getGlowReductionPercentage(site.status);
          currentGlow = baseGlow * ((100 - reductionPercent) / 100);
        }
      }

      return {
        siteId: site.id,
        siteName: site.name,
        baseGlow,
        currentGlow,
        coordinates: site.coordinates,
        status: site.status,
        dateDestroyed: site.dateDestroyed,
      };
    });
  }, [sites, currentDate]);

  // Calculate total heritage value (only changes when sites change)
  const totalHeritageValue = useMemo(
    () => calculateTotalHeritageValue(sites),
    [sites]
  );

  // Calculate current metrics based on timeline position
  const currentMetrics = useMemo(() => {
    const { value: destroyedValue, count: destroyedCount } =
      calculateDestroyedValue(sites, currentDate);

    const integrityPercent = calculateHeritageIntegrity(sites, currentDate);

    const remainingValue = totalHeritageValue - destroyedValue;

    return {
      destroyedValue,
      destroyedCount,
      integrityPercent,
      remainingValue,
    };
  }, [sites, currentDate, totalHeritageValue]);

  return {
    glowContributions,
    totalHeritageValue,
    currentMetrics,
  };
}

/**
 * Get glow intensity for rendering
 * Returns normalized value (0-1) for canvas alpha/opacity
 *
 * @param currentGlow - Current glow value for site
 * @param maxGlow - Maximum glow value in dataset
 * @returns Normalized intensity (0-1)
 */
export function getGlowIntensity(currentGlow: number, maxGlow: number): number {
  if (maxGlow === 0) return 0;
  return Math.min(currentGlow / maxGlow, 1);
}

/**
 * Get glow radius for rendering (in pixels)
 * Larger glow for more significant sites
 *
 * @param glowValue - Glow contribution value
 * @returns Radius in pixels
 */
export function getGlowRadius(glowValue: number): number {
  // Base radius + logarithmic scaling for glow value
  const baseRadius = 20;
  const scaledRadius = Math.log(glowValue + 1) * 15;
  return Math.min(baseRadius + scaledRadius, 150); // Cap at 150px
}

/**
 * Interpolate color between two hex colors based on progress
 * Used for glow color transitions (gold → grey)
 *
 * @param color1 - Start color (hex)
 * @param color2 - End color (hex)
 * @param progress - Progress value (0-1)
 * @returns Interpolated hex color
 */
export function interpolateColor(
  color1: string,
  color2: string,
  progress: number
): string {
  // Parse hex colors
  const c1 = {
    r: parseInt(color1.slice(1, 3), 16),
    g: parseInt(color1.slice(3, 5), 16),
    b: parseInt(color1.slice(5, 7), 16),
  };

  const c2 = {
    r: parseInt(color2.slice(1, 3), 16),
    g: parseInt(color2.slice(3, 5), 16),
    b: parseInt(color2.slice(5, 7), 16),
  };

  // Interpolate
  const r = Math.round(c1.r + (c2.r - c1.r) * progress);
  const g = Math.round(c1.g + (c2.g - c1.g) * progress);
  const b = Math.round(c1.b + (c2.b - c1.b) * progress);

  // Convert back to hex
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
