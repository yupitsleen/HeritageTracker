/**
 * Imagery Period Type Definitions
 *
 * Defines extensible historical satellite imagery period system.
 * Supports ESRI Wayback archive and custom imagery sources.
 */

/**
 * Unique identifier for imagery period
 */
export type ImageryPeriodId = string;

/**
 * Imagery period configuration
 */
export interface ImageryPeriodConfig {
  /** Unique imagery period identifier */
  id: ImageryPeriodId;

  /** Display label (English) */
  label: string;

  /** Display label (Arabic) */
  labelArabic?: string;

  /** ISO date string (YYYY-MM-DD) or "current" */
  date: string;

  /** Tile URL template */
  url: string;

  /** Maximum zoom level available */
  maxZoom: number;

  /** Minimum zoom level (default: 1) */
  minZoom?: number;

  /** ESRI Wayback release number (if applicable) */
  releaseNum?: number | null;

  /** Display order in UI */
  order: number;

  /** Whether this is the default period */
  isDefault?: boolean;

  /** Whether period is enabled */
  enabled?: boolean;

  /** Description for documentation/tooltips */
  description?: string;

  /** Additional metadata */
  metadata?: {
    /** Resolution in meters/pixel */
    resolution?: number;
    /** Image source */
    source?: string;
    /** Coverage area */
    coverage?: string;
    /** Quality rating 1-5 */
    quality?: number;
  };
}

/**
 * Imagery period category
 */
export type ImageryPeriodCategory =
  | "baseline" // Initial/earliest imagery
  | "pre-conflict" // Before major event
  | "conflict" // During event
  | "post-conflict" // After event
  | "current"; // Latest imagery

/**
 * Extended imagery period with categorization
 */
export interface ExtendedImageryPeriodConfig extends ImageryPeriodConfig {
  /** Period category */
  category: ImageryPeriodCategory;

  /** Related event (if applicable) */
  event?: string;
}
