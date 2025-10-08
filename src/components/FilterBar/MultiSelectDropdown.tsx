import { useState, useRef, useEffect } from "react";

interface MultiSelectDropdownProps<T extends string> {
  label: string;
  options: readonly T[];
  selectedValues: T[];
  onChange: (values: T[]) => void;
  formatLabel?: (value: string) => string;
}

/**
 * Custom multi-select dropdown with checkboxes
 * Shows count badge when items are selected
 */
export function MultiSelectDropdown<T extends string>({
  label,
  options,
  selectedValues,
  onChange,
  formatLabel = (v) => v,
}: MultiSelectDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const toggleOption = (value: T) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 focus:ring-2 focus:ring-[#16a34a] focus:border-[#16a34a] transition-colors"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-gray-700">
          {label}
          {selectedValues.length > 0 && (
            <span className="ml-1 text-[#16a34a] font-semibold">({selectedValues.length})</span>
          )}
        </span>
        {/* Chevron icon */}
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="fixed z-[100] mt-2 w-56 bg-white border border-gray-300 rounded-md shadow-lg max-h-64 overflow-y-auto"
          style={{
            top: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().bottom + 8 : 0,
            left: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().left : 0,
          }}
        >
          <ul className="py-1" role="listbox">
            {options.map((option) => {
              const isSelected = selectedValues.includes(option);
              return (
                <li
                  key={option}
                  className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                  onClick={() => toggleOption(option)}
                  role="option"
                  aria-selected={isSelected}
                >
                  {/* Checkbox */}
                  <div
                    className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                      isSelected
                        ? "bg-[#16a34a] border-[#16a34a]"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {isSelected && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-gray-700">{formatLabel(option)}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
