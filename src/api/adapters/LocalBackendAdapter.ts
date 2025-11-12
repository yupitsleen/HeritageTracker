/**
 * Local Backend Adapter
 *
 * Connects to local Express server with PostgreSQL database
 * Perfect for realistic development environment
 */

import type { GazaSite } from '../../types';
import type { PaginatedResponse, SitesQueryParams } from '../types';
import type { BackendAdapter } from './types';
import { buildQueryParams } from '../../utils/queryBuilder';
import { logger } from '../../utils/logger';

/**
 * Handle fetch response and errors
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    if (response.status === 404) {
      const errorData = await response.json().catch(() => ({ message: 'Not found' }));
      throw new Error(errorData.message || 'Not found');
    }

    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(`API error: ${errorData.message || response.statusText}`);
  }

  return await response.json();
}

/**
 * Local backend adapter implementation
 * Communicates with Express server on localhost:5000
 */
export class LocalBackendAdapter implements BackendAdapter {
  private baseUrl: string;
  private abortControllers: Map<string, AbortController> = new Map();

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  }

  /**
   * Cancel a pending request
   * @param key - Request key to cancel
   */
  private cancelRequest(key: string): void {
    const controller = this.abortControllers.get(key);
    if (controller) {
      controller.abort();
      this.abortControllers.delete(key);
    }
  }

  /**
   * Create a new abort controller for a request
   * @param key - Unique key for the request
   * @returns AbortSignal to pass to fetch
   */
  private createAbortSignal(key: string): AbortSignal {
    // Cancel any existing request with this key
    this.cancelRequest(key);

    // Create new controller
    const controller = new AbortController();
    this.abortControllers.set(key, controller);

    return controller.signal;
  }

  /**
   * Clean up abort controller after request completes
   * @param key - Request key to clean up
   */
  private cleanupRequest(key: string): void {
    this.abortControllers.delete(key);
  }

  async getAllSites(params?: SitesQueryParams): Promise<GazaSite[]> {
    const requestKey = 'getAllSites';
    const signal = this.createAbortSignal(requestKey);

    try {
      const queryParams = buildQueryParams({
        types: params?.types,
        statuses: params?.statuses,
        search: params?.search,
        startDate: params?.dateDestroyedStart,
        endDate: params?.dateDestroyedEnd,
        unescoListed: params?.unescoListed,
        page: params?.page,
        pageSize: params?.pageSize,
      });

      const url = `${this.baseUrl}/sites${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await fetch(url, { signal });

      return handleResponse<GazaSite[]>(response);
    } catch (error) {
      // Don't throw error for cancelled requests
      if (error instanceof Error && error.name === 'AbortError') {
        logger.debug('[LocalBackendAdapter] Request cancelled:', requestKey);
        return [];
      }
      throw error;
    } finally {
      this.cleanupRequest(requestKey);
    }
  }

  async getSitesPaginated(params?: SitesQueryParams): Promise<PaginatedResponse<GazaSite>> {
    const requestKey = `getSitesPaginated-${params?.page || 1}`;
    const signal = this.createAbortSignal(requestKey);

    try {
      const queryParams = buildQueryParams({
        types: params?.types,
        statuses: params?.statuses,
        search: params?.search,
        startDate: params?.dateDestroyedStart,
        endDate: params?.dateDestroyedEnd,
        unescoListed: params?.unescoListed,
        page: params?.page,
        pageSize: params?.pageSize,
        sortBy: params?.sortBy,
        sortOrder: params?.sortOrder,
      });

      const url = `${this.baseUrl}/sites/paginated${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await fetch(url, { signal });

      return handleResponse<PaginatedResponse<GazaSite>>(response);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        logger.debug('[LocalBackendAdapter] Request cancelled:', requestKey);
        return {
          data: [],
          pagination: {
            page: params?.page || 1,
            pageSize: params?.pageSize || 50,
            totalItems: 0,
            totalPages: 0,
          },
          success: true,
          timestamp: new Date().toISOString(),
        };
      }
      throw error;
    } finally {
      this.cleanupRequest(requestKey);
    }
  }

  async getSiteById(id: string): Promise<GazaSite> {
    const response = await fetch(`${this.baseUrl}/sites/${id}`);
    return handleResponse<GazaSite>(response);
  }

  async getSitesNearLocation(lat: number, lng: number, radiusKm: number): Promise<GazaSite[]> {
    const requestKey = 'getSitesNearLocation';
    const signal = this.createAbortSignal(requestKey);

    try {
      const queryParams = buildQueryParams({
        lat,
        lng,
        radius: radiusKm,
      });

      const url = `${this.baseUrl}/sites/nearby?${queryParams.toString()}`;
      const response = await fetch(url, { signal });

      return handleResponse<GazaSite[]>(response);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        logger.debug('[LocalBackendAdapter] Request cancelled:', requestKey);
        return [];
      }
      throw error;
    } finally {
      this.cleanupRequest(requestKey);
    }
  }

  async createSite(site: Omit<GazaSite, 'id'>): Promise<GazaSite> {
    const response = await fetch(`${this.baseUrl}/sites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(site),
    });

    return handleResponse<GazaSite>(response);
  }

  async updateSite(id: string, updates: Partial<GazaSite>): Promise<GazaSite> {
    const response = await fetch(`${this.baseUrl}/sites/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    return handleResponse<GazaSite>(response);
  }

  async deleteSite(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/sites/${id}`, {
      method: 'DELETE',
    });

    await handleResponse<void>(response);
  }
}
