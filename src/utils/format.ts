/**
 * Formatting utility functions
 */

import type { TranslationKey } from "../types/i18n";

/**
 * Formats kebab-case or snake_case strings to Title Case
 * @example formatLabel("heavily-damaged") => "Heavily Damaged"
 * @example formatLabel("all") => "All"
 */
export const formatLabel = (value: string): string => {
  return value
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Formats a date string to compact format (short month, day, 2-digit year)
 * @param dateString - ISO date string or null/undefined
 * @param locale - BCP 47 language tag (e.g., 'en-US', 'ar-EG'). Defaults to 'en-US'
 * @example formatDateCompact("2023-12-07") => "Dec 7, 23"
 * @example formatDateCompact("2023-12-07", "ar-EG") => "٧ ديسمبر ٢٣"
 * @example formatDateCompact(null) => "N/A"
 */
export const formatDateCompact = (
  dateString: string | null | undefined,
  locale: string = "en-US"
): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "2-digit",
  });
};

/**
 * Formats a date string to standard format (short month, day, full year)
 * @param dateString - ISO date string or null/undefined
 * @param locale - BCP 47 language tag (e.g., 'en-US', 'ar-EG'). Defaults to 'en-US'
 * @example formatDateStandard("2023-12-07") => "Dec 7, 2023"
 * @example formatDateStandard("2023-12-07", "ar-EG") => "٧ ديسمبر ٢٠٢٣"
 * @example formatDateStandard(null) => "N/A"
 */
export const formatDateStandard = (
  dateString: string | null | undefined,
  locale: string = "en-US"
): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Formats a date string to long format (full month name, day, full year)
 * @param dateString - ISO date string or null/undefined
 * @param locale - BCP 47 language tag (e.g., 'en-US', 'ar-EG'). Defaults to 'en-US'
 * @example formatDateLong("2023-12-07") => "December 7, 2023"
 * @example formatDateLong("2023-12-07", "ar-EG") => "٧ ديسمبر ٢٠٢٣"
 * @example formatDateLong(null) => "N/A"
 */
export const formatDateLong = (
  dateString: string | null | undefined,
  locale: string = "en-US"
): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Converts kebab-case strings to camelCase for i18n translation keys.
 * Used to map data values (site.status, site.type) to translation key format.
 *
 * @param value - Kebab-case string from data
 * @returns CamelCase string for translation key lookup
 *
 * @example
 * toTranslationKey("heavily-damaged") // => "heavilyDamaged"
 * toTranslationKey("archaeological-site") // => "archaeologicalSite"
 * toTranslationKey("mosque") // => "mosque" (unchanged if no hyphens)
 */
export const toTranslationKey = (value: string): string => {
  return value.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
};

/**
 * Translates a site status value to its localized string.
 * Handles kebab-case to camelCase conversion and type casting.
 *
 * @param translate - Translation function from useTranslation hook
 * @param status - Site status value (e.g., "heavily-damaged", "destroyed")
 * @returns Translated status string
 *
 * @example
 * translateStatus(translate, "heavily-damaged") // => "Heavily Damaged" (en) or "تضرر بشدة" (ar)
 * translateStatus(translate, "destroyed") // => "Destroyed" (en) or "مدمر" (ar)
 */
export const translateStatus = (
  translate: (key: TranslationKey) => string,
  status: string
): string => {
  return translate(`siteStatus.${toTranslationKey(status)}` as TranslationKey);
};

/**
 * Translates a site type value to its localized string.
 * Handles kebab-case to camelCase conversion and type casting.
 *
 * @param translate - Translation function from useTranslation hook
 * @param type - Site type value (e.g., "archaeological-site", "mosque")
 * @returns Translated type string
 *
 * @example
 * translateSiteType(translate, "archaeological-site") // => "Archaeological Site" (en) or "موقع أثري" (ar)
 * translateSiteType(translate, "mosque") // => "Mosque" (en) or "مسجد" (ar)
 */
export const translateSiteType = (
  translate: (key: TranslationKey) => string,
  type: string
): string => {
  return translate(`siteTypes.${toTranslationKey(type)}` as TranslationKey);
};
