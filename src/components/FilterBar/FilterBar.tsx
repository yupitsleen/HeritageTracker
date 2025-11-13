import { memo, useState, useMemo, useEffect, useCallback } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import type { Site, FilterState } from "../../types";
import { SITE_TYPES, STATUS_OPTIONS } from "../../constants/filters";
import { formatLabel, formatDateRange, formatYearRange } from "../../utils/format";
import { FilterButton } from "./FilterButton";
import { FilterCheckboxList } from "./FilterCheckboxList";
import { FilterTag } from "./FilterTag";
import { DateRangeFilter } from "./DateRangeFilter";
import { YearRangeFilter } from "./YearRangeFilter";
import { Input } from "../Form/Input";
import { Button } from "../Button/Button";
import { CountBadge } from "../Badge/CountBadge";
import { CloseIcon } from "../Icons/CloseIcon";
import { StatusLegend } from "../Map/StatusLegend";
import { Tooltip } from "../Tooltip";
import { useTranslation } from "../../contexts/LocaleContext";
import { useDefaultDateRange } from "../../hooks/useDefaultDateRange";
import { useDefaultYearRange } from "../../hooks/useDefaultYearRange";
import { useActiveFilters } from "../../hooks/useActiveFilters";
import { useDebounce } from "../../hooks/useDebounce";
import { Z_INDEX } from "../../constants/layout";
import { cn } from "../../styles/theme";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import { TOOLTIPS } from "../../config/tooltips";

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  sites?: Site[];
  defaultDateRange?: {
    defaultStartDate: Date;
    defaultEndDate: Date;
  };
  defaultYearRange?: {
    defaultStartYear: string;
    defaultEndYear: string;
    defaultStartEra: "BCE" | "CE";
  };
  showActions?: boolean;
  totalSites?: number;
  filteredSites?: number;
  onClearAll?: () => void;
}

