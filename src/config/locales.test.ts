import { describe, it, expect, beforeEach } from "vitest";
import {
  LOCALE_REGISTRY,
  registerLocale,
  getAllLocales,
  getLocale,
  updateLocale,
  removeLocale,
  getLocaleConfig,
  getAvailableLocales,
  getDefaultLocale,
  isLocaleSupported,
  getLocaleCodes,
  getLocaleName,
  getLocalesByDirection,
  isRTLLocale,
} from "./locales";
import type { LocaleConfig } from "../types/i18n";

describe("LOCALE_REGISTRY", () => {
  it("contains English and Arabic locales", () => {
    expect(LOCALE_REGISTRY.en).toBeDefined();
    expect(LOCALE_REGISTRY.ar).toBeDefined();
  });

  it("has valid structure for all locales", () => {
    Object.values(LOCALE_REGISTRY).forEach((locale) => {
      expect(locale.code).toBeTruthy();
      expect(locale.bcp47).toBeTruthy();
      expect(locale.name).toBeTruthy();
      expect(locale.nativeName).toBeTruthy();
      expect(locale.direction).toMatch(/^(ltr|rtl)$/);
    });
  });

  it("has English as default locale", () => {
    expect(LOCALE_REGISTRY.en.isDefault).toBe(true);
  });

  it("has correct BCP 47 tags", () => {
    expect(LOCALE_REGISTRY.en.bcp47).toBe("en-US");
    expect(LOCALE_REGISTRY.ar.bcp47).toBe("ar-EG");
  });

  it("has correct text directions", () => {
    expect(LOCALE_REGISTRY.en.direction).toBe("ltr");
    expect(LOCALE_REGISTRY.ar.direction).toBe("rtl");
  });

  it("has correct native names", () => {
    expect(LOCALE_REGISTRY.en.nativeName).toBe("English");
    expect(LOCALE_REGISTRY.ar.nativeName).toBe("العربية");
  });
});

describe("getLocaleConfig", () => {
  it("returns correct config for English", () => {
    const config = getLocaleConfig("en");
    expect(config.code).toBe("en");
    expect(config.direction).toBe("ltr");
  });

  it("returns correct config for Arabic", () => {
    const config = getLocaleConfig("ar");
    expect(config.code).toBe("ar");
    expect(config.direction).toBe("rtl");
  });

  it("falls back to English for invalid locale", () => {
    const config = getLocaleConfig("invalid" as unknown as LocaleCode);
    expect(config.code).toBe("en");
  });
});

describe("getAvailableLocales", () => {
  it("returns all 2 locales", () => {
    const locales = getAvailableLocales();
    expect(locales).toHaveLength(2);
  });

  it("returns array of LocaleConfig objects", () => {
    const locales = getAvailableLocales();
    locales.forEach((locale) => {
      expect(locale).toHaveProperty("code");
      expect(locale).toHaveProperty("bcp47");
      expect(locale).toHaveProperty("name");
      expect(locale).toHaveProperty("nativeName");
      expect(locale).toHaveProperty("direction");
    });
  });

  it("includes both English and Arabic", () => {
    const locales = getAvailableLocales();
    const codes = locales.map((l) => l.code);
    expect(codes).toContain("en");
    expect(codes).toContain("ar");
  });
});

describe("getDefaultLocale", () => {
  it("returns English as default", () => {
    const defaultLocale = getDefaultLocale();
    expect(defaultLocale.code).toBe("en");
    expect(defaultLocale.isDefault).toBe(true);
  });

  it("returns valid locale config", () => {
    const defaultLocale = getDefaultLocale();
    expect(defaultLocale.bcp47).toBe("en-US");
    expect(defaultLocale.direction).toBe("ltr");
  });
});

describe("isLocaleSupported", () => {
  it("returns true for supported locales", () => {
    expect(isLocaleSupported("en")).toBe(true);
    expect(isLocaleSupported("ar")).toBe(true);
  });

  it("returns false for unsupported locales", () => {
    expect(isLocaleSupported("fr")).toBe(false);
    expect(isLocaleSupported("es")).toBe(false);
    expect(isLocaleSupported("invalid")).toBe(false);
  });

  it("is case-sensitive", () => {
    expect(isLocaleSupported("EN")).toBe(false);
    expect(isLocaleSupported("AR")).toBe(false);
  });
});

describe("getLocaleCodes", () => {
  it("returns all locale codes", () => {
    const codes = getLocaleCodes();
    expect(codes).toEqual(["en", "ar"]);
  });

  it("returns only string values", () => {
    const codes = getLocaleCodes();
    codes.forEach((code) => {
      expect(typeof code).toBe("string");
    });
  });
});

