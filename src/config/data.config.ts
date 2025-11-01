/**
 * Data Configuration
 *
 * Consolidated registry for all heritage site data schemas:
 * - Site statuses (damage levels)
 * - Site types (mosque, church, archaeological, etc.)
 * - Source types (verification sources)
 * - Verifiers (organizations that verify sites)
 *
 * Provides centralized access to all data configuration with
 * dynamic registration capabilities.
 */

import type { StatusConfig } from '../types/siteStatus';
import type { SiteTypeConfig } from '../types/siteTypes';
import type { SourceTypeConfig } from '../types/sourceTypes';
import type { VerifierConfig } from "../types/verifierTypes";

// ============================================================================
// SITE STATUS REGISTRY
// ============================================================================

/**
 * Site status registry - stores all registered statuses
 */
export const STATUS_REGISTRY: Record<string, StatusConfig> = {
  "destroyed": {
    id: "destroyed",
    label: "Destroyed",
    labelArabic: "مدمر",
    severity: 100,
    markerColor: "red",
    description: "Completely destroyed, no structural integrity remaining"
  },
  "heavily-damaged": {
    id: "heavily-damaged",
    label: "Heavily Damaged",
    labelArabic: "تضررت بشدة",
    severity: 75,
    markerColor: "orange",
    description: "Major structural damage, may not be repairable"
  },
  "looted": {
    id: "looted",
    label: "Looted",
    labelArabic: "منهوب",
    severity: 60,
    markerColor: "purple",
    description: "Artifacts or valuables stolen or removed"
  },
  "damaged": {
    id: "damaged",
    label: "Damaged",
    labelArabic: "تضرر",
    severity: 50,
    markerColor: "yellow",
    description: "Partial damage, repairable with restoration work"
  },
  "abandoned": {
    id: "abandoned",
    label: "Abandoned",
    labelArabic: "مهجور",
    severity: 25,
    markerColor: "gray",
    description: "No longer in use or maintained, but structurally intact"
  },
  "unknown": {
    id: "unknown",
    label: "Unknown",
    labelArabic: "غير معروف",
    severity: 10,
    markerColor: "lightgray",
    description: "Status cannot be verified or is uncertain"
  },
  "unharmed": {
    id: "unharmed",
    label: "Unharmed",
    labelArabic: "سليم",
    severity: 0,
    markerColor: "green",
    description: "No damage, fully intact and preserved"
  },
};

/**
 * Get all registered statuses, sorted by severity (highest first)
 */
export function getStatuses(): StatusConfig[] {
  return Object.values(STATUS_REGISTRY)
    .sort((a, b) => b.severity - a.severity);
}

/**
 * Get status configuration by ID
 *
 * Returns a default configuration if status is not registered,
 * ensuring graceful degradation.
 */
export function getStatusConfig(statusId: string): StatusConfig {
  return STATUS_REGISTRY[statusId] || {
    id: statusId,
    label: statusId,
    severity: 0,
    markerColor: "grey",
    description: "Unknown status"
  };
}

/**
 * Get status label by ID and locale
 */
export function getStatusLabel(statusId: string, locale: string = 'en'): string {
  const config = getStatusConfig(statusId);

  if (locale === 'ar' && config.labelArabic) {
    return config.labelArabic;
  }

  return config.label;
}

/**
 * Get marker color for a status
 */
export function getMarkerColor(statusId: string): string {
  return getStatusConfig(statusId).markerColor;
}

// ============================================================================
// SITE TYPE REGISTRY
// ============================================================================

/**
 * Site type registry - stores all registered site types
 */
export const SITE_TYPE_REGISTRY: Record<string, SiteTypeConfig> = {
  "mosque": {
    id: "mosque",
    label: "Mosque",
    labelArabic: "مسجد",
    icon: "☪",
    description: "Islamic place of worship"
  },
  "church": {
    id: "church",
    label: "Church",
    labelArabic: "كنيسة",
    icon: "✝",
    description: "Christian place of worship"
  },
  "archaeological": {
    id: "archaeological",
    label: "Archaeological Site",
    labelArabic: "موقع أثري",
    icon: "heroicon:MagnifyingGlassIcon",
    description: "Ancient ruins and historical excavation sites"
  },
  "museum": {
    id: "museum",
    label: "Museum",
    labelArabic: "متحف",
    icon: "heroicon:BuildingLibraryIcon",
    description: "Cultural institution housing artifacts"
  },
  "historic-building": {
    id: "historic-building",
    label: "Historic Building",
    labelArabic: "مبنى تاريخي",
    icon: "heroicon:HomeModernIcon",
    description: "Architecturally or historically significant structure"
  },
};

/**
 * Register a new site type dynamically
 */
export function registerSiteType(config: SiteTypeConfig): void {
  SITE_TYPE_REGISTRY[config.id] = config;
}

/**
 * Get all registered site types
 */
export function getSiteTypes(): SiteTypeConfig[] {
  return Object.values(SITE_TYPE_REGISTRY);
}

/**
 * Get site type configuration by ID
 *
 * Returns a default configuration if type is not registered,
 * ensuring graceful degradation.
 */
export function getSiteTypeConfig(typeId: string): SiteTypeConfig {
  return SITE_TYPE_REGISTRY[typeId] || {
    id: typeId,
    label: typeId,
    icon: "📍",
    description: "Unknown site type"
  };
}

/**
 * Get site type label by ID and locale
 */
