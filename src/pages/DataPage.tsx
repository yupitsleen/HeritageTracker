import { useState, useCallback, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { mockSites } from "../data/mockSites";
import { SitesTable } from "../components/SitesTable";
import { SharedLayout } from "../components/Layout/SharedLayout";
import { FilterBar } from "../components/FilterBar/FilterBar";
import { Modal } from "../components/Modal/Modal";
import { useThemeClasses } from "../hooks/useThemeClasses";
import { useTranslation } from "../contexts/LocaleContext";
import { useDefaultFilterRanges } from "../hooks/useDefaultFilterRanges";
import { useFilteredSites } from "../hooks/useFilteredSites";
import type { FilterState } from "../types/filters";
import { createEmptyFilterState } from "../types/filters";
import type { Site } from "../types";
import { Z_INDEX } from "../constants/layout";

// Lazy load Site Detail Panel
const SiteDetailPanel = lazy(() => import("../components/SiteDetail/SiteDetailPanel").then(m => ({ default: m.SiteDetailPanel })));

export function DataPage() {
  const t = useThemeClasses();
  const translate = useTranslation();
  const navigate = useNavigate();

  const [filters, setFilters] = useState<FilterState>(createEmptyFilterState());
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);

  // Use shared hook for default filter ranges (eliminates 50 lines of duplicated logic)
  const { dateRange: defaultDateRange, yearRange: defaultYearRange } = useDefaultFilterRanges(mockSites);

  // Apply filters via the shared hook so date/year/unknown-date filters work here too
  // (the previous inline filter only handled type/status/search).
  const { filteredSites } = useFilteredSites(mockSites, filters);

  const handleFilterChange = useCallback((updates: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  }, []);

  const clearAllFilters = () => {
    setFilters(createEmptyFilterState());
  };

  // The sidebar collapses to a rail; the table beside it just takes the freed width.
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  // Handle site click to open detail panel
  const handleSiteClick = useCallback((site: Site) => {
    setSelectedSite(site);
  }, []);

  const handleViewOnMap = useCallback((siteId: string) => {
    setSelectedSite(null);
    navigate(`/?siteId=${siteId}`);
  }, [navigate]);

  return (
    <SharedLayout>
      <div className="h-[calc(100vh-58px)] flex flex-col md:flex-row gap-2 px-4 pt-2 pb-8">
        {/* Faceted filter sidebar (desktop) / search + drawer (mobile) */}
        <FilterBar
          variant="sidebar"
          filters={filters}
          onFilterChange={handleFilterChange}
          sites={mockSites}
          defaultDateRange={defaultDateRange}
          defaultYearRange={defaultYearRange}
          showActions={true}
          totalSites={mockSites.length}
          filteredSites={filteredSites.length}
          onClearAll={clearAllFilters}
          sidebarCollapsed={sidebarCollapsed}
          onSidebarCollapsedChange={setSidebarCollapsed}
        />

        {/* Data Table */}
        <div className="flex-1 min-h-0 min-w-0">
          <SitesTable
            sites={filteredSites}
            onSiteClick={handleSiteClick}
            onSiteHighlight={() => {}}
            highlightedSiteId={null}
            variant="expanded"
            clickableRow={true}
            tooltipText={translate("table.tooltipDataPage")}
          />
        </div>
      </div>

      {/* Site Detail Modal */}
      <Modal
        isOpen={selectedSite !== null}
        onClose={() => setSelectedSite(null)}
        zIndex={Z_INDEX.MODAL}
      >
        {selectedSite && (
          <Suspense
            fallback={
              <div className={`p-8 text-center ${t.layout.loadingText}`}>
                <div>Loading site details...</div>
              </div>
            }
          >
            <SiteDetailPanel site={selectedSite} onViewOnMap={handleViewOnMap} />
          </Suspense>
        )}
      </Modal>

    </SharedLayout>
  );
}
