/**
 * Heritage calculations - Barrel export for backward compatibility
 * Actual implementations moved to src/utils/calculations/ for better organization
 *
 * @deprecated Import from specific calculation modules instead:
 * - calculations/glowContributions
 * - calculations/heritageMetrics
 * - calculations/significance
 */

export {
  calculateGlowContribution,
  getGlowReductionPercentage,
  getAgeColorCode,
  calculateTotalHeritageValue,
  calculateDestroyedValue,
  calculateHeritageIntegrity,
  calculateSignificanceScore,
} from "./calculations";
