import { useState } from "react";

/**
 * Modal state interface
 */
export interface ModalState {
  isTableExpanded: boolean;
  isAboutOpen: boolean;
  isStatsOpen: boolean;
  isFilterOpen: boolean;
  isDonateOpen: boolean;
}

/**
 * Hook for managing modal visibility state
 *
 * Follows Single Responsibility Principle - only manages modal open/close state.
 */
export function useModalState() {
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);

  return {
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
