/**
 * Site-specific API endpoints for Heritage Tracker
 *
 * All site-related API calls go through this module.
 * Uses centralized apiClient for HTTP requests.
 * Falls back to mock adapter when USE_MOCK_API is enabled.
 */

import { apiClient } from './client';
import type { ApiResponse, PaginatedResponse, SitesQueryParams } from './types';
import type { GazaSite } from '../types';
import { mockGetAllSites, mockGetSiteById } from './mockAdapter';

/**
 * Check if we should use mock data
 */
const shouldUseMockData = () => import.meta.env.VITE_USE_MOCK_API === 'true';

/**
 * Fetch all heritage sites (with optional filtering)
 */
export async function getAllSites(params?: SitesQueryParams): Promise<GazaSite[]> {
  // Use mock adapter in development
  if (shouldUseMockData()) {
    console.log('📦 Using mock adapter (MSW alternative)');
    return mockGetAllSites();
  }

  // Use real API
  try {
    const response = await apiClient.get<ApiResponse<GazaSite[]>>('/sites', {
      params: params as Record<string, string | number | boolean | string[]>,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch sites:', error);
    throw error;
  }
}

/**
 * Fetch paginated heritage sites (for large datasets)
 */
export async function getSitesPaginated(
  params?: SitesQueryParams
): Promise<PaginatedResponse<GazaSite>> {
  try {
    const response = await apiClient.get<PaginatedResponse<GazaSite>>('/sites/paginated', {
      params: params as Record<string, string | number | boolean | string[]>,
    });
    return response;
  } catch (error) {
    console.error('Failed to fetch paginated sites:', error);
    throw error;
  }
}

/**
 * Fetch a single heritage site by ID
 */
export async function getSiteById(id: string): Promise<GazaSite> {
  // Use mock adapter in development
  if (shouldUseMockData()) {
    return mockGetSiteById(id);
  }

  // Use real API
  try {
    const response = await apiClient.get<ApiResponse<GazaSite>>(`/sites/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch site ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new heritage site (admin only - future feature)
 */
export async function createSite(site: Omit<GazaSite, 'id'>): Promise<GazaSite> {
  try {
    const response = await apiClient.post<ApiResponse<GazaSite>>('/sites', site);
    return response.data;
  } catch (error) {
    console.error('Failed to create site:', error);
    throw error;
  }
}

/**
 * Update an existing heritage site (admin only - future feature)
 */
export async function updateSite(id: string, site: Partial<GazaSite>): Promise<GazaSite> {
  try {
    const response = await apiClient.put<ApiResponse<GazaSite>>(`/sites/${id}`, site);
    return response.data;
  } catch (error) {
    console.error(`Failed to update site ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a heritage site (admin only - future feature)
 */
export async function deleteSite(id: string): Promise<void> {
  try {
    await apiClient.delete<ApiResponse<void>>(`/sites/${id}`);
  } catch (error) {
    console.error(`Failed to delete site ${id}:`, error);
    throw error;
  }
}
