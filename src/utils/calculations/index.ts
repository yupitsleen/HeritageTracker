/**
 * Heritage calculations barrel export
 * Maintains backward compatibility while organizing by theme
 */

export {
  calculateGlowContribution,
  getGlowReductionPercentage,
  getAgeColorCode,
} from "./glowContributions";

export {
  calculateTotalHeritageValue,
  calculateDestroyedValue,
  calculateHeritageIntegrity,
} from "./heritageMetrics";

export { calculateSignificanceScore } from "./significance";
