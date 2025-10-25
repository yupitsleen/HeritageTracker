# Scaling Implementation Plan - Pagination + Virtual Scrolling

**Created:** October 25, 2025
**Target:** Scale from 44 sites → thousands of sites
**Estimated Time:** 8-10 hours total

---

## Overview

Frontend updates needed to handle thousands of heritage sites efficiently with:
1. Server-side pagination
2. Virtual scrolling for tables
3. Map marker clustering
4. Optimized filtering

**Current State:**
- ✅ API layer ready with `getSitesPaginated()` function
- ✅ `VirtualizedTableBody` component exists (disabled)
- ✅ All infrastructure in place
- ⚠️ Currently fetches all sites at once (works for 44, breaks at 1000+)

---

## Phase 1: Enable Pagination (2-3 hours)

### 1.1 Create Paginated Hook

**File:** `src/hooks/useSitesPaginated.ts`

```typescript
import { useState, useEffect, useCallback } from 'react';
import { getSitesPaginated } from '../api/sites';
import type { GazaSite } from '../types';
import type { SitesQueryParams } from '../api/types';

export interface UseSitesPaginatedReturn {
  sites: GazaSite[];
  isLoading: boolean;
  error: Error | null;
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  refetch: () => void;
}

/**
 * Fetch sites with pagination
 *
 * @param params Query parameters (filters, sort, etc.)
 * @param initialPage Starting page number (default: 1)
 * @param initialPageSize Items per page (default: 50)
 */
export function useSitesPaginated(
  params?: Omit<SitesQueryParams, 'page' | 'pageSize'>,
  initialPage = 1,
  initialPageSize = 50
): UseSitesPaginatedReturn {
  const [sites, setSites] = useState<GazaSite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(initialPage);
  const [pageSize] = useState(initialPageSize);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchSites = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getSitesPaginated({
        ...params,
        page,
        pageSize,
      });

      setSites(response.data);
      setTotalItems(response.pagination.totalItems);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch sites');
      setError(error);
      console.error('useSitesPaginated error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [params, page, pageSize]);

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  const goToPage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(page + 1);
  }, [page, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(page - 1);
  }, [page, goToPage]);

  return {
    sites,
    isLoading,
    error,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
    },
    goToPage,
    nextPage,
    prevPage,
    refetch: fetchSites,
  };
}
```

### 1.2 Create Pagination UI Component

**File:** `src/components/Pagination/Pagination.tsx`

```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  isLoading = false
}: PaginationProps) {
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t">
      {/* Stats */}
      <div className="text-sm text-gray-700">
        Showing page <span className="font-semibold">{currentPage}</span> of{' '}
        <span className="font-semibold">{totalPages}</span>
        {' '}({totalItems} total sites)
      </div>

      {/* Page controls */}
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="px-3 py-1 rounded border disabled:opacity-50"
        >
          Previous
        </button>

        {pageNumbers.map((pageNum, idx) =>
          pageNum === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-3 py-1">...</span>
          ) : (
            <button
              key={pageNum}
              onClick={() => onPageChange(Number(pageNum))}
              disabled={isLoading}
              className={`px-3 py-1 rounded border ${
                pageNum === currentPage
                  ? 'bg-palestine-red text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              {pageNum}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className="px-3 py-1 rounded border disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

// Helper to show smart page numbers (1 ... 5 6 [7] 8 9 ... 100)
function getPageNumbers(current: number, total: number): (number | string)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [1];

  if (current > 3) {
    pages.push('...');
  }

  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push('...');
  }

  pages.push(total);

  return pages;
}
```

### 1.3 Update HomePage to Use Pagination

**File:** `src/pages/HomePage.tsx`

```typescript
// OLD: Fetch all sites at once
const { sites, isLoading, error } = useSites();

// NEW: Fetch paginated sites
const {
  sites,
  isLoading,
  error,
  pagination,
  goToPage
} = useSitesPaginated(
  {
    types: filters.types,
    statuses: filters.statuses,
    dateDestroyedStart: filters.dateRange.start,
    dateDestroyedEnd: filters.dateRange.end,
  },
  1,  // Initial page
  50  // Page size
);

// Add Pagination component to layout
<DesktopLayout
  // ... existing props
  pagination={
    <Pagination
      currentPage={pagination.page}
      totalPages={pagination.totalPages}
      totalItems={pagination.totalItems}
      onPageChange={goToPage}
      isLoading={isLoading}
    />
  }
