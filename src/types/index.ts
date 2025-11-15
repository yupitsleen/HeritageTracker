/**
 * Core type definitions for Heritage Tracker MVP
 * Only includes types we're actively using - following JIT principle
 */

/**
 * Re-export FilterState for convenient imports
 */
export type { FilterState } from "./filters";

/**
 * Source documentation reference
 */
export interface Source {
  organization: string;
  title: string;
  url?: string;
  date?: string;
  type: string; // Now accepts any string - use SOURCE_TYPE_REGISTRY for valid types
}

/**
 * Image with attribution information
 */
export interface ImageWithAttribution {
  url: string;
  credit: string; // Photographer, organization, or source name
  license?: string; // e.g., "CC BY-SA 4.0", "Fair Use", "Public Domain"
  sourceUrl?: string; // Link to original source
  date?: string; // When photo was taken
  description?: string; // Additional context about the image
}

/**
 * Heritage site (MVP simplified schema)
 *
 * Islamic Calendar Dates:
 * - yearBuiltIslamic and dateDestroyedIslamic are manually entered and should be
 *   verified using Islamic calendar conversion tools before data entry
 * - These dates are stored as formatted strings for display purposes
 * - All filtering logic uses Gregorian dates for consistency
 */
export interface Site {
  id: string;
  name: string;
  nameArabic?: string;
  type: string; // Now accepts any string - use SITE_TYPE_REGISTRY for valid types
  yearBuilt: string;
  yearBuiltIslamic?: string; // Manually verified Islamic calendar date
  coordinates: [number, number]; // [latitude, longitude] - Leaflet format
  status: string; // Now accepts any string - use STATUS_REGISTRY for valid statuses

  /**
   * Exact date when the site was destroyed or damaged (ISO date string).
   *
   * Use when the precise destruction date is known from sources.
   * Leave undefined if only a survey/assessment date is available.
   */
  dateDestroyed?: string;

  dateDestroyedIslamic?: string; // Manually verified Islamic calendar date
  lastUpdated: string; // ISO date string - tracks when WE last modified this data row

  /**
   * Survey Date - Date when verification source assessed/surveyed the site (ISO date string).
   *
   * **Purpose:** Archival timestamp for when damage was documented, not when it occurred.
   *
   * **Usage:**
   * - Acts as fallback timeline date when `dateDestroyed` is unknown
   * - Display as "Survey Date" in UI (not "Source Assessment Date")
   * - Used by `getEffectiveDestructionDate()` for timeline positioning
   *
   * **Examples:**
   * - Site destroyed in Oct 2023, surveyed in May 2024 → use `dateDestroyed`
   * - Site damage date unknown, surveyed in Oct 2025 → use `sourceAssessmentDate`
   *
   * **Display Guidelines:**
   * - Tables: Show in "Survey Date" column (separate from destruction date)
   * - Site Detail: Show "Survey Date: [date]" when destruction date is "Unknown"
   * - Timeline: Include dot for survey date (hollow if no destruction date)
   */
  sourceAssessmentDate?: string;

  description: string;
  historicalSignificance: string;
  culturalValue: string;
  verifiedBy: string[];
  images?: {
    before?: ImageWithAttribution;
    after?: ImageWithAttribution;
    satellite?: ImageWithAttribution;
  };
  sources: Source[];

  // Timeline animation enhancements (Phase 2+)
  unescoListed?: boolean;
  artifactCount?: number;
  isUnique?: boolean; // Only one of its kind in Gaza
  religiousSignificance?: boolean;
  communityGatheringPlace?: boolean;
  historicalEvents?: string[];

  // Metadata for grouped collections
  metadata?: {
    isCollection?: boolean;
    estimatedBuildingCount?: string;
    collectionRationale?: string;
  };
}
