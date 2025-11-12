/**
 * useSitesQuery - Fetch sites with React Query caching
 *
 * Benefits:
 * - Automatic caching (5 minute stale time)
 * - Background refetching
 * - Deduplication of requests
 * - Cache invalidation
 * - Optimistic updates
 *
 * Use this instead of useSites() for better performance with pagination.
 */

import { useQuery } from '@tanstack/react-query';
import { getSitesPaginated } from '../api/sites';
import { QUERY_CONFIG } from '../config/queryConfig';
import type { SitesQueryParams } from '../api/types';
import type { Site } from '../types';

/**
 * Fetch paginated sites with caching
 *
 * @param params Query parameters (filters, pagination, sort)
 * @returns React Query result with data, loading, and error states
 *
 * @example
 * ```tsx
 * const { data, isLoading, error, refetch } = useSitesQuery({
 *   types: ['mosque'],
 *   page: 1,
 *   pageSize: 50,
 * });
 *
 * if (isLoading) return <LoadingSpinner />;
 * if (error) return <ErrorMessage error={error} onRetry={refetch} />;
 *
 * return <SiteList sites={data.data} pagination={data.pagination} />;
 * ```
 */
export function useSitesQuery(params?: SitesQueryParams) {
  return useQuery({
    queryKey: ['sites', params],
    queryFn: () => getSitesPaginated(params),
    staleTime: QUERY_CONFIG.STALE_TIME,
    gcTime: QUERY_CONFIG.GC_TIME,
    retry: QUERY_CONFIG.RETRY_COUNT,
    refetchOnWindowFocus: QUERY_CONFIG.REFETCH_ON_WINDOW_FOCUS,
  });
}

/**
 * Fetch all sites (non-paginated) with caching
 *
 * Use this for components that need all sites at once (e.g., map, timeline).
 * For large datasets, consider using useSitesQuery with pagination instead.
 */
export function useAllSitesQuery(params?: Omit<SitesQueryParams, 'page' | 'pageSize'>) {
  return useQuery({
    queryKey: ['all-sites', params],
    queryFn: async () => {
      const response = await getSitesPaginated({
        ...params,
        page: 1,
        pageSize: 10000, // Fetch all sites (up to 10k)
      });
      return response.data as Site[];
    },
    staleTime: QUERY_CONFIG.STALE_TIME,
    gcTime: QUERY_CONFIG.GC_TIME,
    retry: QUERY_CONFIG.RETRY_COUNT,
    refetchOnWindowFocus: QUERY_CONFIG.REFETCH_ON_WINDOW_FOCUS,
  });
}
