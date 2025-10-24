import { useState, useRef, useEffect } from "react";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { useLocale } from "../../contexts/LocaleContext";
import { getAllLocales, getLocaleName } from "../../config/locales";
import { useTheme } from "../../contexts/ThemeContext";
import type { LocaleCode } from "../../types/i18n";

interface LanguageSelectorProps {
  /**
   * Optional className for additional styling
   */
  className?: string;
}

/**
 * Language selector dropdown that displays all registered locales
 * Shows native names and allows users to switch between languages
 */
export function LanguageSelector({ className = "" }: LanguageSelectorProps) {
  const { locale, setLocale } = useLocale();
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const allLocales = getAllLocales();
  const currentLocaleName = getLocaleName(locale, true);

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

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale as LocaleCode);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-colors ${
          isDark
            ? "bg-gray-800 hover:bg-gray-700 text-gray-200"
            : "bg-gray-100 hover:bg-gray-200 text-gray-800"
        }`}
        aria-label="Select language"
        title={`Current: ${currentLocaleName}`}
      >
        <GlobeAltIcon className="w-4 h-4" />
        <span className="text-xs font-medium">{currentLocaleName}</span>
        <svg
          className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute right-0 mt-1 py-1 rounded-md shadow-lg border z-[9999] min-w-[120px] ${
            isDark
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          {allLocales.map((loc) => {
            const isSelected = loc.code === locale;
            return (
              <button
                key={loc.code}
                onClick={() => handleLocaleChange(loc.code)}
                className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                  isSelected
                    ? isDark
                      ? "bg-gray-700 text-[#009639] font-semibold"
                      : "bg-gray-100 text-[#009639] font-semibold"
                    : isDark
                    ? "text-gray-200 hover:bg-gray-700"
                    : "text-gray-800 hover:bg-gray-50"
                }`}
                aria-current={isSelected ? "true" : undefined}
              >
                <div className="flex items-center justify-between gap-2">
                  <span>{loc.nativeName}</span>
                  {isSelected && (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                {/* Show English name as subtitle if different from native */}
                {loc.name !== loc.nativeName && (
                  <div className={`text-[10px] mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    {loc.name}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
