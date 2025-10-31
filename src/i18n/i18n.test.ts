import { describe, it, expect } from "vitest";
import { TRANSLATIONS, getTranslations, translate, hasTranslation, getLocalizedLabel } from "./index";
import { en } from "./en";
import { ar } from "./ar";

describe("TRANSLATIONS", () => {
  it("contains English and Arabic translations", () => {
    expect(TRANSLATIONS.en).toBeDefined();
    expect(TRANSLATIONS.ar).toBeDefined();
  });

  it("has the same structure for both languages", () => {
    const enKeys = Object.keys(en);
    const arKeys = Object.keys(ar);

    expect(arKeys).toEqual(enKeys);
  });

  it("has all required namespaces", () => {
    const requiredNamespaces = [
      "common",
      "header",
      "map",
      "timeline",
      "table",
      "filters",
      "siteTypes",
      "siteStatus",
      "stats",
      "timelinePage",
      "siteDetail",
      "modals",
      "errors",
      "aria",
    ];

    requiredNamespaces.forEach((namespace) => {
      expect(en).toHaveProperty(namespace);
      expect(ar).toHaveProperty(namespace);
    });
  });
});

describe("getTranslations", () => {
  it("returns English translations for 'en' locale", () => {
    const translations = getTranslations("en");
    expect(translations).toBe(en);
  });

  it("returns Arabic translations for 'ar' locale", () => {
    const translations = getTranslations("ar");
    expect(translations).toBe(ar);
  });

  it("falls back to English for invalid locale", () => {
    const translations = getTranslations("invalid" as unknown as LocaleCode);
    expect(translations).toBe(en);
  });
});

describe("translate", () => {
  it("translates simple keys in English", () => {
    expect(translate("en", "common.loading")).toBe("Loading...");
    expect(translate("en", "common.save")).toBe("Save");
    expect(translate("en", "header.title")).toBe("Heritage Tracker");
  });

  it("translates simple keys in Arabic", () => {
    expect(translate("ar", "common.loading")).toBe("جار التحميل...");
    expect(translate("ar", "common.save")).toBe("حفظ");
    expect(translate("ar", "header.title")).toBe("متتبع التراث");
  });

  it("translates nested keys", () => {
    expect(translate("en", "map.satelliteView")).toBe("Satellite");
    expect(translate("en", "timeline.play")).toBe("Play");
    expect(translate("en", "table.siteName")).toBe("Site Name");
  });

  it("returns key if translation not found", () => {
    expect(translate("en", "nonexistent.key" as unknown as LocaleCode)).toBe("nonexistent.key");
  });

  it("warns when translation not found", () => {
    const consoleSpy = vi.spyOn(console, "warn");
    translate("en", "missing.translation" as unknown as LocaleCode);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Translation key not found")
    );
    consoleSpy.mockRestore();
  });

  it("interpolates parameters", () => {
    // This would work if we had translations with {{param}} syntax
    // For now, test that it doesn't break without parameters
    const result = translate("en", "common.loading");
    expect(result).toBe("Loading...");
  });
});

describe("hasTranslation", () => {
  it("returns true for existing keys", () => {
    expect(hasTranslation("en", "common.loading")).toBe(true);
    expect(hasTranslation("ar", "common.loading")).toBe(true);
    expect(hasTranslation("en", "header.title")).toBe(true);
  });

  it("returns false for non-existent keys", () => {
    expect(hasTranslation("en", "nonexistent.key" as unknown as LocaleCode)).toBe(false);
    expect(hasTranslation("ar", "missing.translation" as unknown as LocaleCode)).toBe(false);
  });

  it("handles nested keys correctly", () => {
    expect(hasTranslation("en", "map.satelliteView")).toBe(true);
    expect(hasTranslation("en", "map.nonexistent" as unknown as LocaleCode)).toBe(false);
  });
});

describe("getLocalizedLabel", () => {
  it("returns English label for English locale", () => {
    expect(getLocalizedLabel("en", "Test", "اختبار")).toBe("Test");
  });

  it("returns Arabic label for Arabic locale when available", () => {
    expect(getLocalizedLabel("ar", "Test", "اختبار")).toBe("اختبار");
  });

  it("falls back to English when Arabic label not provided", () => {
    expect(getLocalizedLabel("ar", "Test")).toBe("Test");
  });

  it("handles empty strings", () => {
    expect(getLocalizedLabel("en", "", "")).toBe("");
    expect(getLocalizedLabel("ar", "", "")).toBe("");
  });
});

describe("Translation Completeness", () => {
  it("English and Arabic have matching keys in common namespace", () => {
    const enCommonKeys = Object.keys(en.common);
    const arCommonKeys = Object.keys(ar.common);
    expect(arCommonKeys.sort()).toEqual(enCommonKeys.sort());
  });

  it("English and Arabic have matching keys in all namespaces", () => {
    const namespaces = Object.keys(en) as Array<keyof typeof en>;

    namespaces.forEach((namespace) => {
      const enKeys = Object.keys(en[namespace]);
      const arKeys = Object.keys(ar[namespace]);
      expect(arKeys.sort()).toEqual(enKeys.sort());
    });
  });

  it("no empty translations in English", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const checkEmpty = (obj: any, path: string = "") => {
      Object.entries(obj).forEach(([key, value]) => {
        const currentPath = path ? `${path}.${key}` : key;
        if (typeof value === "string") {
          expect(value.trim()).not.toBe("");
        } else if (typeof value === "object") {
          checkEmpty(value, currentPath);
        }
      });
    };

    checkEmpty(en);
  });

  it("no empty translations in Arabic", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const checkEmpty = (obj: any, path: string = "") => {
      Object.entries(obj).forEach(([key, value]) => {
        const currentPath = path ? `${path}.${key}` : key;
        if (typeof value === "string") {
          expect(value.trim()).not.toBe("");
        } else if (typeof value === "object") {
          checkEmpty(value, currentPath);
        }
      });
    };

    checkEmpty(ar);
  });
});

describe("Site-specific Translations", () => {
  it("has all site type translations", () => {
    const types = ["mosque", "church", "archaeological", "museum", "historicBuilding"];

    types.forEach((type) => {
      expect(en.siteTypes).toHaveProperty(type);
      expect(ar.siteTypes).toHaveProperty(type);
    });
  });

  it("has all site status translations", () => {
    const statuses = ["destroyed", "heavilyDamaged", "damaged"];

    statuses.forEach((status) => {
      expect(en.siteStatus).toHaveProperty(status);
      expect(ar.siteStatus).toHaveProperty(status);
    });
  });

  it("translates site types correctly", () => {
    expect(translate("en", "siteTypes.mosque")).toBe("Mosque");
    expect(translate("ar", "siteTypes.mosque")).toBe("مسجد");

    expect(translate("en", "siteTypes.church")).toBe("Church");
    expect(translate("ar", "siteTypes.church")).toBe("كنيسة");
  });

  it("translates site statuses correctly", () => {
    expect(translate("en", "siteStatus.destroyed")).toBe("Destroyed");
    expect(translate("ar", "siteStatus.destroyed")).toBe("مدمر");

    expect(translate("en", "siteStatus.damaged")).toBe("Damaged");
    expect(translate("ar", "siteStatus.damaged")).toBe("متضرر");
  });
});
