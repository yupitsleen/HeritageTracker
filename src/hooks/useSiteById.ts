/**
 * useSiteById Hook - Fetch single heritage site by ID
 *
 * Handles:
 * - Individual site fetching (for modals, detail pages)
 * - Loading/error states
 * - Retry logic
 * - Conditional fetching (only fetch when ID is provided)
 */

import { useAsyncQuery } from './useAsyncQuery';
import { getSiteById } from '../api/sites';
import type { Site } from '../types';

/**
 * Hook return type
 */
export interface UseSiteByIdReturn {
  site: Site | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Fetch a single site by ID with loading/error state management
 *
 * @param id Site ID to fetch (if null/undefined, won't fetch)
 * @returns Site data, loading state, error state, and refetch function
 *
 * @example
 * ```tsx
 * const { site, isLoading, error, refetch } = useSiteById(selectedSiteId);
 *
 * if (!selectedSiteId) return null;
 * if (isLoading) return <LoadingSpinner />;
 * if (error) return <ErrorMessage error={error} onRetry={refetch} />;
 * if (!site) return <NotFound />;
 *
 * return <SiteDetail site={site} />;
 * ```
 */
export function useSiteById(id: string | null | undefined): UseSiteByIdReturn {
  const { data, isLoading, error, refetch } = useAsyncQuery<Site, string | undefined>({
    queryFn: (params) => getSiteById(params!),
    params: id || undefined,
    enabled: !!id,
  });

  // Clear site data when ID becomes null/undefined
  return {
    site: id ? data : null,
    isLoading,
    error,
    refetch,
  };
}
