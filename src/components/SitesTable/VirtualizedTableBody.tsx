/**
 * Virtualized table body using TanStack Virtual
 * Only renders visible rows for optimal performance with large datasets
 *
 * Activated when site count exceeds VIRTUAL_SCROLL_THRESHOLD (100 sites)
 */

import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { GazaSite } from '../../types';
import { SiteTableRow } from './SiteTableRow';

interface VirtualizedTableBodyProps {
  sites: GazaSite[];
  onSiteClick?: (site: GazaSite) => void;
  onSiteHighlight?: (siteId: string | null) => void;
  highlightedSiteId?: string | null;
  variant: 'compact' | 'expanded';
  isColumnVisible: (columnName: string) => boolean;
  height?: number; // Container height (default: 600px)
}

/**
 * Virtualized table body using TanStack Virtual
 * Only renders visible rows for optimal performance
 *
 * @param sites Array of sites to display
 * @param variant Table variant (compact: 48px rows, expanded: 64px rows)
 * @param height Container height in pixels (default: 600)
 */
export function VirtualizedTableBody({
  sites,
  onSiteClick,
  onSiteHighlight,
  highlightedSiteId,
  variant,
  isColumnVisible,
  height = 600,
}: VirtualizedTableBodyProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: sites.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => (variant === 'compact' ? 48 : 64), // Row height
    overscan: 10, // Render 10 extra rows above/below viewport for smoother scrolling
  });

  return (
    <div
      ref={parentRef}
      className="smooth-scroll"
      style={{
        height: `${height}px`,
        overflow: 'auto',
        willChange: 'transform',
        contain: 'strict',
        scrollBehavior: 'auto', // Use auto for better performance during virtual scrolling
        WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        <table className="min-w-full">
          <tbody>
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const site = sites[virtualRow.index];
              return (
                <tr
                  key={site.id}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                    willChange: 'transform',
                  }}
                >
                  <SiteTableRow
                    site={site}
                    onSiteClick={onSiteClick}
                    onSiteHighlight={onSiteHighlight}
                    highlightedSiteId={highlightedSiteId}
                    variant={variant}
                    isColumnVisible={isColumnVisible}
                  />
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
