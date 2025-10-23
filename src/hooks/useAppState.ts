import { useCallback } from "react";
import { useFilterState } from "./useFilterState";
import { useModalState, type ModalState } from "./useModalState";
import { useSiteSelection } from "./useSiteSelection";

// Re-export types for backward compatibility
export type { ModalState };
export type { FilterState } from "../types/filters";

/**
 * Centralized application state management hook
 *
 * REFACTORED to follow Single Responsibility Principle:
 * - Composes three focused hooks (useFilterState, useModalState, useSiteSelection)
 * - Each hook manages one specific area of responsibility
 * - Maintains backward compatibility with existing API
 *
 * @deprecated Consider using the focused hooks directly:
 * - useFilterState() for filter management
 * - useModalState() for modal visibility
 * - useSiteSelection() for site selection/highlighting
 *
 * @returns State values and setter functions
 */
export function useAppState() {
  // Compose focused hooks
  const filterState = useFilterState();
  const modalState = useModalState();
  const siteSelection = useSiteSelection();

  // Open filter modal and initialize temp state
  const openFilterModal = useCallback(() => {
    filterState.initializeTempFilters();
    modalState.setIsFilterOpen(true);
  }, [filterState, modalState]);

  // Apply filters and close modal
  const applyFilters = useCallback(() => {
    filterState.applyFilters();
    modalState.setIsFilterOpen(false);
  }, [filterState, modalState]);

  return {
    // Site selection (from useSiteSelection)
    ...siteSelection,

    // Filters (from useFilterState)
    filters: filterState.filters,
    setSelectedTypes: filterState.setSelectedTypes,
    setSelectedStatuses: filterState.setSelectedStatuses,
    setDestructionDateStart: filterState.setDestructionDateStart,
    setDestructionDateEnd: filterState.setDestructionDateEnd,
    setCreationYearStart: filterState.setCreationYearStart,
    setCreationYearEnd: filterState.setCreationYearEnd,
    setSearchTerm: filterState.setSearchTerm,
    hasActiveFilters: filterState.hasActiveFilters,
    hasUnappliedChanges: filterState.hasUnappliedChanges,
    hasTempFilters: filterState.hasTempFilters,
    clearAllFilters: filterState.clearAllFilters,

    // Temp filters (from useFilterState)
    tempFilters: filterState.tempFilters,
    setTempSelectedTypes: filterState.setTempSelectedTypes,
    setTempSelectedStatuses: filterState.setTempSelectedStatuses,
    setTempDestructionDateStart: filterState.setTempDestructionDateStart,
    setTempDestructionDateEnd: filterState.setTempDestructionDateEnd,
    setTempCreationYearStart: filterState.setTempCreationYearStart,
    setTempCreationYearEnd: filterState.setTempCreationYearEnd,
    openFilterModal,
    applyFilters,
    clearTempFilters: filterState.clearTempFilters,

    // Modals (from useModalState)
    modals: modalState.modals,
    setIsTableExpanded: modalState.setIsTableExpanded,
    setIsAboutOpen: modalState.setIsAboutOpen,
    setIsStatsOpen: modalState.setIsStatsOpen,
    setIsFilterOpen: modalState.setIsFilterOpen,
    setIsDonateOpen: modalState.setIsDonateOpen,
    setIsHelpOpen: modalState.setIsHelpOpen,
  };
}
