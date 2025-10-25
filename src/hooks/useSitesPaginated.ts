/**
 * useSitesPaginated Hook - Fetch sites with pagination
 *
 * Handles:
 * - Paginated data fetching with loading/error states
 * - Page navigation (next, prev, goToPage)
 * - Retry logic
 * - Optional filtering via query parameters
 */

import { useState, useEffect, useCallback } from 'react';
import { getSitesPaginated } from '../api/sites';
import type { GazaSite } from '../types';
import type { SitesQueryParams } from '../api/types';

/**
 * Hook return type
 */
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
 * @returns Paginated sites data with navigation functions
 *
 * @example
 * ```tsx
 * const {
 *   sites,
 *   isLoading,
 *   error,
 *   pagination,
 *   nextPage,
 *   prevPage
 * } = useSitesPaginated({ types: ['mosque'] }, 1, 50);
 *
 * if (isLoading) return <LoadingSpinner />;
 * if (error) return <ErrorMessage error={error} onRetry={refetch} />;
 *
 * return (
 *   <>
 *     <SiteList sites={sites} />
 *     <Pagination {...pagination} onPageChange={goToPage} />
 *   </>
 * );
 * ```
 */
export function useSitesPaginated(
  params?: Omit<SitesQueryParams, 'page' | 'pageSize'>,
  initialPage = 1,
  initialPageSize = 50
): UseSitesPaginatedReturn {
  const [sites, setSites] = useState<GazaSite[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
      const error = err instanceof Error ? err : new Error('Failed to fetch paginated sites');
      setError(error);
      console.error('useSitesPaginated error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [params, page, pageSize]);

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  const goToPage = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setPage(newPage);
      }
    },
    [totalPages]
  );

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
