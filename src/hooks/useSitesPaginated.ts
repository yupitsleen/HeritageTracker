/**
 * useSitesPaginated Hook - Fetch sites with pagination
 *
 * Handles:
 * - Paginated data fetching with loading/error states
 * - Page navigation (next, prev, goToPage)
 * - Retry logic
 * - Optional filtering via query parameters
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAsyncQuery } from './useAsyncQuery';
import { getSitesPaginated } from '../api/sites';
import type { GazaSite } from '../types';
import type { SitesQueryParams, PaginatedResponse } from '../api/types';

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
  const [page, setPage] = useState(initialPage);
  const [pageSize] = useState(initialPageSize);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Build query params including pagination
  const queryParams = useMemo(
    () => ({
      ...params,
      page,
      pageSize,
    }),
    [params, page, pageSize]
  );

  // Fetch paginated data using shared async hook
  const { data, isLoading, error, refetch } = useAsyncQuery<
    PaginatedResponse<GazaSite>,
    SitesQueryParams
  >({
    queryFn: getSitesPaginated,
    params: queryParams,
    errorMessage: 'Failed to fetch paginated sites',
    onError: (err) => console.error('useSitesPaginated error:', err),
  });

  // Update pagination metadata when data changes
  useEffect(() => {
    if (data) {
      setTotalItems(data.pagination.totalItems);
      setTotalPages(data.pagination.totalPages);
    }
  }, [data]);

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
    sites: data?.data ?? [],
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
    refetch,
  };
}
