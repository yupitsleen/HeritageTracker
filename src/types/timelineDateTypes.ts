/**
 * Timeline Date Configuration Type Definitions
 *
 * Defines extensible timeline date range configuration.
 */

/**
 * Timeline date range configuration
 */
export interface TimelineDateConfig {
  /** Unique configuration identifier */
  id: string;

  /** Display label (English) */
  label: string;

  /** Display label (Arabic) */
  labelArabic?: string;

  /** Whether this is the default configuration */
  isDefault?: boolean;

  /** Fallback start date (when no events exist) */
  fallbackStartDate: Date;

  /** Fallback end date (when no events exist) */
  fallbackEndDate: Date;

  /** Minimum allowed date (timeline lower bound) */
  minDate?: Date;

  /** Maximum allowed date (timeline upper bound) */
  maxDate?: Date;

  /** Description for documentation */
  description?: string;

  /** Configuration metadata */
  metadata?: {
    author?: string;
    version?: string;
    notes?: string;
  };
}
