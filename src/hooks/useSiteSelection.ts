import { useState } from "react";
import type { Site } from "../types";

/**
 * Hook for managing site selection state
 *
 * Follows Single Responsibility Principle - only manages which site is selected/highlighted.
 */
export function useSiteSelection() {
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [highlightedSiteId, setHighlightedSiteId] = useState<string | null>(null);

  return {
    selectedSite,
    setSelectedSite,
    highlightedSiteId,
    setHighlightedSiteId,
  };
}
