/**
 * Site Status Configuration Types
 *
 * Extensible status system for heritage site damage states.
 * Replaces hard-coded enum to allow dynamic status registration.
 */

export interface StatusConfig {
  /** Unique identifier for the status */
  id: string;
  /** Display label in English */
  label: string;
  /** Display label in Arabic (optional) */
  labelArabic?: string;
  /** Severity level (0-100) for ordering and filtering */
  severity: number;
  /** Marker color for map display */
  markerColor: string;
  /** Description of the status */
  description?: string;
}
