import { describe, it as test, expect, vi } from "vitest";
import { TRANSLATIONS, getTranslations, translate, hasTranslation, getLocalizedLabel } from "./index";
import { en } from "./en";
import { ar } from "./ar";
import { it } from "./it";
import type { LocaleCode, TranslationKey } from "../types/i18n";

// Recursively collect dot-notation keys so parity is checked at every depth
function collectKeys(obj: object, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === "object" && value !== null ? collectKeys(value, path) : [path];
  });
}

const locales = { en, ar, it };

describe("Translation Completeness", () => {
  const enKeys = collectKeys(en).sort();

  test("all locales are registered", () => {
    Object.keys(locales).forEach((locale) => {
      expect(TRANSLATIONS).toHaveProperty(locale);
    });
  });

  // ponytail: deep key parity + non-empty covers structure for every locale;
  // literal copy assertions were removed on purpose — content is not behavior
  Object.entries(locales).forEach(([code, translations]) => {
    test(`${code} has exactly the same keys as en`, () => {
      expect(collectKeys(translations).sort()).toEqual(enKeys);
    });

    test(`${code} has no empty translations`, () => {
      collectKeys(translations).forEach((key) => {
        expect(translate(code as LocaleCode, key as TranslationKey).trim()).not.toBe("");
      });
    });
  });
});

describe("getTranslations", () => {
  test("returns the matching locale's translations", () => {
    expect(getTranslations("en")).toBe(en);
    expect(getTranslations("ar")).toBe(ar);
    expect(getTranslations("it")).toBe(it);
  });

  test("falls back to English for invalid locale", () => {
    expect(getTranslations("invalid" as LocaleCode)).toBe(en);
  });
});

describe("translate", () => {
  test("resolves nested keys to a non-empty string", () => {
    expect(translate("en", "common.loading").trim()).not.toBe("");
    expect(translate("ar", "common.loading").trim()).not.toBe("");
  });

  test("returns key if translation not found", () => {
    expect(translate("en", "nonexistent.key" as TranslationKey)).toBe("nonexistent.key");
  });

  test("warns when translation not found", () => {
    const consoleSpy = vi.spyOn(console, "warn");
    translate("en", "missing.translation" as TranslationKey);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Translation key not found"));
    consoleSpy.mockRestore();
  });

  test("interpolates {{param}} placeholders", () => {
    const result = translate("en", "filters.showingCount", { filtered: 3, total: 10 });
    expect(result).toContain("3");
    expect(result).toContain("10");
    expect(result).not.toContain("{{");
  });
});

describe("hasTranslation", () => {
  test("returns true for existing keys", () => {
    expect(hasTranslation("en", "common.loading")).toBe(true);
    expect(hasTranslation("ar", "common.loading")).toBe(true);
  });

  test("returns false for non-existent keys", () => {
    expect(hasTranslation("en", "nonexistent.key" as TranslationKey)).toBe(false);
    expect(hasTranslation("en", "common.nonexistent" as TranslationKey)).toBe(false);
  });
});

describe("getLocalizedLabel", () => {
  test("returns English label for English locale", () => {
    expect(getLocalizedLabel("en", "Test", "اختبار")).toBe("Test");
  });

  test("returns Arabic label for Arabic locale when available", () => {
    expect(getLocalizedLabel("ar", "Test", "اختبار")).toBe("اختبار");
  });

  test("falls back to English when Arabic label not provided", () => {
    expect(getLocalizedLabel("ar", "Test")).toBe("Test");
  });
});
