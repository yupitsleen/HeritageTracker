import React from "react";
import type { GazaSite } from "../../types";
import { components, cn } from "../../styles/theme";
import { SITE_TYPES, STATUS_OPTIONS } from "../../constants/filters";
import { formatLabel } from "../../utils/format";
import { MultiSelectDropdown } from "./MultiSelectDropdown";
import { FilterTag } from "./FilterTag";
import { useCalendar } from "../../contexts/CalendarContext";
import { Tooltip } from "../Tooltip";
import { Input } from "../Form/Input";
import { Select } from "../Form/Select";

interface FilterBarProps {
  selectedTypes: Array<GazaSite["type"]>;
  selectedStatuses: Array<GazaSite["status"]>;
  destructionDateStart: Date | null;
  destructionDateEnd: Date | null;
  creationYearStart: number | null;
  creationYearEnd: number | null;
  onTypeChange: (types: Array<GazaSite["type"]>) => void;
  onStatusChange: (statuses: Array<GazaSite["status"]>) => void;
  onDestructionDateStartChange: (date: Date | null) => void;
  onDestructionDateEndChange: (date: Date | null) => void;
  onCreationYearStartChange: (year: number | null) => void;
  onCreationYearEndChange: (year: number | null) => void;
  filteredCount: number;
  totalCount: number;
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
  creationYearStart,
  creationYearEnd,
  onTypeChange,
  onStatusChange,
  onDestructionDateStartChange,
  onDestructionDateEndChange,
  onCreationYearStartChange,
  onCreationYearEndChange,
  filteredCount,
  totalCount,
}: FilterBarProps) {
  const { calendarType, toggleCalendar } = useCalendar();

  // Local state for year input and era selection
  const [startYearInput, setStartYearInput] = React.useState("");
  const [startYearEra, setStartYearEra] = React.useState<"CE" | "BCE">("CE");
  const [endYearInput, setEndYearInput] = React.useState("");
  const [endYearEra, setEndYearEra] = React.useState<"CE" | "BCE">("CE");

  // Update parent state when year or era changes
  const handleStartYearChange = (input: string, era: "CE" | "BCE") => {
    setStartYearInput(input);
    setStartYearEra(era);
    if (input.trim() && !isNaN(parseInt(input))) {
      const year = Math.abs(parseInt(input)); // Ensure positive
      onCreationYearStartChange(era === "BCE" ? -year : year);
    } else {
      onCreationYearStartChange(null);
    }
  };

  const handleEndYearChange = (input: string, era: "CE" | "BCE") => {
    setEndYearInput(input);
    setEndYearEra(era);
    if (input.trim() && !isNaN(parseInt(input))) {
      const year = Math.abs(parseInt(input)); // Ensure positive
      onCreationYearEndChange(era === "BCE" ? -year : year);
    } else {
      onCreationYearEndChange(null);
    }
  };

  const hasActiveFilters =
    selectedTypes.length > 0 ||
    selectedStatuses.length > 0 ||
    destructionDateStart !== null ||
    destructionDateEnd !== null ||
    creationYearStart !== null ||
    creationYearEnd !== null;

  const clearAllFilters = () => {
    onTypeChange([]);
    onStatusChange([]);
    onDestructionDateStartChange(null);
    onDestructionDateEndChange(null);
    onCreationYearStartChange(null);
    onCreationYearEndChange(null);
    setStartYearInput("");
    setEndYearInput("");
    setStartYearEra("CE");
    setEndYearEra("CE");
  };

  return (
    <div className={cn(components.card.base, "px-4 py-3 mb-6")}>
      {/* Filter controls - sleek horizontal layout */}
      <div className="flex items-end justify-center gap-4 flex-wrap">
        {/* Calendar Toggle */}
        <button
          onClick={toggleCalendar}
          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md text-sm font-medium text-gray-700 transition-colors"
          aria-label="Toggle calendar type"
        >
          {calendarType === "gregorian"
            ? "Switch to Islamic Calendar"
            : "Switch to Gregorian Calendar"}
        </button>
        {/* Live region for screen readers to announce calendar changes */}
        <div role="status" aria-live="polite" className="sr-only">
          {calendarType === "gregorian"
            ? "Displaying Gregorian calendar dates"
            : "Displaying Islamic calendar dates"}
        </div>
        <div className="flex items-center gap-3">
          {/* Type Filter Dropdown */}
          <MultiSelectDropdown
            label="Site Type"
            options={SITE_TYPES}
            selectedValues={selectedTypes}
            onChange={onTypeChange}
            formatLabel={formatLabel}
          />

          {/* Status Filter Dropdown */}
          <MultiSelectDropdown
            label="Status"
            options={STATUS_OPTIONS}
            selectedValues={selectedStatuses}
            onChange={onStatusChange}
            formatLabel={formatLabel}
          />
        </div>

        {/* Destruction Date Range */}
        <div className="flex flex-col gap-1 px-3 py-2 border border-gray-200 rounded-md bg-gray-50/50">
          <div className="flex items-center gap-1 justify-center">
            <label className="text-xs font-medium text-gray-600">Destroyed (Gregorian)</label>
            <Tooltip content="Date filters use Gregorian calendar only">
              <svg className="w-3.5 h-3.5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </Tooltip>
          </div>
          <div className="flex items-center gap-2">
            <Input
              variant="date"
              value={destructionDateStart ? destructionDateStart.toISOString().split("T")[0] : ""}
              onChange={(e) => {
                onDestructionDateStartChange(e.target.value ? new Date(e.target.value) : null);
              }}
              placeholder="From"
            />
            <span className="text-xs text-gray-500">to</span>
            <Input
              variant="date"
              value={destructionDateEnd ? destructionDateEnd.toISOString().split("T")[0] : ""}
              onChange={(e) => {
                onDestructionDateEndChange(e.target.value ? new Date(e.target.value) : null);
              }}
              placeholder="To"
            />
          </div>
        </div>

        {/* Creation Year Range - Always uses Gregorian (CE/BCE) for filtering */}
        <div className="flex flex-col gap-1 px-3 py-2 border border-gray-200 rounded-md bg-gray-50/50">
          <div className="flex items-center gap-1 justify-center">
            <label className="text-xs font-medium text-gray-600">Built (CE/BCE)</label>
            <Tooltip content="Year filters use Gregorian calendar only">
              <svg className="w-3.5 h-3.5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </Tooltip>
          </div>
          <div className="flex items-center gap-2">
            <Input
              variant="number"
              value={startYearInput}
              onChange={(e) => handleStartYearChange(e.target.value, startYearEra)}
              placeholder="Year"
              min="1"
            />
            <Select
              size="small"
              value={startYearEra}
              onChange={(e) =>
                handleStartYearChange(startYearInput, e.target.value as "CE" | "BCE")
              }
            >
              <option value="BCE">BCE</option>
              <option value="CE">CE</option>
            </Select>
            <span className="text-xs text-gray-500">to</span>
            <Input
              variant="number"
              value={endYearInput}
              onChange={(e) => handleEndYearChange(e.target.value, endYearEra)}
              placeholder="Year"
              min="1"
            />
            <Select
              size="small"
              value={endYearEra}
              onChange={(e) => handleEndYearChange(endYearInput, e.target.value as "CE" | "BCE")}
            >
              <option value="BCE">BCE</option>
              <option value="CE">CE</option>
            </Select>
          </div>
        </div>

        {/* Clear filters button - right aligned, always takes up space */}
        <div className="min-w-[100px]">
          {hasActiveFilters && (
            <button onClick={clearAllFilters} className={components.button.reset}>
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Active filter tags */}
      {(selectedTypes.length > 0 || selectedStatuses.length > 0) && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedTypes.map((type) => (
            <FilterTag
              key={type}
              label={formatLabel(type)}
              onRemove={() => onTypeChange(selectedTypes.filter((t) => t !== type))}
              ariaLabel={`Remove ${type} filter`}
            />
          ))}
          {selectedStatuses.map((status) => (
            <FilterTag
              key={status}
              label={formatLabel(status)}
              onRemove={() => onStatusChange(selectedStatuses.filter((s) => s !== status))}
              ariaLabel={`Remove ${status} filter`}
            />
          ))}
        </div>
      )}

      {/* Site count */}
      <div className="mt-2 text-sm text-gray-600 text-center">
        Showing <span className="font-semibold text-gray-900">{filteredCount}</span> of{" "}
        <span className="font-semibold text-gray-900">{totalCount}</span> sites
      </div>
    </div>
  );
}
