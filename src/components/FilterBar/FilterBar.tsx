import React from "react";
import type { GazaSite } from "../../types";
import { components, cn } from "../../styles/theme";
import { SITE_TYPES, STATUS_OPTIONS } from "../../constants/filters";
import { formatLabel } from "../../utils/format";
import { MultiSelectDropdown } from "./MultiSelectDropdown";

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
  // Local state for year input and era selection
  const [startYearInput, setStartYearInput] = React.useState("");
  const [startYearEra, setStartYearEra] = React.useState<"CE" | "BCE">("CE");
  const [endYearInput, setEndYearInput] = React.useState("");
  const [endYearEra, setEndYearEra] = React.useState<"CE" | "BCE">("CE");

  // Update parent state when year or era changes
  const handleStartYearChange = (input: string, era: "CE" | "BCE") => {
    setStartYearInput(input);
    setStartYearEra(era);
    if (input.trim()) {
      const year = parseInt(input);
      onCreationYearStartChange(era === "BCE" ? -year : year);
    } else {
      onCreationYearStartChange(null);
    }
  };

  const handleEndYearChange = (input: string, era: "CE" | "BCE") => {
    setEndYearInput(input);
    setEndYearEra(era);
    if (input.trim()) {
      const year = parseInt(input);
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
    <div className={cn(components.card.base, components.card.padding, "mb-6")}>
      <div className="flex items-center justify-between flex-wrap gap-6">
        {/* Filter controls - centered */}
        <div className="flex-1 flex items-center gap-6 flex-wrap justify-center">
          <div className="flex items-center gap-4">
            <div className="font-semibold text-gray-900">Filters:</div>

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
          <div className="flex flex-col items-center gap-2 justify-center">
            <label className="text-sm font-medium text-gray-700">Destroyed</label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={destructionDateStart ? destructionDateStart.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  onDestructionDateStartChange(e.target.value ? new Date(e.target.value) : null);
                }}
                placeholder="From"
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#16a34a] focus:border-[#16a34a]"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={destructionDateEnd ? destructionDateEnd.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  onDestructionDateEndChange(e.target.value ? new Date(e.target.value) : null);
                }}
                placeholder="To"
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#16a34a] focus:border-[#16a34a]"
              />
            </div>
          </div>

          {/* Creation Year Range */}
          <div className="flex flex-col items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Built</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={startYearInput}
                onChange={(e) => handleStartYearChange(e.target.value, startYearEra)}
                placeholder="Year"
                min="1"
                className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#16a34a] focus:border-[#16a34a]"
              />
              <select
                value={startYearEra}
                onChange={(e) => handleStartYearChange(startYearInput, e.target.value as "CE" | "BCE")}
                className="px-2 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#16a34a] focus:border-[#16a34a]"
              >
                <option value="BCE">BCE</option>
                <option value="CE">CE</option>
              </select>
              <span className="text-gray-500">to</span>
              <input
                type="number"
                value={endYearInput}
                onChange={(e) => handleEndYearChange(e.target.value, endYearEra)}
                placeholder="Year"
                min="1"
                className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#16a34a] focus:border-[#16a34a]"
              />
              <select
                value={endYearEra}
                onChange={(e) => handleEndYearChange(endYearInput, e.target.value as "CE" | "BCE")}
                className="px-2 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#16a34a] focus:border-[#16a34a]"
              >
                <option value="BCE">BCE</option>
                <option value="CE">CE</option>
              </select>
            </div>
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
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedTypes.map((type) => (
            <span
              key={type}
              className="inline-flex items-center gap-1 px-2 py-1 bg-[#f1f3f5] text-gray-700 rounded text-xs"
            >
              {formatLabel(type)}
              <button
                onClick={() => onTypeChange(selectedTypes.filter((t) => t !== type))}
                className="text-gray-500 hover:text-[#b91c1c] font-bold"
                aria-label={`Remove ${type} filter`}
              >
                ×
              </button>
            </span>
          ))}
          {selectedStatuses.map((status) => (
            <span
              key={status}
              className="inline-flex items-center gap-1 px-2 py-1 bg-[#f1f3f5] text-gray-700 rounded text-xs"
            >
              {formatLabel(status)}
              <button
                onClick={() => onStatusChange(selectedStatuses.filter((s) => s !== status))}
                className="text-gray-500 hover:text-[#b91c1c] font-bold"
                aria-label={`Remove ${status} filter`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Site count */}
      <div className="mt-3 text-sm text-gray-600 text-center">
        Showing <span className="font-semibold text-gray-900">{filteredCount}</span> of{" "}
        <span className="font-semibold text-gray-900">{totalCount}</span> sites
      </div>
    </div>
  );
}
