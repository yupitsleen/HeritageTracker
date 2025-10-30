import { useState, useCallback, useMemo, lazy, Suspense } from "react";
import { mockSites } from "../data/mockSites";
import { SitesTable } from "../components/SitesTable";
import { SharedLayout } from "../components/Layout/SharedLayout";
import { FilterBar } from "../components/FilterBar/FilterBar";
import { FilterTag } from "../components/FilterBar/FilterTag";
import { Modal } from "../components/Modal/Modal";
import { Button } from "../components/Button";
import { Input } from "../components/Form/Input";
import { useThemeClasses } from "../hooks/useThemeClasses";
import { useTranslation } from "../contexts/LocaleContext";
import { formatLabel } from "../utils/format";
import type { FilterState } from "../types/filters";
import { createEmptyFilterState, isFilterStateEmpty } from "../types/filters";
import type { GazaSite } from "../types";
import { COMPACT_FILTER_BAR } from "../constants/compactDesign";
import { Z_INDEX } from "../constants/layout";
import { COLORS } from "../constants/colors";

// Lazy load Site Detail Panel
const SiteDetailPanel = lazy(() => import("../components/SiteDetail/SiteDetailPanel").then(m => ({ default: m.SiteDetailPanel })));

export function DataPage() {
  const t = useThemeClasses();
  const translate = useTranslation();

  const [filters, setFilters] = useState<FilterState>(createEmptyFilterState());

  const [tempFilters, setTempFilters] = useState<FilterState>(filters);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<GazaSite | null>(null);

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
        const matchesArabicName = site.name_ar?.toLowerCase().includes(searchLower);
        if (!matchesName && !matchesArabicName) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  const handleFilterChange = (updates: Partial<FilterState>) => {
    setTempFilters(prev => ({ ...prev, ...updates }));
  };

  const openFilterModal = () => {
    setTempFilters(filters);
    setIsFilterModalOpen(true);
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setIsFilterModalOpen(false);
  };

  const clearAllFilters = () => {
    const emptyFilters = createEmptyFilterState();
    setFilters(emptyFilters);
    setTempFilters(emptyFilters);
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
      <div className="h-[calc(100vh-100px)] flex flex-col mb-8">
        {/* Compact Filter Bar */}
        <div className={`flex-shrink-0 ${t.containerBg.semiTransparent} shadow-md mb-4 px-4`}>
          <div className={`${COMPACT_FILTER_BAR.containerPadding} flex flex-col gap-1.5`}>
            {/* Top row - Filter controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Filter Button */}
                <button
                  onClick={openFilterModal}
                  style={{
                    backgroundColor: COLORS.FLAG_GREEN,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = COLORS.FLAG_GREEN_HOVER)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = COLORS.FLAG_GREEN)}
                  className={`${COMPACT_FILTER_BAR.buttonPadding} ${COMPACT_FILTER_BAR.inputHeight} text-white rounded shadow-md hover:shadow-lg transition-all duration-200 font-semibold active:scale-95 ${COMPACT_FILTER_BAR.inputText} border ${t.border.primary}`}
                >
                  {translate("filters.filters")}
                </button>

                {/* Clear All button - only show if filters active */}
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className={`${COMPACT_FILTER_BAR.buttonPadding} ${COMPACT_FILTER_BAR.inputHeight} ${t.bg.secondary} ${t.text.body} border ${t.border.default} rounded shadow-sm hover:shadow-md transition-all duration-200 font-semibold active:scale-95 ${COMPACT_FILTER_BAR.inputText}`}
                  >
                    {translate("filters.clearAll")}
                  </button>
                )}

                {/* Search Input */}
                <div className="relative">
                  <Input
                    type="text"
                    value={filters.searchTerm}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                    placeholder={translate("filters.searchPlaceholder")}
                    className={`${COMPACT_FILTER_BAR.inputWidth} ${COMPACT_FILTER_BAR.inputHeight} ${COMPACT_FILTER_BAR.inputPadding} text-black placeholder:text-gray-400 ${COMPACT_FILTER_BAR.inputText}`}
                  />
                  {filters.searchTerm.trim().length > 0 && (
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, searchTerm: "" }))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label={translate("aria.clearSearch")}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              </div>

              {/* Results count */}
              <div className={`${COMPACT_FILTER_BAR.resultText} ${t.text.muted}`}>
                Showing {filteredSites.length} of {mockSites.length} sites
              </div>
            </div>

            {/* Bottom row - Active filter tags (only if filters active) */}
            {hasActiveFilters && (
              <div className="flex items-center gap-1.5 flex-wrap">
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

      {/* Filter Modal */}
      <Modal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        zIndex={Z_INDEX.MODAL_DROPDOWN}
      >
        <h2 className={`text-2xl font-bold mb-6 ${t.layout.modalHeading}`}>Filter Sites</h2>
        <FilterBar
          filters={tempFilters}
          onFilterChange={handleFilterChange}
          sites={mockSites}
        />
        <div className="mt-6 flex justify-end gap-3">
          <Button
            onClick={() => setTempFilters(filters)}
            variant="secondary"
            size="sm"
          >
            {translate("filters.clear")}
          </Button>
          <Button
            onClick={applyFilters}
            variant="primary"
            size="sm"
          >
            {translate("filters.applyFilters")}
          </Button>
        </div>
      </Modal>
    </SharedLayout>
  );
}
