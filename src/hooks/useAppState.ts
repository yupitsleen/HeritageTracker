import { useState, useCallback } from "react";
import type { GazaSite } from "../types";

/**
 * Interface for filter state
 */
export interface FilterState {
  selectedTypes: Array<GazaSite["type"]>;
  selectedStatuses: Array<GazaSite["status"]>;
  destructionDateStart: Date | null;
  destructionDateEnd: Date | null;
  creationYearStart: number | null;
  creationYearEnd: number | null;
  searchTerm: string;
}

/**
 * Interface for modal state
 */
export interface ModalState {
  isTableExpanded: boolean;
  isAboutOpen: boolean;
  isStatsOpen: boolean;
  isFilterOpen: boolean;
  isDonateOpen: boolean;
}

/**
 * Centralized application state management hook
 * Extracts all state declarations from App.tsx
 *
 * @returns State values and setter functions
 */
export function useAppState() {
  // Site selection state
  const [selectedSite, setSelectedSite] = useState<GazaSite | null>(null);
  const [highlightedSiteId, setHighlightedSiteId] = useState<string | null>(null);

  // Filter state
  const [selectedTypes, setSelectedTypes] = useState<Array<GazaSite["type"]>>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<Array<GazaSite["status"]>>([]);
  const [destructionDateStart, setDestructionDateStart] = useState<Date | null>(null);
  const [destructionDateEnd, setDestructionDateEnd] = useState<Date | null>(null);
  const [creationYearStart, setCreationYearStart] = useState<number | null>(null);
  const [creationYearEnd, setCreationYearEnd] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Temp filter state (for modal - not applied until "Apply Filters" clicked)
  const [tempSelectedTypes, setTempSelectedTypes] = useState<Array<GazaSite["type"]>>([]);
  const [tempSelectedStatuses, setTempSelectedStatuses] = useState<Array<GazaSite["status"]>>([]);
  const [tempDestructionDateStart, setTempDestructionDateStart] = useState<Date | null>(null);
  const [tempDestructionDateEnd, setTempDestructionDateEnd] = useState<Date | null>(null);
  const [tempCreationYearStart, setTempCreationYearStart] = useState<number | null>(null);
  const [tempCreationYearEnd, setTempCreationYearEnd] = useState<number | null>(null);

  // Modal state
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);

  // Check if any filters are active
  const hasActiveFilters =
    selectedTypes.length > 0 ||
    selectedStatuses.length > 0 ||
    destructionDateStart !== null ||
    destructionDateEnd !== null ||
    creationYearStart !== null ||
    creationYearEnd !== null ||
    searchTerm.trim().length > 0;

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setSelectedTypes([]);
    setSelectedStatuses([]);
    setDestructionDateStart(null);
    setDestructionDateEnd(null);
    setCreationYearStart(null);
    setCreationYearEnd(null);
    setSearchTerm("");
  }, []);

  // Open filter modal and initialize temp state with current filters
  const openFilterModal = useCallback(() => {
    setTempSelectedTypes(selectedTypes);
    setTempSelectedStatuses(selectedStatuses);
    setTempDestructionDateStart(destructionDateStart);
    setTempDestructionDateEnd(destructionDateEnd);
    setTempCreationYearStart(creationYearStart);
    setTempCreationYearEnd(creationYearEnd);
    setIsFilterOpen(true);
  }, [
    selectedTypes,
    selectedStatuses,
    destructionDateStart,
    destructionDateEnd,
    creationYearStart,
    creationYearEnd,
  ]);

  // Apply filters from temp state to actual state
  const applyFilters = useCallback(() => {
    setSelectedTypes(tempSelectedTypes);
    setSelectedStatuses(tempSelectedStatuses);
    setDestructionDateStart(tempDestructionDateStart);
    setDestructionDateEnd(tempDestructionDateEnd);
    setCreationYearStart(tempCreationYearStart);
    setCreationYearEnd(tempCreationYearEnd);
    setIsFilterOpen(false);
  }, [
    tempSelectedTypes,
    tempSelectedStatuses,
    tempDestructionDateStart,
    tempDestructionDateEnd,
    tempCreationYearStart,
    tempCreationYearEnd,
  ]);

  // Clear all temp filters in modal
  const clearTempFilters = useCallback(() => {
    setTempSelectedTypes([]);
    setTempSelectedStatuses([]);
    setTempDestructionDateStart(null);
    setTempDestructionDateEnd(null);
    setTempCreationYearStart(null);
    setTempCreationYearEnd(null);
  }, []);

  return {
    // Site selection
    selectedSite,
    setSelectedSite,
    highlightedSiteId,
    setHighlightedSiteId,

    // Filters (applied)
    filters: {
      selectedTypes,
      selectedStatuses,
      destructionDateStart,
      destructionDateEnd,
      creationYearStart,
      creationYearEnd,
      searchTerm,
    },
    setSelectedTypes,
    setSelectedStatuses,
    setDestructionDateStart,
    setDestructionDateEnd,
    setCreationYearStart,
    setCreationYearEnd,
    setSearchTerm,
    hasActiveFilters,
    clearAllFilters,

    // Temp filters (for modal)
    tempFilters: {
      tempSelectedTypes,
      tempSelectedStatuses,
      tempDestructionDateStart,
      tempDestructionDateEnd,
      tempCreationYearStart,
      tempCreationYearEnd,
    },
    setTempSelectedTypes,
    setTempSelectedStatuses,
    setTempDestructionDateStart,
    setTempDestructionDateEnd,
    setTempCreationYearStart,
    setTempCreationYearEnd,
    openFilterModal,
    applyFilters,
    clearTempFilters,

    // Modals
    modals: {
      isTableExpanded,
      isAboutOpen,
      isStatsOpen,
      isFilterOpen,
      isDonateOpen,
    },
    setIsTableExpanded,
    setIsAboutOpen,
    setIsStatsOpen,
    setIsFilterOpen,
    setIsDonateOpen,
  };
}
