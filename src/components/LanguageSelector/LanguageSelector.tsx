import { useState } from "react";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { useLocale } from "../../contexts/LocaleContext";
import { getAllLocales, getLocaleName } from "../../config/locales";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import type { LocaleCode } from "../../types/i18n";
import { BaseDropdown, ChevronIcon } from "../Dropdown/BaseDropdown";

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
  const t = useThemeClasses();
  const [isOpen, setIsOpen] = useState(false);

  const allLocales = getAllLocales();
  const currentLocaleName = getLocaleName(locale, true);

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale as LocaleCode);
    setIsOpen(false);
  };

  const trigger = (
    <button
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-colors ${t.bg.secondary} ${t.bg.hover} ${t.text.body}`}
      aria-label="Select language"
      title={`Current: ${currentLocaleName}`}
    >
      <GlobeAltIcon className="w-4 h-4" />
      <span className="text-xs font-medium">{currentLocaleName}</span>
      <ChevronIcon isOpen={isOpen} />
    </button>
  );

  return (
    <BaseDropdown
      trigger={trigger}
      isOpen={isOpen}
      onToggle={setIsOpen}
      align="right"
      className={className}
      menuClassName={`py-1 rounded-md shadow-lg border min-w-[120px] ${t.bg.primary} ${t.border.default}`}
    >
      {allLocales.map((loc) => {
        const isSelected = loc.code === locale;
        return (
          <button
            key={loc.code}
            onClick={() => handleLocaleChange(loc.code)}
            className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
              isSelected
                ? `${t.bg.secondary} text-[#009639] font-semibold`
                : `${t.text.body} ${t.bg.hover}`
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
              <div className={`text-[10px] mt-0.5 ${t.text.subtle}`}>
                {loc.name}
              </div>
            )}
          </button>
        );
      })}
    </BaseDropdown>
  );
}
