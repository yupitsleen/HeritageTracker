import { createContext, useContext, useState, useCallback, useEffect, useMemo, type ReactNode } from "react";
import type { LocaleCode, LocaleConfig, TranslationKey, TranslateFunction } from "../types/i18n";
import { getLocaleConfig, getDefaultLocale } from "../config/locales";
import { translate, getLocalizedLabel } from "../i18n";

/**
 * Locale context value
 */
interface LocaleContextValue {
  /** Current locale code */
  locale: LocaleCode;

  /** Current locale configuration */
  localeConfig: LocaleConfig;

  /** Change locale */
  setLocale: (locale: LocaleCode) => void;

  /** Translation function */
  t: TranslateFunction;

  /** Get localized label (with Arabic fallback) */
  getLabel: (labelEn: string, labelAr?: string) => string;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

const LOCALE_STORAGE_KEY = "heritage-tracker-locale";

interface LocaleProviderProps {
  children: ReactNode;
}

/**
 * Locale Provider
 *
 * Manages locale state and provides translation functions.
 * Persists locale preference to localStorage.
 */
export function LocaleProvider({ children }: LocaleProviderProps) {
  // Initialize locale from localStorage or browser language
  const [locale, setLocaleState] = useState<LocaleCode>(() => {
    // Check localStorage first
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored === "en" || stored === "ar") {
      return stored;
    }

    // Check browser language
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith("ar")) {
      return "ar";
    }

    // Default to English
    return getDefaultLocale().code;
  });

  // Get locale configuration
  const localeConfig = useMemo(() => getLocaleConfig(locale), [locale]);

  // Save locale to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);

    // Update HTML lang and dir attributes
    document.documentElement.lang = localeConfig.bcp47;
    document.documentElement.dir = localeConfig.direction;
  }, [locale, localeConfig]);

  // Set locale with validation
  const setLocale = useCallback((newLocale: LocaleCode) => {
    setLocaleState(newLocale);
  }, []);

  // Translation function
  const t: TranslateFunction = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>) => {
      return translate(locale, key, params);
    },
    [locale]
  );

  // Get localized label helper
  const getLabel = useCallback(
    (labelEn: string, labelAr?: string) => {
      return getLocalizedLabel(locale, labelEn, labelAr);
    },
    [locale]
  );

  const value: LocaleContextValue = {
    locale,
    localeConfig,
    setLocale,
    t,
    getLabel,
  };

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

/**
 * Hook to access locale context
 *
 * @throws Error if used outside LocaleProvider
 * @returns Locale context value
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}

/**
 * Hook to get translation function
 *
 * Convenience hook that returns just the translation function.
 *
 * @returns Translation function
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useTranslation(): TranslateFunction {
  const { t } = useLocale();
  return t;
}
