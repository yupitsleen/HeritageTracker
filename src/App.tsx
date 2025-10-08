import { useState } from "react";
import { mockSites } from "./data/mockSites";
import type { GazaSite } from "./types";
import { components, cn } from "./styles/theme";
import { SitesTable } from "./components/SitesTable";
import { HeritageMap } from "./components/Map/HeritageMap";
import { VerticalTimeline } from "./components/Timeline/VerticalTimeline";
import { Filters } from "./components/Filters/Filters";
import { Modal } from "./components/Modal/Modal";
import { SiteDetailPanel } from "./components/SiteDetail/SiteDetailPanel";
import { filterSitesByTypeAndStatus, filterSitesByDate } from "./utils/siteFilters";

function App() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<Array<GazaSite["type"]>>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<Array<GazaSite["status"]>>([]);
  const [selectedSite, setSelectedSite] = useState<GazaSite | null>(null);
  const [highlightedSiteId, setHighlightedSiteId] = useState<string | null>(null);

  // Filter sites by type and status (for timeline display)
  const typeAndStatusFilteredSites = filterSitesByTypeAndStatus(
    mockSites,
    selectedTypes,
    selectedStatuses
  );

  // Filter sites based on date, type, and status (for map and cards)
  const filteredSites = filterSitesByDate(typeAndStatusFilteredSites, selectedDate);

  return (
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
      <main className={cn(components.container.base, components.container.section)}>
        {/* Stats Summary */}
        <div className={cn(components.card.base, components.card.padding, "mb-8 text-center")}>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Heritage Sites ({mockSites.length} sample sites)
          </h2>
          <p className="text-gray-600">
            Click on map markers or table rows to see site details. Scroll timeline and table independently.
          </p>
        </div>

        {/* Filters */}
        <Filters
          selectedTypes={selectedTypes}
          selectedStatuses={selectedStatuses}
          onTypeChange={setSelectedTypes}
          onStatusChange={setSelectedStatuses}
          filteredCount={filteredSites.length}
          totalCount={mockSites.length}
        />

        <div className="flex gap-6">
          {/* Left Sidebar - Timeline (Sticky) */}
          <aside className="w-80 flex-shrink-0 sticky top-0 h-screen overflow-hidden">
            <VerticalTimeline
              sites={typeAndStatusFilteredSites}
              onDateChange={setSelectedDate}
              onSiteHighlight={setHighlightedSiteId}
            />
          </aside>

          {/* Center - Map */}
          <div className="flex-1 min-w-0">
            <HeritageMap
              sites={filteredSites}
              onSiteClick={setSelectedSite}
              highlightedSiteId={highlightedSiteId}
              onSiteHighlight={setHighlightedSiteId}
            />
          </div>

          {/* Right Sidebar - Sites Table (Sticky) */}
          <aside className="w-96 flex-shrink-0 sticky top-0 h-screen overflow-hidden">
            <SitesTable
              sites={filteredSites}
              onSiteClick={(site) => {
                setHighlightedSiteId(site.id);
                setSelectedSite(site);
              }}
              onSiteHighlight={setHighlightedSiteId}
              highlightedSiteId={highlightedSiteId}
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
  );
}

export default App;
