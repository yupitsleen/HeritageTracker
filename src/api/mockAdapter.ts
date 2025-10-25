/**
 * Mock API Adapter - Alternative to MSW
 *
 * This provides mock responses without Service Workers
 * Useful when Service Worker registration fails
 */

import { mockSites } from '../data/mockSites';
import type { ApiResponse, PaginatedResponse, GazaSite } from './types';

/**
 * Simulate network delay
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const MOCK_DELAY = 800; // 800ms to simulate network latency

/**
 * Mock implementation of getAllSites
 */
export async function mockGetAllSites(): Promise<GazaSite[]> {
  await delay(MOCK_DELAY);

  // Simulate API response format
  const response: ApiResponse<GazaSite[]> = {
    data: mockSites,
    success: true,
    timestamp: new Date().toISOString(),
  };

  return response.data;
}

/**
 * Mock implementation of getSiteById
 */
export async function mockGetSiteById(id: string): Promise<GazaSite> {
  await delay(MOCK_DELAY);

  const site = mockSites.find(s => s.id === id);

  if (!site) {
    throw new Error(`Site with ID "${id}" not found`);
  }

  const response: ApiResponse<GazaSite> = {
    data: site,
    success: true,
    timestamp: new Date().toISOString(),
  };

  return response.data;
}

/**
 * Mock implementation of getSitesPaginated
 */
export async function mockGetSitesPaginated(
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse<GazaSite>> {
  await delay(MOCK_DELAY);

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = mockSites.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    pagination: {
      page,
      pageSize,
      totalItems: mockSites.length,
      totalPages: Math.ceil(mockSites.length / pageSize),
    },
    success: true,
    timestamp: new Date().toISOString(),
  };
}
