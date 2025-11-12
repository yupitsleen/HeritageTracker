/**
 * Site-specific API functions for Heritage Tracker
 *
 * All site-related data fetching goes through this module.
 * Uses adapter pattern to switch between Mock, Local Backend, and Supabase.
 */

import { adapter } from './adapters';
import type { PaginatedResponse, SitesQueryParams } from './types';
import type { Site } from '../types';

/**
 * Fetch all heritage sites (with optional filtering)
 *
 * @param params Optional query parameters for filtering
 * @returns Array of heritage sites
 */
export async function getAllSites(params?: SitesQueryParams): Promise<Site[]> {
  return adapter.getAllSites(params);
}

/**
 * Fetch paginated heritage sites (for large datasets)
 *
 * @param params Query parameters including page, pageSize, and filters
 * @returns Paginated response with sites and metadata
 */
export async function getSitesPaginated(
  params?: SitesQueryParams
): Promise<PaginatedResponse<Site>> {
  return adapter.getSitesPaginated(params);
}

/**
 * Fetch a single heritage site by ID
 *
 * @param id Site unique identifier
 * @returns Single heritage site
 */
export async function getSiteById(id: string): Promise<Site> {
  return adapter.getSiteById(id);
}

/**
 * Geospatial query: Find sites within radius of a point
 *
 * @param lat Latitude
 * @param lng Longitude
 * @param radiusKm Radius in kilometers
 * @returns Sites within the specified radius
 */
export async function getSitesNearLocation(
  lat: number,
  lng: number,
  radiusKm: number
): Promise<Site[]> {
  return adapter.getSitesNearLocation(lat, lng, radiusKm);
}

/**
 * Create a new heritage site (admin only - future feature)
 *
 * @param site Site data (without ID)
 * @returns Created site with ID
 */
export async function createSite(site: Omit<Site, 'id'>): Promise<Site> {
  return adapter.createSite(site);
}

/**
 * Update an existing heritage site (admin only - future feature)
 *
 * @param id Site ID
 * @param updates Partial site data to update
 * @returns Updated site
 */
export async function updateSite(id: string, updates: Partial<Site>): Promise<Site> {
  return adapter.updateSite(id, updates);
}

/**
 * Delete a heritage site (admin only - future feature)
 *
 * @param id Site ID to delete
 */
export async function deleteSite(id: string): Promise<void> {
  return adapter.deleteSite(id);
}
