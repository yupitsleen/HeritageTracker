import { lazy, Suspense, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "../components/Modal/Modal";
import { useTheme } from "../contexts/ThemeContext";
import { useAppState } from "../hooks/useAppState";
import { useFilteredSites } from "../hooks/useFilteredSites";
import { useTableResize } from "../hooks/useTableResize";
import { useThemeClasses } from "../hooks/useThemeClasses";
import { useSites } from "../hooks/useSites";
import { AppHeader } from "../components/Layout/AppHeader";
import { AppFooter } from "../components/Layout/AppFooter";
import { LoadingSpinner } from "../components/Loading/LoadingSpinner";
import { ErrorMessage } from "../components/Error/ErrorMessage";
import { applyFilterUpdates } from "../utils/filterHelpers";
import type { FilterState } from "../types";
import { Z_INDEX } from "../constants/layout";
import { COLORS } from "../config/colorThemes";

// Lazy load layout components for parallel chunk loading and faster initial paint
const DesktopLayout = lazy(() =>
  import("../components/Layout/DesktopLayout").then((m) => ({ default: m.DesktopLayout }))
);
const MobileLayout = lazy(() =>
  import("../components/Layout/MobileLayout").then((m) => ({ default: m.MobileLayout }))
);

// Lazy load SiteDetailPanel (less frequently accessed)
// Note: About, Stats, and Donate are now dedicated pages at /about, /stats, /donate for better performance
const SiteDetailPanel = lazy(() => import("../components/SiteDetail/SiteDetailPanel").then(m => ({ default: m.SiteDetailPanel })));

interface DashboardPageProps {
  isMobile: boolean;
}

/**
 * DashboardPage - Main heritage tracker dashboard with table, maps, and timeline
 */
export function DashboardPage({ isMobile }: DashboardPageProps) {
  // Fetch sites from API (using mock adapter in development)
  const { sites, isLoading, error, refetch } = useSites();

  // Use extracted hooks
  const appState = useAppState();
  const { filteredSites, total } = useFilteredSites(sites, appState.filters);
  const tableResize = useTableResize();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const t = useThemeClasses();

  // Navigate to Data page (full table view)
  const handleExpandTable = useCallback(() => {
    navigate("/data");
  }, [navigate]);

  // Wrapper function to handle filter updates using helper
  const handleFilterChange = useCallback((updates: Partial<FilterState>) => {
    applyFilterUpdates(updates, appState, false);
  }, [appState]);

  // Show error state if fetch failed (full screen)
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
            background: isDark ? COLORS.FLAG_RED_DARK : COLORS.FLAG_RED, // Muted red in dark mode
            clipPath: `polygon(0 0, 0 100%, ${tableResize.tableWidth + 600}px 50%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Header with flag line */}
      <AppHeader
        onOpenHelp={() => appState.setIsHelpOpen(true)}
      />

      {/* Main Content - Non-blocking render with skeleton UI while loading */}
      <main id="main-content" className="pb-24 md:pb-0 relative">
        {isLoading ? (
          // Show skeleton UI immediately while data loads
          <LoadingSpinner fullScreen message="Loading heritage sites..." />
        ) : (
          // Lazy load layout components with Suspense for parallel chunk loading
          <Suspense fallback={<LoadingSpinner fullScreen message="Loading dashboard..." />}>
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
                filterProps={{
                  filters: appState.filters,
                  onFilterChange: handleFilterChange,
                  hasActiveFilters: appState.hasActiveFilters,
                  onClearAll: appState.clearAllFilters,
                }}
                siteData={{
                  sites,
                  filteredSites,
                  totalSites: total,
                }}
                tableResize={{
                  width: tableResize.tableWidth,
                  isResizing: tableResize.isResizing,
                  handleResizeStart: tableResize.handleResizeStart,
                  getVisibleColumns: tableResize.getVisibleColumns,
                }}
                siteInteraction={{
                  highlightedSiteId: appState.highlightedSiteId,
                  onSiteClick: appState.setSelectedSite,
                  onSiteHighlight: appState.setHighlightedSiteId,
                  onExpandTable: handleExpandTable,
                }}
              />
            )}
          </Suspense>
        )}
      </main>

      {/* Site Detail Modal */}
      <Modal
        isOpen={appState.selectedSite !== null}
        onClose={() => appState.setSelectedSite(null)}
        zIndex={Z_INDEX.MODAL}
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
        zIndex={Z_INDEX.MODAL_DROPDOWN}
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
                <li>Use the filter dropdowns to filter by type, status, destruction date, or year built</li>
                <li>Clear all filters with the "Clear" button</li>
              </ul>
            </section>

            <section>
              <h3 className={`text-lg font-semibold mb-2 ${t.text.subheading}`}>Timeline Page</h3>
              <p className="text-sm">
                Click "Timeline" in the header to view a specialized page with 150+ historical satellite imagery versions
                from ESRI Wayback (2014-2025), showing how the landscape has changed over time.
              </p>
            </section>
          </div>
        </div>
      </Modal>

      {/* Footer */}
      <AppFooter
        isMobile={isMobile}
      />
    </div>
  );
}
