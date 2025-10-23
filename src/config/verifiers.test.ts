import { describe, it, expect } from "vitest";
import {
  VERIFIER_REGISTRY,
  getVerifier,
  getAllVerifiers,
  getVerifiersByType,
  calculateVerifierCredibility,
  isVerifierRegistered,
  getVerifierLabel,
} from "./verifiers";

describe("VERIFIER_REGISTRY", () => {
  it("contains all expected verifiers", () => {
    const expectedVerifiers = [
      "UNESCO",
      "Heritage for Peace",
      "Forensic Architecture",
      "ICOM UK",
      "International Council on Archives",
      "British Council",
      "Aliph Foundation",
      "Ministry of Tourism and Antiquities",
      "Centre for Cultural Heritage Preservation",
      "PEN America",
      "Al-Israa University",
      "Commonwealth War Graves Commission",
    ];

    expectedVerifiers.forEach((verifierId) => {
      expect(VERIFIER_REGISTRY[verifierId]).toBeDefined();
    });
  });

  it("has valid structure for all verifiers", () => {
    Object.values(VERIFIER_REGISTRY).forEach((verifier) => {
      expect(verifier.id).toBeTruthy();
      expect(verifier.label).toBeTruthy();
      expect(verifier.credibilityWeight).toBeGreaterThanOrEqual(0);
      expect(verifier.credibilityWeight).toBeLessThanOrEqual(100);
      expect(verifier.type).toBeTruthy();
    });
  });

  it("assigns highest credibility to UNESCO", () => {
    expect(VERIFIER_REGISTRY.UNESCO.credibilityWeight).toBe(100);
  });

  it("includes Arabic labels for all verifiers", () => {
    Object.values(VERIFIER_REGISTRY).forEach((verifier) => {
      expect(verifier.labelArabic).toBeTruthy();
    });
  });

  it("includes badge colors for all verifiers", () => {
    Object.values(VERIFIER_REGISTRY).forEach((verifier) => {
      expect(verifier.badgeColor).toBeTruthy();
      expect(verifier.badgeColor).toMatch(/^#[0-9a-f]{6}$/i);
    });
  });
});

describe("getVerifier", () => {
  it("returns correct verifier by ID", () => {
    const unesco = getVerifier("UNESCO");
    expect(unesco.id).toBe("UNESCO");
    expect(unesco.label).toBe("UNESCO");
    expect(unesco.credibilityWeight).toBe(100);
  });

  it("returns default config for unknown verifier", () => {
    const unknown = getVerifier("Unknown Organization");
    expect(unknown.id).toBe("Unknown Organization");
    expect(unknown.label).toBe("Unknown Organization");
    expect(unknown.credibilityWeight).toBe(50);
    expect(unknown.type).toBe("documentation");
  });

  it("preserves all properties for registered verifiers", () => {
    const forensic = getVerifier("Forensic Architecture");
    expect(forensic.websiteURL).toBe("https://forensic-architecture.org");
    expect(forensic.description).toBeTruthy();
    expect(forensic.countryCode).toBe("GB");
  });
});

describe("getAllVerifiers", () => {
  it("returns all 12 registered verifiers", () => {
    const verifiers = getAllVerifiers();
    expect(verifiers).toHaveLength(12);
  });

  it("returns array of VerifierConfig objects", () => {
    const verifiers = getAllVerifiers();
    verifiers.forEach((verifier) => {
      expect(verifier).toHaveProperty("id");
      expect(verifier).toHaveProperty("label");
      expect(verifier).toHaveProperty("credibilityWeight");
      expect(verifier).toHaveProperty("type");
    });
  });
});

describe("getVerifiersByType", () => {
  it("returns international organizations", () => {
    const international = getVerifiersByType("international");
    expect(international.length).toBeGreaterThan(0);
    international.forEach((verifier) => {
      expect(verifier.type).toBe("international");
    });
  });

  it("returns academic institutions", () => {
    const academic = getVerifiersByType("academic");
    expect(academic.length).toBe(2);
    expect(academic.map((v) => v.id)).toContain("Forensic Architecture");
    expect(academic.map((v) => v.id)).toContain("Al-Israa University");
  });

  it("returns governmental organizations", () => {
    const governmental = getVerifiersByType("governmental");
    expect(governmental.length).toBeGreaterThan(0);
    governmental.forEach((verifier) => {
      expect(verifier.type).toBe("governmental");
    });
  });

  it("returns NGOs", () => {
    const ngos = getVerifiersByType("ngo");
    expect(ngos.length).toBeGreaterThan(0);
    ngos.forEach((verifier) => {
      expect(verifier.type).toBe("ngo");
    });
  });

  it("returns empty array for non-existent type", () => {
    const none = getVerifiersByType("documentation");
    expect(none).toHaveLength(0);
  });
});

describe("calculateVerifierCredibility", () => {
  it("returns 0 for empty array", () => {
    expect(calculateVerifierCredibility([])).toBe(0);
  });

  it("returns 100 for UNESCO only", () => {
    expect(calculateVerifierCredibility(["UNESCO"])).toBe(100);
  });

  it("calculates average for multiple verifiers", () => {
    // UNESCO: 100, Heritage for Peace: 95
    const result = calculateVerifierCredibility(["UNESCO", "Heritage for Peace"]);
    expect(result).toBe(98); // (100 + 95) / 2 = 97.5, rounded to 98
  });

  it("calculates average for three verifiers", () => {
    // UNESCO: 100, Forensic Architecture: 98, Heritage for Peace: 95
    const result = calculateVerifierCredibility([
      "UNESCO",
      "Forensic Architecture",
      "Heritage for Peace",
    ]);
    expect(result).toBe(98); // (100 + 98 + 95) / 3 = 97.67, rounded to 98
  });

  it("handles unknown verifiers with default weight", () => {
    // Unknown gets 50, UNESCO gets 100
    const result = calculateVerifierCredibility(["Unknown", "UNESCO"]);
    expect(result).toBe(75); // (50 + 100) / 2 = 75
  });

  it("rounds to nearest integer", () => {
    // Test rounding behavior
    const result = calculateVerifierCredibility([
      "UNESCO", // 100
      "Heritage for Peace", // 95
      "Forensic Architecture", // 98
    ]);
    expect(Number.isInteger(result)).toBe(true);
  });
});

describe("isVerifierRegistered", () => {
  it("returns true for registered verifiers", () => {
    expect(isVerifierRegistered("UNESCO")).toBe(true);
    expect(isVerifierRegistered("Heritage for Peace")).toBe(true);
    expect(isVerifierRegistered("Forensic Architecture")).toBe(true);
  });

  it("returns false for unregistered verifiers", () => {
    expect(isVerifierRegistered("Unknown Organization")).toBe(false);
    expect(isVerifierRegistered("Random NGO")).toBe(false);
    expect(isVerifierRegistered("")).toBe(false);
  });

  it("is case-sensitive", () => {
    expect(isVerifierRegistered("unesco")).toBe(false);
    expect(isVerifierRegistered("UNESCO")).toBe(true);
  });
});

describe("getVerifierLabel", () => {
  it("returns English label by default", () => {
    expect(getVerifierLabel("UNESCO")).toBe("UNESCO");
    expect(getVerifierLabel("Heritage for Peace")).toBe("Heritage for Peace");
  });

  it("returns English label when locale is 'en'", () => {
    expect(getVerifierLabel("UNESCO", "en")).toBe("UNESCO");
  });

  it("returns Arabic label when locale is 'ar'", () => {
    expect(getVerifierLabel("UNESCO", "ar")).toBe("اليونسكو");
    expect(getVerifierLabel("Heritage for Peace", "ar")).toBe("التراث من أجل السلام");
  });

  it("falls back to English if Arabic not available", () => {
    // All verifiers should have Arabic labels, but test the fallback logic
    const verifier = getVerifier("UNESCO");
    const originalArabic = verifier.labelArabic;
    // @ts-expect-error - Testing fallback behavior
    verifier.labelArabic = undefined;

    const label = getVerifierLabel("UNESCO", "ar");
    expect(label).toBe("UNESCO");

    // Restore
    verifier.labelArabic = originalArabic;
  });

  it("handles unknown verifiers", () => {
    const label = getVerifierLabel("Unknown Organization");
    expect(label).toBe("Unknown Organization");
  });
});

describe("Verifier Type Distribution", () => {
  it("has balanced type distribution", () => {
    const allVerifiers = getAllVerifiers();
    const typeCount: Record<string, number> = {};

    allVerifiers.forEach((verifier) => {
      typeCount[verifier.type] = (typeCount[verifier.type] || 0) + 1;
    });

    // Should have multiple types represented
    expect(Object.keys(typeCount).length).toBeGreaterThan(1);
  });
});

describe("Credibility Weight Distribution", () => {
  it("has credibility weights in valid range", () => {
    const allVerifiers = getAllVerifiers();

    allVerifiers.forEach((verifier) => {
      expect(verifier.credibilityWeight).toBeGreaterThanOrEqual(0);
      expect(verifier.credibilityWeight).toBeLessThanOrEqual(100);
    });
  });

  it("has high-credibility verifiers (90+)", () => {
    const highCredibility = getAllVerifiers().filter(
      (v) => v.credibilityWeight >= 90
    );
    expect(highCredibility.length).toBeGreaterThan(0);
  });

  it("distinguishes between verifier types by credibility", () => {
    const international = getVerifiersByType("international");
    const avgInternational =
      international.reduce((sum, v) => sum + v.credibilityWeight, 0) /
      international.length;

    // International organizations should have high average credibility
    expect(avgInternational).toBeGreaterThan(85);
  });
});
