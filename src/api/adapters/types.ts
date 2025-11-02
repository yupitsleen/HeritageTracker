/**
 * Backend Adapter Interface
 *
 * Defines the contract that all backend implementations must follow.
 * This enables easy switching between Mock, Local Backend, and Supabase.
 */

import type { GazaSite } from '../../types';
import type { PaginatedResponse, SitesQueryParams } from '../types';

/**
 * Backend adapter interface
 * All backend implementations (Mock, Local, Supabase) must implement this
 */
export interface BackendAdapter {
  /**
   * Fetch all heritage sites (with optional filtering)
   */
  getAllSites(params?: SitesQueryParams): Promise<GazaSite[]>;

  /**
   * Fetch paginated heritage sites
   */
  getSitesPaginated(params?: SitesQueryParams): Promise<PaginatedResponse<GazaSite>>;

  /**
   * Fetch a single heritage site by ID
   */
  getSiteById(id: string): Promise<GazaSite>;

  /**
   * Geospatial query: Find sites within radius of a point
   */
  getSitesNearLocation(lat: number, lng: number, radiusKm: number): Promise<GazaSite[]>;

  /**
   * Create a new heritage site (admin only - future feature)
   */
  createSite(site: Omit<GazaSite, 'id'>): Promise<GazaSite>;

  /**
   * Update an existing heritage site (admin only - future feature)
   */
  updateSite(id: string, updates: Partial<GazaSite>): Promise<GazaSite>;

  /**
   * Delete a heritage site (admin only - future feature)
   */
  deleteSite(id: string): Promise<void>;
}
