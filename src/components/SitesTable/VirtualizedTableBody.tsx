// NOTE: react-window types are currently incompatible with production build (TypeScript error)
// The library exports 'List' but TypeScript definitions expect 'FixedSizeList'
// This component is prepared for future use when site count exceeds VIRTUAL_SCROLL_THRESHOLD (50)
// Currently not activated because standard rendering performs well for current dataset
// TODO: Resolve react-window import issue or switch to react-virtualized when needed

import type { GazaSite } from "../../types";
import { SiteTableRow } from "./SiteTableRow";

interface VirtualizedTableBodyProps {
  sites: GazaSite[];
  onSiteClick: (site: GazaSite) => void;
  onSiteHighlight?: (siteId: string | null) => void;
  highlightedSiteId?: string | null;
  variant: "compact" | "expanded";
  isColumnVisible: (columnName: string) => boolean;
  height: number; // Container height
  itemHeight: number; // Row height
}

/**
 * Virtualized table body using react-window
 * Only renders visible rows for optimal performance with large datasets
 *
 * CURRENTLY DISABLED - See note above about react-window compatibility
 */
export function VirtualizedTableBody({
  sites,
  onSiteClick,
  onSiteHighlight,
  highlightedSiteId,
  variant,
  isColumnVisible,
}: VirtualizedTableBodyProps) {
  // Fallback to regular rendering until react-window import is resolved
  return (
    <tbody>
      {sites.map((site) => (
        <SiteTableRow
          key={site.id}
          site={site}
          onSiteClick={onSiteClick}
          onSiteHighlight={onSiteHighlight}
          highlightedSiteId={highlightedSiteId}
          variant={variant}
          isColumnVisible={isColumnVisible}
        />
      ))}
    </tbody>
  );
}
