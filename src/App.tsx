import { useState, useEffect, useCallback } from "react";
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
 * Main app content - uses animation context on desktop only
 */
function AppContent({ isMobile }: { isMobile: boolean }) {
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
  const [tableWidth, setTableWidth] = useState(480); // Resizable table width
  const [isResizing, setIsResizing] = useState(false);

  // Local filter state for modal (not applied until "Apply Filters" clicked)
  const [tempSelectedTypes, setTempSelectedTypes] = useState<Array<GazaSite["type"]>>([]);
  const [tempSelectedStatuses, setTempSelectedStatuses] = useState<Array<GazaSite["status"]>>([]);
  const [tempDestructionDateStart, setTempDestructionDateStart] = useState<Date | null>(null);
  const [tempDestructionDateEnd, setTempDestructionDateEnd] = useState<Date | null>(null);
  const [tempCreationYearStart, setTempCreationYearStart] = useState<number | null>(null);
  const [tempCreationYearEnd, setTempCreationYearEnd] = useState<number | null>(null);

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

  // Open filter modal and initialize temp state with current filters
  const openFilterModal = () => {
    setTempSelectedTypes(selectedTypes);
    setTempSelectedStatuses(selectedStatuses);
    setTempDestructionDateStart(destructionDateStart);
    setTempDestructionDateEnd(destructionDateEnd);
    setTempCreationYearStart(creationYearStart);
    setTempCreationYearEnd(creationYearEnd);
    setIsFilterOpen(true);
  };

  // Apply filters from temp state to actual state
  const applyFilters = () => {
    setSelectedTypes(tempSelectedTypes);
    setSelectedStatuses(tempSelectedStatuses);
    setDestructionDateStart(tempDestructionDateStart);
    setDestructionDateEnd(tempDestructionDateEnd);
    setCreationYearStart(tempCreationYearStart);
    setCreationYearEnd(tempCreationYearEnd);
    setIsFilterOpen(false);
  };

  // Clear all temp filters in modal
  const clearTempFilters = () => {
    setTempSelectedTypes([]);
    setTempSelectedStatuses([]);
    setTempDestructionDateStart(null);
    setTempDestructionDateEnd(null);
    setTempCreationYearStart(null);
    setTempCreationYearEnd(null);
  };

  // Resize handler for table
  const handleResizeStart = useCallback(() => {
    setIsResizing(true);
  }, []);

  // Handle mouse move during resize
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate new width from left edge of viewport to mouse position
      // Subtract 24px for left padding (pl-6)
      const newWidth = e.clientX - 24;
      // Min width: 480px, Max width: 1100px
      const clampedWidth = Math.max(480, Math.min(1100, newWidth));
      setTableWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Calculate which columns to show based on table width
  const getVisibleColumns = (): string[] => {
    const columns = ['name', 'status', 'dateDestroyed', 'actions'];
    if (tableWidth >= 650) columns.splice(1, 0, 'type'); // Add Type after Name
    if (tableWidth >= 800) columns.splice(columns.length - 1, 0, 'dateDestroyedIslamic'); // Add before Actions
    if (tableWidth >= 950) columns.splice(columns.length - 1, 0, 'yearBuilt');
    if (tableWidth >= 1100) columns.splice(columns.length - 1, 0, 'yearBuiltIslamic');
    return columns;
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
              {/* Help Palestine button - desktop only, positioned in top left */}
              <div className="hidden md:flex absolute top-3 left-4 md:top-6 md:left-6">
                <button
                  onClick={() => setIsDonateOpen(true)}
                  className="px-3 py-1.5 bg-[#ed3039] hover:bg-[#d4202a] text-white text-xs md:text-sm rounded transition-colors font-medium"
                  aria-label="Help Palestine - Donate to relief efforts"
                >
                  Help Palestine
                </button>
              </div>
              {/* Statistics and About buttons - desktop only, positioned in top right */}
              <div className="hidden md:flex absolute top-3 right-4 md:top-6 md:right-6 gap-2">
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
                  onClick={openFilterModal}
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
              {/* Left Sidebar - Sites Table (Resizable, RED outline with white inner border) */}
              <aside
                className="flex-shrink-0 pl-6 pt-3 relative"
                style={{ width: `${tableWidth}px` }}
              >
                <div className="border-4 border-[#ed3039] rounded-lg sticky top-[120px] max-h-[calc(100vh-120px)] overflow-y-auto z-10">
                  <div className="border-2 border-white rounded-lg h-full overflow-y-auto">
                    <SitesTable
                      sites={tableSites}
                      onSiteClick={setSelectedSite}
                      onSiteHighlight={setHighlightedSiteId}
                      highlightedSiteId={highlightedSiteId}
                      onExpandTable={() => setIsTableExpanded(true)}
                      visibleColumns={getVisibleColumns()}
                    />
                  </div>
                </div>
                {/* Resize handle */}
                <div
                  className={`absolute top-3 right-0 w-2 h-full cursor-col-resize z-20 hover:bg-[#ed3039] hover:bg-opacity-30 transition-colors ${isResizing ? 'bg-[#ed3039] bg-opacity-50' : ''}`}
                  onMouseDown={handleResizeStart}
                  title="Drag to resize table"
                  aria-label="Resize table"
                />
              </aside>

              {/* Right - Map (Expanded to fill space) - Desktop only */}
              {!isMobile && (
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
              )}
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
              selectedTypes={tempSelectedTypes}
              selectedStatuses={tempSelectedStatuses}
              destructionDateStart={tempDestructionDateStart}
              destructionDateEnd={tempDestructionDateEnd}
              searchTerm={searchTerm}
              onTypeChange={setTempSelectedTypes}
              onStatusChange={setTempSelectedStatuses}
              onDestructionDateStartChange={setTempDestructionDateStart}
              onDestructionDateEndChange={setTempDestructionDateEnd}
              onCreationYearStartChange={setTempCreationYearStart}
              onCreationYearEndChange={setTempCreationYearEnd}
              onSearchChange={setSearchTerm}
            />
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={clearTempFilters}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors text-sm font-medium"
              >
                Clear All
              </button>
              <button
                onClick={applyFilters}
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
 * AnimationProvider only active on desktop (where timeline is shown)
 */
function App() {
  // Check if we're on mobile - initialize immediately from window.innerWidth
  const [isMobile, setIsMobile] = useState(() => {
    // Check during initial render (works in browser, defaults to false in SSR)
    return typeof window !== 'undefined' && window.innerWidth < 768;
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    // Recheck on mount (in case window was resized before mount)
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <CalendarProvider>
      <ErrorBoundary>
        {isMobile ? (
          // Mobile: No AnimationProvider (timeline not shown)
          <AppContent isMobile={true} />
        ) : (
          // Desktop: AnimationProvider for timeline features
          <AnimationProvider sites={mockSites}>
            <AppContent isMobile={false} />
          </AnimationProvider>
        )}
      </ErrorBoundary>
    </CalendarProvider>
  );
}

export default App;
