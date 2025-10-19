import { useState, useEffect, lazy, Suspense } from "react";
import { mockSites } from "./data/mockSites";
import { Modal } from "./components/Modal/Modal";
import { CalendarProvider } from "./contexts/CalendarContext";
import { AnimationProvider } from "./contexts/AnimationContext";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";
import { useAppState } from "./hooks/useAppState";
import { useFilteredSites } from "./hooks/useFilteredSites";
import { useTableResize } from "./hooks/useTableResize";
import { useThemeClasses } from "./hooks/useThemeClasses";
import { AppHeader } from "./components/Layout/AppHeader";
import { AppFooter } from "./components/Layout/AppFooter";
import { DesktopLayout } from "./components/Layout/DesktopLayout";
import { MobileLayout } from "./components/Layout/MobileLayout";
import { SitesTable } from "./components/SitesTable";
import { FilterBar } from "./components/FilterBar/FilterBar";
import { Button } from "./components/Button";

// Lazy load heavy components for better initial load performance
const SiteDetailPanel = lazy(() => import("./components/SiteDetail/SiteDetailPanel").then(m => ({ default: m.SiteDetailPanel })));
const About = lazy(() => import("./components/About/About").then(m => ({ default: m.About })));
const StatsDashboard = lazy(() => import("./components/Stats/StatsDashboard").then(m => ({ default: m.StatsDashboard })));
const DonateModal = lazy(() => import("./components/Donate/DonateModal").then(m => ({ default: m.DonateModal })));

/**
 * Main app content - uses animation context on desktop only
 */
