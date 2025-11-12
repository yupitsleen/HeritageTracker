/**
 * Mock Backend Adapter
 *
 * Uses in-memory mock data from mockSites.ts
 * Perfect for development without database setup
 */

import { mockSites } from '../../data/mockSites';
import type { Site } from '../../types';
import type { ApiResponse, PaginatedResponse, SitesQueryParams } from '../types';
import type { BackendAdapter } from './types';
import { API_MOCK_DELAY_MS } from '../../constants/api';
import { logger } from '../../utils/logger';

/**
 * Simulate network delay
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock adapter implementation
 * Uses static data from mockSites.ts with simulated network delay
 */
export class MockAdapter implements BackendAdapter {
  async getAllSites(params?: SitesQueryParams): Promise<Site[]> {
    await delay(API_MOCK_DELAY_MS);

    // Simulate API response format
    const response: ApiResponse<Site[]> = {
      data: mockSites,
      success: true,
      timestamp: new Date().toISOString(),
    };

    // Apply client-side filtering if params provided
    let filteredSites = response.data;

    if (params?.types?.length) {
      filteredSites = filteredSites.filter(site => params.types!.includes(site.type));
    }

    if (params?.statuses?.length) {
      filteredSites = filteredSites.filter(site => params.statuses!.includes(site.status));
    }

    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filteredSites = filteredSites.filter(
        site =>
          site.name.toLowerCase().includes(searchLower) ||
          site.nameArabic?.toLowerCase().includes(searchLower) ||
          site.description.toLowerCase().includes(searchLower)
      );
    }

    return filteredSites;
  }

  async getSitesPaginated(params?: SitesQueryParams): Promise<PaginatedResponse<Site>> {
    await delay(API_MOCK_DELAY_MS);

    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;

    // Get filtered sites first
    const allSites = await this.getAllSites(params);

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = allSites.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      pagination: {
        page,
        pageSize,
        totalItems: allSites.length,
        totalPages: Math.ceil(allSites.length / pageSize),
      },
      success: true,
      timestamp: new Date().toISOString(),
    };
  }

  async getSiteById(id: string): Promise<Site> {
    await delay(API_MOCK_DELAY_MS);

    const site = mockSites.find(s => s.id === id);

    if (!site) {
      throw new Error(`Site with ID "${id}" not found`);
    }

    const response: ApiResponse<Site> = {
      data: site,
      success: true,
      timestamp: new Date().toISOString(),
    };

    return response.data;
  }

  async getSitesNearLocation(lat: number, lng: number, radiusKm: number): Promise<Site[]> {
    await delay(API_MOCK_DELAY_MS);

    // Simple distance calculation using Haversine formula
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const R = 6371; // Earth's radius in km

    const nearSites = mockSites.filter(site => {
      const [siteLat, siteLng] = site.coordinates;
      const dLat = toRad(siteLat - lat);
      const dLng = toRad(siteLng - lng);

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat)) *
          Math.cos(toRad(siteLat)) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      return distance <= radiusKm;
    });

    return nearSites;
  }

  async createSite(site: Omit<Site, 'id'>): Promise<Site> {
    await delay(API_MOCK_DELAY_MS);

    // Mock implementation - not persisted
    const newSite: Site = {
      ...site,
      id: `site-${Date.now()}`,
    };

    logger.warn('MockAdapter: createSite not persisted (mock mode)');
    return newSite;
  }

  async updateSite(id: string, updates: Partial<Site>): Promise<Site> {
    await delay(API_MOCK_DELAY_MS);

    const existingSite = await this.getSiteById(id);

    // Mock implementation - not persisted
    const updatedSite: Site = {
      ...existingSite,
      ...updates,
      id, // Preserve original ID
    };

    logger.warn('MockAdapter: updateSite not persisted (mock mode)');
    return updatedSite;
  }

  async deleteSite(id: string): Promise<void> {
    await delay(API_MOCK_DELAY_MS);

    // Verify site exists
    await this.getSiteById(id);

    // Mock implementation - not persisted
    logger.warn('MockAdapter: deleteSite not persisted (mock mode)');
  }
}