export function getSiteTypeLabel(typeId: string, locale: string = 'en'): string {
  const config = getSiteTypeConfig(typeId);

  if (locale === 'ar' && config.labelArabic) {
    return config.labelArabic;
  }

  return config.label;
}

/**
 * Check if a site type is registered
 */
export function isSiteTypeRegistered(typeId: string): boolean {
  return typeId in SITE_TYPE_REGISTRY;
}

// ============================================================================
// SOURCE TYPE REGISTRY
// ============================================================================

/**
 * Source type registry - stores all registered source types
 */
export const SOURCE_TYPE_REGISTRY: Record<string, SourceTypeConfig> = {
  "official": {
    id: "official",
    label: "Official Report",
    labelArabic: "تقرير رسمي",
    credibilityWeight: 100,
    requiresURL: true,
    requiresDate: true,
    badgeColor: "#1e40af", // blue-800
    description: "Government or UN official documentation"
  },
  "academic": {
    id: "academic",
    label: "Academic Research",
    labelArabic: "بحث أكاديمي",
    credibilityWeight: 95,
    requiresURL: true,
    requiresDate: true,
    badgeColor: "#7c3aed", // violet-600
    description: "Peer-reviewed academic publications"
  },
  "forensic": {
    id: "forensic",
    label: "Forensic Analysis",
    labelArabic: "تحليل جنائي",
    credibilityWeight: 95,
    requiresURL: true,
    requiresDate: false,
    badgeColor: "#be123c", // rose-700
    description: "Forensic architecture and technical analysis"
  },
  "journalism": {
    id: "journalism",
    label: "Journalism",
    labelArabic: "صحافة",
    credibilityWeight: 80,
    requiresURL: false,
    requiresDate: false,
    badgeColor: "#ea580c", // orange-600
    description: "News reporting and investigative journalism"
  },
  "eyewitness": {
    id: "eyewitness",
    label: "Eyewitness Account",
    labelArabic: "شهادة عيان",
    credibilityWeight: 70,
    requiresURL: false,
    requiresDate: false,
    badgeColor: "#0891b2", // cyan-600
    description: "Direct witness testimony"
  },
  "satellite-analysis": {
    id: "satellite-analysis",
    label: "Satellite Analysis",
    labelArabic: "تحليل الأقمار الصناعية",
    credibilityWeight: 90,
    requiresURL: false,
    requiresDate: false,
    badgeColor: "#059669", // emerald-600
    description: "Satellite imagery analysis and remote sensing"
  },
  "documentation": {
    id: "documentation",
    label: "Documentation",
    labelArabic: "توثيق",
    credibilityWeight: 75,
    requiresURL: false,
    requiresDate: false,
    badgeColor: "#4b5563", // gray-600
    description: "General documentation and photographic evidence"
  },
};

/**
 * Register a new source type dynamically
 */
export function registerSourceType(config: SourceTypeConfig): void {
  SOURCE_TYPE_REGISTRY[config.id] = config;
}

/**
 * Get all registered source types, sorted by credibility weight
 */
export function getSourceTypes(): SourceTypeConfig[] {
  return Object.values(SOURCE_TYPE_REGISTRY)
    .sort((a, b) => b.credibilityWeight - a.credibilityWeight);
}

/**
 * Get source type configuration by ID
 *
 * Returns a default configuration if type is not registered,
 * ensuring graceful degradation.
 */
export function getSourceTypeConfig(typeId: string): SourceTypeConfig {
  return SOURCE_TYPE_REGISTRY[typeId] || {
    id: typeId,
    label: typeId,
    credibilityWeight: 50,
    description: "Unknown source type"
  };
}

/**
 * Get source type label by ID and locale
 */
export function getSourceTypeLabel(typeId: string, locale: string = 'en'): string {
  const config = getSourceTypeConfig(typeId);

  if (locale === 'ar' && config.labelArabic) {
    return config.labelArabic;
  }

  return config.label;
}

/**
 * Check if a source type is registered
 */
export function isSourceTypeRegistered(typeId: string): boolean {
  return typeId in SOURCE_TYPE_REGISTRY;
}

/**
 * Get credibility weight for a source type
 */
export function getSourceCredibility(typeId: string): number {
  return getSourceTypeConfig(typeId).credibilityWeight;
}

/**
 * Calculate aggregate credibility score for multiple sources
 *
 * Uses weighted average based on credibility weights
 */
export function calculateSourceCredibility(sourceTypes: string[]): number {
  if (sourceTypes.length === 0) return 0;

  const weights = sourceTypes.map(typeId => getSourceCredibility(typeId));
  const sum = weights.reduce((acc, weight) => acc + weight, 0);

  return Math.round(sum / sourceTypes.length);
}

// ============================================================================
// VERIFIER REGISTRY
// ============================================================================

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
 */
export function getAllVerifiers(): VerifierConfig[] {
  return Object.values(VERIFIER_REGISTRY);
}

/**
 * Get verifiers by type
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
 */
export function calculateVerifierCredibility(verifierIds: string[]): number {
  if (verifierIds.length === 0) return 0;

  const weights = verifierIds.map((id) => getVerifier(id).credibilityWeight);
  const sum = weights.reduce((acc, weight) => acc + weight, 0);

  return Math.round(sum / verifierIds.length);
}

/**
 * Check if a verifier is registered
 */
export function isVerifierRegistered(verifierId: string): boolean {
  return verifierId in VERIFIER_REGISTRY;
}

/**
 * Get verifier display name with fallback
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
