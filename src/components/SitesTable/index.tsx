import type { GazaSite } from "../../types";
import { SitesTableMobile } from "./SitesTableMobile";
import { SitesTableDesktop } from "./SitesTableDesktop";

interface SitesTableProps {
  sites: GazaSite[];
  onSiteClick?: (site: GazaSite) => void;
  onSiteHighlight?: (siteId: string | null) => void;
  highlightedSiteId?: string | null;
  onExpandTable?: () => void;
  variant?: "compact" | "expanded" | "mobile";
  visibleColumns?: string[]; // For resizable table - which columns to show
}

/**
 * Table view of heritage sites with click-to-view-details and sorting
 * Supports compact, expanded, and mobile accordion variants
 *
 * @variant compact - Desktop sidebar table (Name, Status, Destruction Date, Actions)
 * @variant expanded - Full modal table with all fields (Type, Islamic dates, Built dates)
 * @variant mobile - Accordion list for screens < 768px (Name/Type/Date collapsed, tap to expand for full details)
 *
 * Mobile features: Status shown via name color, sortable columns, sticky headers, inline detail expansion
 */
export function SitesTable({
  sites,
  onSiteClick,
  onSiteHighlight,
  highlightedSiteId,
  onExpandTable,
  variant = "compact",
  visibleColumns,
}: SitesTableProps) {
  // Route to appropriate variant component
  if (variant === "mobile") {
    return <SitesTableMobile sites={sites} />;
  }

  return (
    <SitesTableDesktop
      sites={sites}
      onSiteClick={onSiteClick}
      onSiteHighlight={onSiteHighlight}
      highlightedSiteId={highlightedSiteId}
      onExpandTable={onExpandTable}
      variant={variant}
      visibleColumns={visibleColumns}
    />
  );
}
