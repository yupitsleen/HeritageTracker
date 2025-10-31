import { memo, useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import type { GazaSite, FilterState } from "../../types";
import { SITE_TYPES, STATUS_OPTIONS } from "../../constants/filters";
import { formatLabel } from "../../utils/format";
import { FilterButton } from "./FilterButton";
import { FilterCheckboxList } from "./FilterCheckboxList";
import { FilterTag } from "./FilterTag";
import { DateRangeFilter } from "./DateRangeFilter";
import { YearRangeFilter } from "./YearRangeFilter";
import { Input } from "../Form/Input";
import { Button } from "../Button/Button";
import { CloseIcon } from "../Icons/CloseIcon";
import { useTranslation } from "../../contexts/LocaleContext";
import { useDefaultDateRange } from "../../hooks/useDefaultDateRange";
import { useDefaultYearRange } from "../../hooks/useDefaultYearRange";
import { Z_INDEX } from "../../constants/layout";
import { cn } from "../../styles/theme";
import { useThemeClasses } from "../../hooks/useThemeClasses";

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  sites?: GazaSite[];
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

  // Use provided ranges or calculate from sites
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

  const activeFilterCount =
    filters.selectedTypes.length +
    filters.selectedStatuses.length +
    (filters.destructionDateStart || filters.destructionDateEnd ? 1 : 0) +
    (filters.creationYearStart || filters.creationYearEnd ? 1 : 0);

  // Format date range for pill display
  const formatDateRange = (start: Date | null, end: Date | null) => {
    if (!start && !end) return null;
    const formatDate = (d: Date | null) => d?.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    return `${formatDate(start) || "Start"} - ${formatDate(end) || "End"}`;
  };

  // Format year range for pill display
  const formatYearRange = (start: number | null, end: number | null) => {
    if (!start && !end) return null;
    return `${start || "Start"} - ${end || "End"}`;
  };

  return (
    <div className="space-y-2">
      {/* Main Filter Row */}
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {/* "Filters:" Label - Green */}
        <span className="hidden md:inline-block text-[#009639] font-semibold text-sm">
          Filters:
        </span>

        {/* Search Bar - Always visible */}
        <div className="relative flex-shrink-0 w-full sm:w-auto sm:min-w-[200px]">
          <Input
            type="text"
            value={filters.searchTerm}
            onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
            placeholder={translate("filters.searchPlaceholder")}
            className="w-full h-8 px-2.5 pr-8 text-xs text-black placeholder:text-gray-400"
          />
          {filters.searchTerm.trim().length > 0 && (
            <button
              onClick={() => onFilterChange({ searchTerm: "" })}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={translate("filters.clearSearch")}
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Desktop Filter Buttons - Hidden on mobile */}
        <div className="hidden md:flex md:items-center md:gap-1.5 md:flex-wrap">
          {/* Type Filter */}
          <FilterButton label={translate("filters.selectTypes")} count={filters.selectedTypes.length}>
            <FilterCheckboxList
              options={SITE_TYPES}
              selectedValues={filters.selectedTypes}
              onChange={(types) => onFilterChange({ selectedTypes: types })}
              formatLabel={formatLabel}
            />
          </FilterButton>

          {/* Status Filter */}
          <FilterButton label={translate("filters.selectStatus")} count={filters.selectedStatuses.length}>
            <FilterCheckboxList
              options={STATUS_OPTIONS}
              selectedValues={filters.selectedStatuses}
              onChange={(statuses) => onFilterChange({ selectedStatuses: statuses })}
              formatLabel={formatLabel}
            />
          </FilterButton>

          {/* Destruction Date Filter */}
          <FilterButton
            label={translate("filters.destructionDate")}
            count={filters.destructionDateStart || filters.destructionDateEnd ? 1 : 0}
            panelWidth="min-w-max"
          >
            <DateRangeFilter
              label=""
              startDate={filters.destructionDateStart}
              endDate={filters.destructionDateEnd}
              onStartChange={(date) => onFilterChange({ destructionDateStart: date })}
              onEndChange={(date) => onFilterChange({ destructionDateEnd: date })}
              defaultStartDate={defaultStartDate}
              defaultEndDate={defaultEndDate}
            />
          </FilterButton>

          {/* Year Built Filter */}
          <FilterButton
            label={translate("filters.yearBuilt")}
            count={filters.creationYearStart || filters.creationYearEnd ? 1 : 0}
            panelWidth="min-w-max"
          >
            <YearRangeFilter
              label=""
              onStartChange={(year) => onFilterChange({ creationYearStart: year })}
              onEndChange={(year) => onFilterChange({ creationYearEnd: year })}
              supportBCE={true}
              startYearDefault={defaultStartYear}
              endYearDefault={defaultEndYear}
              startEraDefault={defaultStartEra}
            />
          </FilterButton>
        </div>

        {/* Mobile Filters Button - Visible only on mobile */}
        <button
          onClick={() => setIsMobileFiltersOpen(true)}
          className={cn(
            "md:hidden flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border",
            "transition-all duration-200",
            t.bg.primary,
            t.border.subtle,
            t.bg.hover,
            t.text.body
          )}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#009639] text-white text-xs font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Actions - Centered with filters */}
        {showActions && (
          <>
            {/* Clear All Button */}
            {hasActiveFilters && onClearAll && (
              <Button
                variant="danger"
                size="sm"
                onClick={onClearAll}
                className="whitespace-nowrap"
              >
                {translate("filters.clearAll")}
              </Button>
            )}

            {/* Results Count */}
            <div className={cn("text-sm whitespace-nowrap", t.text.muted)}>
              {translate("filters.showingCount", { filtered: filteredSites, total: totalSites })}
            </div>
          </>
        )}
      </div>

      {/* Active Filter Tags Row */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {/* Type Tags */}
          {filters.selectedTypes.map((type) => (
            <FilterTag
              key={type}
              label={formatLabel(type)}
              onRemove={() =>
                onFilterChange({
                  selectedTypes: filters.selectedTypes.filter((t) => t !== type),
                })
              }
              ariaLabel={`Remove ${formatLabel(type)} filter`}
            />
          ))}

          {/* Status Tags */}
          {filters.selectedStatuses.map((status) => (
            <FilterTag
              key={status}
              label={formatLabel(status)}
              onRemove={() =>
                onFilterChange({
                  selectedStatuses: filters.selectedStatuses.filter((s) => s !== status),
                })
              }
              ariaLabel={`Remove ${formatLabel(status)} filter`}
            />
          ))}

          {/* Destruction Date Tag */}
          {(filters.destructionDateStart || filters.destructionDateEnd) && (
            <FilterTag
              label={formatDateRange(filters.destructionDateStart, filters.destructionDateEnd) || ""}
              onRemove={() =>
                onFilterChange({
                  destructionDateStart: null,
                  destructionDateEnd: null,
                })
              }
              ariaLabel="Remove destruction date filter"
            />
          )}

          {/* Year Built Tag */}
          {(filters.creationYearStart || filters.creationYearEnd) && (
            <FilterTag
              label={(formatYearRange(filters.creationYearStart, filters.creationYearEnd) ?? "")}
              onRemove={() =>
                onFilterChange({
                  creationYearStart: null,
                  creationYearEnd: null,
                })
              }
              ariaLabel="Remove year built filter"
            />
          )}
        </div>
      )}

      {/* Mobile Filters Drawer */}
      <Dialog
        open={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
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
                onClick={() => setIsMobileFiltersOpen(false)}
                className={cn("p-1 rounded-md transition-colors", t.bg.hover)}
                aria-label="Close filters"
              >
                <CloseIcon className="w-6 h-6" />
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
                  onChange={(types) => onFilterChange({ selectedTypes: types })}
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
                  onChange={(statuses) => onFilterChange({ selectedStatuses: statuses })}
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
                  onStartChange={(date) => onFilterChange({ destructionDateStart: date })}
                  onEndChange={(date) => onFilterChange({ destructionDateEnd: date })}
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
                  onStartChange={(year) => onFilterChange({ creationYearStart: year })}
                  onEndChange={(year) => onFilterChange({ creationYearEnd: year })}
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
                  onClick={() => {
                    onClearAll();
                    setIsMobileFiltersOpen(false);
                  }}
                  fullWidth
                >
                  {translate("filters.clearAll")}
                </Button>
              )}
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsMobileFiltersOpen(false)}
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
