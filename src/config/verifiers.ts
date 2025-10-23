import type { VerifierConfig } from "../types/verifierTypes";

/**
 * Registry of heritage site verifier organizations
 *
 * Defines credibility scoring and metadata for organizations that verify
 * cultural heritage destruction. Used for source validation and UI display.
 */
export const VERIFIER_REGISTRY: Record<string, VerifierConfig> = {
  UNESCO: {
    id: "UNESCO",
    label: "UNESCO",
    labelArabic: "اليونسكو",
    credibilityWeight: 100,
    type: "international",
    websiteURL: "https://www.unesco.org",
    description:
      "United Nations Educational, Scientific and Cultural Organization - leading international authority on cultural heritage protection",
    badgeColor: "#0077be",
    countryCode: "UN",
  },
  "Heritage for Peace": {
    id: "Heritage for Peace",
    label: "Heritage for Peace",
    labelArabic: "التراث من أجل السلام",
    credibilityWeight: 95,
    type: "ngo",
    websiteURL: "https://www.heritageforpeace.org",
    description:
      "International NGO dedicated to protecting cultural heritage in conflict zones, specialized in Middle East documentation",
    badgeColor: "#2d5f3f",
  },
  "Forensic Architecture": {
    id: "Forensic Architecture",
    label: "Forensic Architecture",
    labelArabic: "العمارة الجنائية",
    credibilityWeight: 98,
    type: "academic",
    websiteURL: "https://forensic-architecture.org",
    description:
      "Research agency based at Goldsmiths, University of London, using spatial and media analysis to investigate human rights violations",
    badgeColor: "#1a1a1a",
    countryCode: "GB",
  },
  "ICOM UK": {
    id: "ICOM UK",
    label: "ICOM UK",
    labelArabic: "المجلس الدولي للمتاحف - المملكة المتحدة",
    credibilityWeight: 90,
    type: "international",
    websiteURL: "https://uk.icom.museum",
    description:
      "International Council of Museums UK - professional organization for museum and cultural heritage preservation",
    badgeColor: "#003d7a",
    countryCode: "GB",
  },
  "International Council on Archives": {
    id: "International Council on Archives",
    label: "International Council on Archives",
    labelArabic: "المجلس الدولي للأرشيف",
    credibilityWeight: 90,
    type: "international",
    websiteURL: "https://www.ica.org",
    description:
      "Professional organization dedicated to the preservation and protection of archives worldwide",
    badgeColor: "#4a5568",
    countryCode: "FR",
  },
  "British Council": {
    id: "British Council",
    label: "British Council",
    labelArabic: "المجلس الثقافي البريطاني",
    credibilityWeight: 85,
    type: "governmental",
    websiteURL: "https://www.britishcouncil.org",
    description:
      "UK's international organization for cultural relations and educational opportunities, supports cultural heritage preservation",
    badgeColor: "#e01e84",
    countryCode: "GB",
  },
  "Aliph Foundation": {
    id: "Aliph Foundation",
    label: "Aliph Foundation",
    labelArabic: "مؤسسة أليف",
    credibilityWeight: 88,
    type: "ngo",
    websiteURL: "https://www.aliph-foundation.org",
    description:
      "International foundation dedicated to protecting cultural heritage in conflict zones",
    badgeColor: "#8b4513",
    countryCode: "CH",
  },
  "Ministry of Tourism and Antiquities": {
    id: "Ministry of Tourism and Antiquities",
    label: "Ministry of Tourism and Antiquities",
    labelArabic: "وزارة السياحة والآثار",
    credibilityWeight: 92,
    type: "governmental",
    websiteURL: "https://www.mot.gov.ps",
    description:
      "Palestinian Ministry responsible for archaeological sites and cultural heritage protection",
    badgeColor: "#006838",
    countryCode: "PS",
  },
  "Centre for Cultural Heritage Preservation": {
    id: "Centre for Cultural Heritage Preservation",
    label: "Centre for Cultural Heritage Preservation",
    labelArabic: "مركز الحفاظ على التراث الثقافي",
    credibilityWeight: 87,
    type: "ngo",
    websiteURL: "",
    description:
      "Palestinian organization focused on documentation and preservation of cultural heritage",
    badgeColor: "#2c5f2d",
    countryCode: "PS",
  },
  "PEN America": {
    id: "PEN America",
    label: "PEN America",
    labelArabic: "بن أمريكا",
    credibilityWeight: 85,
    type: "ngo",
    websiteURL: "https://pen.org",
    description:
      "Organization championing freedom of expression and cultural preservation, documents cultural site destruction",
    badgeColor: "#ff6b35",
    countryCode: "US",
  },
  "Al-Israa University": {
    id: "Al-Israa University",
    label: "Al-Israa University",
    labelArabic: "جامعة الإسراء",
    credibilityWeight: 80,
    type: "academic",
    websiteURL: "https://www.alisra.ps",
    description: "Palestinian university in Gaza with archaeological and heritage research programs",
    badgeColor: "#1e3a8a",
    countryCode: "PS",
  },
  "Commonwealth War Graves Commission": {
    id: "Commonwealth War Graves Commission",
    label: "Commonwealth War Graves Commission",
    labelArabic: "لجنة مقابر الحرب للكومنولث",
    credibilityWeight: 93,
    type: "international",
    websiteURL: "https://www.cwgc.org",
    description:
      "Organization responsible for maintaining Commonwealth war graves and memorials worldwide",
    badgeColor: "#003d7a",
    countryCode: "GB",
  },
};