function AppContent({ isMobile }: { isMobile: boolean }) {
  // Use extracted hooks
  const appState = useAppState();
  const { filteredSites, total } = useFilteredSites(mockSites, appState.filters);
  const tableResize = useTableResize();
  const { isDark } = useTheme();

  const t = useThemeClasses();

  return (
    <div
      data-theme={isDark ? "dark" : "light"}
      className={`min-h-screen relative transition-colors duration-200 ${t.layout.appBackground}`}>
      {/* Skip to content link for keyboard navigation */}
      <a
        href="#main-content"
        className={t.layout.skipLink}
      >
        Skip to main content
      </a>

      {/* Palestinian Flag Red Triangle - Background Element (Desktop only) */}
      {!isMobile && (
        <div
          className="fixed top-0 left-0 pointer-events-none z-[8] opacity-50 transition-colors duration-200"
          style={{
            width: `${tableResize.tableWidth + 600}px`, // Extends from left edge well into first map
            height: '100vh', // Full viewport height
            background: isDark ? '#8b2a30' : '#ed3039', // Muted red in dark mode
            clipPath: `polygon(0 0, 0 100%, ${tableResize.tableWidth + 600}px 50%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Header with flag line */}
      <AppHeader
        onOpenDonate={() => appState.setIsDonateOpen(true)}
        onOpenStats={() => appState.setIsStatsOpen(true)}
        onOpenAbout={() => appState.setIsAboutOpen(true)}
      />

      {/* Main Content */}
      <main id="main-content" className="pb-24 md:pb-0 relative">
        {isMobile ? (
          <MobileLayout
            selectedTypes={appState.filters.selectedTypes}
            selectedStatuses={appState.filters.selectedStatuses}
            destructionDateStart={appState.filters.destructionDateStart}
            destructionDateEnd={appState.filters.destructionDateEnd}
            searchTerm={appState.filters.searchTerm}
            onTypeChange={appState.setSelectedTypes}
            onStatusChange={appState.setSelectedStatuses}
            onDestructionDateStartChange={appState.setDestructionDateStart}
            onDestructionDateEndChange={appState.setDestructionDateEnd}
            onCreationYearStartChange={appState.setCreationYearStart}
            onCreationYearEndChange={appState.setCreationYearEnd}
            onSearchChange={appState.setSearchTerm}
            filteredSites={filteredSites}
            onSiteClick={appState.setSelectedSite}
            onSiteHighlight={appState.setHighlightedSiteId}
            highlightedSiteId={appState.highlightedSiteId}
          />
        ) : (
          <DesktopLayout
            selectedTypes={appState.filters.selectedTypes}
            selectedStatuses={appState.filters.selectedStatuses}
            searchTerm={appState.filters.searchTerm}
            destructionDateStart={appState.filters.destructionDateStart}
            destructionDateEnd={appState.filters.destructionDateEnd}
            setSelectedTypes={appState.setSelectedTypes}
            setSelectedStatuses={appState.setSelectedStatuses}
            setSearchTerm={appState.setSearchTerm}
            setDestructionDateStart={appState.setDestructionDateStart}
            setDestructionDateEnd={appState.setDestructionDateEnd}
            hasActiveFilters={appState.hasActiveFilters}
            clearAllFilters={appState.clearAllFilters}
            openFilterModal={appState.openFilterModal}
            filteredSites={filteredSites}
            totalSites={total}
            tableWidth={tableResize.tableWidth}
            isResizing={tableResize.isResizing}
            handleResizeStart={tableResize.handleResizeStart}
            getVisibleColumns={tableResize.getVisibleColumns}
            onSiteClick={appState.setSelectedSite}
            onSiteHighlight={appState.setHighlightedSiteId}
            highlightedSiteId={appState.highlightedSiteId}
            onExpandTable={() => appState.setIsTableExpanded(true)}
          />
        )}
      </main>

      {/* Site Detail Modal */}
      <Modal
        isOpen={appState.selectedSite !== null}
        onClose={() => appState.setSelectedSite(null)}
        zIndex={10000}
      >
        {appState.selectedSite && (
          <Suspense
            fallback={
              <div className={`p-8 text-center ${t.layout.loadingText}`}>
                <div>Loading site details...</div>
              </div>
            }
          >
            <SiteDetailPanel site={appState.selectedSite} />
          </Suspense>
        )}
      </Modal>

      {/* Expanded Table Modal */}
      <Modal
        isOpen={appState.modals.isTableExpanded}
        onClose={() => appState.setIsTableExpanded(false)}
        zIndex={9999}
      >
        <div className="h-[80vh]">
          <SitesTable
            sites={filteredSites}
            onSiteClick={appState.setSelectedSite}
            onSiteHighlight={appState.setHighlightedSiteId}
            highlightedSiteId={appState.highlightedSiteId}
            variant="expanded"
          />
        </div>
      </Modal>

      {/* Statistics Modal */}
      <Modal
        isOpen={appState.modals.isStatsOpen}
        onClose={() => appState.setIsStatsOpen(false)}
        zIndex={10001}
      >
        <Suspense
          fallback={
            <div className={`p-8 text-center ${t.layout.loadingText}`}>
              <div>Loading statistics...</div>
            </div>
          }
        >
          <StatsDashboard sites={mockSites} />
        </Suspense>
      </Modal>

      {/* About Modal */}
      <Modal
        isOpen={appState.modals.isAboutOpen}
        onClose={() => appState.setIsAboutOpen(false)}
        zIndex={10001}
      >
        <Suspense
          fallback={
            <div className={`p-8 text-center ${t.layout.loadingText}`}>
              <div>Loading about...</div>
            </div>
          }
        >
          <About />
        </Suspense>
      </Modal>

      {/* Donate Modal */}
      <Modal
        isOpen={appState.modals.isDonateOpen}
        onClose={() => appState.setIsDonateOpen(false)}
        zIndex={10001}
      >
        <Suspense
          fallback={
            <div className={`p-8 text-center ${t.layout.loadingText}`}>
              <div>Loading...</div>
            </div>
          }
        >
          <DonateModal />
        </Suspense>
      </Modal>

      {/* Filter Modal */}
      <Modal
        isOpen={appState.modals.isFilterOpen}
        onClose={() => appState.setIsFilterOpen(false)}
        zIndex={10001}
      >
        <h2 className={`text-2xl font-bold mb-6 ${t.layout.modalHeading}`}>Filter Sites</h2>
        <FilterBar
          selectedTypes={appState.tempFilters.selectedTypes}
          selectedStatuses={appState.tempFilters.selectedStatuses}
          destructionDateStart={appState.tempFilters.destructionDateStart}
          destructionDateEnd={appState.tempFilters.destructionDateEnd}
          searchTerm={appState.filters.searchTerm}
          onTypeChange={appState.setTempSelectedTypes}
          onStatusChange={appState.setTempSelectedStatuses}
          onDestructionDateStartChange={appState.setTempDestructionDateStart}
          onDestructionDateEndChange={appState.setTempDestructionDateEnd}
          onCreationYearStartChange={appState.setTempCreationYearStart}
          onCreationYearEndChange={appState.setTempCreationYearEnd}
          onSearchChange={appState.setSearchTerm}
          sites={mockSites}
        />
        <div className="mt-6 flex justify-end gap-3">
          <Button
            onClick={appState.clearTempFilters}
            disabled={!appState.hasTempFilters}
            variant="ghost"
          >
            Clear All
          </Button>
          <Button
            onClick={appState.applyFilters}
            disabled={!appState.hasUnappliedChanges}
            variant="primary"
            className={appState.hasUnappliedChanges ? "animate-pulse ring-2 ring-white/50" : ""}
          >
            Apply Filters
          </Button>
        </div>
      </Modal>

      {/* Footer */}
      <AppFooter
        onOpenDonate={() => appState.setIsDonateOpen(true)}
        onOpenStats={() => appState.setIsStatsOpen(true)}
        onOpenAbout={() => appState.setIsAboutOpen(true)}
        isMobile={isMobile}
      />
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
    <ThemeProvider>
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
    </ThemeProvider>
  );
}

export default App;
