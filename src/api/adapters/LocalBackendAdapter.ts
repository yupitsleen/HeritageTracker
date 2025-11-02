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

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  }

  async getAllSites(params?: SitesQueryParams): Promise<GazaSite[]> {
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
    const response = await fetch(url);

    return handleResponse<GazaSite[]>(response);
  }

  async getSitesPaginated(params?: SitesQueryParams): Promise<PaginatedResponse<GazaSite>> {
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
    const response = await fetch(url);

    return handleResponse<PaginatedResponse<GazaSite>>(response);
  }

  async getSiteById(id: string): Promise<GazaSite> {
    const response = await fetch(`${this.baseUrl}/sites/${id}`);
    return handleResponse<GazaSite>(response);
  }

  async getSitesNearLocation(lat: number, lng: number, radiusKm: number): Promise<GazaSite[]> {
    const queryParams = buildQueryParams({
      lat,
      lng,
      radius: radiusKm,
    });

    const url = `${this.baseUrl}/sites/nearby?${queryParams.toString()}`;
    const response = await fetch(url);

    return handleResponse<GazaSite[]>(response);
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
