/**
 * Query Configuration Constants
 *
 * Centralized configuration for React Query and async queries.
 * Used by useSitesQuery and other query hooks.
 */

/**
 * Cache configuration for React Query
 */
export const QUERY_CONFIG = {
  /** Data remains fresh for 5 minutes before refetch */
  STALE_TIME: 5 * 60 * 1000,

  /** Keep data in cache for 10 minutes after last use */
  GC_TIME: 10 * 60 * 1000,

  /** Number of retry attempts for failed queries */
  RETRY_COUNT: 2,

  /** Don't refetch when window regains focus */
  REFETCH_ON_WINDOW_FOCUS: false,
} as const;

/**
 * Performance thresholds for conditional feature activation
 */
export const PERFORMANCE_THRESHOLDS = {
  /** Enable virtual scrolling when site count exceeds this */
  VIRTUAL_SCROLL: 100,

  /** Enable map clustering when site count exceeds this */
  MAP_CLUSTERING: 50,

  /** Debounce delay for filter inputs (ms) */
  FILTER_DEBOUNCE: 300,

  /** Default page size for pagination */
  DEFAULT_PAGE_SIZE: 50,
} as const;
