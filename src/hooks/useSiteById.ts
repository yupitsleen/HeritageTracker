/**
 * useSiteById Hook - Fetch single heritage site by ID
 *
 * Handles:
 * - Individual site fetching (for modals, detail pages)
 * - Loading/error states
 * - Retry logic
 * - Conditional fetching (only fetch when ID is provided)
 */

import { useState, useEffect, useCallback } from 'react';
import { getSiteById } from '../api/sites';
import type { GazaSite } from '../types';

/**
 * Hook return type
 */
export interface UseSiteByIdReturn {
  site: GazaSite | null;
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
  const [site, setSite] = useState<GazaSite | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSite = useCallback(async () => {
    if (!id) {
      setSite(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getSiteById(id);
      setSite(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(`Failed to fetch site ${id}`);
      setError(error);
      console.error('useSiteById error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSite();
  }, [fetchSite]);

  return {
    site,
    isLoading,
    error,
    refetch: fetchSite,
  };
}
