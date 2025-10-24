/**
 * Glow Formula Registry Tests
 *
 * Comprehensive test suite for glow formula registry and helper functions.
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  GLOW_FORMULA_REGISTRY,
  registerGlowFormula,
  getAllGlowFormulas,
  getGlowFormula,
  getDefaultGlowFormula,
  updateGlowFormula,
  removeGlowFormula,
  getGlowFormulaIds,
  isValidGlowFormula,
  getGlowFormulaLabel,
  getAgeMultiplier,
  getTypeMultiplier,
  getDamageReduction,
  getAgeColor,
  DEFAULT_GLOW_FORMULA,
  BASE_WEIGHT,
} from "./glowFormulas";
import type { GlowFormulaConfig } from "../types/glowFormulaTypes";

describe("Glow Formula Registry", () => {
  // ============================================================================
  // Registry Validation Tests
  // ============================================================================

  describe("Registry Validation", () => {
    it("should contain heritage-tracker-v1 formula", () => {
      expect(GLOW_FORMULA_REGISTRY["heritage-tracker-v1"]).toBeDefined();
      expect(GLOW_FORMULA_REGISTRY["heritage-tracker-v1"].label).toBe(
        "Heritage Tracker Formula v1"
      );
    });

    it("should have default formula", () => {
      expect(GLOW_FORMULA_REGISTRY["heritage-tracker-v1"].isDefault).toBe(true);
    });

    it("should have Arabic labels", () => {
      expect(GLOW_FORMULA_REGISTRY["heritage-tracker-v1"].labelArabic).toBe(
        "صيغة متتبع التراث الإصدار 1"
      );
    });

    it("should have base weight defined", () => {
      const formula = GLOW_FORMULA_REGISTRY["heritage-tracker-v1"];
      expect(formula.baseWeight).toBe(100);
    });

    it("should have age multipliers", () => {
      const formula = GLOW_FORMULA_REGISTRY["heritage-tracker-v1"];
      expect(formula.ageMultipliers.length).toBeGreaterThan(0);
      expect(formula.ageMultipliers[0].multiplier).toBeDefined();
    });

    it("should have significance multipliers", () => {
      const formula = GLOW_FORMULA_REGISTRY["heritage-tracker-v1"];
      expect(formula.significanceMultipliers.length).toBeGreaterThan(0);
      expect(formula.significanceMultipliers[0].propertyName).toBeDefined();
    });

    it("should have type multipliers", () => {
      const formula = GLOW_FORMULA_REGISTRY["heritage-tracker-v1"];
      expect(formula.typeMultipliers.length).toBeGreaterThan(0);
      expect(formula.typeMultipliers[0].type).toBeDefined();
    });

    it("should have damage reductions", () => {
      const formula = GLOW_FORMULA_REGISTRY["heritage-tracker-v1"];
      expect(formula.damageReductions.length).toBe(3);
      expect(formula.damageReductions.map((d) => d.status)).toContain("destroyed");
    });

    it("should have age colors", () => {
      const formula = GLOW_FORMULA_REGISTRY["heritage-tracker-v1"];
      expect(formula.ageColors.length).toBeGreaterThan(0);
      expect(formula.ageColors[0].color).toMatch(/^#[0-9A-F]{6}$/i);
    });

    it("should have metadata", () => {
      const formula = GLOW_FORMULA_REGISTRY["heritage-tracker-v1"];
      expect(formula.metadata).toBeDefined();
      expect(formula.metadata?.author).toBe("Heritage Tracker Team");
    });
  });

  // ============================================================================
  // CRUD Operations Tests
  // ============================================================================

  describe("CRUD Operations", () => {
    const customFormula: GlowFormulaConfig = {
      id: "test-formula",
      label: "Test Formula",
      labelArabic: "صيغة الاختبار",
      baseWeight: 50,
      ageMultipliers: [
        {
          minAge: 1000,
          maxAge: null,
          multiplier: 2,
          label: "Old",
          labelArabic: "قديم",
        },
        {
          minAge: 0,
          maxAge: 1000,
          multiplier: 1,
          label: "New",
          labelArabic: "جديد",
        },
      ],
      significanceMultipliers: [],
      typeMultipliers: [],
      damageReductions: [
        {
          status: "destroyed",
          reductionPercentage: 100,
          label: "Destroyed",
          labelArabic: "مدمر",
        },
        {
          status: "heavily-damaged",
          reductionPercentage: 50,
          label: "Heavily Damaged",
          labelArabic: "متضرر بشدة",
        },
        {
          status: "damaged",
          reductionPercentage: 25,
          label: "Damaged",
          labelArabic: "متضرر",
        },
      ],
      ageColors: [
        {
          minAge: 0,
          maxAge: null,
          color: "#FF0000",
          label: "Red",
          labelArabic: "أحمر",
        },
      ],
    };

    beforeEach(() => {
      // Clean up test formula if it exists
      if (isValidGlowFormula("test-formula")) {
        removeGlowFormula("test-formula");
      }
    });

    it("should register a new glow formula", () => {
      registerGlowFormula(customFormula);
      expect(GLOW_FORMULA_REGISTRY["test-formula"]).toBeDefined();
      expect(GLOW_FORMULA_REGISTRY["test-formula"].label).toBe("Test Formula");
    });

    it("should get glow formula by ID", () => {
      registerGlowFormula(customFormula);
      const formula = getGlowFormula("test-formula");
      expect(formula).toBeDefined();
      expect(formula?.label).toBe("Test Formula");
    });

    it("should return undefined for non-existent formula", () => {
      const formula = getGlowFormula("non-existent");
      expect(formula).toBeUndefined();
    });

    it("should update existing formula", () => {
      registerGlowFormula(customFormula);
      updateGlowFormula("test-formula", { baseWeight: 75 });
      expect(GLOW_FORMULA_REGISTRY["test-formula"].baseWeight).toBe(75);
    });

    it("should throw error when updating non-existent formula", () => {
      expect(() => updateGlowFormula("non-existent", { baseWeight: 100 })).toThrow(
        "Glow formula 'non-existent' not found in registry"
      );
    });

    it("should remove glow formula", () => {
      registerGlowFormula(customFormula);
      expect(GLOW_FORMULA_REGISTRY["test-formula"]).toBeDefined();
      removeGlowFormula("test-formula");
      expect(GLOW_FORMULA_REGISTRY["test-formula"]).toBeUndefined();
    });

    it("should get all formula IDs", () => {
      const ids = getGlowFormulaIds();
      expect(ids).toContain("heritage-tracker-v1");
    });

    it("should validate formula ID", () => {
      expect(isValidGlowFormula("heritage-tracker-v1")).toBe(true);
      expect(isValidGlowFormula("non-existent")).toBe(false);
    });

    it("should preserve all properties when updating", () => {
      registerGlowFormula(customFormula);
      updateGlowFormula("test-formula", { baseWeight: 60 });
      const formula = getGlowFormula("test-formula");
      expect(formula?.baseWeight).toBe(60);
      expect(formula?.label).toBe("Test Formula");
      expect(formula?.ageMultipliers.length).toBe(2);
    });
  });

  // ============================================================================
  // Query Function Tests
  // ============================================================================

  describe("Query Functions", () => {
    it("should get all glow formulas", () => {
      const formulas = getAllGlowFormulas();
      expect(formulas.length).toBeGreaterThanOrEqual(1);
      expect(formulas.some((f) => f.id === "heritage-tracker-v1")).toBe(true);
    });

    it("should get default glow formula", () => {
      const defaultFormula = getDefaultGlowFormula();
      expect(defaultFormula).toBeDefined();
      expect(defaultFormula.id).toBe("heritage-tracker-v1");
      expect(defaultFormula.isDefault).toBe(true);
    });

    it("should get label in English", () => {
      const label = getGlowFormulaLabel("heritage-tracker-v1", "en");
      expect(label).toBe("Heritage Tracker Formula v1");
    });

    it("should get label in Arabic", () => {
      const label = getGlowFormulaLabel("heritage-tracker-v1", "ar");
      expect(label).toBe("صيغة متتبع التراث الإصدار 1");
    });

    it("should fallback to English if Arabic not available", () => {
      const customFormula: GlowFormulaConfig = {
        ...GLOW_FORMULA_REGISTRY["heritage-tracker-v1"],
        id: "test-no-arabic",
        label: "Test No Arabic",
        labelArabic: undefined,
      };
      registerGlowFormula(customFormula);
      const label = getGlowFormulaLabel("test-no-arabic", "ar");
      expect(label).toBe("Test No Arabic");
      removeGlowFormula("test-no-arabic");
    });

    it("should return ID for non-existent formula", () => {
      const label = getGlowFormulaLabel("non-existent", "en");
      expect(label).toBe("non-existent");
    });
  });

  // ============================================================================
  // Age Multiplier Tests
  // ============================================================================

  describe("Age Multiplier Functions", () => {
    it("should get correct multiplier for ancient age (>2000 years)", () => {
      const multiplier = getAgeMultiplier("heritage-tracker-v1", 2500);
      expect(multiplier).toBe(3);
    });

    it("should get correct multiplier for medieval age (1000-2000 years)", () => {
      const multiplier = getAgeMultiplier("heritage-tracker-v1", 1500);
      expect(multiplier).toBe(2);
    });

    it("should get correct multiplier for historic age (200-1000 years)", () => {
      const multiplier = getAgeMultiplier("heritage-tracker-v1", 500);
      expect(multiplier).toBe(1.5);
    });

    it("should get correct multiplier for modern age (<200 years)", () => {
      const multiplier = getAgeMultiplier("heritage-tracker-v1", 100);
      expect(multiplier).toBe(1);
    });

    it("should return 1 for non-existent formula", () => {
      const multiplier = getAgeMultiplier("non-existent", 1000);
      expect(multiplier).toBe(1);
    });
  });

  // ============================================================================
  // Type Multiplier Tests
  // ============================================================================

  describe("Type Multiplier Functions", () => {
    it("should get correct multiplier for archaeological sites", () => {
      const multiplier = getTypeMultiplier("heritage-tracker-v1", "archaeological");
      expect(multiplier).toBe(1.8);
    });

    it("should get correct multiplier for museums", () => {
      const multiplier = getTypeMultiplier("heritage-tracker-v1", "museum");
      expect(multiplier).toBe(1.6);
    });

    it("should get correct multiplier for mosques", () => {
      const multiplier = getTypeMultiplier("heritage-tracker-v1", "mosque");
      expect(multiplier).toBe(1);
    });

    it("should return 1 for unknown type", () => {
      const multiplier = getTypeMultiplier("heritage-tracker-v1", "unknown-type");
      expect(multiplier).toBe(1);
    });

    it("should return 1 for non-existent formula", () => {
      const multiplier = getTypeMultiplier("non-existent", "mosque");
      expect(multiplier).toBe(1);
    });
  });

  // ============================================================================
  // Damage Reduction Tests
  // ============================================================================

  describe("Damage Reduction Functions", () => {
    it("should get 100% reduction for destroyed status", () => {
      const reduction = getDamageReduction("heritage-tracker-v1", "destroyed");
      expect(reduction).toBe(100);
    });

    it("should get 50% reduction for heavily-damaged status", () => {
      const reduction = getDamageReduction("heritage-tracker-v1", "heavily-damaged");
      expect(reduction).toBe(50);
    });

    it("should get 25% reduction for damaged status", () => {
      const reduction = getDamageReduction("heritage-tracker-v1", "damaged");
      expect(reduction).toBe(25);
    });

    it("should return 0 for non-existent formula", () => {
      const reduction = getDamageReduction("non-existent", "destroyed");
      expect(reduction).toBe(0);
    });
  });

  // ============================================================================
  // Age Color Tests
  // ============================================================================

  describe("Age Color Functions", () => {
    it("should get gold color for ancient age (>2000 years)", () => {
      const color = getAgeColor("heritage-tracker-v1", 2500);
      expect(color).toBe("#FFD700");
    });

    it("should get bronze color for medieval age (500-2000 years)", () => {
      const color = getAgeColor("heritage-tracker-v1", 1000);
      expect(color).toBe("#CD7F32");
    });

    it("should get silver color for historic age (200-500 years)", () => {
      const color = getAgeColor("heritage-tracker-v1", 300);
      expect(color).toBe("#C0C0C0");
    });

    it("should get blue color for modern age (<200 years)", () => {
      const color = getAgeColor("heritage-tracker-v1", 100);
      expect(color).toBe("#4A90E2");
    });

    it("should return blue fallback for non-existent formula", () => {
      const color = getAgeColor("non-existent", 1000);
      expect(color).toBe("#4A90E2");
    });
  });

  // ============================================================================
  // Backward Compatibility Tests
  // ============================================================================

  describe("Backward Compatibility", () => {
    it("should export DEFAULT_GLOW_FORMULA constant", () => {
      expect(DEFAULT_GLOW_FORMULA).toBeDefined();
      expect(DEFAULT_GLOW_FORMULA.id).toBe("heritage-tracker-v1");
    });

    it("should export BASE_WEIGHT constant", () => {
      expect(BASE_WEIGHT).toBeDefined();
      expect(BASE_WEIGHT).toBe(100);
    });

    it("BASE_WEIGHT should match default formula baseWeight", () => {
      const defaultFormula = getDefaultGlowFormula();
      expect(BASE_WEIGHT).toBe(defaultFormula.baseWeight);
    });
  });

  // ============================================================================
  // Integration Tests
  // ============================================================================

  describe("Integration Tests", () => {
    it("should allow dynamic formula switching", () => {
      const customFormula: GlowFormulaConfig = {
        ...GLOW_FORMULA_REGISTRY["heritage-tracker-v1"],
        id: "test-integration",
        label: "Test Integration",
        baseWeight: 200,
      };

      registerGlowFormula(customFormula);
      const formula = getGlowFormula("test-integration");
      expect(formula).toBeDefined();
      expect(formula?.baseWeight).toBe(200);

      removeGlowFormula("test-integration");
    });

    it("should maintain consistency across multiplier queries", () => {
      const formulaId = "heritage-tracker-v1";

      // Ancient age should give highest multipliers
      const ancientAge = getAgeMultiplier(formulaId, 2500);
      const medievalAge = getAgeMultiplier(formulaId, 1500);
      expect(ancientAge).toBeGreaterThan(medievalAge);

      // Archaeological should have higher multiplier than mosque
      const archMult = getTypeMultiplier(formulaId, "archaeological");
      const mosqueMult = getTypeMultiplier(formulaId, "mosque");
      expect(archMult).toBeGreaterThan(mosqueMult);

      // Destroyed should have highest reduction
      const destroyedRed = getDamageReduction(formulaId, "destroyed");
      const damagedRed = getDamageReduction(formulaId, "damaged");
      expect(destroyedRed).toBeGreaterThan(damagedRed);
    });
  });

  // ============================================================================
  // Edge Cases Tests
  // ============================================================================

  describe("Edge Cases", () => {
    it("should handle fallback when no default formula set", () => {
      // Temporarily remove isDefault flag
      const originalFormula = GLOW_FORMULA_REGISTRY["heritage-tracker-v1"];
      const originalDefault = originalFormula.isDefault;
      originalFormula.isDefault = undefined;

      const defaultFormula = getDefaultGlowFormula();
      expect(defaultFormula).toBeDefined();

      // Restore
      originalFormula.isDefault = originalDefault;
    });

    it("should handle age at exact boundary (2000 years)", () => {
      const multiplier = getAgeMultiplier("heritage-tracker-v1", 2000);
      expect(multiplier).toBe(3); // Should match ancient category
    });

    it("should handle age at exact boundary (1000 years)", () => {
      const multiplier = getAgeMultiplier("heritage-tracker-v1", 1000);
      expect(multiplier).toBe(2); // Should match medieval category
    });

    it("should handle age at exact boundary (200 years)", () => {
      const multiplier = getAgeMultiplier("heritage-tracker-v1", 200);
      expect(multiplier).toBe(1.5); // Should match historic category
    });

    it("should validate all damage statuses are covered", () => {
      const formula = getGlowFormula("heritage-tracker-v1")!;
      const statuses = formula.damageReductions.map((d) => d.status);
      expect(statuses).toContain("destroyed");
      expect(statuses).toContain("heavily-damaged");
      expect(statuses).toContain("damaged");
    });
  });
});
