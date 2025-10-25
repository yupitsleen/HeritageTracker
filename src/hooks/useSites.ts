/**
 * useSites Hook - Fetch all heritage sites
 *
 * Handles:
 * - Data fetching with loading/error states
 * - Retry logic
 * - Optional filtering via query parameters
 */

import { useState, useEffect, useCallback } from 'react';
import { getAllSites } from '../api/sites';
import type { GazaSite } from '../types';
import type { SitesQueryParams } from '../api/types';

/**
 * Hook return type
 */
export interface UseSitesReturn {
  sites: GazaSite[];
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
  const [sites, setSites] = useState<GazaSite[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSites = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getAllSites(params);
      setSites(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch sites');
      setError(error);
      console.error('useSites error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  return {
    sites,
    isLoading,
    error,
    refetch: fetchSites,
  };
}
