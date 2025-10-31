import { useState, useCallback, useMemo, lazy, Suspense } from "react";
import { mockSites } from "../data/mockSites";
import { SitesTable } from "../components/SitesTable";
import { SharedLayout } from "../components/Layout/SharedLayout";
import { FilterBar } from "../components/FilterBar/FilterBar";
import { FilterTag } from "../components/FilterBar/FilterTag";
import { Modal } from "../components/Modal/Modal";
import { useThemeClasses } from "../hooks/useThemeClasses";
import { formatLabel } from "../utils/format";
import type { FilterState } from "../types/filters";
import { createEmptyFilterState, isFilterStateEmpty } from "../types/filters";
import type { GazaSite } from "../types";
import { Z_INDEX } from "../constants/layout";

// Lazy load Site Detail Panel
const SiteDetailPanel = lazy(() => import("../components/SiteDetail/SiteDetailPanel").then(m => ({ default: m.SiteDetailPanel })));

export function DataPage() {
  const t = useThemeClasses();

  const [filters, setFilters] = useState<FilterState>(createEmptyFilterState());
  const [selectedSite, setSelectedSite] = useState<GazaSite | null>(null);

  // Pre-compute default date ranges ONCE at page level (not on every filter change)
  const defaultDateRange = useMemo(() => {
    const destructionDates = mockSites
      .filter(site => site.dateDestroyed)
      .map(site => new Date(site.dateDestroyed!));

    if (destructionDates.length === 0) {
      return {
        defaultStartDate: new Date("2023-10-07"),
        defaultEndDate: new Date(),
      };
    }

    const timestamps = destructionDates.map(d => d.getTime());
    return {
      defaultStartDate: new Date(Math.min(...timestamps)),
      defaultEndDate: new Date(Math.max(...timestamps)),
    };
  }, []); // Empty deps - only calculate once

  const defaultYearRange = useMemo(() => {
    const creationYears = mockSites
      .filter(site => site.yearBuilt)
      .map(site => {
        const match = site.yearBuilt?.match(/^(?:BCE\s+)?(-?\d+)/);
        return match ? parseInt(match[1], 10) * (site.yearBuilt?.startsWith('BCE') ? -1 : 1) : null;
      })
      .filter((year): year is number => year !== null);

    if (creationYears.length === 0) {
      return {
        defaultStartYear: "",
        defaultEndYear: new Date().getFullYear().toString(),
        defaultStartEra: "CE" as const,
      };
    }

    const minYear = Math.min(...creationYears);
    const maxYear = Math.max(...creationYears);

    const formatYear = (year: number): string => {
      if (year < 0) return Math.abs(year).toString();
      return year.toString();
    };

    return {
      defaultStartYear: formatYear(minYear),
      defaultEndYear: formatYear(maxYear),
      defaultStartEra: minYear < 0 ? ("BCE" as const) : ("CE" as const),
    };
  }, []); // Empty deps - only calculate once

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

  const hasActiveFilters = !isFilterStateEmpty(filters);

  // Memoized filter tag handlers to prevent unnecessary re-renders
  const handleRemoveType = useCallback((typeToRemove: GazaSite["type"]) => {
    setFilters(prev => ({
      ...prev,
      selectedTypes: prev.selectedTypes.filter((t) => t !== typeToRemove)
    }));
  }, []);

  const handleRemoveStatus = useCallback((statusToRemove: GazaSite["status"]) => {
    setFilters(prev => ({
      ...prev,
      selectedStatuses: prev.selectedStatuses.filter((s) => s !== statusToRemove)
    }));
  }, []);

  const handleRemoveDestructionDateRange = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      destructionDateStart: null,
      destructionDateEnd: null
    }));
  }, []);

  const handleRemoveCreationYearRange = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      creationYearStart: null,
      creationYearEnd: null
    }));
  }, []);

  // Handle site click to open detail panel
  const handleSiteClick = useCallback((site: GazaSite) => {
    setSelectedSite(site);
  }, []);

  return (
    <SharedLayout>
      <div className="h-[calc(100vh-100px)] flex flex-col mb-8 pt-4">
        {/* Filter Bar Container */}
        <div className={`flex-shrink-0 ${t.containerBg.semiTransparent} shadow-md mb-4 mx-4 rounded relative z-[1001]`}>
          <div className="p-4 flex flex-col gap-3">
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

            {/* Active filter tags (only if filters active) */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 flex-wrap">
                {filters.selectedTypes.map((type) => (
                  <FilterTag
                    key={type}
                    label={formatLabel(type)}
                    onRemove={() => handleRemoveType(type)}
                    ariaLabel={`Remove ${type} filter`}
                  />
                ))}
                {filters.selectedStatuses.map((status) => (
                  <FilterTag
                    key={status}
                    label={formatLabel(status)}
                    onRemove={() => handleRemoveStatus(status)}
                    ariaLabel={`Remove ${status} filter`}
                  />
                ))}
                {/* Destruction date filter tag */}
                {(filters.destructionDateStart || filters.destructionDateEnd) && (
                  <FilterTag
                    key="destruction-date"
                    label={`Destroyed: ${filters.destructionDateStart?.toLocaleDateString() || '...'} - ${filters.destructionDateEnd?.toLocaleDateString() || '...'}`}
                    onRemove={handleRemoveDestructionDateRange}
                    ariaLabel="Remove destruction date filter"
                  />
                )}
                {/* Creation year filter tag */}
                {(filters.creationYearStart || filters.creationYearEnd) && (
                  <FilterTag
                    key="creation-year"
                    label={`Built: ${filters.creationYearStart || '...'} - ${filters.creationYearEnd || '...'}`}
                    onRemove={handleRemoveCreationYearRange}
                    ariaLabel="Remove creation year filter"
                  />
                )}
              </div>
            )}
          </div>
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