/**
 * Get verifier configuration by ID
 *
 * @param verifierId - Verifier identifier
 * @returns Verifier configuration or default fallback
 */
export function getVerifier(verifierId: string): VerifierConfig {
  return (
    VERIFIER_REGISTRY[verifierId] || {
      id: verifierId,
      label: verifierId,
      credibilityWeight: 50,
      type: "documentation",
      description: "Unknown verifier - using default configuration",
      badgeColor: "#718096",
    }
  );
}

/**
 * Get all registered verifiers
 *
 * @returns Array of all verifier configurations
 */
export function getAllVerifiers(): VerifierConfig[] {
  return Object.values(VERIFIER_REGISTRY);
}

/**
 * Get verifiers by type
 *
 * @param type - Organization type filter
 * @returns Array of verifiers matching the type
 */
export function getVerifiersByType(
  type: VerifierConfig["type"]
): VerifierConfig[] {
  return getAllVerifiers().filter((verifier) => verifier.type === type);
}

/**
 * Calculate average credibility from multiple verifiers
 *
 * Uses weighted average of verifier credibility scores.
 *
 * @param verifierIds - Array of verifier IDs
 * @returns Average credibility score (0-100) or 0 if no verifiers
 */
export function calculateVerifierCredibility(verifierIds: string[]): number {
  if (verifierIds.length === 0) return 0;

  const weights = verifierIds.map((id) => getVerifier(id).credibilityWeight);
  const sum = weights.reduce((acc, weight) => acc + weight, 0);

  return Math.round(sum / verifierIds.length);
}

/**
 * Check if a verifier is registered
 *
 * @param verifierId - Verifier identifier to check
 * @returns True if verifier exists in registry
 */
export function isVerifierRegistered(verifierId: string): boolean {
  return verifierId in VERIFIER_REGISTRY;
}

/**
 * Get verifier display name with fallback
 *
 * @param verifierId - Verifier identifier
 * @param locale - Locale for label (default: "en")
 * @returns Display name in requested locale
 */
export function getVerifierLabel(
  verifierId: string,
  locale: string = "en"
): string {
  const verifier = getVerifier(verifierId);

  if (locale === "ar" && verifier.labelArabic) {
    return verifier.labelArabic;
  }

  return verifier.label;
}
