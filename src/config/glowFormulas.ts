/**
 * Glow Formula Registry
 *
 * Central registry for glow contribution formulas. Enables dynamic formula
 * switching without code changes.
 *
 * @example
 * ```typescript
 * // Get default formula:
 * const formula = getGlowFormula('heritage-tracker-v1');
 *
 * // Register custom formula:
 * registerGlowFormula({
 *   id: 'custom-formula',
 *   label: 'Custom Formula',
 *   baseWeight: 100,
 *   ageMultipliers: [ ... ],
 *   significanceMultipliers: [ ... ],
 *   typeMultipliers: [ ... ],
 *   damageReductions: [ ... ],
 *   ageColors: [ ... ]
 * });
 * ```
 */

import type { GlowFormulaConfig } from "../types/glowFormulaTypes";

/**
 * Glow formula registry - stores all registered formulas
 */
export const GLOW_FORMULA_REGISTRY: Record<string, GlowFormulaConfig> = {
  "heritage-tracker-v1": {
    id: "heritage-tracker-v1",
    label: "Heritage Tracker Formula v1",
    labelArabic: "صيغة متتبع التراث الإصدار 1",
    isDefault: true,
    description:
      "Original glow formula considering age, significance, and damage status",
    metadata: {
      author: "Heritage Tracker Team",
      version: "1.0.0",
      notes: "Based on heritage conservation principles and visual impact",
    },

    baseWeight: 100,

    ageMultipliers: [
      {
        minAge: 2000,
        maxAge: null,
        multiplier: 3,
        label: "Ancient",
        labelArabic: "قديم",
        description: "Bronze Age, Roman, Byzantine (>2000 years)",
      },
      {
        minAge: 1000,
        maxAge: 2000,
        multiplier: 2,
        label: "Medieval",
        labelArabic: "عصور وسطى",
        description: "Islamic Golden Age (1000-2000 years)",
      },
      {
        minAge: 200,
        maxAge: 1000,
        multiplier: 1.5,
        label: "Historic",
        labelArabic: "تاريخي",
        description: "Ottoman/Historic period (200-1000 years)",
      },
      {
        minAge: 0,
        maxAge: 200,
        multiplier: 1,
        label: "Modern",
        labelArabic: "حديث",
        description: "Modern era (<200 years)",
      },
    ],

    significanceMultipliers: [
      {
        id: "unesco-listed",
        label: "UNESCO Listed",
        labelArabic: "مدرج في اليونسكو",
        multiplier: 2,
        propertyName: "unescoListed",
        description: "UNESCO World Heritage Site or tentative list",
      },
      {
        id: "artifact-count-100",
        label: "Rich Artifact Collection (>100)",
        labelArabic: "مجموعة غنية من القطع الأثرية (>100)",
        multiplier: 1.5,
        propertyName: "artifactCount",
        description: "Sites with significant artifact collections",
      },
      {
        id: "unique",
        label: "Unique Site",
        labelArabic: "موقع فريد",
        multiplier: 2,
        propertyName: "isUnique",
        description: "One-of-a-kind heritage site",
      },
      {
        id: "religious-significance",
        label: "Religious Significance",
        labelArabic: "أهمية دينية",
        multiplier: 1.3,
        propertyName: "religiousSignificance",
        description: "Sites with religious importance",
      },
      {
        id: "community-gathering",
        label: "Community Gathering Place",
        labelArabic: "مكان تجمع المجتمع",
        multiplier: 1.2,
        propertyName: "communityGatheringPlace",
        description: "Sites serving as community centers",
      },
      {
        id: "historical-events",
        label: "Historical Events",
        labelArabic: "أحداث تاريخية",
        multiplier: 1.1,
        propertyName: "historicalEvents",
        description: "+10% per historical event",
      },
    ],

    typeMultipliers: [
      {
        type: "archaeological",
        multiplier: 1.8,
        label: "Archaeological Site",
        labelArabic: "موقع أثري",
        description: "Ancient archaeological sites",
      },
      {
        type: "museum",
        multiplier: 1.6,
        label: "Museum",
        labelArabic: "متحف",
        description: "Museums and cultural centers",
      },
      {
        type: "mosque",
        multiplier: 1,
        label: "Mosque",
        labelArabic: "مسجد",
        description: "Mosques (use base weight + significance)",
      },
      {
        type: "church",
        multiplier: 1,
        label: "Church",
        labelArabic: "كنيسة",
        description: "Churches (use base weight + significance)",
      },
      {
        type: "historic-building",
        multiplier: 1,
        label: "Historic Building",
        labelArabic: "مبنى تاريخي",
        description: "Historic buildings (use base weight)",
      },
    ],

    damageReductions: [
      {
        status: "destroyed",
        reductionPercentage: 100,
        label: "Destroyed",
        labelArabic: "مدمر",
        description: "Complete destruction - remove 100% of glow",
      },
      {
        status: "heavily-damaged",
        reductionPercentage: 50,
        label: "Heavily Damaged",
        labelArabic: "متضرر بشدة",
        description: "Severe damage - remove 50% of glow",
      },
      {
        status: "damaged",
        reductionPercentage: 25,
        label: "Damaged",
        labelArabic: "متضرر",
        description: "Moderate damage - remove 25% of glow",
      },
    ],

    ageColors: [
      {
        minAge: 2000,
        maxAge: null,
        color: "#FFD700",
        label: "Ancient (Gold)",
        labelArabic: "قديم (ذهبي)",
        description: "Gold for ancient sites (>2000 years)",
      },
      {
        minAge: 500,
        maxAge: 2000,
        color: "#CD7F32",
        label: "Medieval (Bronze)",
        labelArabic: "عصور وسطى (برونزي)",
        description: "Bronze for medieval sites (500-2000 years)",
      },
      {
        minAge: 200,
        maxAge: 500,
        color: "#C0C0C0",
        label: "Historic (Silver)",
        labelArabic: "تاريخي (فضي)",
        description: "Silver for historic sites (200-500 years)",
      },
      {
        minAge: 0,
        maxAge: 200,
        color: "#4A90E2",
        label: "Modern (Blue)",
        labelArabic: "حديث (أزرق)",
        description: "Blue for modern sites (<200 years)",
      },
    ],
  },
};

