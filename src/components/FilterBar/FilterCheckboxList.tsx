import { useThemeClasses } from "../../hooks/useThemeClasses";
import { cn } from "../../styles/theme";

interface FilterCheckboxListProps<T extends string> {
  /** Available options */
  options: readonly T[];
  /** Currently selected values */
  selectedValues: T[];
  /** Callback when selection changes */
  onChange: (values: T[]) => void;
  /** Optional label formatter */
  formatLabel?: (value: string) => string;
  /** Optional counts per option (e.g., "mosque": 14) */
  counts?: Record<string, number>;
}

/**
 * FilterCheckboxList - Checkbox list for multi-select filtering
 *
 * Reusable component for displaying filter options with checkboxes.
 * Used inside FilterButton popovers.
 *
 * @example
 * ```tsx
 * <FilterCheckboxList
 *   options={SITE_TYPES}
 *   selectedValues={filters.selectedTypes}
 *   onChange={(types) => onFilterChange({ selectedTypes: types })}
 *   formatLabel={formatLabel}
 * />
 * ```
 */
export function FilterCheckboxList<T extends string>({
  options,
  selectedValues,
  onChange,
  formatLabel = (v) => v,
  counts,
}: FilterCheckboxListProps<T>) {
  const t = useThemeClasses();

  const toggleOption = (value: T) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  return (
    <div className="space-y-2">
      {options.map((option) => {
        const isSelected = selectedValues.includes(option);
        const count = counts?.[option];
        return (
          <label
            key={option}
            className={cn(
              "flex items-center gap-3 p-2 rounded cursor-pointer transition-colors",
              t.bg.hover
            )}
          >
            {/* Checkbox */}
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggleOption(option)}
              className="w-4 h-4 rounded border-2 text-[#009639] focus:ring-[#009639] focus:ring-2 cursor-pointer"
            />
            <span className={cn("text-sm select-none flex-1", t.text.body)}>
              {formatLabel(option)}
              {count !== undefined && (
                <span className={cn("ml-1.5 text-xs font-mono", t.text.muted)}>
                  ({count})
                </span>
              )}
            </span>
          </label>
        );
      })}
    </div>
  );
}
