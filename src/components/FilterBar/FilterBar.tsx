import { useMemo } from "react";
import type { GazaSite, FilterState } from "../../types";
import { SITE_TYPES, STATUS_OPTIONS } from "../../constants/filters";
import { formatLabel } from "../../utils/format";
import { parseYearBuilt } from "../../utils/siteFilters";
import { MultiSelectDropdown } from "./MultiSelectDropdown";
import { DateRangeFilter } from "./DateRangeFilter";
import { YearRangeFilter } from "./YearRangeFilter";
import { Input } from "../Form/Input";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import { useTranslation } from "../../contexts/LocaleContext";

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  sites?: GazaSite[];
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
export function FilterBar({
  filters,
  onFilterChange,
  sites = [],
}: FilterBarProps) {
  const t = useThemeClasses();
  const translate = useTranslation();

  // Calculate default date range from all sites' destruction dates
  const { defaultStartDate, defaultEndDate } = useMemo(() => {
    const destructionDates = sites
      .filter(site => site.dateDestroyed)
      .map(site => new Date(site.dateDestroyed!));

    if (destructionDates.length === 0) {
      const fallbackStart = new Date("2023-10-07"); // Conflict start date
      const fallbackEnd = new Date();
      return { defaultStartDate: fallbackStart, defaultEndDate: fallbackEnd };
    }

    const timestamps = destructionDates.map(d => d.getTime());
    return {
      defaultStartDate: new Date(Math.min(...timestamps)),
      defaultEndDate: new Date(Math.max(...timestamps)),
    };
  }, [sites]);

  // Calculate default year range from all sites' creation years
  const { defaultStartYear, defaultEndYear, defaultStartEra } = useMemo(() => {
    const creationYears = sites
      .filter(site => site.yearBuilt)
      .map(site => parseYearBuilt(site.yearBuilt))
      .filter((year): year is number => year !== null);

    if (creationYears.length === 0) {
      return {
        defaultStartYear: "",
        defaultEndYear: new Date().getFullYear().toString(),
        defaultStartEra: "CE" as const
      };
    }

    const minYear = Math.min(...creationYears);
    const maxYear = Math.max(...creationYears);

    // Format the years for display
    const formatYear = (year: number): string => {
      if (year < 0) {
        return Math.abs(year).toString(); // Will be shown with BCE dropdown
      }
      return year.toString();
    };

    return {
      defaultStartYear: formatYear(minYear),
      defaultEndYear: formatYear(maxYear),
      defaultStartEra: minYear < 0 ? ("BCE" as const) : ("CE" as const),
    };
  }, [sites]);

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

      {/* Filter controls - grid layout for modal (hidden on mobile) */}
      <div className="hidden md:grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Type Filter */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${t.text.heading}`}>{translate("filters.siteType")}</label>
            <MultiSelectDropdown
              label={translate("filters.selectTypes")}
              options={SITE_TYPES}
              selectedValues={filters.selectedTypes}
              onChange={(types) => onFilterChange({ selectedTypes: types })}
              formatLabel={formatLabel}
            />
          </div>

          {/* Destruction Date Range */}
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

        {/* Right Column */}
        <div className="space-y-4">
          {/* Status Filter */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${t.text.heading}`}>{translate("filters.status")}</label>
            <MultiSelectDropdown
              label={translate("filters.selectStatus")}
              options={STATUS_OPTIONS}
              selectedValues={filters.selectedStatuses}
              onChange={(statuses) => onFilterChange({ selectedStatuses: statuses })}
              formatLabel={formatLabel}
            />
          </div>

          {/* Creation Year Range */}
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
}
