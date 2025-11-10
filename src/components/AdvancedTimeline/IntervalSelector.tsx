/**
 * IntervalSelector - Dropdown for selecting comparison mode interval
 *
 * Allows users to control the time gap between before/after imagery
 * in comparison mode.
 */

import { useThemeClasses } from "../../hooks/useThemeClasses";
import { useTranslation } from "../../contexts/LocaleContext";
import type { ComparisonInterval } from "../../types/waybackTimelineTypes";
import { COMPARISON_INTERVAL_OPTIONS } from "../../config/comparisonIntervals";

interface IntervalSelectorProps {
  /** Current interval value */
  value: ComparisonInterval;
  /** Callback when interval changes */
  onChange: (interval: ComparisonInterval) => void;
  /** Whether comparison mode is enabled (disables selector if false) */
  comparisonModeEnabled: boolean;
}

/**
 * IntervalSelector Component
 *
 * Dropdown selector for comparison mode intervals.
 * Only active when comparison mode is enabled.
 */
export function IntervalSelector({
  value,
  onChange,
  comparisonModeEnabled,
}: IntervalSelectorProps) {
  const t = useThemeClasses();
  const translate = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="interval-selector"
        className={`text-xs ${comparisonModeEnabled ? t.text.primary : t.text.muted}`}
      >
        {translate("timeline.interval")}:
      </label>
      <select
        id="interval-selector"
        value={value}
        onChange={(e) => onChange(e.target.value as ComparisonInterval)}
        disabled={!comparisonModeEnabled}
        className={`
          text-xs px-2 py-1 rounded border
          ${comparisonModeEnabled ? t.border.primary : t.border.muted}
          ${comparisonModeEnabled ? t.bg.primary : t.bg.disabled}
          ${comparisonModeEnabled ? t.text.primary : t.text.muted}
          ${comparisonModeEnabled ? "cursor-pointer" : "cursor-not-allowed"}
          transition-all duration-200
        `}
        aria-label={translate("timeline.interval")}
      >
        {COMPARISON_INTERVAL_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {translate(option.labelKey)}
          </option>
        ))}
      </select>
    </div>
  );
}
