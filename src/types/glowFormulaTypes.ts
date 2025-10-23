/**
 * Glow Formula Type Definitions
 *
 * Defines extensible glow formula system for heritage visualization.
 */

/**
 * Age multiplier configuration
 */
export interface AgeMultiplier {
  /** Minimum age in years */
  minAge: number;

  /** Maximum age in years (null for infinity) */
  maxAge: number | null;

  /** Multiplier value */
  multiplier: number;

  /** Label for this age range */
  label: string;

  /** Label in Arabic */
  labelArabic?: string;

  /** Description */
  description?: string;
}

/**
 * Significance multiplier configuration
 */
export interface SignificanceMultiplier {
  /** Unique identifier */
  id: string;

  /** Display label */
  label: string;

  /** Label in Arabic */
  labelArabic?: string;

  /** Multiplier value */
  multiplier: number;

  /** Property name in GazaSite type */
  propertyName: string;

  /** Description */
  description?: string;
}

/**
 * Type-based multiplier configuration
 */
export interface TypeMultiplier {
  /** Site type */
  type: string;

  /** Multiplier value */
  multiplier: number;

  /** Display label */
  label: string;

  /** Label in Arabic */
  labelArabic?: string;

  /** Description */
  description?: string;
}

/**
 * Damage reduction configuration
 */
export interface DamageReduction {
  /** Damage status */
  status: "destroyed" | "heavily-damaged" | "damaged";

  /** Reduction percentage (0-100) */
  reductionPercentage: number;

  /** Display label */
  label: string;

  /** Label in Arabic */
  labelArabic?: string;

  /** Description */
  description?: string;
}

/**
 * Age color configuration
 */
export interface AgeColorConfig {
  /** Minimum age in years */
  minAge: number;

  /** Maximum age in years (null for infinity) */
  maxAge: number | null;

  /** Hex color code */
  color: string;

  /** Display label */
  label: string;

  /** Label in Arabic */
  labelArabic?: string;

  /** Description */
  description?: string;
}

/**
 * Complete glow formula configuration
 */
export interface GlowFormulaConfig {
  /** Unique formula identifier */
  id: string;

  /** Display label (English) */
  label: string;

  /** Display label (Arabic) */
  labelArabic?: string;

  /** Whether this is the default formula */
  isDefault?: boolean;

  /** Base weight value */
  baseWeight: number;

  /** Age multipliers (sorted by minAge descending) */
  ageMultipliers: AgeMultiplier[];

  /** Significance multipliers */
  significanceMultipliers: SignificanceMultiplier[];

  /** Type-based multipliers */
  typeMultipliers: TypeMultiplier[];

  /** Damage reduction percentages */
  damageReductions: DamageReduction[];

  /** Age-based colors */
  ageColors: AgeColorConfig[];

  /** Description for documentation */
  description?: string;

  /** Formula metadata */
  metadata?: {
    author?: string;
    version?: string;
    notes?: string;
  };
}
