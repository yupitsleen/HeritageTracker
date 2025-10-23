/**
 * Filter options constants
 * Centralized to ensure consistency across components
 */

import type { GazaSite } from "../types";
import { getSiteTypes } from "../config/siteTypes";

/**
 * Available site types for filtering
 * Now dynamically generated from SITE_TYPE_REGISTRY
 */
export const getSiteTypeOptions = (): string[] => {
  return getSiteTypes().map(type => type.id);
};

// Backward compatibility: export as constant for existing code
export const SITE_TYPES: readonly string[] = getSiteTypeOptions();

/**
 * Available damage status options for filtering
 */
export const STATUS_OPTIONS: ReadonlyArray<GazaSite["status"]> = [
  "destroyed",
  "heavily-damaged",
  "damaged",
] as const;
