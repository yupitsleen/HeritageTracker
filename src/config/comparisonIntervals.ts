/**
 * Comparison Mode Interval Configuration
 *
 * Defines available interval options for comparison mode in the Wayback slider.
 * Each interval determines the time gap between before/after satellite imagery.
 */

import type { ComparisonInterval } from "../types/waybackTimelineTypes";
import type { TranslationKey } from "../types/i18n";

/**
 * Interval option configuration
 */
export interface IntervalOption {
  /** Unique identifier */
  value: ComparisonInterval;
  /** Display label (English) - i18n key */
  labelKey: TranslationKey;
  /** Sort order */
  order: number;
}

/**
 * Available comparison interval options
 *
 * Sorted by logical order (not necessarily by time duration)
 */
export const COMPARISON_INTERVAL_OPTIONS: IntervalOption[] = [
  {
    value: "as_large_as_possible",
    labelKey: "timeline.intervalAsLargeAsPossible",
    order: 1,
  },
  {
    value: "as_small_as_possible",
    labelKey: "timeline.intervalAsSmallAsPossible",
    order: 2,
  },
  {
    value: "1_month",
    labelKey: "timeline.interval1Month",
    order: 3,
  },
  {
    value: "1_year",
    labelKey: "timeline.interval1Year",
    order: 4,
  },
  {
    value: "5_years",
    labelKey: "timeline.interval5Years",
    order: 5,
  },
];

/**
 * Default comparison interval
 */
export const DEFAULT_COMPARISON_INTERVAL: ComparisonInterval = "as_large_as_possible";
