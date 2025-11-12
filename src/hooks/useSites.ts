/**
 * useSites Hook - Fetch all heritage sites
 *
 * Handles:
 * - Data fetching with loading/error states
 * - Retry logic
 * - Optional filtering via query parameters
 */

import { useAsyncQuery } from './useAsyncQuery';
import { getAllSites } from '../api/sites';
import type { Site } from '../types';
import type { SitesQueryParams } from '../api/types';

/**
 * Hook return type
 */
export interface UseSitesReturn {
  sites: Site[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Fetch all sites with loading/error state management
 *
 * @param params Optional query parameters for filtering
 * @returns Sites data, loading state, error state, and refetch function
 *
 * @example
 * ```tsx
 * const { sites, isLoading, error, refetch } = useSites();
 *
 * if (isLoading) return <LoadingSpinner />;
 * if (error) return <ErrorMessage error={error} onRetry={refetch} />;
 *
 * return <SiteList sites={sites} />;
 * ```
 */
export function useSites(params?: SitesQueryParams): UseSitesReturn {
  const { data, isLoading, error, refetch } = useAsyncQuery<Site[], SitesQueryParams>({
    queryFn: getAllSites,
    params,
    errorMessage: 'Failed to fetch sites',
  });

  return {
    sites: data ?? [],
    isLoading,
    error,
    refetch,
  };
}
