import { InfoIcon } from "../Icons";
import { useThemeClasses } from "../../hooks/useThemeClasses";

interface FilterLabelProps {
  /** Label text to display */
  label: string;
  /** Optional tooltip text shown on info icon hover */
  tooltip?: string;
  /** Additional CSS classes for the container */
  className?: string;
}

/**
 * FilterLabel - Reusable label with optional tooltip for filter components
 *
 * Provides consistent styling for filter labels across the application.
 * Shows an info icon with tooltip when tooltip text is provided.
 *
 * @example
 * ```tsx
 * <FilterLabel
 *   label="Date Range"
 *   tooltip="Date filters use Gregorian calendar only"
 * />
 * ```
 */
export function FilterLabel({ label, tooltip, className = "flex items-center gap-2 mb-2" }: FilterLabelProps) {
  const t = useThemeClasses();

  return (
    <div className={className}>
      <label className={`text-sm font-semibold ${t.text.heading}`}>{label}</label>
      {tooltip && (
        <InfoIcon
          className={`w-4 h-4 ${t.icon.default} cursor-help`}
          aria-label="More information"
          title={tooltip}
        />
      )}
    </div>
  );
}
