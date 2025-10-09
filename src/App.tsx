import { useState } from "react";
import { mockSites } from "./data/mockSites";
import type { GazaSite } from "./types";
import { components, cn } from "./styles/theme";
import { SitesTable } from "./components/SitesTable";
import { HeritageMap } from "./components/Map/HeritageMap";
import { VerticalTimeline } from "./components/Timeline/VerticalTimeline";
import { FilterBar } from "./components/FilterBar/FilterBar";
import { Modal } from "./components/Modal/Modal";
import { SiteDetailPanel } from "./components/SiteDetail/SiteDetailPanel";
import { CalendarProvider } from "./contexts/CalendarContext";
import {
  filterSitesByTypeAndStatus,
  filterSitesByDestructionDate,
  filterSitesByCreationYear
} from "./utils/siteFilters";

function App() {
  const [selectedTypes, setSelectedTypes] = useState<Array<GazaSite["type"]>>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<Array<GazaSite["status"]>>([]);
  const [destructionDateStart, setDestructionDateStart] = useState<Date | null>(null);
  const [destructionDateEnd, setDestructionDateEnd] = useState<Date | null>(null);
  const [creationYearStart, setCreationYearStart] = useState<number | null>(null);
  const [creationYearEnd, setCreationYearEnd] = useState<number | null>(null);
  const [selectedSite, setSelectedSite] = useState<GazaSite | null>(null);
  const [highlightedSiteId, setHighlightedSiteId] = useState<string | null>(null);
  const [isTableExpanded, setIsTableExpanded] = useState(false);

  // Filter sites by type and status
  const typeAndStatusFilteredSites = filterSitesByTypeAndStatus(
    mockSites,
    selectedTypes,
    selectedStatuses
  );

  // Filter by destruction date range
  const destructionDateFilteredSites = filterSitesByDestructionDate(
    typeAndStatusFilteredSites,
    destructionDateStart,
    destructionDateEnd
  );

  // Filter by creation year range
  const filteredSites = filterSitesByCreationYear(
    destructionDateFilteredSites,
    creationYearStart,
    creationYearEnd
  );

  return (
    <CalendarProvider>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className={components.header.base}>
        <div className={cn(components.container.base, "py-6")}>
          <h1 className={components.header.title}>Heritage Tracker</h1>
          <p className={components.header.subtitle}>
            Documenting the destruction of cultural heritage in Gaza (2023-2024)
          </p>
        </div>
      </header>

      {/* Main Content - Three Column Layout */}
      <main className={components.container.section}>
        {/* Stats Summary - with container padding */}
        <div className={cn(components.container.base, "mb-8")}>
          <div className={cn(components.card.base, components.card.padding, "text-center")}>
            <h2 className="text-2xl font-semibold text-gray-800">
              Heritage Sites ({mockSites.length} sample sites)
            </h2>
          </div>
        </div>

        {/* Unified Filter Bar - with container padding */}
        <div className={components.container.base}>
          <FilterBar
            selectedTypes={selectedTypes}
            selectedStatuses={selectedStatuses}
            destructionDateStart={destructionDateStart}
            destructionDateEnd={destructionDateEnd}
            creationYearStart={creationYearStart}
            creationYearEnd={creationYearEnd}
            onTypeChange={setSelectedTypes}
            onStatusChange={setSelectedStatuses}
            onDestructionDateStartChange={setDestructionDateStart}
            onDestructionDateEndChange={setDestructionDateEnd}
            onCreationYearStartChange={setCreationYearStart}
            onCreationYearEndChange={setCreationYearEnd}
            filteredCount={filteredSites.length}
            totalCount={mockSites.length}
          />
        </div>

        {/* Three-column layout - no padding, hugs edges */}
        <div className="flex gap-0">
          {/* Left Sidebar - Timeline (Sticky, hugs left edge) */}
          <aside className="w-80 flex-shrink-0 sticky top-0 h-screen overflow-hidden">
            <VerticalTimeline
              sites={typeAndStatusFilteredSites}
              onSiteHighlight={setHighlightedSiteId}
            />
          </aside>

          {/* Center - Map */}
          <div className="flex-1 min-w-0 px-6">
            <HeritageMap
              sites={filteredSites}
              onSiteClick={setSelectedSite}
              highlightedSiteId={highlightedSiteId}
              onSiteHighlight={setHighlightedSiteId}
            />
          </div>

          {/* Right Sidebar - Sites Table (Sticky, hugs right edge) */}
          <aside className="w-80 flex-shrink-0 sticky top-0 h-screen overflow-hidden">
            <SitesTable
              sites={filteredSites}
              onSiteClick={setSelectedSite}
              onSiteHighlight={setHighlightedSiteId}
              highlightedSiteId={highlightedSiteId}
              onExpandTable={() => setIsTableExpanded(true)}
            />
          </aside>
        </div>
      </main>

      {/* Site Detail Modal */}
      <Modal
        isOpen={selectedSite !== null}
        onClose={() => setSelectedSite(null)}
        title={selectedSite?.name}
      >
        {selectedSite && <SiteDetailPanel site={selectedSite} />}
      </Modal>

      {/* Expanded Table Modal */}
      <Modal
        isOpen={isTableExpanded}
        onClose={() => setIsTableExpanded(false)}
        title="All Heritage Sites"
      >
        <div className="max-h-[80vh] overflow-auto">
          <SitesTable
            sites={filteredSites}
            onSiteClick={setSelectedSite}
            onSiteHighlight={setHighlightedSiteId}
            highlightedSiteId={highlightedSiteId}
          />
        </div>
      </Modal>

      {/* Footer */}
      <footer className={components.footer.base}>
        <div className={cn(components.container.base, "py-6")}>
          <p className={components.footer.text}>
            Heritage Tracker • Evidence-based documentation • All data verified by UNESCO,
            Forensic Architecture, and Heritage for Peace
          </p>
        </div>
      </footer>
      </div>
    </CalendarProvider>
  );
}

export default App;