// ============================================================================
// Glow Formula Helper Functions
// ============================================================================

/**
 * Register a new glow formula
 *
 * @param config - Glow formula configuration
 *
 * @example
 * ```typescript
 * registerGlowFormula({
 *   id: 'aggressive-aging',
 *   label: 'Aggressive Aging Formula',
 *   baseWeight: 100,
 *   ageMultipliers: [
 *     { minAge: 1000, maxAge: null, multiplier: 5, label: 'Very Old' }
 *   ],
 *   ...
 * });
 * ```
 */
export function registerGlowFormula(config: GlowFormulaConfig): void {
  GLOW_FORMULA_REGISTRY[config.id] = config;
}

/**
 * Get all registered glow formulas
 *
 * @returns Array of all glow formulas
 *
 * @example
 * ```typescript
 * const formulas = getAllGlowFormulas();
 * formulas.forEach(f => console.log(f.label));
 * ```
 */
export function getAllGlowFormulas(): GlowFormulaConfig[] {
  return Object.values(GLOW_FORMULA_REGISTRY);
}

/**
 * Get glow formula by ID
 *
 * @param id - Formula identifier
 * @returns Glow formula configuration or undefined if not found
 *
 * @example
 * ```typescript
 * const formula = getGlowFormula('heritage-tracker-v1');
 * if (formula) {
 *   console.log(formula.baseWeight); // 100
 * }
 * ```
 */
export function getGlowFormula(id: string): GlowFormulaConfig | undefined {
  return GLOW_FORMULA_REGISTRY[id];
}

/**
 * Get default glow formula
 *
 * @returns Default glow formula or first formula
 *
 * @example
 * ```typescript
 * const defaultFormula = getDefaultGlowFormula();
 * // Returns formula with isDefault: true
 * ```
 */
export function getDefaultGlowFormula(): GlowFormulaConfig {
  const defaultFormula = getAllGlowFormulas().find((f) => f.isDefault);
  if (defaultFormula) return defaultFormula;

  // Fallback to first formula
  const formulas = getAllGlowFormulas();
  if (formulas.length > 0) return formulas[0];

  // Final fallback to heritage-tracker-v1
  return GLOW_FORMULA_REGISTRY["heritage-tracker-v1"];
}

/**
 * Update glow formula configuration
 *
 * @param id - Formula identifier
 * @param updates - Partial configuration to update
 *
 * @example
 * ```typescript
 * updateGlowFormula('heritage-tracker-v1', {
 *   baseWeight: 150
 * });
 * ```
 */
export function updateGlowFormula(
  id: string,
  updates: Partial<GlowFormulaConfig>
): void {
  const existing = GLOW_FORMULA_REGISTRY[id];
  if (!existing) {
    throw new Error(`Glow formula '${id}' not found in registry`);
  }

  GLOW_FORMULA_REGISTRY[id] = {
    ...existing,
    ...updates,
  };
}

/**
 * Remove glow formula from registry
 *
 * @param id - Formula identifier
 *
 * @example
 * ```typescript
 * removeGlowFormula('custom-formula');
 * ```
 */
export function removeGlowFormula(id: string): void {
  delete GLOW_FORMULA_REGISTRY[id];
}

/**
 * Get glow formula IDs
 *
 * @returns Array of all formula IDs
 *
 * @example
 * ```typescript
 * const ids = getGlowFormulaIds();
 * // ['heritage-tracker-v1', 'custom-formula']
 * ```
 */
