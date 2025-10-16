import { useState } from "react";
import { mockSites } from "./data/mockSites";
import type { GazaSite } from "./types";
import { components, cn } from "./styles/theme";
import { SitesTable } from "./components/SitesTable";
import { HeritageMap } from "./components/Map/HeritageMap";
import { StatusLegend } from "./components/Map/StatusLegend";
// import { VerticalTimeline } from "./components/Timeline/VerticalTimeline"; // HIDDEN - Phase 5 will remove
import { TimelineScrubber } from "./components/Timeline/TimelineScrubber";
import { FilterBar } from "./components/FilterBar/FilterBar";
import { FilterTag } from "./components/FilterBar/FilterTag";
import { Modal } from "./components/Modal/Modal";
import { formatLabel } from "./utils/format";
import { Input } from "./components/Form/Input";
import { useCalendar } from "./contexts/CalendarContext";
import { SiteDetailPanel } from "./components/SiteDetail/SiteDetailPanel";
import { About } from "./components/About/About";
import { StatsDashboard } from "./components/Stats/StatsDashboard";
import { CalendarProvider } from "./contexts/CalendarContext";
import { AnimationProvider } from "./contexts/AnimationContext";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";
import { DonateModal } from "./components/Donate/DonateModal";
import {
  filterSitesByTypeAndStatus,
  filterSitesByDestructionDate,
  filterSitesByCreationYear,
  filterSitesBySearch,
} from "./utils/siteFilters";

/**
 * Calendar toggle button component for switching between Gregorian and Islamic calendars
 */
function CalendarToggleButton() {
  const { calendarType, toggleCalendar } = useCalendar();

  return (
    <>
      <button
        onClick={toggleCalendar}
        className="px-2 py-1 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md text-[10px] font-medium text-gray-700 transition-colors"
        aria-label="Toggle calendar type"
      >
        {calendarType === "gregorian"
          ? "Switch to Islamic Calendar"
          : "Switch to Gregorian Calendar"}
      </button>
      {/* Live region for screen readers to announce calendar changes */}
      <div role="status" aria-live="polite" className="sr-only">
        {calendarType === "gregorian"
          ? "Displaying Gregorian calendar dates"
          : "Displaying Islamic calendar dates"}
      </div>
    </>
  );
}

/**
 * Main app content - uses animation context
 */