/**
 * FilterBar - Redesigned with pill/badge system for better UX
 *
 * **Key Improvements:**
 * - Compact filter buttons with count badges (Toggl-inspired)
 * - Active filters displayed as removable pills below
 * - Responsive mobile drawer instead of awkward stacking
 * - Better use of horizontal space on desktop
 * - Uses Headless UI (Popover, Dialog) for accessibility
 *
 * **Design Pattern:**
 * Desktop: [Search] [Filter Buttons] [Clear All] [Count]
 *          [Active Filter Pills]
 *
 * Mobile:  [Search] [Filters Button (count)] [Count]
 *          [Active Filter Pills]
 *          [Mobile Drawer for all filters]
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
  const t = useThemeClasses();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Local state for search input (for immediate UI feedback)
  const [searchInputValue, setSearchInputValue] = useState(filters.searchTerm);

  // Debounce search to avoid filtering on every keystroke (300ms delay)
  const debouncedSearchTerm = useDebounce(searchInputValue, 300);

  // Update filter when debounced value changes
  useEffect(() => {
    if (debouncedSearchTerm !== filters.searchTerm) {
      onFilterChange({ searchTerm: debouncedSearchTerm });
    }
  }, [debouncedSearchTerm, filters.searchTerm, onFilterChange]);

  // Sync local state when external searchTerm changes (e.g., clear all filters)
  useEffect(() => {
    setSearchInputValue(filters.searchTerm);
  }, [filters.searchTerm]);

  // Use provided ranges or calculate from sites
  const computedDateRange = useDefaultDateRange(sites);
  const computedYearRange = useDefaultYearRange(sites);

  const { defaultStartDate, defaultEndDate } = providedDateRange || computedDateRange;
  const { defaultStartYear, defaultEndYear, defaultStartEra } = providedYearRange || computedYearRange;

  // Use custom hook for derived filter state (memoized)
  const { hasActiveFilters, activeFilterCount } = useActiveFilters(filters);

  // Memoized formatted ranges for filter pills
  const dateRangeLabel = useMemo(
    () => formatDateRange(filters.destructionDateStart, filters.destructionDateEnd),
    [filters.destructionDateStart, filters.destructionDateEnd]
  );

  const yearRangeLabel = useMemo(
    () => formatYearRange(filters.creationYearStart, filters.creationYearEnd),
    [filters.creationYearStart, filters.creationYearEnd]
  );

  // Memoized callback handlers to prevent unnecessary re-renders
  const handleSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(e.target.value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchInputValue("");
  }, []);

  const handleOpenMobileFilters = useCallback(() => {
    setIsMobileFiltersOpen(true);
  }, []);

  const handleCloseMobileFilters = useCallback(() => {
    setIsMobileFiltersOpen(false);
  }, []);

  const handleMobileClearAllAndClose = useCallback(() => {
    onClearAll?.();
    setIsMobileFiltersOpen(false);
  }, [onClearAll]);

  // Filter change handlers (memoized with stable references)
  const handleTypesChange = useCallback((types: string[]) => {
    onFilterChange({ selectedTypes: types });
  }, [onFilterChange]);

  const handleStatusesChange = useCallback((statuses: string[]) => {
    onFilterChange({ selectedStatuses: statuses });
  }, [onFilterChange]);

  const handleDestructionStartDateChange = useCallback((date: Date | null) => {
    onFilterChange({ destructionDateStart: date });
  }, [onFilterChange]);

  const handleDestructionEndDateChange = useCallback((date: Date | null) => {
    onFilterChange({ destructionDateEnd: date });
  }, [onFilterChange]);

  const handleCreationYearStartChange = useCallback((year: number | null) => {
    onFilterChange({ creationYearStart: year });
  }, [onFilterChange]);

  const handleCreationYearEndChange = useCallback((year: number | null) => {
    onFilterChange({ creationYearEnd: year });
  }, [onFilterChange]);

  const handleRemoveDestructionDateFilter = useCallback(() => {
    onFilterChange({
      destructionDateStart: null,
      destructionDateEnd: null,
    });
  }, [onFilterChange]);

  const handleRemoveYearBuiltFilter = useCallback(() => {
    onFilterChange({
      creationYearStart: null,
      creationYearEnd: null,
    });
  }, [onFilterChange]);

  // Factory function for creating memoized remove handlers for filter tags
  const createRemoveTypeHandler = useCallback((typeToRemove: string) => {
    return () => {
      onFilterChange({
        selectedTypes: filters.selectedTypes.filter((t) => t !== typeToRemove),
      });
    };
  }, [onFilterChange, filters.selectedTypes]);

  const createRemoveStatusHandler = useCallback((statusToRemove: string) => {
    return () => {
      onFilterChange({
        selectedStatuses: filters.selectedStatuses.filter((s) => s !== statusToRemove),
      });
    };
  }, [onFilterChange, filters.selectedStatuses]);

  return (
    <div className="space-y-2">
      {/* Main Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        {/* Results Count - Far left, super small */}
        {showActions && (
          <div className={cn("text-[10px] whitespace-nowrap", t.text.muted)}>
            {translate("filters.showingCount", { filtered: filteredSites, total: totalSites })}
          </div>
        )}

        {/* Center: Filters */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 flex-1">
          {/* Search Bar - Always visible (with debouncing) */}
          <div className="relative flex-shrink-0 w-full sm:w-auto sm:min-w-[200px]">
            <Input
              type="text"
              value={searchInputValue}
              onChange={handleSearchInputChange}
              placeholder={translate("filters.searchPlaceholder")}
              className="w-full h-8 px-2.5 pr-8 text-xs text-black placeholder:text-gray-400"
            />
            {searchInputValue.trim().length > 0 && (
              <Tooltip content={TOOLTIPS.FILTERS.CLEAR_SEARCH}>
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:ring-2 focus:ring-[#009639] focus:outline-none rounded"
                  aria-label={translate("filters.clearSearch")}
                >
                  <CloseIcon className="w-4 h-4" aria-hidden="true" />
                </button>
              </Tooltip>
            )}
          </div>

          {/* Desktop Filter Buttons - Hidden on mobile */}
          <div className="hidden md:flex md:items-center md:gap-1.5 md:flex-wrap">
          {/* Type Filter */}
          <FilterButton
            label={translate("filters.selectTypes")}
            count={filters.selectedTypes.length}
            tooltip={TOOLTIPS.FILTERS.TYPE_FILTER}
          >
            <FilterCheckboxList
              options={SITE_TYPES}
              selectedValues={filters.selectedTypes}
              onChange={handleTypesChange}
              formatLabel={formatLabel}
            />
          </FilterButton>

          {/* Status Filter */}
          <FilterButton
            label={translate("filters.selectStatus")}
            count={filters.selectedStatuses.length}
            tooltip={TOOLTIPS.FILTERS.STATUS_FILTER}
          >
            <FilterCheckboxList
              options={STATUS_OPTIONS}
              selectedValues={filters.selectedStatuses}
              onChange={handleStatusesChange}
              formatLabel={formatLabel}
            />
          </FilterButton>

          {/* Destruction Date Filter */}
          <FilterButton
            label={translate("filters.destructionDate")}
            count={filters.destructionDateStart || filters.destructionDateEnd ? 1 : 0}
            panelWidth="min-w-max"
            tooltip={TOOLTIPS.FILTERS.DATE_FILTER}
          >
            <DateRangeFilter
              label=""
              startDate={filters.destructionDateStart}
              endDate={filters.destructionDateEnd}
              onStartChange={handleDestructionStartDateChange}
              onEndChange={handleDestructionEndDateChange}
              defaultStartDate={defaultStartDate}
              defaultEndDate={defaultEndDate}
            />
          </FilterButton>

          {/* Year Built Filter */}
          <FilterButton
            label={translate("filters.yearBuilt")}
            count={filters.creationYearStart || filters.creationYearEnd ? 1 : 0}
            panelWidth="min-w-max"
            tooltip={TOOLTIPS.FILTERS.YEAR_FILTER}
          >
            <YearRangeFilter
              label=""
              onStartChange={handleCreationYearStartChange}
              onEndChange={handleCreationYearEndChange}
              supportBCE={true}
              startYearDefault={defaultStartYear}
              endYearDefault={defaultEndYear}
              startEraDefault={defaultStartEra}
            />
          </FilterButton>
          </div>

          {/* Mobile Filters Button - Visible only on mobile */}
          <Tooltip content={TOOLTIPS.FILTERS.OPEN_MOBILE}>
            <button
              type="button"
              onClick={handleOpenMobileFilters}
              className={cn(
                "md:hidden flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border",
                "transition-all duration-200 focus:ring-2 focus:ring-[#009639] focus:outline-none",
                t.bg.primary,
                t.border.subtle,
                t.bg.hover,
                t.text.body
              )}
              aria-label={translate("filters.openFilters")}
              aria-expanded={isMobileFiltersOpen}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span>Filters</span>
              {activeFilterCount > 0 && <CountBadge count={activeFilterCount} variant="primary" />}
            </button>
          </Tooltip>

          {/* Clear All Button */}
          {showActions && hasActiveFilters && onClearAll && (
            <Tooltip content={TOOLTIPS.FILTERS.CLEAR_ALL}>
              <Button
                variant="danger"
                size="sm"
                onClick={onClearAll}
                className="whitespace-nowrap"
              >
                {translate("filters.clearAll")}
              </Button>
            </Tooltip>
          )}
        </div>

        {/* Status Legend - Far right, desktop only */}
        <div className="hidden lg:flex">
          <StatusLegend compact />
        </div>
      </div>

      {/* Active Filter Tags Row */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {/* Type Tags */}
          {filters.selectedTypes.map((type) => (
            <FilterTag
              key={type}
              label={formatLabel(type)}
              onRemove={createRemoveTypeHandler(type)}
              ariaLabel={`Remove ${formatLabel(type)} filter`}
            />
          ))}

          {/* Status Tags */}
          {filters.selectedStatuses.map((status) => (
            <FilterTag
              key={status}
              label={formatLabel(status)}
              onRemove={createRemoveStatusHandler(status)}
              ariaLabel={`Remove ${formatLabel(status)} filter`}
            />
          ))}

          {/* Destruction Date Tag */}
          {dateRangeLabel && (
            <FilterTag
              label={dateRangeLabel}
              onRemove={handleRemoveDestructionDateFilter}
              ariaLabel="Remove destruction date filter"
            />
          )}

          {/* Year Built Tag */}
          {yearRangeLabel && (
            <FilterTag
              label={yearRangeLabel}
              onRemove={handleRemoveYearBuiltFilter}
              ariaLabel="Remove year built filter"
            />
          )}
        </div>
      )}

      {/* Mobile Filters Drawer */}
      <Dialog
        open={isMobileFiltersOpen}
        onClose={handleCloseMobileFilters}
        className="relative md:hidden"
        style={{ zIndex: Z_INDEX.MODAL }}
      >
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        {/* Drawer */}
        <div className="fixed inset-0 flex items-end justify-center">
          <DialogPanel
            className={cn(
              "w-full max-h-[85vh] rounded-t-2xl p-6 overflow-y-auto",
              "animate-slide-up",
              t.bg.primary
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <DialogTitle className={cn("text-lg font-semibold", t.text.heading)}>
                Filters
              </DialogTitle>
              <button
                type="button"
                onClick={handleCloseMobileFilters}
                className={cn("p-1 rounded-md transition-colors focus:ring-2 focus:ring-[#009639] focus:outline-none", t.bg.hover)}
                aria-label="Close filters"
              >
                <CloseIcon className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>

            {/* Filter Sections */}
            <div className="space-y-6">
              {/* Type Filter */}
              <div>
                <h3 className={cn("text-sm font-semibold mb-2", t.text.heading)}>
                  {translate("filters.selectTypes")}
                </h3>
                <FilterCheckboxList
                  options={SITE_TYPES}
                  selectedValues={filters.selectedTypes}
                  onChange={handleTypesChange}
                  formatLabel={formatLabel}
                />
              </div>

              {/* Status Filter */}
              <div>
                <h3 className={cn("text-sm font-semibold mb-2", t.text.heading)}>
                  {translate("filters.selectStatus")}
                </h3>
                <FilterCheckboxList
                  options={STATUS_OPTIONS}
                  selectedValues={filters.selectedStatuses}
                  onChange={handleStatusesChange}
                  formatLabel={formatLabel}
                />
              </div>

              {/* Destruction Date Filter */}
              <div>
                <h3 className={cn("text-sm font-semibold mb-2", t.text.heading)}>
                  {translate("filters.destructionDate")}
                </h3>
                <DateRangeFilter
                  label=""
                  startDate={filters.destructionDateStart}
                  endDate={filters.destructionDateEnd}
                  onStartChange={handleDestructionStartDateChange}
                  onEndChange={handleDestructionEndDateChange}
                  defaultStartDate={defaultStartDate}
                  defaultEndDate={defaultEndDate}
                />
              </div>

              {/* Year Built Filter */}
              <div>
                <h3 className={cn("text-sm font-semibold mb-2", t.text.heading)}>
                  {translate("filters.yearBuilt")}
                </h3>
                <YearRangeFilter
                  label=""
                  onStartChange={handleCreationYearStartChange}
                  onEndChange={handleCreationYearEndChange}
                  supportBCE={true}
                  startYearDefault={defaultStartYear}
                  endYearDefault={defaultEndYear}
                  startEraDefault={defaultStartEra}
                />
              </div>
            </div>

            {/* Mobile Drawer Actions */}
            <div className="mt-6 flex gap-3">
              {hasActiveFilters && onClearAll && (
                <Button
                  variant="danger"
                  size="md"
                  onClick={handleMobileClearAllAndClose}
                  fullWidth
                >
                  {translate("filters.clearAll")}
                </Button>
              )}
              <Button
                variant="primary"
                size="md"
                onClick={handleCloseMobileFilters}
                fullWidth
              >
                Apply
              </Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
});