describe("Locale Configuration Consistency", () => {
  it("all locales have unique codes", () => {
    const codes = getLocaleCodes();
    const uniqueCodes = [...new Set(codes)];
    expect(codes.length).toBe(uniqueCodes.length);
  });

  it("all locales have unique BCP 47 tags", () => {
    const bcp47Tags = getAvailableLocales().map((l) => l.bcp47);
    const uniqueTags = [...new Set(bcp47Tags)];
    expect(bcp47Tags.length).toBe(uniqueTags.length);
  });

  it("exactly one locale is marked as default", () => {
    const defaults = getAvailableLocales().filter((l) => l.isDefault);
    expect(defaults).toHaveLength(1);
  });
});

// ============================================================================
// CRUD Operations Tests
// ============================================================================

describe("registerLocale", () => {
  const testLocale: LocaleConfig = {
    code: "fr",
    bcp47: "fr-FR",
    name: "French",
    nativeName: "Français",
    direction: "ltr",
  };

  beforeEach(() => {
    // Clean up test locale if it exists
    if (LOCALE_REGISTRY.fr) {
      delete LOCALE_REGISTRY.fr;
    }
  });

  it("registers a new locale", () => {
    registerLocale(testLocale);
    expect(LOCALE_REGISTRY.fr).toBeDefined();
    expect(LOCALE_REGISTRY.fr.name).toBe("French");
  });

  it("makes locale immediately available", () => {
    registerLocale(testLocale);
    expect(isLocaleSupported("fr")).toBe(true);
  });

  it("can override existing locale", () => {
    registerLocale(testLocale);
    const updated = { ...testLocale, name: "French (France)" };
    registerLocale(updated);
    expect(LOCALE_REGISTRY.fr.name).toBe("French (France)");
  });
});

describe("getAllLocales", () => {
  it("returns all registered locales", () => {
    const locales = getAllLocales();
    expect(locales.length).toBeGreaterThanOrEqual(2);
  });

  it("includes default locales (en, ar)", () => {
    const locales = getAllLocales();
    const codes = locales.map((l) => l.code);
    expect(codes).toContain("en");
    expect(codes).toContain("ar");
  });

  it("returns array of LocaleConfig objects", () => {
    const locales = getAllLocales();
    locales.forEach((locale) => {
      expect(locale).toHaveProperty("code");
      expect(locale).toHaveProperty("bcp47");
      expect(locale).toHaveProperty("direction");
    });
  });
});

describe("getLocale", () => {
  it("returns locale config for valid code", () => {
    const english = getLocale("en");
    expect(english).toBeDefined();
    expect(english?.code).toBe("en");
  });

  it("returns undefined for invalid code", () => {
    const invalid = getLocale("invalid");
    expect(invalid).toBeUndefined();
  });

  it("is case-sensitive", () => {
    const uppercase = getLocale("EN");
    expect(uppercase).toBeUndefined();
  });
});

describe("updateLocale", () => {
  beforeEach(() => {
    // Ensure clean state
    if (!LOCALE_REGISTRY.en) {
      registerLocale({
        code: "en",
        bcp47: "en-US",
        name: "English",
        nativeName: "English",
        direction: "ltr",
        isDefault: true,
      });
    }
  });

  it("updates locale configuration", () => {
    updateLocale("en", { name: "English (Updated)" });
    expect(LOCALE_REGISTRY.en.name).toBe("English (Updated)");
  });

  it("preserves other fields when updating", () => {
    const original = { ...LOCALE_REGISTRY.en };
    updateLocale("en", { name: "English (Updated)" });
    expect(LOCALE_REGISTRY.en.bcp47).toBe(original.bcp47);
    expect(LOCALE_REGISTRY.en.direction).toBe(original.direction);
  });

  it("prevents code from being changed", () => {
    updateLocale("en", { code: "en-modified" } as Partial<LocaleConfig>);
    expect(LOCALE_REGISTRY.en.code).toBe("en");
  });

  it("throws error for non-existent locale", () => {
    expect(() => {
      updateLocale("nonexistent", { name: "Test" });
    }).toThrow("Locale 'nonexistent' not found");
  });

  it("can update BCP 47 tag", () => {
    updateLocale("en", { bcp47: "en-GB" });
    expect(LOCALE_REGISTRY.en.bcp47).toBe("en-GB");
  });
});

describe("removeLocale", () => {
  const testLocale: LocaleConfig = {
    code: "test",
    bcp47: "test-TEST",
    name: "Test",
    nativeName: "Test",
    direction: "ltr",
  };

  beforeEach(() => {
    registerLocale(testLocale);
  });

  it("removes locale from registry", () => {
    expect(LOCALE_REGISTRY.test).toBeDefined();
    removeLocale("test");
    expect(LOCALE_REGISTRY.test).toBeUndefined();
  });

  it("returns true when locale is removed", () => {
    const result = removeLocale("test");
    expect(result).toBe(true);
  });

  it("returns false when locale does not exist", () => {
    const result = removeLocale("nonexistent");
    expect(result).toBe(false);
  });

  it("makes locale unavailable after removal", () => {
    removeLocale("test");
    expect(isLocaleSupported("test")).toBe(false);
  });
});

