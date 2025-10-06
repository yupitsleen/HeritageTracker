import { useState } from "react";
import { mockSites } from "./data/mockSites";
import type { GazaSite } from "./types";
import { components, cn } from "./styles/theme";
import { SiteCard } from "./components/SiteCard";
import { HeritageMap } from "./components/Map/HeritageMap";
import { Timeline } from "./components/Timeline/Timeline";
import { Filters } from "./components/Filters/Filters";
import { Modal } from "./components/Modal/Modal";
import { SiteDetailPanel } from "./components/SiteDetail/SiteDetailPanel";

function App() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedType, setSelectedType] = useState<GazaSite["type"] | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<GazaSite["status"] | "all">("all");
  const [selectedSite, setSelectedSite] = useState<GazaSite | null>(null);
  const [highlightedSiteId, setHighlightedSiteId] = useState<string | null>(null);

  // Filter sites based on selected date, type, and status
  const filteredSites = mockSites.filter((site) => {
    // Date filter
    if (selectedDate && site.dateDestroyed) {
      if (new Date(site.dateDestroyed) > selectedDate) return false;
    }

    // Type filter
    if (selectedType !== "all" && site.type !== selectedType) {
      return false;
    }

    // Status filter
    if (selectedStatus !== "all" && site.status !== selectedStatus) {
      return false;
    }

    return true;
  });

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

      {/* Main Content */}
      <main className={cn(components.container.base, components.container.section)}>
        {/* Stats Summary */}
        <div className={cn(components.card.base, components.card.padding, "mb-8")}>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Heritage Sites ({mockSites.length} sample sites)
          </h2>
          <p className="text-gray-600">
            Click on map markers to see site details. Scroll to explore the interactive map.
          </p>
        </div>

        {/* Timeline */}
        <Timeline
          sites={mockSites}
          onDateChange={setSelectedDate}
          onSiteHighlight={setHighlightedSiteId}
        />

        {/* Filters */}
        <Filters
          selectedType={selectedType}
          selectedStatus={selectedStatus}
          onTypeChange={setSelectedType}
          onStatusChange={setSelectedStatus}
        />

        {/* Interactive Map */}
        <div className="mb-8">
          <HeritageMap
            sites={filteredSites}
            onSiteClick={setSelectedSite}
            highlightedSiteId={highlightedSiteId}
            onSiteHighlight={setHighlightedSiteId}
          />
        </div>

        {/* Sites List */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {filteredSites.length === mockSites.length
              ? "All Sites"
              : `Sites (${filteredSites.length} of ${mockSites.length})`}
          </h3>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSites.map((site) => (
            <SiteCard
              key={site.id}
              site={site}
              onClick={() => {
                setHighlightedSiteId(site.id);
                setSelectedSite(site);
              }}
            />
          ))}
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
