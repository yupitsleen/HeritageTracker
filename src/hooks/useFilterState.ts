import { useState, useCallback, useMemo } from "react";
import type { Site } from "../types";
import {
  type FilterState,
  createEmptyFilterState,
  isFilterStateEmpty,
  areFiltersEqual,
} from "../types/filters";

/**
 * Hook for managing filter state (applied and temporary)
 *
 * Handles both the active filters and temporary filters (used in modal before applying).
 * Follows Single Responsibility Principle - only manages filter-related state.
 */
export function useFilterState() {
  // Applied filters
  const [selectedTypes, setSelectedTypes] = useState<Array<Site["type"]>>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<Array<Site["status"]>>([]);
  const [destructionDateStart, setDestructionDateStart] = useState<Date | null>(null);
  const [destructionDateEnd, setDestructionDateEnd] = useState<Date | null>(null);
  const [creationYearStart, setCreationYearStart] = useState<number | null>(null);
  const [creationYearEnd, setCreationYearEnd] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Temporary filters (for modal - not applied until "Apply Filters" clicked)
  const [tempSelectedTypes, setTempSelectedTypes] = useState<Array<Site["type"]>>([]);
  const [tempSelectedStatuses, setTempSelectedStatuses] = useState<Array<Site["status"]>>([]);
  const [tempDestructionDateStart, setTempDestructionDateStart] = useState<Date | null>(null);
  const [tempDestructionDateEnd, setTempDestructionDateEnd] = useState<Date | null>(null);
  const [tempCreationYearStart, setTempCreationYearStart] = useState<number | null>(null);
  const [tempCreationYearEnd, setTempCreationYearEnd] = useState<number | null>(null);

  // Memoized filter states
  const filters = useMemo<FilterState>(
    () => ({
      selectedTypes,
      selectedStatuses,
      destructionDateStart,
      destructionDateEnd,
      creationYearStart,
      creationYearEnd,
      searchTerm,
    }),
    [
      selectedTypes,
      selectedStatuses,
      destructionDateStart,
      destructionDateEnd,
      creationYearStart,
      creationYearEnd,
      searchTerm,
    ]
  );

  const tempFilters = useMemo<FilterState>(
    () => ({
      selectedTypes: tempSelectedTypes,
      selectedStatuses: tempSelectedStatuses,
      destructionDateStart: tempDestructionDateStart,
      destructionDateEnd: tempDestructionDateEnd,
      creationYearStart: tempCreationYearStart,
      creationYearEnd: tempCreationYearEnd,
      searchTerm, // Search term is always synced (not part of modal)
    }),
    [
      tempSelectedTypes,
      tempSelectedStatuses,
      tempDestructionDateStart,
      tempDestructionDateEnd,
      tempCreationYearStart,
      tempCreationYearEnd,
      searchTerm,
    ]
  );

  // Derived states using utility functions
  const hasActiveFilters = useMemo(
    () => !isFilterStateEmpty(filters),
    [filters]
  );

  const hasUnappliedChanges = useMemo(
    () => !areFiltersEqual(filters, tempFilters),
    [filters, tempFilters]
  );

  const hasTempFilters = useMemo(
    () => !isFilterStateEmpty(tempFilters),
    [tempFilters]
  );

  // Actions
  const clearAllFilters = useCallback(() => {
    const empty = createEmptyFilterState();
    setSelectedTypes(empty.selectedTypes);
    setSelectedStatuses(empty.selectedStatuses);
    setDestructionDateStart(empty.destructionDateStart);
    setDestructionDateEnd(empty.destructionDateEnd);
    setCreationYearStart(empty.creationYearStart);
    setCreationYearEnd(empty.creationYearEnd);
    setSearchTerm(empty.searchTerm);
  }, []);

  const initializeTempFilters = useCallback(() => {
    setTempSelectedTypes(selectedTypes);
    setTempSelectedStatuses(selectedStatuses);
    setTempDestructionDateStart(destructionDateStart);
    setTempDestructionDateEnd(destructionDateEnd);
    setTempCreationYearStart(creationYearStart);
    setTempCreationYearEnd(creationYearEnd);
  }, [
    selectedTypes,
    selectedStatuses,
    destructionDateStart,
    destructionDateEnd,
    creationYearStart,
    creationYearEnd,
  ]);

  const applyFilters = useCallback(() => {
    setSelectedTypes(tempSelectedTypes);
    setSelectedStatuses(tempSelectedStatuses);
    setDestructionDateStart(tempDestructionDateStart);
    setDestructionDateEnd(tempDestructionDateEnd);
    setCreationYearStart(tempCreationYearStart);
    setCreationYearEnd(tempCreationYearEnd);
  }, [
    tempSelectedTypes,
    tempSelectedStatuses,
    tempDestructionDateStart,
    tempDestructionDateEnd,
    tempCreationYearStart,
    tempCreationYearEnd,
  ]);

  const clearTempFilters = useCallback(() => {
    const empty = createEmptyFilterState();
    setTempSelectedTypes(empty.selectedTypes);
    setTempSelectedStatuses(empty.selectedStatuses);
    setTempDestructionDateStart(empty.destructionDateStart);
    setTempDestructionDateEnd(empty.destructionDateEnd);
    setTempCreationYearStart(empty.creationYearStart);
    setTempCreationYearEnd(empty.creationYearEnd);
  }, []);

  return {
    // Applied filters
    filters,
    setSelectedTypes,
    setSelectedStatuses,
    setDestructionDateStart,
    setDestructionDateEnd,
    setCreationYearStart,
    setCreationYearEnd,
    setSearchTerm,

    // Temporary filters
    tempFilters,
    setTempSelectedTypes,
    setTempSelectedStatuses,
    setTempDestructionDateStart,
    setTempDestructionDateEnd,
    setTempCreationYearStart,
    setTempCreationYearEnd,

    // Derived states
    hasActiveFilters,
    hasUnappliedChanges,
    hasTempFilters,

    // Actions
    clearAllFilters,
    initializeTempFilters,
    applyFilters,
    clearTempFilters,
  };
}
