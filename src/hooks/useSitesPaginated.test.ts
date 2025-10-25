/**
 * Tests for useSitesPaginated Hook
 *
 * Behavior-focused tests for paginated data fetching
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useSitesPaginated } from './useSitesPaginated';
import * as sitesApi from '../api/sites';
import type { GazaSite } from '../types';

// Mock the sites API
vi.mock('../api/sites');

const mockSites: GazaSite[] = [
  {
    id: 'site-1',
    name: 'Test Mosque',
    type: 'mosque',
    coordinates: [31.5, 34.4],
    status: 'destroyed',
    dateDestroyed: '2023-10-27',
    dateFounded: '1500',
    description: 'Test description',
    significance: 'Test significance',
    sources: [],
  } as GazaSite,
  {
    id: 'site-2',
    name: 'Test Church',
    type: 'church',
    coordinates: [31.6, 34.5],
    status: 'damaged',
    dateDestroyed: '2023-11-15',
    dateFounded: '1600',
    description: 'Test description 2',
    significance: 'Test significance 2',
    sources: [],
  } as GazaSite,
];

describe('useSitesPaginated', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial Loading', () => {
    it('starts with loading state', () => {
      vi.mocked(sitesApi.getSitesPaginated).mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => useSitesPaginated());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.sites).toEqual([]);
      expect(result.current.error).toBeNull();
    });

    it('loads paginated sites successfully', async () => {
      vi.mocked(sitesApi.getSitesPaginated).mockResolvedValue({
        data: mockSites,
        pagination: {
          page: 1,
          pageSize: 50,
          totalItems: 100,
          totalPages: 2,
        },
        success: true,
        timestamp: new Date().toISOString(),
      });

      const { result } = renderHook(() => useSitesPaginated());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.sites).toEqual(mockSites);
      expect(result.current.pagination.totalItems).toBe(100);
      expect(result.current.pagination.totalPages).toBe(2);
      expect(result.current.error).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('sets error when fetch fails', async () => {
      vi.mocked(sitesApi.getSitesPaginated).mockRejectedValue(new Error('Failed to fetch'));

      const { result } = renderHook(() => useSitesPaginated());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Failed to fetch');
      expect(result.current.sites).toEqual([]);
    });

    it('converts non-Error objects to Error', async () => {
      vi.mocked(sitesApi.getSitesPaginated).mockRejectedValue('String error');

      const { result } = renderHook(() => useSitesPaginated());

      await waitFor(() => {
        expect(result.current.error).toBeInstanceOf(Error);
      });

      expect(result.current.error?.message).toBe('Failed to fetch paginated sites');
    });
  });

  describe('Page Navigation', () => {
    it('provides goToPage function', async () => {
      vi.mocked(sitesApi.getSitesPaginated).mockResolvedValue({
        data: mockSites,
        pagination: { page: 1, pageSize: 50, totalItems: 100, totalPages: 2 },
        success: true,
        timestamp: new Date().toISOString(),
      });

      const { result } = renderHook(() => useSitesPaginated());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(typeof result.current.goToPage).toBe('function');
      expect(typeof result.current.nextPage).toBe('function');
      expect(typeof result.current.prevPage).toBe('function');
    });

    it('updates page when goToPage is called', async () => {
      let callCount = 0;
      vi.mocked(sitesApi.getSitesPaginated).mockImplementation(async (params) => {
        callCount++;
        return {
          data: mockSites,
          pagination: {
            page: params?.page || 1,
            pageSize: 50,
            totalItems: 100,
            totalPages: 2,
          },
          success: true,
          timestamp: new Date().toISOString(),
        };
      });

      const { result } = renderHook(() => useSitesPaginated());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.pagination.page).toBe(1);

      // Go to page 2
      result.current.goToPage(2);

      await waitFor(() => {
        expect(result.current.pagination.page).toBe(2);
      });

      expect(callCount).toBeGreaterThan(1);
    });

    it('does not navigate beyond totalPages', async () => {
      vi.mocked(sitesApi.getSitesPaginated).mockResolvedValue({
        data: mockSites,
        pagination: { page: 2, pageSize: 50, totalItems: 100, totalPages: 2 },
        success: true,
        timestamp: new Date().toISOString(),
      });

      const { result } = renderHook(() => useSitesPaginated(undefined, 2));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const initialPage = result.current.pagination.page;

      // Try to go to page 3 (doesn't exist)
      result.current.goToPage(3);

      // Should still be on page 2
      expect(result.current.pagination.page).toBe(initialPage);
    });
  });

  describe('Refetch Functionality', () => {
    it('provides refetch function', async () => {
      vi.mocked(sitesApi.getSitesPaginated).mockResolvedValue({
        data: mockSites,
        pagination: { page: 1, pageSize: 50, totalItems: 100, totalPages: 2 },
        success: true,
        timestamp: new Date().toISOString(),
      });

      const { result } = renderHook(() => useSitesPaginated());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(typeof result.current.refetch).toBe('function');
    });
  });

  describe('Custom Parameters', () => {
    it('accepts custom initial page', async () => {
      vi.mocked(sitesApi.getSitesPaginated).mockResolvedValue({
        data: mockSites,
        pagination: { page: 3, pageSize: 50, totalItems: 100, totalPages: 5 },
        success: true,
        timestamp: new Date().toISOString(),
      });

      const { result } = renderHook(() => useSitesPaginated(undefined, 3));

      await waitFor(() => {
        expect(result.current.pagination.page).toBe(3);
      });
    });

    it('accepts custom page size', async () => {
      vi.mocked(sitesApi.getSitesPaginated).mockResolvedValue({
        data: mockSites,
        pagination: { page: 1, pageSize: 25, totalItems: 100, totalPages: 4 },
        success: true,
        timestamp: new Date().toISOString(),
      });

      const { result } = renderHook(() => useSitesPaginated(undefined, 1, 25));

      await waitFor(() => {
        expect(result.current.pagination.pageSize).toBe(25);
      });
    });

    it('passes filter params to API', async () => {
      const getSitesPagedSpy = vi.mocked(sitesApi.getSitesPaginated);

      getSitesPagedSpy.mockResolvedValue({
        data: [],
        pagination: { page: 1, pageSize: 50, totalItems: 0, totalPages: 0 },
        success: true,
        timestamp: new Date().toISOString(),
      });

      renderHook(() =>
        useSitesPaginated({
          types: ['mosque'],
          statuses: ['destroyed'],
        })
      );

      await waitFor(() => {
        expect(getSitesPagedSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            types: ['mosque'],
            statuses: ['destroyed'],
          })
        );
      });
    });
  });
});
