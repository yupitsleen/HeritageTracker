/**
 * Source type configuration types for Heritage Tracker
 *
 * Defines extensible source types for verification and documentation.
 */

/**
 * Configuration for a source type
 */
export interface SourceTypeConfig {
  /** Unique identifier (e.g., 'official', 'academic', 'forensic') */
  id: string;

  /** Display label in English */
  label: string;

  /** Arabic label for internationalization */
  labelArabic?: string;

  /** Credibility weight (0-100) for trust scoring */
  credibilityWeight: number;

  /** Whether this source type requires a URL */
  requiresURL?: boolean;

  /** Whether this source type requires a date */
  requiresDate?: boolean;

  /** Human-readable description */
  description?: string;

  /** Badge color for UI display (CSS color value) */
  badgeColor?: string;
}
