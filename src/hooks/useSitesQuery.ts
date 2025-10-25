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
import type { SitesQueryParams } from '../api/types';
import type { GazaSite } from '../types';

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
    queryKey: ['sites', params], // Cache key based on params
    queryFn: () => getSitesPaginated(params),
    staleTime: 5 * 60 * 1000, // Data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes (formerly cacheTime)
    retry: 2, // Retry failed requests twice
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
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
      return response.data as GazaSite[];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}