function AppContent() {
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
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);

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
  const searchFilteredSites = filterSitesBySearch(yearFilteredSites, searchTerm);

  // Phase 2: Show ALL filtered sites on map, timeline, and table
  // The map uses glow effect to show destruction state
  // Timeline shows event markers for all filtered sites
  // Table shows all filtered sites (user can see the full dataset)
  const mapSites = searchFilteredSites;
  const tableSites = searchFilteredSites;

  // Check if any filters are active
  const hasActiveFilters =
    selectedTypes.length > 0 ||
    selectedStatuses.length > 0 ||
    destructionDateStart !== null ||
    destructionDateEnd !== null ||
    creationYearStart !== null ||
    creationYearEnd !== null ||
    searchTerm.trim().length > 0;

  const clearAllFilters = () => {
    setSelectedTypes([]);
    setSelectedStatuses([]);
    setDestructionDateStart(null);
    setDestructionDateEnd(null);
    setCreationYearStart(null);
    setCreationYearEnd(null);
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Sticky Header with flag line */}
        <div className="sticky top-0 z-50 bg-[#000000]">
          {/* Header - BLACK background */}
          <header className={components.header.base}>
            <div className={cn(components.container.base, "py-3 relative")}>
              <h1 className="text-xl md:text-3xl font-bold text-center">Heritage Tracker</h1>
              <p className="text-[#f5f5f5] mt-1 md:mt-2 text-center text-xs md:text-base">
                Documenting the destruction of cultural heritage in Gaza (2023-2024)
              </p>
              {/* Navigation buttons - desktop only, positioned in top right */}
              <div className="hidden md:flex absolute top-3 right-4 md:top-6 md:right-6 gap-2">
                <button
                  onClick={() => setIsDonateOpen(true)}
                  className="px-3 py-1.5 bg-[#ed3039] hover:bg-[#d4202a] text-white text-xs md:text-sm rounded transition-colors font-medium"
                  aria-label="Help Palestine - Donate to relief efforts"
                >
                  Help Palestine
                </button>
                <button
                  onClick={() => setIsStatsOpen(true)}
                  className="px-3 py-1.5 bg-[#009639] hover:bg-[#007b2f] text-white text-xs md:text-sm rounded transition-colors font-medium"
                  aria-label="View Statistics"
                >
                  Statistics
                </button>
                <button
                  onClick={() => setIsAboutOpen(true)}
                  className="px-3 py-1.5 bg-[#009639] hover:bg-[#007b2f] text-white text-xs md:text-sm rounded transition-colors font-medium"
                  aria-label="About Heritage Tracker"
                >
                  About
                </button>
              </div>
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
                sites={tableSites}
                onSiteClick={setSelectedSite}
                onSiteHighlight={setHighlightedSiteId}
                highlightedSiteId={highlightedSiteId}
                variant="mobile"
              />
            </div>
          </div>

          {/* Desktop Layout - Filter button, search, calendar toggle, and active filters */}
          <div className="hidden md:block">
            <div className={cn(components.container.base, "pt-2 pb-1")}>
              <div className="flex items-center gap-3 flex-wrap">
                {/* Filter Button */}
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="px-4 py-2 bg-[#009639] hover:bg-[#007b2f] text-white rounded-md transition-colors text-sm font-medium"
                >
                  Filters
                </button>

                {/* Search bar - inline */}
                <div className="relative flex-1 max-w-xs">
                  <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search sites..."
                    className="w-full pr-8 text-xs py-1 px-2"
                  />
                  {searchTerm.trim().length > 0 && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Clear search"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Calendar Toggle */}
                <CalendarToggleButton />

                {/* Active filter tags */}
                {selectedTypes.map((type) => (
                  <FilterTag
                    key={type}
                    label={formatLabel(type)}
                    onRemove={() => setSelectedTypes(selectedTypes.filter((t) => t !== type))}
                    ariaLabel={`Remove ${type} filter`}
                  />
                ))}
                {selectedStatuses.map((status) => (
                  <FilterTag
                    key={status}
                    label={formatLabel(status)}
                    onRemove={() =>
                      setSelectedStatuses(selectedStatuses.filter((s) => s !== status))
                    }
                    ariaLabel={`Remove ${status} filter`}
                  />
                ))}

                {/* Clear button */}
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="px-3 py-1.5 bg-[#ed3039] text-[#fefefe] rounded-md hover:bg-[#d4202a] transition-colors text-xs font-medium"
                  >
                    Clear
                  </button>
                )}

                {/* Site count */}
                <span className="text-xs font-medium text-gray-600 ml-auto">
                  Showing {tableSites.length} of {mockSites.length} sites
                </span>
              </div>
            </div>

            {/* Two-column layout below FilterBar - Table on Left, Map on Right */}
            <div className="flex gap-6">
              {/* Left Sidebar - Sites Table (Sticky below header, scrollable on hover, WHITE outline with black inner border) */}
              <aside className="w-[480px] flex-shrink-0 pl-6 pt-3">
                <div className="border-4 border-white rounded-lg sticky top-[120px] max-h-[calc(100vh-120px)] overflow-y-auto z-10">
                  <div className="border border-black rounded-lg h-full overflow-y-auto">
                    <SitesTable
                      sites={tableSites}
                      onSiteClick={setSelectedSite}
                      onSiteHighlight={setHighlightedSiteId}
                      highlightedSiteId={highlightedSiteId}
                      onExpandTable={() => setIsTableExpanded(true)}
                    />
                  </div>
                </div>
              </aside>

              {/* Right - Map (Expanded to fill space) */}
              <div className="flex-1 min-w-0 pr-6 pt-3">
                <div className="w-full sticky top-[120px]">
                  <StatusLegend />
                  {/* Map without height wrapper - sizes to content */}
                  <HeritageMap
                    sites={mapSites}
                    onSiteClick={setSelectedSite}
                    highlightedSiteId={highlightedSiteId}
                    onSiteHighlight={setHighlightedSiteId}
                  />
                  {/* Timeline Scrubber - Directly below map */}
                  <div className="mt-4">
                    <TimelineScrubber sites={searchFilteredSites} />
                  </div>
                </div>
                {/* Spacer to allow table scrolling */}
                <div className="h-[200px]"></div>
              </div>
            </div>
          </div>
        </main>

        {/* Site Detail Modal - Higher z-index to appear above table modal */}
        <Modal isOpen={selectedSite !== null} onClose={() => setSelectedSite(null)} zIndex={10000}>
          {selectedSite && <SiteDetailPanel site={selectedSite} />}
        </Modal>

        {/* Expanded Table Modal */}
        <Modal isOpen={isTableExpanded} onClose={() => setIsTableExpanded(false)} zIndex={9999}>
          <div className="max-h-[80vh] overflow-auto">
            <SitesTable
              sites={tableSites}
              onSiteClick={setSelectedSite}
              onSiteHighlight={setHighlightedSiteId}
              highlightedSiteId={highlightedSiteId}
              variant="expanded"
            />
          </div>
        </Modal>

        {/* Statistics Modal */}
        <Modal isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} zIndex={10001}>
          <StatsDashboard sites={mockSites} />
        </Modal>

        {/* About Modal */}
        <Modal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} zIndex={10001}>
          <About />
        </Modal>

        {/* Donate Modal */}
        <Modal isOpen={isDonateOpen} onClose={() => setIsDonateOpen(false)} zIndex={10001}>
          <DonateModal />
        </Modal>

        {/* Filter Modal */}
        <Modal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} zIndex={10001}>
          <div className="bg-white rounded-lg p-6 max-w-5xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Filter Sites</h2>
            <FilterBar
              selectedTypes={selectedTypes}
              selectedStatuses={selectedStatuses}
              destructionDateStart={destructionDateStart}
              destructionDateEnd={destructionDateEnd}
              searchTerm={searchTerm}
              onTypeChange={setSelectedTypes}
              onStatusChange={setSelectedStatuses}
              onDestructionDateStartChange={setDestructionDateStart}
              onDestructionDateEndChange={setDestructionDateEnd}
              onCreationYearStartChange={setCreationYearStart}
              onCreationYearEndChange={setCreationYearEnd}
              onSearchChange={setSearchTerm}
            />
            <div className="mt-6 flex justify-end gap-3">
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors text-sm font-medium"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => setIsFilterOpen(false)}
                className="px-4 py-2 bg-[#009639] hover:bg-[#007b2f] text-white rounded-md transition-colors text-sm font-medium"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </Modal>

        {/* Footer - GREEN background, sticky at bottom */}
        <footer className="fixed bottom-0 left-0 right-0 bg-[#009639] text-[#fefefe] shadow-lg z-50">
          {/* Desktop footer - full text with more height */}
          <div className="hidden md:block py-4">
            <div className={cn(components.container.base)}>
              <p className="text-sm text-center">
                Heritage Tracker • Evidence-based documentation • All data verified by UNESCO,
                Forensic Architecture, and Heritage for Peace
              </p>
            </div>
          </div>
          {/* Mobile footer - site name with navigation links */}
          <div className="md:hidden py-2">
            <div className={cn(components.container.base)}>
              <p className="text-xs text-center font-semibold">
                Heritage Tracker •{" "}
                <button
                  onClick={() => setIsDonateOpen(true)}
                  className="underline hover:text-[#fefefe]/80 transition-colors"
                  aria-label="Help Palestine - Donate to relief efforts"
                >
                  Donate
                </button>
                {" • "}
                <button
                  onClick={() => setIsStatsOpen(true)}
                  className="underline hover:text-[#fefefe]/80 transition-colors"
                  aria-label="View Statistics"
                >
                  Stats
                </button>
                {" • "}
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
  );
}

/**
 * App wrapper with providers
 * ErrorBoundary wraps AnimationProvider to gracefully handle timeline errors
 */
function App() {
  return (
    <CalendarProvider>
      <ErrorBoundary>
        <AnimationProvider>
          <AppContent />
        </AnimationProvider>
      </ErrorBoundary>
    </CalendarProvider>
  );
}

export default App;
