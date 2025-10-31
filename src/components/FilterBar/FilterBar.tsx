import { memo } from "react";
import type { GazaSite, FilterState } from "../../types";
import { SITE_TYPES, STATUS_OPTIONS } from "../../constants/filters";
import { formatLabel } from "../../utils/format";
import { MultiSelectDropdown } from "./MultiSelectDropdown";
import { DateRangeFilter } from "./DateRangeFilter";
import { YearRangeFilter } from "./YearRangeFilter";
import { Input } from "../Form/Input";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import { useTranslation } from "../../contexts/LocaleContext";
import { useDefaultDateRange } from "../../hooks/useDefaultDateRange";
import { useDefaultYearRange } from "../../hooks/useDefaultYearRange";
import { Z_INDEX } from "../../constants/layout";

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  sites?: GazaSite[];
  /** Pre-computed default date range to avoid recalculating on every render */
  defaultDateRange?: {
    defaultStartDate: Date;
    defaultEndDate: Date;
  };
  /** Pre-computed default year range to avoid recalculating on every render */
  defaultYearRange?: {
    defaultStartYear: string;
    defaultEndYear: string;
    defaultStartEra: "BCE" | "CE";
  };
}

/**
 * Unified filtering bar that controls all data displayed below
 * Shows active filters and provides clear indication of data scope
 *
 * **Filter Registry Integration:**
 *
 * This component uses the legacy FilterState interface for backward compatibility,
 * but the underlying filter options (SITE_TYPES, STATUS_OPTIONS) are dynamically
 * generated from the filter registry (src/config/filters.ts).
 *
 * To use the new filter registry system with this component:
 *
 * ```typescript
 * import {
 *   filterSitesWithLegacyState,
 *   countActiveFiltersLegacy
 * } from '../../utils/filterStateAdapter';
 *
 * // Filter sites using registry (with legacy state)
 * const filtered = filterSitesWithLegacyState(sites, appState.filters);
 *
 * // Count active filters
 * const activeCount = countActiveFiltersLegacy(appState.filters);
 * ```
 *
 * **Future Migration:**
 *
 * The filter registry provides a more extensible system. Future versions
 * may migrate to a registry-first approach:
 * - Dynamic filter UI rendering based on filter type
 * - Configurable filter labels (i18n support)
 * - Extensible filter types without code changes
 *
 * See src/config/filters.ts for filter registry documentation.
 */
export const FilterBar = memo(function FilterBar({
  filters,
  onFilterChange,
  sites = [],
  defaultDateRange: providedDateRange,
  defaultYearRange: providedYearRange,
}: FilterBarProps) {
  const t = useThemeClasses();
  const translate = useTranslation();

  // Use provided ranges or calculate from sites (fallback for backward compatibility)
  const computedDateRange = useDefaultDateRange(sites);
  const computedYearRange = useDefaultYearRange(sites);

  const { defaultStartDate, defaultEndDate } = providedDateRange || computedDateRange;
  const { defaultStartYear, defaultEndYear, defaultStartEra } = providedYearRange || computedYearRange;

  return (
    <div className="text-white">
      {/* Mobile Search bar */}
      <div className="md:hidden mb-2">
        <div className="relative w-full">
          <Input
            type="text"
            value={filters.searchTerm}
            onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
            placeholder={translate("filters.search")}
            className="w-full pr-8 text-xs py-1 px-2 text-black placeholder:text-gray-400"
          />
          {filters.searchTerm.trim().length > 0 && (
            <button
              onClick={() => onFilterChange({ searchTerm: "" })}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={translate("filters.clearSearch")}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Filter controls - horizontal layout (hidden on mobile) */}
      <div className="hidden md:flex md:gap-4 md:items-start">
        {/* Type Filter */}
        <div className="flex-1 min-w-0">
          <label className={`block text-xs font-semibold mb-1.5 ${t.text.heading}`}>{translate("filters.siteType")}</label>
          <MultiSelectDropdown
            label={translate("filters.selectTypes")}
            options={SITE_TYPES}
            selectedValues={filters.selectedTypes}
            onChange={(types) => onFilterChange({ selectedTypes: types })}
            formatLabel={formatLabel}
            zIndex={Z_INDEX.DROPDOWN}
          />
        </div>

        {/* Status Filter */}
        <div className="flex-1 min-w-0">
          <label className={`block text-xs font-semibold mb-1.5 ${t.text.heading}`}>{translate("filters.status")}</label>
          <MultiSelectDropdown
            label={translate("filters.selectStatus")}
            options={STATUS_OPTIONS}
            selectedValues={filters.selectedStatuses}
            onChange={(statuses) => onFilterChange({ selectedStatuses: statuses })}
            formatLabel={formatLabel}
            zIndex={Z_INDEX.DROPDOWN}
          />
        </div>

        {/* Destruction Date Range */}
        <div className="flex-1 min-w-0">
          <DateRangeFilter
            label={translate("filters.destructionDate")}
            startDate={filters.destructionDateStart}
            endDate={filters.destructionDateEnd}
            onStartChange={(date) => onFilterChange({ destructionDateStart: date })}
            onEndChange={(date) => onFilterChange({ destructionDateEnd: date })}
            defaultStartDate={defaultStartDate}
            defaultEndDate={defaultEndDate}
          />
        </div>

        {/* Creation Year Range */}
        <div className="flex-1 min-w-0">
          <YearRangeFilter
            label={translate("filters.yearBuilt")}
            onStartChange={(year) => onFilterChange({ creationYearStart: year })}
            onEndChange={(year) => onFilterChange({ creationYearEnd: year })}
            supportBCE={true}
            startYearDefault={defaultStartYear}
            endYearDefault={defaultEndYear}
            startEraDefault={defaultStartEra}
          />
        </div>
      </div>
    </div>
  );
});
