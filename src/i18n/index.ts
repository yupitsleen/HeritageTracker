import type { LocaleCode, Translations, TranslationKey } from "../types/i18n";
import { en } from "./en";
import { ar } from "./ar";
import { it } from "./it";
import { logger } from "../utils/logger";

/**
 * Translation registry
 *
 * Maps locale codes to their translations.
 */
export const TRANSLATIONS: Record<LocaleCode, Translations> = {
  en,
  ar,
  it,
};

/**
 * Get translations for a specific locale
 *
 * @param locale - Locale code
 * @returns Translations object for the locale
 */
export function getTranslations(locale: LocaleCode): Translations {
  return TRANSLATIONS[locale] || TRANSLATIONS.en;
}

/**
 * Get a translation by key
 *
 * Supports dot notation (e.g., "common.loading") and parameter interpolation.
 *
 * @param locale - Locale code
 * @param key - Translation key in dot notation
 * @param params - Optional parameters for interpolation
 * @returns Translated string
 */
export function translate(
  locale: LocaleCode,
  key: TranslationKey,
  params?: Record<string, string | number>
): string {
  const translations = getTranslations(locale);

  // Split key by dots to navigate nested object
  const keys = key.split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let value: any = translations;

  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) {
      logger.warn(`Translation key not found: ${key} (locale: ${locale})`);
      return key;
    }
  }

  // If no parameters, return the string
  if (!params || typeof value !== "string") {
    return value as string;
  }

  // Replace parameters in format {{paramName}}
  return value.replace(/\{\{(\w+)\}\}/g, (match, paramName) => {
    const replacement = params[paramName];
    return replacement !== undefined ? String(replacement) : match;
  });
}

/**
 * Check if a translation exists
 *
 * @param locale - Locale code
 * @param key - Translation key
 * @returns True if translation exists
 */
export function hasTranslation(locale: LocaleCode, key: TranslationKey): boolean {
  const translations = getTranslations(locale);
  const keys = key.split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let value: any = translations;

  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) {
      return false;
    }
  }

  return true;
}

/**
 * Get translated label with fallback to English
 *
 * Useful for registry items that have labelArabic fields.
 *
 * @param locale - Locale code
 * @param labelEn - English label
 * @param labelAr - Optional Arabic label
 * @returns Translated label
 */
export function getLocalizedLabel(
  locale: LocaleCode,
  labelEn: string,
  labelAr?: string
): string {
  if (locale === "ar" && labelAr) {
    return labelAr;
  }
  return labelEn;
}