/>
```

---

## Phase 2: Virtual Scrolling for Tables (2-3 hours)

### 2.1 Install TanStack Virtual

```bash
npm install @tanstack/react-virtual
```

### 2.2 Update VirtualizedTableBody

**File:** `src/components/SitesTable/VirtualizedTableBody.tsx`

```typescript
import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { GazaSite } from '../../types';
import { SiteTableRow } from './SiteTableRow';

interface VirtualizedTableBodyProps {
  sites: GazaSite[];
  onSiteClick: (site: GazaSite) => void;
  onSiteHighlight?: (siteId: string | null) => void;
  highlightedSiteId?: string | null;
  variant: 'compact' | 'expanded';
  isColumnVisible: (columnName: string) => boolean;
}

/**
 * Virtualized table body using TanStack Virtual
 * Only renders visible rows for optimal performance
 */
export function VirtualizedTableBody({
  sites,
  onSiteClick,
  onSiteHighlight,
  highlightedSiteId,
  variant,
  isColumnVisible,
}: VirtualizedTableBodyProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: sites.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => (variant === 'compact' ? 48 : 64), // Row height
    overscan: 5, // Render 5 extra rows above/below viewport
  });

  return (
    <div
      ref={parentRef}
      style={{
        height: '600px',
        overflow: 'auto',
      }}
    >
      <table className="min-w-full">
        <tbody
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
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
  );
}
```

### 2.3 Enable Virtual Scrolling in SitesTableDesktop

**File:** `src/components/SitesTable/SitesTableDesktop.tsx`

```typescript
// Add threshold constant
const VIRTUAL_SCROLL_THRESHOLD = 100;

