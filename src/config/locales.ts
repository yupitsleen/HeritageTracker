/**
 * Locale Registry
 *
 * Central registry for locale configurations. Enables dynamic locale
 * registration and management for internationalization (i18n).
 *
 * @example
 * ```typescript
 * // Register a new locale:
 * registerLocale({
 *   code: 'fr',
 *   bcp47: 'fr-FR',
 *   name: 'French',
 *   nativeName: 'Français',
 *   direction: 'ltr'
 * });
 * ```
 */

import type { LocaleCode, LocaleConfig } from "../types/i18n";

/**
 * Locale registry - stores all registered locales
 *
 * Mutable to support dynamic locale registration.
 */
export const LOCALE_REGISTRY: Record<string, LocaleConfig> = {
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
  it: {
    code: "it",
    bcp47: "it-IT",
    name: "Italian",
    nativeName: "Italiano",
    direction: "ltr",
  },
};

// ============================================================================
// CRUD Operations
// ============================================================================

/**
 * Register a new locale
 *
 * @param config - Locale configuration
 *
 * @example
 * ```typescript
 * registerLocale({
 *   code: 'es',
 *   bcp47: 'es-ES',
 *   name: 'Spanish',
 *   nativeName: 'Español',
 *   direction: 'ltr'
 * });
 * ```
 */
export function registerLocale(config: LocaleConfig): void {
  LOCALE_REGISTRY[config.code] = config;
}

/**
 * Get all registered locales
 *
 * @returns Array of all locale configurations
 *
 * @example
 * ```typescript
 * const locales = getAllLocales();
 * locales.forEach(locale => console.log(locale.name));
 * ```
 */
export function getAllLocales(): LocaleConfig[] {
  return Object.values(LOCALE_REGISTRY);
}

/**
 * Get locale configuration by code
 *
 * @param code - Locale code
 * @returns Locale configuration or undefined if not found
 *
 * @example
 * ```typescript
 * const arabic = getLocale('ar');
 * if (arabic) {
 *   console.log(arabic.direction); // 'rtl'
 * }
 * ```
 */
export function getLocale(code: string): LocaleConfig | undefined {
  return LOCALE_REGISTRY[code];
}

/**
 * Update locale configuration
 *
 * @param code - Locale code
 * @param updates - Partial configuration to update
 *
 * @example
 * ```typescript
 * updateLocale('ar', { bcp47: 'ar-PS' }); // Palestinian Arabic
 * ```
 */
export function updateLocale(
  code: string,
  updates: Partial<LocaleConfig>
): void {
  const existing = LOCALE_REGISTRY[code];
  if (!existing) {
    throw new Error(`Locale '${code}' not found in registry`);
  }

  LOCALE_REGISTRY[code] = {
    ...existing,
    ...updates,
    code: existing.code, // Prevent code from being changed
  };
}

/**
 * Remove locale from registry
 *
 * @param code - Locale code
 * @returns True if locale was removed, false if not found
 *
 * @example
 * ```typescript
 * removeLocale('test-locale');
 * ```
 */
export function removeLocale(code: string): boolean {
  if (code in LOCALE_REGISTRY) {
    delete LOCALE_REGISTRY[code];
    return true;
  }
  return false;
}

// ============================================================================
// Query Functions
// ============================================================================

/**
 * Get available locales (alias for getAllLocales)
 *
 * @returns Array of all locale configurations
 */
export function getAvailableLocales(): LocaleConfig[] {
  return getAllLocales();
}

/**
 * Get locale configuration by code (with fallback to English)
 *
 * @param code - Locale code
 * @returns Locale configuration or default (English)
 *
 * @example
 * ```typescript
 * const config = getLocaleConfig('ar');
 * ```
 */
export function getLocaleConfig(code: LocaleCode): LocaleConfig {
  return LOCALE_REGISTRY[code] || LOCALE_REGISTRY.en;
}

/**
 * Get default locale
 *
 * @returns Default locale configuration (first with isDefault: true)
 *
 * @example
 * ```typescript
 * const defaultLang = getDefaultLocale(); // English
 * ```
 */
export function getDefaultLocale(): LocaleConfig {
  const defaultLocale = Object.values(LOCALE_REGISTRY).find(
    (locale) => locale.isDefault
  );
  return defaultLocale || LOCALE_REGISTRY.en;
}

/**
 * Check if a locale is supported
 *
 * @param code - Locale code to check
 * @returns True if locale is registered
 *
 * @example
 * ```typescript
 * if (isLocaleSupported('ar')) {
 *   // Arabic is supported
 * }
 * ```
 */
export function isLocaleSupported(code: string): code is LocaleCode {
  return code in LOCALE_REGISTRY;
}

/**
 * Get all locale codes
 *
 * @returns Array of supported locale codes
 *
 * @example
 * ```typescript
 * const codes = getLocaleCodes(); // ['en', 'ar']
 * ```
 */
export function getLocaleCodes(): LocaleCode[] {
  return Object.keys(LOCALE_REGISTRY) as LocaleCode[];
}

/**
 * Get locale name (localized)
 *
 * @param code - Locale code
 * @param useNative - Use native name instead of English name
 * @returns Locale name or code if not found
 *
 * @example
 * ```typescript
 * getLocaleName('ar'); // 'Arabic'
 * getLocaleName('ar', true); // 'العربية'
 * ```
 */
export function getLocaleName(code: string, useNative = false): string {
  const locale = getLocale(code);
  if (!locale) return code;

  return useNative ? locale.nativeName : locale.name;
}

/**
 * Get locales by text direction
 *
 * @param direction - Text direction ('ltr' or 'rtl')
 * @returns Array of locales with the specified direction
 *
 * @example
 * ```typescript
 * const rtlLocales = getLocalesByDirection('rtl'); // [ar]
 * const ltrLocales = getLocalesByDirection('ltr'); // [en]
 * ```
 */
export function getLocalesByDirection(
  direction: "ltr" | "rtl"
): LocaleConfig[] {
  return getAllLocales().filter((locale) => locale.direction === direction);
}

/**
 * Check if locale uses RTL (right-to-left) direction
 *
 * @param code - Locale code
 * @returns True if locale uses RTL direction
 *
 * @example
 * ```typescript
 * if (isRTLLocale('ar')) {
 *   // Apply RTL styles
 * }
 * ```
 */
export function isRTLLocale(code: string): boolean {
  const locale = getLocale(code);
  return locale?.direction === "rtl";
}

// ============================================================================
// Backward Compatibility
// ============================================================================

/**
 * @deprecated Use getAllLocales() instead
 * Exported for backward compatibility with existing code
 */
export const SUPPORTED_LOCALES = getAllLocales();

/**
 * @deprecated Use getDefaultLocale() instead
 * Exported for backward compatibility
 */
export const DEFAULT_LOCALE = LOCALE_REGISTRY.en;
