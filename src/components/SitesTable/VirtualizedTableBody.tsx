import { FixedSizeList as List } from "react-window";
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
 */
export function VirtualizedTableBody({
  sites,
  onSiteClick,
  onSiteHighlight,
  highlightedSiteId,
  variant,
  isColumnVisible,
  height,
  itemHeight,
}: VirtualizedTableBodyProps) {
  // Row renderer for react-window
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const site = sites[index];

    return (
      <div style={{ ...style, display: "table-row" }}>
        <SiteTableRow
          site={site}
          onSiteClick={onSiteClick}
          onSiteHighlight={onSiteHighlight}
          highlightedSiteId={highlightedSiteId}
          variant={variant}
          isColumnVisible={isColumnVisible}
        />
      </div>
    );
  };

  return (
    <List
      height={height}
      itemCount={sites.length}
      itemSize={itemHeight}
      width="100%"
      style={{ display: "table-row-group" }} // Acts as tbody
    >
      {Row}
    </List>
  );
}
