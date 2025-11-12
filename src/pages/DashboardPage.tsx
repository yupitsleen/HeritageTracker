import { lazy, Suspense, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "../components/Modal/Modal";
import { useTheme } from "../contexts/ThemeContext";
import { useAnimation } from "../contexts/AnimationContext";
import { useAppState } from "../hooks/useAppState";
import { useFilteredSites } from "../hooks/useFilteredSites";
import { useTableResize } from "../hooks/useTableResize";
import { useThemeClasses } from "../hooks/useThemeClasses";
import { useSites } from "../hooks/useSites";
import { AppHeader } from "../components/Layout/AppHeader";
import { AppFooter } from "../components/Layout/AppFooter";
import { LoadingSpinner } from "../components/Loading/LoadingSpinner";
import { ErrorMessage } from "../components/Error/ErrorMessage";
import { DashboardHelpModal } from "../components/Help";
import { applyFilterUpdates } from "../utils/filterHelpers";
import type { FilterState } from "../types";
import { Z_INDEX } from "../constants/layout";
import { PalestinianFlagTriangle } from "../components/Decorative";

// Lazy load layout components for parallel chunk loading and faster initial paint
const DesktopLayout = lazy(() =>
  import("../components/Layout/DesktopLayout").then((m) => ({ default: m.DesktopLayout }))
);

// Lazy load SiteDetailPanel (less frequently accessed)
// Note: About, Stats, and Donate are now dedicated pages at /about, /stats, /donate for better performance
const SiteDetailPanel = lazy(() => import("../components/SiteDetail/SiteDetailPanel").then(m => ({ default: m.SiteDetailPanel })));

/**
 * DashboardPage - Main heritage tracker dashboard with table, maps, and timeline
 * Desktop only - mobile users see DataPage instead (see App.tsx routing)
 */
export function DashboardPage() {
  const navigate = useNavigate();
  const { setMapMarkersVisible } = useAnimation();

  // Set map markers to hidden by default on Dashboard (only on initial mount)
  useEffect(() => {
    setMapMarkersVisible(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount

  // Fetch sites from API (using mock adapter in development)
  const { sites, isLoading, error, refetch } = useSites();

  // Use extracted hooks
  const appState = useAppState();
  const { filteredSites, total } = useFilteredSites(sites, appState.filters);
  const tableResize = useTableResize();
  const { isDark } = useTheme();

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

      {/* Palestinian Flag Red Triangle - Background Element */}
      <PalestinianFlagTriangle
        width={tableResize.tableWidth + 600}
        zIndex={Z_INDEX.BACKGROUND_DECORATION}
      />

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
          // Note: Mobile devices are redirected to Data page via useEffect
          <Suspense fallback={<LoadingSpinner fullScreen message="Loading dashboard..." />}>
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
        <DashboardHelpModal />
      </Modal>

      {/* Footer - Desktop only */}
      <AppFooter isMobile={false} />
    </div>
  );
}
