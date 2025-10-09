/**
 * Filter options constants
 * Centralized to ensure consistency across components
 */

import type { GazaSite } from "../types";

/**
 * Available site types for filtering
 */
export const SITE_TYPES: ReadonlyArray<GazaSite["type"]> = [
  "mosque",
  "church",
  "archaeological",
  "museum",
  "historic-building",
] as const;

/**
 * Available damage status options for filtering
 */
export const STATUS_OPTIONS: ReadonlyArray<GazaSite["status"]> = [
  "destroyed",
  "heavily-damaged",
  "damaged",
] as const;
