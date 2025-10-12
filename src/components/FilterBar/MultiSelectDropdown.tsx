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
        className="flex items-center gap-1 px-2 py-1 border border-gray-300 rounded-md text-[10px] bg-white hover:bg-gray-50 focus:ring-2 focus:ring-[#009639] focus:border-[#009639] transition-colors"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-gray-700">
          {label}
          {/* Always reserve space for count to prevent layout shift */}
          <span className={`ml-0.5 font-semibold inline-block min-w-[20px] ${selectedValues.length > 0 ? 'text-[#009639]' : 'opacity-0'}`}>
            ({selectedValues.length > 0 ? selectedValues.length : '99'})
          </span>
        </span>
        {/* Chevron icon */}
        <svg
          className={`w-3 h-3 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="fixed z-[9999] mt-1 w-44 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto"
          style={{
            top: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().bottom + 4 : 0,
            left: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().left : 0,
          }}
        >
          <ul className="py-0.5" role="listbox">
            {options.map((option) => {
              const isSelected = selectedValues.includes(option);
              return (
                <li
                  key={option}
                  className="px-2 py-1 hover:bg-gray-50 cursor-pointer flex items-center gap-1.5"
                  onClick={() => toggleOption(option)}
                  role="option"
                  aria-selected={isSelected}
                >
                  {/* Checkbox */}
                  <div
                    className={`w-3 h-3 border-2 rounded flex items-center justify-center ${
                      isSelected
                        ? "bg-[#009639] border-[#009639]"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {isSelected && (
                      <svg
                        className="w-2 h-2 text-white"
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
                  <span className="text-[10px] text-gray-700">{formatLabel(option)}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
