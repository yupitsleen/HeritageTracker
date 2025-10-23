import { describe, it, expect } from "vitest";
import {
  LOCALE_REGISTRY,
  getLocaleConfig,
  getAvailableLocales,
  getDefaultLocale,
  isLocaleSupported,
  getLocaleCodes,
} from "./locales";

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
