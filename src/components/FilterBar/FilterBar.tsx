import { useMemo } from "react";
import type { GazaSite } from "../../types";
import { SITE_TYPES, STATUS_OPTIONS } from "../../constants/filters";
import { formatLabel } from "../../utils/format";
import { parseYearBuilt } from "../../utils/siteFilters";
import { MultiSelectDropdown } from "./MultiSelectDropdown";
import { DateRangeFilter } from "./DateRangeFilter";
import { YearRangeFilter } from "./YearRangeFilter";
import { Input } from "../Form/Input";
import { useThemeClasses } from "../../hooks/useThemeClasses";

interface FilterBarProps {
  selectedTypes: Array<GazaSite["type"]>;
  selectedStatuses: Array<GazaSite["status"]>;
  destructionDateStart: Date | null;
  destructionDateEnd: Date | null;
  searchTerm: string;
  onTypeChange: (types: Array<GazaSite["type"]>) => void;
  onStatusChange: (statuses: Array<GazaSite["status"]>) => void;
  onDestructionDateStartChange: (date: Date | null) => void;
  onDestructionDateEndChange: (date: Date | null) => void;
  onCreationYearStartChange: (year: number | null) => void;
  onCreationYearEndChange: (year: number | null) => void;
  onSearchChange: (term: string) => void;
  sites?: GazaSite[]; // Optional for calculating default dates
}

/**
 * Unified filtering bar that controls all data displayed below
 * Shows active filters and provides clear indication of data scope
 */
export function FilterBar({
  selectedTypes,
  selectedStatuses,
  destructionDateStart,
  destructionDateEnd,
  searchTerm,
  onTypeChange,
  onStatusChange,
  onDestructionDateStartChange,
  onDestructionDateEndChange,
  onCreationYearStartChange,
  onCreationYearEndChange,
  onSearchChange,
  sites = [],
}: FilterBarProps) {
  const t = useThemeClasses();

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
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search"
            className="w-full pr-8 text-xs py-1 px-2 text-black placeholder:text-gray-400"
          />
          {searchTerm.trim().length > 0 && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
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
            <label className={`block text-sm font-semibold mb-2 ${t.text.heading}`}>Site Type</label>
            <MultiSelectDropdown
              label="Select types..."
              options={SITE_TYPES}
              selectedValues={selectedTypes}
              onChange={onTypeChange}
              formatLabel={formatLabel}
            />
          </div>

          {/* Destruction Date Range */}
          <DateRangeFilter
            label="Destruction Date"
            startDate={destructionDateStart}
            endDate={destructionDateEnd}
            onStartChange={onDestructionDateStartChange}
            onEndChange={onDestructionDateEndChange}
            defaultStartDate={defaultStartDate}
            defaultEndDate={defaultEndDate}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Status Filter */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${t.text.heading}`}>Status</label>
            <MultiSelectDropdown
              label="Select status..."
              options={STATUS_OPTIONS}
              selectedValues={selectedStatuses}
              onChange={onStatusChange}
              formatLabel={formatLabel}
            />
          </div>

          {/* Creation Year Range */}
          <YearRangeFilter
            label="Year Built"
            onStartChange={onCreationYearStartChange}
            onEndChange={onCreationYearEndChange}
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
