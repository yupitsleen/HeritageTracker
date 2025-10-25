/**
 * API Types for Heritage Tracker (Supabase Backend)
 *
 * Type definitions for API requests and responses.
 * These types wrap Supabase responses with pagination and metadata.
 */

import type { GazaSite, Source, ImageWithAttribution } from '../types';

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

/**
 * Paginated response for large datasets
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  success: boolean;
  timestamp: string;
}

/**
 * Error response from API
 */
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
}

/**
 * Site response from API (may include additional metadata)
 */
export interface ApiSite extends GazaSite {
  createdAt?: string;
  updatedAt?: string;
  version?: number;
}

/**
 * Query parameters for filtering sites
 * Used with both getAllSites() and getSitesPaginated()
 */
export interface SitesQueryParams {
  types?: string[];
  statuses?: string[];
  dateDestroyedStart?: string;
  dateDestroyedEnd?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'name' | 'dateDestroyed' | 'dateFounded' | 'type' | 'status';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Type guard for API errors
 */
export function isApiError(response: unknown): response is ApiError {
  return (
    typeof response === 'object' &&
    response !== null &&
    'success' in response &&
    response.success === false &&
    'error' in response
  );
}

export type { GazaSite, Source, ImageWithAttribution };
