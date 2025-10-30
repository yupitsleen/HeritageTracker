import { lazy, Suspense, useCallback } from "react";
import { Modal } from "../components/Modal/Modal";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "../contexts/LocaleContext";
import { useAppState } from "../hooks/useAppState";
import { useFilteredSites } from "../hooks/useFilteredSites";
import { useTableResize } from "../hooks/useTableResize";
import { useThemeClasses } from "../hooks/useThemeClasses";
import { useSites } from "../hooks/useSites";
import { AppHeader } from "../components/Layout/AppHeader";
import { AppFooter } from "../components/Layout/AppFooter";
import { DesktopLayout } from "../components/Layout/DesktopLayout";
import { MobileLayout } from "../components/Layout/MobileLayout";
import { SitesTable } from "../components/SitesTable";
import { FilterBar } from "../components/FilterBar/FilterBar";
import { Button } from "../components/Button";
import { LoadingSpinner } from "../components/Loading/LoadingSpinner";
import { ErrorMessage } from "../components/Error/ErrorMessage";
import { applyFilterUpdates } from "../utils/filterHelpers";
import type { FilterState } from "../types";

// Lazy load only SiteDetailPanel (less frequently accessed)
// Note: About, Stats, and Donate are now dedicated pages at /about, /stats, /donate for better performance
const SiteDetailPanel = lazy(() => import("../components/SiteDetail/SiteDetailPanel").then(m => ({ default: m.SiteDetailPanel })));

interface HomePageProps {
  isMobile: boolean;
}

/**
 * HomePage - Main heritage tracker view with table, maps, and timeline
 */
export function HomePage({ isMobile }: HomePageProps) {
  // Fetch sites from API (using mock adapter in development)
  const { sites, isLoading, error, refetch } = useSites();

  // Use extracted hooks
  const appState = useAppState();
  const { filteredSites, total } = useFilteredSites(sites, appState.filters);
  const tableResize = useTableResize();
  const { isDark } = useTheme();
  const translate = useTranslation();

  const t = useThemeClasses();

  // Wrapper functions to handle filter updates using helper
  const handleFilterChange = useCallback((updates: Partial<FilterState>) => {
    applyFilterUpdates(updates, appState, false);
  }, [appState]);

  const handleTempFilterChange = useCallback((updates: Partial<FilterState>) => {
    applyFilterUpdates(updates, appState, true);
  }, [appState]);

  // Show loading state while fetching sites
  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading heritage sites..." />;
  }

  // Show error state if fetch failed
  if (error) {
    return <ErrorMessage error={error} onRetry={refetch} fullScreen />;
  }

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
        onOpenHelp={() => appState.setIsHelpOpen(true)}
      />

      {/* Main Content */}
      <main id="main-content" className="pb-24 md:pb-0 relative">
        {isMobile ? (
          <MobileLayout
            filters={appState.filters}
            onFilterChange={handleFilterChange}
            filteredSites={filteredSites}
            onSiteClick={appState.setSelectedSite}
            onSiteHighlight={appState.setHighlightedSiteId}
            highlightedSiteId={appState.highlightedSiteId}
          />
        ) : (
          <DesktopLayout
            filters={{
              selectedTypes: appState.filters.selectedTypes,
              selectedStatuses: appState.filters.selectedStatuses,
              searchTerm: appState.filters.searchTerm,
              destructionDateStart: appState.filters.destructionDateStart,
              destructionDateEnd: appState.filters.destructionDateEnd,
            }}
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
            tableResize={{
              width: tableResize.tableWidth,
              isResizing: tableResize.isResizing,
              handleResizeStart: tableResize.handleResizeStart,
              getVisibleColumns: tableResize.getVisibleColumns,
            }}
            onSiteClick={appState.setSelectedSite}
            onSiteHighlight={appState.setHighlightedSiteId}
            highlightedSiteId={appState.highlightedSiteId}
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


      {/* Help Modal */}
      <Modal
        isOpen={appState.modals.isHelpOpen}
        onClose={() => appState.setIsHelpOpen(false)}
        zIndex={10001}
      >
        <div className="p-6">
          <h2 className={`text-2xl font-bold mb-4 ${t.text.heading}`}>How to Use Heritage Tracker</h2>

          <div className={`space-y-4 ${t.text.body}`}>
            <section>
              <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Overview</h3>
              <p className="text-sm">
                Heritage Tracker documents cultural heritage sites in Gaza that have been damaged or destroyed.
                Explore the interactive map, timeline, and table to learn about these historically significant locations.
              </p>
            </section>

            <section>
              <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Site Table (Left)</h3>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Click on a site name to view detailed information</li>
                <li>Click on a row to highlight the site on the map</li>
                <li>Use the expand button to see all columns and export to CSV</li>
                <li>Drag the resize handle to adjust table width</li>
              </ul>
            </section>

            <section>
              <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Maps (Center & Right)</h3>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li><strong>Heritage Map (center):</strong> Interactive map with all sites. Toggle between street and satellite views</li>
                <li><strong>Site Detail View (right):</strong> Zooms to selected site. Use the time toggle (2014/Aug 2023/Current) to view historical satellite imagery</li>
                <li>Click on map markers to highlight sites</li>
                <li>Colored dots indicate site status: red (destroyed), orange (heavily damaged), yellow (damaged)</li>
              </ul>
            </section>

            <section>
              <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Timeline (Bottom)</h3>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Red dots represent destruction events</li>
                <li>Click a dot to highlight the corresponding site</li>
                <li>Use play/pause to animate through the timeline</li>
                <li>Adjust playback speed (0.5x, 1x, 2x, 4x)</li>
              </ul>
            </section>

            <section>
              <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Filtering</h3>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Use the search bar to find sites by name</li>
                <li>Click "Filters" to filter by type, status, or date range</li>
                <li>Clear all filters with the "Clear" button</li>
              </ul>
            </section>

            <section>
              <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Advanced Timeline</h3>
              <p className="text-sm">
                Click "Advanced Timeline" in the header to view a specialized page with 150+ historical satellite imagery versions
                from ESRI Wayback (2014-2025), showing how the landscape has changed over time.
              </p>
            </section>
          </div>
        </div>
      </Modal>

      {/* Filter Modal */}
      <Modal
        isOpen={appState.modals.isFilterOpen}
        onClose={() => appState.setIsFilterOpen(false)}
        zIndex={10001}
      >
        <h2 className={`text-2xl font-bold mb-6 ${t.layout.modalHeading}`}>Filter Sites</h2>
        <FilterBar
          filters={{
            ...appState.tempFilters,
            searchTerm: appState.filters.searchTerm,
          }}
          onFilterChange={handleTempFilterChange}
          sites={sites}
        />
        <div className="mt-6 flex justify-end gap-3">
          <Button
            onClick={appState.clearTempFilters}
            disabled={!appState.hasTempFilters}
            variant="ghost"
          >
            {translate("filters.clearAll")}
          </Button>
          <Button
            onClick={appState.applyFilters}
            disabled={!appState.hasUnappliedChanges}
            variant="primary"
            className={appState.hasUnappliedChanges ? "animate-pulse ring-2 ring-white/50" : ""}
          >
            {translate("filters.applyFilters")}
          </Button>
        </div>
      </Modal>

      {/* Footer */}
      <AppFooter
        isMobile={isMobile}
      />
    </div>
  );
}