export function getGlowFormulaIds(): string[] {
  return Object.keys(GLOW_FORMULA_REGISTRY);
}

/**
 * Check if a glow formula ID is valid
 *
 * @param id - Formula identifier
 * @returns True if formula exists in registry
 *
 * @example
 * ```typescript
 * if (isValidGlowFormula('heritage-tracker-v1')) {
 *   // Formula exists
 * }
 * ```
 */
export function isValidGlowFormula(id: string): boolean {
  return id in GLOW_FORMULA_REGISTRY;
}

/**
 * Get glow formula label (localized)
 *
 * @param id - Formula identifier
 * @param locale - Locale code ('en' or 'ar')
 * @returns Localized label or formula ID if not found
 *
 * @example
 * ```typescript
 * const label = getGlowFormulaLabel('heritage-tracker-v1', 'ar');
 * // 'صيغة متتبع التراث الإصدار 1'
 * ```
 */
export function getGlowFormulaLabel(
  id: string,
  locale: "en" | "ar" = "en"
): string {
  const formula = getGlowFormula(id);
  if (!formula) return id;

  return locale === "ar" && formula.labelArabic
    ? formula.labelArabic
    : formula.label;
}

/**
 * Get age multiplier for a given age
 *
 * @param formulaId - Formula identifier
 * @param age - Age in years
 * @returns Age multiplier or 1 if not found
 *
 * @example
 * ```typescript
 * const multiplier = getAgeMultiplier('heritage-tracker-v1', 2500);
 * // Returns 3 (ancient multiplier)
 * ```
 */
export function getAgeMultiplier(formulaId: string, age: number): number {
  const formula = getGlowFormula(formulaId);
  if (!formula) return 1;

  // Find the matching age range (sorted descending by minAge)
  const sortedMultipliers = [...formula.ageMultipliers].sort(
    (a, b) => b.minAge - a.minAge
  );

  for (const range of sortedMultipliers) {
    if (age >= range.minAge && (range.maxAge === null || age < range.maxAge)) {
      return range.multiplier;
    }
  }

  return 1; // Fallback
}

/**
 * Get type multiplier for a given site type
 *
 * @param formulaId - Formula identifier
 * @param type - Site type
 * @returns Type multiplier or 1 if not found
 *
 * @example
 * ```typescript
 * const multiplier = getTypeMultiplier('heritage-tracker-v1', 'archaeological');
 * // Returns 1.8
 * ```
 */
export function getTypeMultiplier(formulaId: string, type: string): number {
  const formula = getGlowFormula(formulaId);
  if (!formula) return 1;

  const typeConfig = formula.typeMultipliers.find((t) => t.type === type);
  return typeConfig ? typeConfig.multiplier : 1;
}

/**
 * Get damage reduction percentage for a given status
 *
 * @param formulaId - Formula identifier
 * @param status - Damage status
 * @returns Reduction percentage (0-100) or 0 if not found
 *
 * @example
 * ```typescript
 * const reduction = getDamageReduction('heritage-tracker-v1', 'destroyed');
 * // Returns 100
 * ```
 */
export function getDamageReduction(
  formulaId: string,
  status: "destroyed" | "heavily-damaged" | "damaged"
): number {
  const formula = getGlowFormula(formulaId);
  if (!formula) return 0;

  const damageConfig = formula.damageReductions.find((d) => d.status === status);
  return damageConfig ? damageConfig.reductionPercentage : 0;
}

/**
 * Get age color for a given age
 *
 * @param formulaId - Formula identifier
 * @param age - Age in years
 * @returns Hex color code or '#4A90E2' (blue) as fallback
 *
 * @example
 * ```typescript
 * const color = getAgeColor('heritage-tracker-v1', 2500);
 * // Returns '#FFD700' (gold)
 * ```
 */
export function getAgeColor(formulaId: string, age: number): string {
  const formula = getGlowFormula(formulaId);
  if (!formula) return "#4A90E2"; // Blue fallback

  // Find the matching age range (sorted descending by minAge)
  const sortedColors = [...formula.ageColors].sort(
    (a, b) => b.minAge - a.minAge
  );

  for (const range of sortedColors) {
    if (age >= range.minAge && (range.maxAge === null || age < range.maxAge)) {
      return range.color;
    }
  }

  return "#4A90E2"; // Blue fallback
}

// ============================================================================
// Convenience Exports (for backward compatibility)
// ============================================================================

/**
 * Default glow formula (for backward compatibility)
 */
export const DEFAULT_GLOW_FORMULA = getDefaultGlowFormula();

/**
 * Base weight value (for backward compatibility)
 */
export const BASE_WEIGHT = DEFAULT_GLOW_FORMULA.baseWeight;
