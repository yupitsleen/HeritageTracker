import { useState, useRef } from "react";
import type { GazaSite } from "../../types";
import { formatLabel } from "../../utils/format";
import { SITE_TYPES, STATUS_OPTIONS } from "../../constants/filters";
import { useClickOutside } from "../../hooks/useClickOutside";

interface FiltersProps {
  onTypeChange: (types: Array<GazaSite["type"]>) => void;
  onStatusChange: (statuses: Array<GazaSite["status"]>) => void;
  selectedTypes: Array<GazaSite["type"]>;
  selectedStatuses: Array<GazaSite["status"]>;
  filteredCount: number;
  totalCount: number;
}

export function Filters({
  onTypeChange,
  onStatusChange,
  selectedTypes,
  selectedStatuses,
  filteredCount,
  totalCount,
}: FiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useClickOutside([buttonRef, dropdownRef], () => setIsOpen(false), isOpen);

  const handleTypeToggle = (type: GazaSite["type"]) => {
    if (selectedTypes.includes(type)) {
      onTypeChange(selectedTypes.filter((t) => t !== type));
    } else {
      onTypeChange([...selectedTypes, type]);
    }
  };

  const handleStatusToggle = (status: GazaSite["status"]) => {
    if (selectedStatuses.includes(status)) {
      onStatusChange(selectedStatuses.filter((s) => s !== status));
    } else {
      onStatusChange([...selectedStatuses, status]);
    }
  };

  const activeFilterCount =
    selectedTypes.length + selectedStatuses.length;

  return (
    <div className="relative mb-4">
      <div className="flex items-center gap-4">
        {/* Filter Button */}
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
        >
        <svg
          className="w-5 h-5 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        <span className="font-medium text-gray-700">Filters</span>
        {activeFilterCount > 0 && (
          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full">
            {activeFilterCount}
          </span>
        )}
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Site Count Display */}
      <p className="text-sm text-gray-600">
        Showing <span className="font-semibold text-gray-900">{filteredCount}</span> of {totalCount} sites
      </p>
    </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div ref={dropdownRef} className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-[2000]">
          <div className="p-4 space-y-4">
            {/* Site Type Section */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Site Type</h4>
              <div className="space-y-2">
                {SITE_TYPES.filter((t) => t !== "all").map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type as GazaSite["type"])}
                      onChange={() => handleTypeToggle(type as GazaSite["type"])}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{formatLabel(type)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200" />

            {/* Damage Status Section */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Damage Status</h4>
              <div className="space-y-2">
                {STATUS_OPTIONS.filter((s) => s !== "all").map((status) => (
                  <label
                    key={status}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStatuses.includes(status as GazaSite["status"])}
                      onChange={() => handleStatusToggle(status as GazaSite["status"])}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{formatLabel(status)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear All Button */}
            {activeFilterCount > 0 && (
              <>
                <div className="border-t border-gray-200" />
                <button
                  onClick={() => {
                    onTypeChange([]);
                    onStatusChange([]);
                  }}
                  className="w-full px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                >
                  Clear All Filters
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
