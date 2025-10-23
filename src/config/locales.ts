import type { LocaleCode, LocaleConfig } from "../types/i18n";

/**
 * Locale configuration registry
 *
 * Defines supported locales and their metadata.
 */
export const LOCALE_REGISTRY: Record<LocaleCode, LocaleConfig> = {
  en: {
    code: "en",
    bcp47: "en-US",
    name: "English",
    nativeName: "English",
    direction: "ltr",
    isDefault: true,
  },
  ar: {
    code: "ar",
    bcp47: "ar-EG",
    name: "Arabic",
    nativeName: "العربية",
    direction: "rtl",
  },
};

/**
 * Get locale configuration by code
 *
 * @param code - Locale code
 * @returns Locale configuration or default (English)
 */
export function getLocaleConfig(code: LocaleCode): LocaleConfig {
  return LOCALE_REGISTRY[code] || LOCALE_REGISTRY.en;
}

/**
 * Get all available locales
 *
 * @returns Array of all locale configurations
 */
export function getAvailableLocales(): LocaleConfig[] {
  return Object.values(LOCALE_REGISTRY);
}

/**
 * Get default locale
 *
 * @returns Default locale configuration (English)
 */
export function getDefaultLocale(): LocaleConfig {
  const defaultLocale = Object.values(LOCALE_REGISTRY).find((locale) => locale.isDefault);
  return defaultLocale || LOCALE_REGISTRY.en;
}

/**
 * Check if a locale is supported
 *
 * @param code - Locale code to check
 * @returns True if locale is registered
 */
export function isLocaleSupported(code: string): code is LocaleCode {
  return code in LOCALE_REGISTRY;
}

/**
 * Get locale codes
 *
 * @returns Array of supported locale codes
 */
export function getLocaleCodes(): LocaleCode[] {
  return Object.keys(LOCALE_REGISTRY) as LocaleCode[];
}
