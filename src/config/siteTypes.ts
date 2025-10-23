/**
 * Site Type Registry
 *
 * Central registry for all site types. Allows dynamic registration
 * of new site types without code changes.
 *
 * @example
 * ```typescript
 * // Add a new site type:
 * registerSiteType({
 *   id: 'library',
 *   label: 'Library',
 *   labelArabic: 'مكتبة',
 *   icon: '📚',
 *   description: 'Repository of books and manuscripts'
 * });
 * ```
 */

import type { SiteTypeConfig } from '../types/siteTypes';

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
 *
 * @param config - Site type configuration
 */
export function registerSiteType(config: SiteTypeConfig): void {
  SITE_TYPE_REGISTRY[config.id] = config;
}

/**
 * Get all registered site types
 *
 * @returns Array of all site type configurations
 */
export function getSiteTypes(): SiteTypeConfig[] {
  return Object.values(SITE_TYPE_REGISTRY);
}

/**
 * Get site type configuration by ID
 *
 * Returns a default configuration if type is not registered,
 * ensuring graceful degradation.
 *
 * @param typeId - Site type identifier
 * @returns Site type configuration
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
 *
 * @param typeId - Site type identifier
 * @param locale - Language code ('en' or 'ar')
 * @returns Localized label
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
 *
 * @param typeId - Site type identifier
 * @returns True if type is registered
 */
export function isSiteTypeRegistered(typeId: string): boolean {
  return typeId in SITE_TYPE_REGISTRY;
}
