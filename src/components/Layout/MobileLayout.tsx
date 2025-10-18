import type { GazaSite } from "../../types";
import { cn, components } from "../../styles/theme";
import { FilterBar } from "../FilterBar/FilterBar";
import { SitesTable } from "../SitesTable";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../../contexts/ThemeContext";

interface MobileLayoutProps {
  // Filter state
  selectedTypes: Array<GazaSite["type"]>;
  selectedStatuses: Array<GazaSite["status"]>;
  destructionDateStart: Date | null;
  destructionDateEnd: Date | null;
  searchTerm: string;
  onTypeChange: (types: Array<GazaSite["type"]>) => void;
  onStatusChange: (statuses: Array<GazaSite["status"]>) => void;
  onDestructionDateStartChange: (date: Date | null) => void;
  onDestructionDateEndChange: (date: Date | null) => void;
  onCreationYearStartChange: (year: number | null) => void;
  onCreationYearEndChange: (year: number | null) => void;
  onSearchChange: (term: string) => void;

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
  selectedTypes,
  selectedStatuses,
  destructionDateStart,
  destructionDateEnd,
  searchTerm,
  onTypeChange,
  onStatusChange,
  onDestructionDateStartChange,
  onDestructionDateEndChange,
  onCreationYearStartChange,
  onCreationYearEndChange,
  onSearchChange,
  filteredSites,
  onSiteClick,
  onSiteHighlight,
  highlightedSiteId,
}: MobileLayoutProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="md:hidden">
      {/* Filter Bar with Theme Toggle */}
      <div className={cn(components.container.base, "py-2 relative")}>
        {/* Dark Mode Toggle - Mobile only, top right */}
        <button
          onClick={toggleTheme}
          className={`absolute top-2 right-2 p-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 z-50 ${
            isDark
              ? "bg-gray-700 hover:bg-gray-600 text-gray-200 hover:text-white"
              : "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
          }`}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? (
            <SunIcon className="w-5 h-5" />
          ) : (
            <MoonIcon className="w-5 h-5" />
          )}
        </button>

        <FilterBar
          selectedTypes={selectedTypes}
          selectedStatuses={selectedStatuses}
          destructionDateStart={destructionDateStart}
          destructionDateEnd={destructionDateEnd}
          searchTerm={searchTerm}
          onTypeChange={onTypeChange}
          onStatusChange={onStatusChange}
          onDestructionDateStartChange={onDestructionDateStartChange}
          onDestructionDateEndChange={onDestructionDateEndChange}
          onCreationYearStartChange={onCreationYearStartChange}
          onCreationYearEndChange={onCreationYearEndChange}
          onSearchChange={onSearchChange}
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
