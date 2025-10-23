/**
 * Configuration for heritage site verifier organizations
 *
 * Defines metadata and credibility scoring for organizations that verify
 * cultural heritage destruction in Gaza.
 */
export interface VerifierConfig {
  /** Unique identifier for the verifier */
  id: string;

  /** Display name in English */
  label: string;

  /** Display name in Arabic */
  labelArabic?: string;

  /** Credibility weight (0-100) for source scoring */
  credibilityWeight: number;

  /** Organization type category */
  type: "international" | "governmental" | "academic" | "ngo" | "documentation";

  /** Official website URL */
  websiteURL?: string;

  /** Short description of the organization */
  description?: string;

  /** Badge color for UI display (hex) */
  badgeColor?: string;

  /** ISO 3166-1 alpha-2 country code (if applicable) */
  countryCode?: string;
}