// ============================================================================
// Query Function Tests
// ============================================================================

describe("getLocaleName", () => {
  beforeEach(() => {
    // Reset English name in case previous tests modified it
    if (LOCALE_REGISTRY.en && LOCALE_REGISTRY.en.name !== "English") {
      LOCALE_REGISTRY.en.name = "English";
    }
    if (LOCALE_REGISTRY.en && LOCALE_REGISTRY.en.bcp47 !== "en-US") {
      LOCALE_REGISTRY.en.bcp47 = "en-US";
    }
  });

  it("returns English name by default", () => {
    expect(getLocaleName("en")).toBe("English");
    expect(getLocaleName("ar")).toBe("Arabic");
  });

  it("returns native name when requested", () => {
    expect(getLocaleName("en", true)).toBe("English");
    expect(getLocaleName("ar", true)).toBe("العربية");
  });

  it("returns code for non-existent locale", () => {
    expect(getLocaleName("invalid")).toBe("invalid");
    expect(getLocaleName("invalid", true)).toBe("invalid");
  });
});

describe("getLocalesByDirection", () => {
  it("returns LTR locales", () => {
    const ltrLocales = getLocalesByDirection("ltr");
    expect(ltrLocales.length).toBeGreaterThan(0);
    ltrLocales.forEach((locale) => {
      expect(locale.direction).toBe("ltr");
    });
  });

  it("returns RTL locales", () => {
    const rtlLocales = getLocalesByDirection("rtl");
    expect(rtlLocales.length).toBeGreaterThan(0);
    rtlLocales.forEach((locale) => {
      expect(locale.direction).toBe("rtl");
    });
  });

  it("English is LTR", () => {
    const ltrLocales = getLocalesByDirection("ltr");
    const codes = ltrLocales.map((l) => l.code);
    expect(codes).toContain("en");
  });

  it("Arabic is RTL", () => {
    const rtlLocales = getLocalesByDirection("rtl");
    const codes = rtlLocales.map((l) => l.code);
    expect(codes).toContain("ar");
  });
});

describe("isRTLLocale", () => {
  it("returns true for RTL locales", () => {
    expect(isRTLLocale("ar")).toBe(true);
  });

  it("returns false for LTR locales", () => {
    expect(isRTLLocale("en")).toBe(false);
  });

  it("returns false for non-existent locales", () => {
    expect(isRTLLocale("invalid")).toBe(false);
  });
});

// ============================================================================
// Integration Tests
// ============================================================================

describe("Integration: Full Locale Lifecycle", () => {
  const spanishLocale: LocaleConfig = {
    code: "es",
    bcp47: "es-ES",
    name: "Spanish",
    nativeName: "Español",
    direction: "ltr",
  };

  beforeEach(() => {
    if (LOCALE_REGISTRY.es) {
      delete LOCALE_REGISTRY.es;
    }
  });

  it("registers, retrieves, updates, and removes a locale", () => {
    // Register
    registerLocale(spanishLocale);
    expect(isLocaleSupported("es")).toBe(true);

    // Retrieve
    const retrieved = getLocale("es");
    expect(retrieved?.name).toBe("Spanish");

    // Update
    updateLocale("es", { name: "Spanish (Spain)" });
    expect(LOCALE_REGISTRY.es.name).toBe("Spanish (Spain)");

    // Remove
    const removed = removeLocale("es");
    expect(removed).toBe(true);
    expect(isLocaleSupported("es")).toBe(false);
  });

  it("supports multiple locale registrations", () => {
    const french: LocaleConfig = {
      code: "fr",
      bcp47: "fr-FR",
      name: "French",
      nativeName: "Français",
      direction: "ltr",
    };

    registerLocale(spanishLocale);
    registerLocale(french);

    expect(isLocaleSupported("es")).toBe(true);
    expect(isLocaleSupported("fr")).toBe(true);

    const locales = getAllLocales();
    expect(locales.length).toBeGreaterThanOrEqual(4); // en, ar, es, fr

    // Cleanup
    removeLocale("es");
    removeLocale("fr");
  });
});

// ============================================================================
// Edge Cases
// ============================================================================

describe("Edge Cases", () => {
  it("handles empty string locale code", () => {
    const result = getLocale("");
    expect(result).toBeUndefined();
  });

  it("handles special characters in locale code", () => {
    const result = getLocale("en-*&^%");
    expect(result).toBeUndefined();
  });

  it("getAllLocales returns new array each time", () => {
    const locales1 = getAllLocales();
    const locales2 = getAllLocales();
    expect(locales1).not.toBe(locales2); // Different array instances
    expect(locales1).toEqual(locales2); // Same content
  });

  it("update preserves isDefault flag", () => {
    const originalDefault = LOCALE_REGISTRY.en.isDefault;
    updateLocale("en", { name: "English (Test)" });
    expect(LOCALE_REGISTRY.en.isDefault).toBe(originalDefault);
  });
});
