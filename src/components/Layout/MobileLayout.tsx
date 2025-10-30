import type { GazaSite, FilterState } from "../../types";
import { cn } from "../../styles/theme";
import { FilterBar } from "../FilterBar/FilterBar";
import { SitesTable } from "../SitesTable";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../../contexts/ThemeContext";
import { useTranslation } from "../../contexts/LocaleContext";

interface MobileLayoutProps {
  // Filter state
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;

  // Table props
  filteredSites: GazaSite[];
  onSiteClick: (site: GazaSite) => void;
  onSiteHighlight: (siteId: string | null) => void;
  highlightedSiteId: string | null;
}

/**
 * Mobile layout - FilterBar and accordion table only
 * Map and timeline not rendered on mobile
 */
export function MobileLayout({
  filters,
  onFilterChange,
  filteredSites,
  onSiteClick,
  onSiteHighlight,
  highlightedSiteId,
}: MobileLayoutProps) {
  const { isDark, toggleTheme } = useTheme();
  const t = useTranslation();

  return (
    <div className="md:hidden">
      {/* Filter Bar with Theme Toggle */}
      <div className={cn("container mx-auto px-4", "py-2 relative")}>
        {/* Dark Mode Toggle - Mobile only, top right */}
        <button
          onClick={toggleTheme}
          className={`absolute top-2 right-2 p-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 z-50 ${
            isDark
              ? "bg-gray-700 hover:bg-gray-600 text-gray-200 hover:text-white"
              : "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
          }`}
          aria-label={isDark ? t("aria.switchToLightMode") : t("aria.switchToDarkMode")}
          title={isDark ? t("aria.switchToLightMode") : t("aria.switchToDarkMode")}
        >
          {isDark ? (
            <SunIcon className="w-5 h-5" />
          ) : (
            <MoonIcon className="w-5 h-5" />
          )}
        </button>

        <FilterBar
          filters={filters}
          onFilterChange={onFilterChange}
        />
      </div>

      {/* Mobile Table */}
      <div className="px-2">
        <SitesTable
          sites={filteredSites}
          onSiteClick={onSiteClick}
          onSiteHighlight={onSiteHighlight}
          highlightedSiteId={highlightedSiteId}
          variant="mobile"
        />
      </div>
    </div>
  );
}
