import { useState, useCallback, useMemo, lazy, Suspense } from "react";
import { mockSites } from "../data/mockSites";
import { SitesTable } from "../components/SitesTable";
import { SharedLayout } from "../components/Layout/SharedLayout";
import { FilterBar } from "../components/FilterBar/FilterBar";
import { Modal } from "../components/Modal/Modal";
import { useThemeClasses } from "../hooks/useThemeClasses";
import { useDefaultFilterRanges } from "../hooks/useDefaultFilterRanges";
import type { FilterState } from "../types/filters";
import { createEmptyFilterState } from "../types/filters";
import type { Site } from "../types";
import { Z_INDEX } from "../constants/layout";

// Lazy load Site Detail Panel
const SiteDetailPanel = lazy(() => import("../components/SiteDetail/SiteDetailPanel").then(m => ({ default: m.SiteDetailPanel })));

export function DataPage() {
  const t = useThemeClasses();

  const [filters, setFilters] = useState<FilterState>(createEmptyFilterState());
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);

  // Use shared hook for default filter ranges (eliminates 50 lines of duplicated logic)
  const { dateRange: defaultDateRange, yearRange: defaultYearRange } = useDefaultFilterRanges(mockSites);

  // Apply filters to sites (memoized for performance)
  const filteredSites = useMemo(() => {
    return mockSites.filter(site => {
      // Type filter
      if (filters.selectedTypes.length > 0 && !filters.selectedTypes.includes(site.type)) {
        return false;
      }

      // Status filter
      if (filters.selectedStatuses.length > 0 && !filters.selectedStatuses.includes(site.status)) {
        return false;
      }

      // Search filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesName = site.name.toLowerCase().includes(searchLower);
        const matchesArabicName = site.nameArabic?.toLowerCase().includes(searchLower);
        if (!matchesName && !matchesArabicName) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  const handleFilterChange = useCallback((updates: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  }, []);

  const clearAllFilters = () => {
    setFilters(createEmptyFilterState());
  };

  // Handle site click to open detail panel
  const handleSiteClick = useCallback((site: Site) => {
    setSelectedSite(site);
  }, []);

  return (
    <SharedLayout>
      <div className="h-[calc(100vh-100px)] flex flex-col mb-8 pt-4">
        {/* Filter Bar Container */}
        <div
          className={`flex-shrink-0 mx-4 mb-4 p-2 backdrop-blur-sm ${t.border.primary} rounded shadow-lg relative transition-colors duration-200 bg-[#000000]/95`}
          style={{ zIndex: Z_INDEX.CONTENT }}
        >
          {/* Unified FilterBar with search, filters, and actions */}
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            sites={mockSites}
            defaultDateRange={defaultDateRange}
            defaultYearRange={defaultYearRange}
            showActions={true}
            totalSites={mockSites.length}
            filteredSites={filteredSites.length}
            onClearAll={clearAllFilters}
          />
        </div>

        {/* Data Table */}
        <div className="flex-1 min-h-0 px-4">
          <SitesTable
            sites={filteredSites}
            onSiteClick={handleSiteClick}
            onSiteHighlight={() => {}}
            highlightedSiteId={null}
            variant="expanded"
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
            <SiteDetailPanel site={selectedSite} />
          </Suspense>
        )}
      </Modal>

    </SharedLayout>
  );
}
