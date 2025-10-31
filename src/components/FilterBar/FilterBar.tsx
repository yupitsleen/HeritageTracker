import { memo } from "react";
import type { GazaSite, FilterState } from "../../types";
import { SITE_TYPES, STATUS_OPTIONS } from "../../constants/filters";
import { formatLabel } from "../../utils/format";
import { MultiSelectDropdown } from "./MultiSelectDropdown";
import { DateRangeFilter } from "./DateRangeFilter";
import { YearRangeFilter } from "./YearRangeFilter";
import { Input } from "../Form/Input";
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
  /** Show Clear All button and results count */
  showActions?: boolean;
  /** Total number of sites (for results count) */
  totalSites?: number;
  /** Filtered number of sites (for results count) */
  filteredSites?: number;
  /** Callback for Clear All button */
  onClearAll?: () => void;
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
  showActions = false,
  totalSites = 0,
  filteredSites = 0,
  onClearAll,
}: FilterBarProps) {
  const translate = useTranslation();

  // Use provided ranges or calculate from sites (fallback for backward compatibility)
  const computedDateRange = useDefaultDateRange(sites);
  const computedYearRange = useDefaultYearRange(sites);

  const { defaultStartDate, defaultEndDate } = providedDateRange || computedDateRange;
  const { defaultStartYear, defaultEndYear, defaultStartEra } = providedYearRange || computedYearRange;

  // Check if any filters are active
  const hasActiveFilters =
    filters.selectedTypes.length > 0 ||
    filters.selectedStatuses.length > 0 ||
    filters.destructionDateStart !== null ||
    filters.destructionDateEnd !== null ||
    filters.creationYearStart !== null ||
    filters.creationYearEnd !== null ||
    filters.searchTerm.trim().length > 0;

  return (
    <div className="text-white">
      {/* Desktop: Single row layout with search on far left */}
      <div className="hidden md:flex md:flex-wrap md:gap-3 md:items-start">
        {/* Search Bar - Far Left */}
        <div className="relative flex-1 max-w-[200px] min-w-[180px]">
          <Input
            type="text"
            value={filters.searchTerm}
            onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
            placeholder={translate("filters.searchPlaceholder")}
            className="w-full h-9 px-3 pr-8 text-sm text-black placeholder:text-gray-400"
          />
          {filters.searchTerm.trim().length > 0 && (
            <button
              onClick={() => onFilterChange({ searchTerm: "" })}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={translate("filters.clearSearch")}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        {/* Type Filter */}
        <div className="flex-1 min-w-[150px] max-w-[180px]">
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
        <div className="flex-1 min-w-[150px] max-w-[180px]">
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
        <div className="flex-1 min-w-[280px]">
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
        <div className="flex-1 min-w-[300px]">
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

        {/* Actions - Far Right */}
        {showActions && (
          <>
            {/* Spacer to push actions to the right */}
            <div className="flex-grow"></div>

            {/* Clear All Button */}
            {hasActiveFilters && onClearAll && (
              <button
                onClick={onClearAll}
                className="px-4 h-9 bg-[#CE1126] hover:bg-[#a00d1e] text-white rounded shadow-md hover:shadow-lg transition-all duration-200 font-semibold active:scale-95 text-sm whitespace-nowrap"
              >
                {translate("filters.clearAll")}
              </button>
            )}

            {/* Results Count */}
            <div className="text-sm text-gray-300 self-center whitespace-nowrap">
              {translate("filters.showingCount", { filtered: filteredSites, total: totalSites })}
            </div>
          </>
        )}
      </div>

      {/* Mobile: Vertical stack layout */}
      <div className="md:hidden space-y-2">
        {/* Search Bar */}
        <div className="relative w-full">
          <Input
            type="text"
            value={filters.searchTerm}
            onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
            placeholder={translate("filters.searchPlaceholder")}
            className="w-full h-9 px-3 pr-8 text-sm text-black placeholder:text-gray-400"
          />
          {filters.searchTerm.trim().length > 0 && (
            <button
              onClick={() => onFilterChange({ searchTerm: "" })}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={translate("filters.clearSearch")}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        {/* Filter Dropdowns */}
        <div className="flex gap-2">
          <div className="flex-1">
            <MultiSelectDropdown
              label={translate("filters.selectTypes")}
              options={SITE_TYPES}
              selectedValues={filters.selectedTypes}
              onChange={(types) => onFilterChange({ selectedTypes: types })}
              formatLabel={formatLabel}
              zIndex={Z_INDEX.DROPDOWN}
            />
          </div>
          <div className="flex-1">
            <MultiSelectDropdown
              label={translate("filters.selectStatus")}
              options={STATUS_OPTIONS}
              selectedValues={filters.selectedStatuses}
              onChange={(statuses) => onFilterChange({ selectedStatuses: statuses })}
              formatLabel={formatLabel}
              zIndex={Z_INDEX.DROPDOWN}
            />
          </div>
        </div>

        {/* Date Filters */}
        <DateRangeFilter
          label={translate("filters.destructionDate")}
          startDate={filters.destructionDateStart}
          endDate={filters.destructionDateEnd}
          onStartChange={(date) => onFilterChange({ destructionDateStart: date })}
          onEndChange={(date) => onFilterChange({ destructionDateEnd: date })}
          defaultStartDate={defaultStartDate}
          defaultEndDate={defaultEndDate}
        />

        <YearRangeFilter
          label={translate("filters.yearBuilt")}
          onStartChange={(year) => onFilterChange({ creationYearStart: year })}
          onEndChange={(year) => onFilterChange({ creationYearEnd: year })}
          supportBCE={true}
          startYearDefault={defaultStartYear}
          endYearDefault={defaultEndYear}
          startEraDefault={defaultStartEra}
        />

        {/* Mobile Actions */}
        {showActions && (
          <div className="flex items-center justify-between gap-2">
            {hasActiveFilters && onClearAll && (
              <button
                onClick={onClearAll}
                className="px-4 h-9 bg-[#CE1126] hover:bg-[#a00d1e] text-white rounded shadow-md hover:shadow-lg transition-all duration-200 font-semibold active:scale-95 text-sm"
              >
                {translate("filters.clearAll")}
              </button>
            )}
            <div className="text-sm text-gray-300 whitespace-nowrap">
              {translate("filters.showingCount", { filtered: filteredSites, total: totalSites })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
