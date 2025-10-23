/**
 * Source Type Registry
 *
 * Central registry for all verification source types. Allows dynamic
 * registration of new source types without code changes.
 *
 * @example
 * ```typescript
 * // Add a new source type:
 * registerSourceType({
 *   id: 'legal-filing',
 *   label: 'Legal Filing',
 *   labelArabic: 'ملف قانوني',
 *   credibilityWeight: 100,
 *   requiresURL: true,
 *   requiresDate: true,
 *   description: 'International court filings and legal documents'
 * });
 * ```
 */

import type { SourceTypeConfig } from '../types/sourceTypes';

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
 *
 * @param config - Source type configuration
 */
export function registerSourceType(config: SourceTypeConfig): void {
  SOURCE_TYPE_REGISTRY[config.id] = config;
}

/**
 * Get all registered source types
 *
 * @returns Array of all source type configurations, sorted by credibility weight
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
 *
 * @param typeId - Source type identifier
 * @returns Source type configuration
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
 *
 * @param typeId - Source type identifier
 * @param locale - Language code ('en' or 'ar')
 * @returns Localized label
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
 *
 * @param typeId - Source type identifier
 * @returns True if type is registered
 */
export function isSourceTypeRegistered(typeId: string): boolean {
  return typeId in SOURCE_TYPE_REGISTRY;
}

/**
 * Get credibility weight for a source type
 *
 * @param typeId - Source type identifier
 * @returns Credibility weight (0-100)
 */
export function getSourceCredibility(typeId: string): number {
  return getSourceTypeConfig(typeId).credibilityWeight;
}

/**
 * Calculate aggregate credibility score for multiple sources
 *
 * Uses weighted average based on credibility weights
 *
 * @param sourceTypes - Array of source type IDs
 * @returns Aggregate credibility score (0-100)
 */
export function calculateSourceCredibility(sourceTypes: string[]): number {
  if (sourceTypes.length === 0) return 0;

  const weights = sourceTypes.map(typeId => getSourceCredibility(typeId));
  const sum = weights.reduce((acc, weight) => acc + weight, 0);

  return Math.round(sum / sourceTypes.length);
}
