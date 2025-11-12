/**
 * useAsyncQuery - Reusable async state management hook
 *
 * Extracts common loading/error/data state pattern used across multiple hooks.
 * Eliminates ~45 lines of duplicated code from useSites, useSiteById, useSitesPaginated.
 */

import { useState, useEffect, useCallback } from 'react';
import { logger } from '../utils/logger';

export interface UseAsyncQueryOptions<TParams, TData> {
  queryFn: (params?: TParams) => Promise<TData>;
  params?: TParams;
  enabled?: boolean;
  errorMessage?: string;
  onError?: (error: Error) => void;
}

export interface UseAsyncQueryReturn<TData> {
  data: TData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Generic async query hook with loading/error state management
 *
 * @param options Query configuration
 * @returns Data, loading, error states and refetch function
 *
 * @example
 * ```tsx
 * const { data, isLoading, error, refetch } = useAsyncQuery({
 *   queryFn: () => getAllSites(),
 *   enabled: true,
 *   onError: (err) => console.error('Failed:', err)
 * });
 * ```
 */
export function useAsyncQuery<TData, TParams = void>({
  queryFn,
  params,
  enabled = true,
  errorMessage = 'Query failed',
  onError,
}: UseAsyncQueryOptions<TParams, TData>): UseAsyncQueryReturn<TData> {
  const [data, setData] = useState<TData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await queryFn(params);
      setData(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(errorMessage);
      setError(error);
      onError?.(error);
      logger.error('useAsyncQuery error:', error);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, enabled, errorMessage]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, enabled]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
}
