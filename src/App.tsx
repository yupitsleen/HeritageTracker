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
import { About } from "./components/About/About";
import { CalendarProvider } from "./contexts/CalendarContext";
import {
  filterSitesByTypeAndStatus,
  filterSitesByDestructionDate,
  filterSitesByCreationYear,
  filterSitesBySearch,
} from "./utils/siteFilters";

function App() {
  const [selectedTypes, setSelectedTypes] = useState<Array<GazaSite["type"]>>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<Array<GazaSite["status"]>>([]);
  const [destructionDateStart, setDestructionDateStart] = useState<Date | null>(null);
  const [destructionDateEnd, setDestructionDateEnd] = useState<Date | null>(null);
  const [creationYearStart, setCreationYearStart] = useState<number | null>(null);
  const [creationYearEnd, setCreationYearEnd] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedSite, setSelectedSite] = useState<GazaSite | null>(null);
  const [highlightedSiteId, setHighlightedSiteId] = useState<string | null>(null);
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

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
  const yearFilteredSites = filterSitesByCreationYear(
    destructionDateFilteredSites,
    creationYearStart,
    creationYearEnd
  );

  // Filter by search term
  const filteredSites = filterSitesBySearch(yearFilteredSites, searchTerm);

  return (
    <CalendarProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Sticky Header with flag line */}
        <div className="sticky top-0 z-50 bg-[#000000]">
          {/* Header - BLACK background */}
          <header className={components.header.base}>
            <div className={cn(components.container.base, "py-3 md:py-6 relative")}>
              <h1 className="text-xl md:text-3xl font-bold text-center">Heritage Tracker</h1>
              <p className="text-[#f5f5f5] mt-1 md:mt-2 text-center text-xs md:text-base">
                Documenting the destruction of cultural heritage in Gaza (2023-2024)
              </p>
              {/* About button - desktop only, positioned in top right */}
              <button
                onClick={() => setIsAboutOpen(true)}
                className="hidden md:block absolute top-3 right-4 md:top-6 md:right-6 px-3 py-1.5 bg-[#009639] hover:bg-[#007b2f] text-white text-xs md:text-sm rounded transition-colors font-medium"
                aria-label="About Heritage Tracker"
              >
                About
              </button>
            </div>
          </header>

          {/* Flag-colored horizontal line - RED, BLACK, RED, GREEN (4px high, 4 bars) */}
          <div className="flex h-1">
            <div className="flex-1 bg-[#ed3039]"></div>
            <div className="flex-1 bg-[#000000]"></div>
            <div className="flex-1 bg-[#ed3039]"></div>
            <div className="flex-1 bg-[#009639]"></div>
          </div>
        </div>

        {/* Main Content */}
        <main className="pb-24 md:pb-32">
          {/* Mobile Layout - FilterBar and Table only */}
          <div className="md:hidden">
            {/* Filter Bar */}
            <div className={cn(components.container.base, "py-2")}>
              <FilterBar
                selectedTypes={selectedTypes}
                selectedStatuses={selectedStatuses}
                destructionDateStart={destructionDateStart}
                destructionDateEnd={destructionDateEnd}
                creationYearStart={creationYearStart}
                creationYearEnd={creationYearEnd}
                searchTerm={searchTerm}
                onTypeChange={setSelectedTypes}
                onStatusChange={setSelectedStatuses}
                onDestructionDateStartChange={setDestructionDateStart}
                onDestructionDateEndChange={setDestructionDateEnd}
                onCreationYearStartChange={setCreationYearStart}
                onCreationYearEndChange={setCreationYearEnd}
                onSearchChange={setSearchTerm}
              />
            </div>
            {/* Mobile Table */}
            <div className="px-2">
              <SitesTable
                sites={filteredSites}
                onSiteClick={setSelectedSite}
                onSiteHighlight={setHighlightedSiteId}
                highlightedSiteId={highlightedSiteId}
                variant="mobile"
              />
            </div>
          </div>

          {/* Desktop Layout - FilterBar full width, then three columns below */}
          <div className="hidden md:block">
            {/* Filter Bar - Full width, very compact */}
            <div className={components.container.base}>
              <div className="bg-white rounded-lg p-1">
                <div className="bg-[#000000] rounded-lg p-2">
                  <FilterBar
                    selectedTypes={selectedTypes}
                    selectedStatuses={selectedStatuses}
                    destructionDateStart={destructionDateStart}
                    destructionDateEnd={destructionDateEnd}
                    creationYearStart={creationYearStart}
                    creationYearEnd={creationYearEnd}
                    searchTerm={searchTerm}
                    onTypeChange={setSelectedTypes}
                    onStatusChange={setSelectedStatuses}
                    onDestructionDateStartChange={setDestructionDateStart}
                    onDestructionDateEndChange={setDestructionDateEnd}
                    onCreationYearStartChange={setCreationYearStart}
                    onCreationYearEndChange={setCreationYearEnd}
                    onSearchChange={setSearchTerm}
                  />
                </div>
              </div>
            </div>

            {/* Three-column layout below FilterBar - Timeline and Table sticky below header, Map scrolls */}
            <div className="flex gap-6 pt-6">
              {/* Left Sidebar - Timeline (Sticky below header, scrollable on hover, RED outline) */}
              <aside className="w-[440px] flex-shrink-0 pl-6">
                <div className="border-4 border-[#ed3039] rounded-lg sticky top-[120px] max-h-[calc(100vh-120px)] overflow-y-auto">
                  <VerticalTimeline
                    sites={filteredSites}
                    onSiteHighlight={setHighlightedSiteId}
                  />
                </div>
              </aside>

              {/* Center - Map (Sticky, vertically centered) */}
              <div className="flex-1 min-w-0">
                <div className="w-full sticky top-[calc(50vh-300px)]">
                  <HeritageMap
                    sites={filteredSites}
                    onSiteClick={setSelectedSite}
                    highlightedSiteId={highlightedSiteId}
                    onSiteHighlight={setHighlightedSiteId}
                  />
                </div>
                {/* Spacer to allow full scrolling */}
                <div className="h-[600px]"></div>
              </div>

              {/* Right Sidebar - Sites Table (Sticky below header, scrollable on hover, WHITE outline with black inner border) */}
              <aside className="w-[480px] flex-shrink-0 pr-6">
                <div className="border-4 border-white rounded-lg sticky top-[120px] max-h-[calc(100vh-120px)] overflow-y-auto z-10">
                  <div className="border border-black rounded-lg h-full overflow-y-auto">
                    <SitesTable
                      sites={filteredSites}
                      onSiteClick={setSelectedSite}
                      onSiteHighlight={setHighlightedSiteId}
                      highlightedSiteId={highlightedSiteId}
                      onExpandTable={() => setIsTableExpanded(true)}
                    />
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </main>

        {/* Site Detail Modal - Higher z-index to appear above table modal */}
        <Modal
          isOpen={selectedSite !== null}
          onClose={() => setSelectedSite(null)}
          zIndex={10000}
        >
          {selectedSite && <SiteDetailPanel site={selectedSite} />}
        </Modal>

        {/* Expanded Table Modal */}
        <Modal
          isOpen={isTableExpanded}
          onClose={() => setIsTableExpanded(false)}
          zIndex={9999}
        >
          <div className="max-h-[80vh] overflow-auto">
            <SitesTable
              sites={filteredSites}
              onSiteClick={setSelectedSite}
              onSiteHighlight={setHighlightedSiteId}
              highlightedSiteId={highlightedSiteId}
              variant="expanded"
            />
          </div>
        </Modal>

        {/* About Modal */}
        <Modal
          isOpen={isAboutOpen}
          onClose={() => setIsAboutOpen(false)}
          zIndex={10001}
        >
          <About />
        </Modal>

        {/* Footer - GREEN background, sticky at bottom */}
        <footer className="fixed bottom-0 left-0 right-0 bg-[#009639] text-[#fefefe] shadow-lg z-50">
          {/* Desktop footer - full text with more height */}
          <div className="hidden md:block py-8">
            <div className={cn(components.container.base)}>
              <p className="text-sm text-center">
                Heritage Tracker • Evidence-based documentation • All data verified by UNESCO,
                Forensic Architecture, and Heritage for Peace
              </p>
            </div>
          </div>
          {/* Mobile footer - site name with About link */}
          <div className="md:hidden py-2">
            <div className={cn(components.container.base)}>
              <p className="text-xs text-center font-semibold">
                Heritage Tracker •{" "}
                <button
                  onClick={() => setIsAboutOpen(true)}
                  className="underline hover:text-[#fefefe]/80 transition-colors"
                  aria-label="About Heritage Tracker"
                >
                  About
                </button>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </CalendarProvider>
  );
}

export default App;
