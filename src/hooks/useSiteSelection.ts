import { useState } from "react";
import type { GazaSite } from "../types";

/**
 * Hook for managing site selection state
 *
 * Follows Single Responsibility Principle - only manages which site is selected/highlighted.
 */
export function useSiteSelection() {
  const [selectedSite, setSelectedSite] = useState<GazaSite | null>(null);
  const [highlightedSiteId, setHighlightedSiteId] = useState<string | null>(null);

  return {
    selectedSite,
    setSelectedSite,
    highlightedSiteId,
    setHighlightedSiteId,
  };
}
