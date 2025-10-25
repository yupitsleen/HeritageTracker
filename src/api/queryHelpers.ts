/**
 * Query Helper Functions
 *
 * Shared logic for building Supabase queries with filters.
 * Eliminates duplication between getAllSites and getSitesPaginated.
 */

import type { SitesQueryParams } from './types';

/**
 * Apply common filter parameters to a Supabase query
 *
 * Handles: types, statuses, dateDestroyedStart, dateDestroyedEnd, search
 *
 * @param query Supabase query builder
 * @param params Query parameters with filters
 * @returns Modified query with filters applied
 *
 * @example
 * ```typescript
 * let query = supabase.from('heritage_sites').select('*');
 * query = applyQueryFilters(query, {
 *   types: ['mosque'],
 *   dateDestroyedStart: '2023-10-01'
 * });
 * ```
 */
export function applyQueryFilters(
  query: any,
  params?: SitesQueryParams
): any {
  if (!params) return query;

  // Filter by site types
  if (params.types && params.types.length > 0) {
    query = query.in('type', params.types);
  }

  // Filter by site statuses
  if (params.statuses && params.statuses.length > 0) {
    query = query.in('status', params.statuses);
  }

  // Filter by destruction date range (start)
  if (params.dateDestroyedStart) {
    query = query.gte('date_destroyed', params.dateDestroyedStart);
  }

  // Filter by destruction date range (end)
  if (params.dateDestroyedEnd) {
    query = query.lte('date_destroyed', params.dateDestroyedEnd);
  }

  // Search by name (English or Arabic)
  if (params.search) {
    query = query.or(
      `name.ilike.%${params.search}%,name_arabic.ilike.%${params.search}%`
    );
  }

  return query;
}
