/**
 * Site Type Configuration Types
 *
 * Extensible type system for heritage sites.
 * Replaces hard-coded enum to allow dynamic site type registration.
 */

export interface SiteTypeConfig {
  /** Unique identifier for the site type */
  id: string;
  /** Display label in English */
  label: string;
  /** Display label in Arabic (optional) */
  labelArabic?: string;
  /** Icon representation (unicode symbol or heroicon identifier) */
  icon: string;
  /** Description of the site type */
  description?: string;
}