export function SitesTableDesktop({ sites, ...props }: SitesTableDesktopProps) {
  const shouldUseVirtualScroll = sites.length > VIRTUAL_SCROLL_THRESHOLD;

  return (
    <div className="table-container">
      <table>
        <TableHeader {...headerProps} />
        {shouldUseVirtualScroll ? (
          <VirtualizedTableBody
            sites={sortedSites}
            {...bodyProps}
          />
        ) : (
          <tbody>
            {sortedSites.map(site => (
              <SiteTableRow key={site.id} site={site} {...bodyProps} />
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
}
```

---

## Phase 3: Map Marker Clustering (1-2 hours)

### 3.1 Install Leaflet Cluster

```bash
npm install react-leaflet-cluster
npm install --save-dev @types/leaflet.markercluster
```

### 3.2 Update MapMarkers Component

**File:** `src/components/Map/MapMarkers.tsx`

```typescript
import MarkerClusterGroup from 'react-leaflet-cluster';
import type { GazaSite } from '../../types';

const CLUSTERING_THRESHOLD = 50;

export function MapMarkers({ sites, ...props }: MapMarkersProps) {
  const shouldCluster = sites.length > CLUSTERING_THRESHOLD;

  const markers = sites.map(site => (
    <Marker
      key={site.id}
      position={site.coordinates}
      icon={getMarkerIcon(site.status)}
      eventHandlers={{
        click: () => props.onSiteHighlight(site.id),
      }}
    >
      <Popup>
        <SitePopup site={site} onViewDetails={props.onSiteClick} />
      </Popup>
    </Marker>
  ));

  if (shouldCluster) {
    return (
      <MarkerClusterGroup
        chunkedLoading
        maxClusterRadius={50}
        spiderfyOnMaxZoom
        showCoverageOnHover={false}
        zoomToBoundsOnClick
        iconCreateFunction={(cluster) => {
          const count = cluster.getChildCount();
          return L.divIcon({
            html: `<div class="cluster-marker">${count}</div>`,
            className: 'marker-cluster',
            iconSize: L.point(40, 40),
          });
        }}
      >
        {markers}
      </MarkerClusterGroup>
    );
  }

  return <>{markers}</>;
}
```

### 3.3 Add Cluster Styles

**File:** `src/index.css`

```css
/* Leaflet cluster markers */
.marker-cluster {
  background: rgba(185, 28, 28, 0.6);
  border-radius: 50%;
  text-align: center;
}

.cluster-marker {
  color: white;
  font-weight: bold;
  line-height: 40px;
}

.marker-cluster:hover {
  background: rgba(185, 28, 28, 0.8);
}
```

---

## Phase 4: Optimize Filtering (1-2 hours)

### 4.1 Move Filtering to Server-Side

**File:** `src/hooks/useFilteredSites.ts`

```typescript
// OLD: Client-side filtering
const filteredSites = sites.filter(site => {
  // ... complex filtering logic
});

// NEW: Server-side filtering (already done in useSitesPaginated!)
const { sites } = useSitesPaginated({
  types: selectedTypes,
  statuses: selectedStatuses,
  dateDestroyedStart: dateRange.start,
  dateDestroyedEnd: dateRange.end,
});
```

### 4.2 Add Debounced Search

**File:** `src/hooks/useDebounce.ts`

```typescript
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

**Usage in Search:**

```typescript
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 300);

const { sites } = useSitesPaginated({
  search: debouncedSearch, // Only fires API call 300ms after user stops typing
});
```

---

## Phase 5: Performance Optimization (1-2 hours)

### 5.1 Add React Query for Caching

```bash
npm install @tanstack/react-query
```

**File:** `src/hooks/useSitesQuery.ts`

```typescript
import { useQuery } from '@tanstack/react-query';
import { getSitesPaginated } from '../api/sites';

export function useSitesQuery(params: SitesQueryParams) {
  return useQuery({
    queryKey: ['sites', params],
    queryFn: () => getSitesPaginated(params),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
}
```

### 5.2 Add Loading Skeletons

**File:** `src/components/Loading/TableSkeleton.tsx`

```typescript
export function TableSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="animate-pulse">
          <td className="h-12 bg-gray-200 rounded"></td>
          <td className="h-12 bg-gray-200 rounded"></td>
          <td className="h-12 bg-gray-200 rounded"></td>
        </tr>
      ))}
    </tbody>
  );
}
```

---

## Testing Checklist

### Unit Tests

- [ ] `useSitesPaginated.test.ts` - Test pagination logic
- [ ] `Pagination.test.tsx` - Test UI controls
- [ ] `VirtualizedTableBody.test.tsx` - Test virtual scrolling
- [ ] `MapMarkers.test.tsx` - Test clustering behavior

### Integration Tests

- [ ] Test pagination with filters
- [ ] Test virtual scroll with 1000+ mock sites
- [ ] Test map clustering with 500+ markers
- [ ] Test search debouncing

### Performance Tests

```typescript
// Create large dataset for testing
const mockLargeSites = Array.from({ length: 5000 }, (_, i) => ({
  id: `site-${i}`,
  name: `Heritage Site ${i}`,
  // ... rest of fields
}));

// Test rendering performance
test('renders 5000 sites with virtual scrolling', () => {
  const { container } = render(
    <VirtualizedTableBody sites={mockLargeSites} />
  );

  // Should only render ~20 rows (visible + overscan)
  expect(container.querySelectorAll('tr')).toHaveLength(20);
});
```

---

## Deployment Checklist

### Before Deploying

- [ ] All 1546+ tests passing
- [ ] Linter passing (`npm run lint`)
- [ ] Production build successful (`npm run build`)
- [ ] Test with large dataset (1000+ sites)
- [ ] Test on slow network (throttle to 3G)
- [ ] Test pagination edge cases (page 1, last page, empty results)
- [ ] Test virtual scroll smoothness
- [ ] Test map clustering at different zoom levels

### Environment Variables

```bash
# .env.production
VITE_API_URL=https://api.heritagetracker.com/api
VITE_USE_MOCK_API=false
VITE_PAGE_SIZE=50
VITE_ENABLE_VIRTUAL_SCROLL=true
VITE_VIRTUAL_SCROLL_THRESHOLD=100
VITE_ENABLE_MAP_CLUSTERING=true
VITE_MAP_CLUSTER_THRESHOLD=50
```

---

## Success Metrics

After implementation, verify:

1. **Page Load Time**
   - Initial load: < 2s
   - Page navigation: < 500ms
   - Filter change: < 1s

2. **Memory Usage**
   - 1000 sites: < 100MB RAM
   - 5000 sites: < 200MB RAM
   - No memory leaks on pagination

3. **Rendering Performance**
   - 60 FPS scrolling
   - Smooth page transitions
   - No janky animations

4. **User Experience**
   - Loading states clear
   - No blank screens
   - Smooth interactions
   - Fast perceived performance

---

## Rollback Plan

If issues occur in production:

1. **Quick rollback**: Set `VITE_USE_MOCK_API=true` temporarily
2. **Disable features**: Set thresholds very high to disable virtual scroll/clustering
3. **Revert deployment**: Redeploy previous stable version

---

## Future Enhancements (Post-MVP)

- [ ] Infinite scroll (alternative to pagination)
- [ ] Advanced search with full-text search
- [ ] Save filter preferences to localStorage
- [ ] URL-based pagination (shareable links)
- [ ] Export filtered results to CSV
- [ ] Real-time updates with Supabase subscriptions

---

**Last Updated:** October 25, 2025
**Status:** Ready for Implementation
**Estimated Total Time:** 8-10 hours
**Dependencies:** Backend API must support pagination endpoint
