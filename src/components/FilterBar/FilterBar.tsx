import React from "react";
import type { GazaSite } from "../../types";
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
  searchTerm: string;
  onTypeChange: (types: Array<GazaSite["type"]>) => void;
  onStatusChange: (statuses: Array<GazaSite["status"]>) => void;
  onDestructionDateStartChange: (date: Date | null) => void;
  onDestructionDateEndChange: (date: Date | null) => void;
  onCreationYearStartChange: (year: number | null) => void;
  onCreationYearEndChange: (year: number | null) => void;
  onSearchChange: (term: string) => void;
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
  searchTerm,
  onTypeChange,
  onStatusChange,
  onDestructionDateStartChange,
  onDestructionDateEndChange,
  onCreationYearStartChange,
  onCreationYearEndChange,
  onSearchChange,
}: FilterBarProps) {
  const { calendarType, toggleCalendar } = useCalendar();

  // Local state for year input and era selection
  const [startYearInput, setStartYearInput] = React.useState("");
  const [startYearEra, setStartYearEra] = React.useState<"CE" | "BCE">("CE");
  const [endYearInput, setEndYearInput] = React.useState(new Date().getFullYear().toString());
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
    creationYearEnd !== null ||
    searchTerm.trim().length > 0;

  const clearAllFilters = () => {
    onTypeChange([]);
    onStatusChange([]);
    onDestructionDateStartChange(null);
    onDestructionDateEndChange(null);
    onCreationYearStartChange(null);
    onCreationYearEndChange(null);
    onSearchChange("");
    setStartYearInput("");
    setEndYearInput("");
    setStartYearEra("CE");
    setEndYearEra("CE");
  };

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
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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

      {/* Filter controls - sleek horizontal layout (hidden on mobile) */}
      <div className="hidden md:flex items-center justify-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5">
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
        <div className="flex flex-col gap-0.5 px-2 py-1 border border-gray-200 rounded-md bg-gray-50/50">
          <div className="flex items-center gap-0.5 justify-center">
            <label className="text-[10px] font-medium text-white">Destroyed (Gregorian)</label>
            <Tooltip content="Date filters use Gregorian calendar only">
              <svg className="w-2.5 h-2.5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </Tooltip>
          </div>
          <div className="flex items-center gap-1">
            <Input
              variant="date"
              value={destructionDateStart ? destructionDateStart.toISOString().split("T")[0] : ""}
              onChange={(e) => {
                onDestructionDateStartChange(e.target.value ? new Date(e.target.value) : null);
              }}
              placeholder="From"
              className="text-[10px] py-0.5 px-1"
            />
            <span className="text-[10px] text-black">to</span>
            <Input
              variant="date"
              value={destructionDateEnd ? destructionDateEnd.toISOString().split("T")[0] : ""}
              onChange={(e) => {
                onDestructionDateEndChange(e.target.value ? new Date(e.target.value) : null);
              }}
              placeholder="To"
              className="text-[10px] py-0.5 px-1"
            />
          </div>
        </div>

        {/* Creation Year Range - Always uses Gregorian (CE/BCE) for filtering */}
        <div className="flex flex-col gap-0.5 px-2 py-1 border border-gray-200 rounded-md bg-gray-50/50">
          <div className="flex items-center gap-0.5 justify-center">
            <label className="text-[10px] font-medium text-white">Built (CE/BCE)</label>
            <Tooltip content="Year filters use Gregorian calendar only">
              <svg className="w-2.5 h-2.5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </Tooltip>
          </div>
          <div className="flex items-center gap-1">
            <Input
              variant="number"
              value={startYearInput}
              onChange={(e) => handleStartYearChange(e.target.value, startYearEra)}
              placeholder="Year"
              min="1"
              className="w-14 text-[10px] py-0.5 px-1"
            />
            <Select
              size="small"
              value={startYearEra}
              onChange={(e) =>
                handleStartYearChange(startYearInput, e.target.value as "CE" | "BCE")
              }
              className="px-1 py-0.5 text-[10px]"
            >
              <option value="BCE">BCE</option>
              <option value="CE">CE</option>
            </Select>
            <span className="text-[10px] text-black">to</span>
            <Input
              variant="number"
              value={endYearInput}
              onChange={(e) => handleEndYearChange(e.target.value, endYearEra)}
              placeholder="Year"
              min="1"
              className="w-14 text-[10px] py-0.5 px-1"
            />
            <Select
              size="small"
              value={endYearEra}
              onChange={(e) => handleEndYearChange(endYearInput, e.target.value as "CE" | "BCE")}
              className="px-1 py-0.5 text-[10px]"
            >
              <option value="BCE">BCE</option>
              <option value="CE">CE</option>
            </Select>
          </div>
        </div>

        {/* Clear filters button - always visible to prevent layout shift */}
        <button
          onClick={clearAllFilters}
          disabled={!hasActiveFilters}
          className="px-3 py-1.5 bg-[#ed3039] text-[#fefefe] rounded-md hover:bg-[#d4202a] transition-colors text-xs font-medium disabled:opacity-0 disabled:cursor-default"
        >
          Clear
        </button>
      </div>

      {/* Active filter tags - always reserve space to prevent layout shift */}
      <div className="mt-1 flex flex-wrap gap-1 min-h-[24px]">
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
    </div>
  );
}
