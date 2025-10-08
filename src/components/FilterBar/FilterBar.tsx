import type { GazaSite } from "../../types";
import { components, cn } from "../../styles/theme";
import { SITE_TYPES, STATUS_OPTIONS } from "../../constants/filters";
import { formatLabel } from "../../utils/format";
import { MultiSelectDropdown } from "./MultiSelectDropdown";

interface FilterBarProps {
  selectedTypes: Array<GazaSite["type"]>;
  selectedStatuses: Array<GazaSite["status"]>;
  selectedDate: Date | null;
  onTypeChange: (types: Array<GazaSite["type"]>) => void;
  onStatusChange: (statuses: Array<GazaSite["status"]>) => void;
  onDateChange: (date: Date | null) => void;
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
  selectedDate,
  onTypeChange,
  onStatusChange,
  onDateChange,
  filteredCount,
  totalCount,
}: FilterBarProps) {
  const hasActiveFilters = selectedTypes.length > 0 || selectedStatuses.length > 0 || selectedDate !== null;

  const clearAllFilters = () => {
    onTypeChange([]);
    onStatusChange([]);
    onDateChange(null);
  };

  return (
    <div className={cn(components.card.base, components.card.padding, "mb-6")}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Left section - Filter controls */}
        <div className="flex items-center gap-4 flex-wrap">
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

          {/* Date Filter Input */}
          <div className="relative">
            <input
              type="date"
              value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
              onChange={(e) => {
                if (e.target.value) {
                  onDateChange(new Date(e.target.value));
                } else {
                  onDateChange(null);
                }
              }}
              placeholder="Filter by date"
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#16a34a] focus:border-[#16a34a] cursor-pointer"
            />
            {selectedDate && (
              <button
                onClick={() => onDateChange(null)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#b91c1c] hover:text-[#991b1b] font-bold text-lg"
                aria-label="Clear date filter"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Right section - Results count and clear button */}
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredCount}</span> of{" "}
            <span className="font-semibold text-gray-900">{totalCount}</span> sites
          </div>

          {hasActiveFilters && (
            <button onClick={clearAllFilters} className={components.button.reset}>
              Clear All
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

      {/* Helper text */}
      <div className="mt-3 text-xs text-gray-500 text-center">
        Use the date picker and dropdowns above to filter sites • Click timeline sites to highlight on map and table
      </div>
    </div>
  );
}
