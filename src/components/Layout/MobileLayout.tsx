import type { GazaSite } from "../../types";
import { cn, components } from "../../styles/theme";
import { FilterBar } from "../FilterBar/FilterBar";
import { SitesTable } from "../SitesTable";

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
  return (
    <div className="md:hidden">
      {/* Filter Bar */}
      <div className={cn(components.container.base, "py-2")}>
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
