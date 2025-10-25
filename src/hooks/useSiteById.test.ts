/**
 * Tests for useSiteById Hook
 *
 * Focus: Hook behavior with conditional fetching, null ID handling
 * Avoids: MSW internals, API implementation details
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useSiteById } from './useSiteById';
import * as sitesApi from '../api/sites';

// Mock the API module
vi.mock('../api/sites');

describe('useSiteById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Conditional Fetching', () => {
    it('does not fetch when ID is null', () => {
      const { result } = renderHook(() => useSiteById(null));

      expect(result.current.site).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(sitesApi.getSiteById).not.toHaveBeenCalled();
    });

    it('does not fetch when ID is undefined', () => {
      const { result } = renderHook(() => useSiteById(undefined));

      expect(result.current.site).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(sitesApi.getSiteById).not.toHaveBeenCalled();
    });

    it('fetches when ID is provided', async () => {
      const mockSite = { id: 'site-1', name: 'Test Site' };
      vi.mocked(sitesApi.getSiteById).mockResolvedValue(mockSite as unknown as GazaSite);

      const { result } = renderHook(() => useSiteById('site-1'));

      await waitFor(() => {
        expect(result.current.site).toEqual(mockSite);
      });

      expect(sitesApi.getSiteById).toHaveBeenCalledWith('site-1');
    });
  });

  describe('Loading State', () => {
    it('starts with loading when ID is provided', () => {
      vi.mocked(sitesApi.getSiteById).mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => useSiteById('site-1'));

      expect(result.current.isLoading).toBe(true);
      expect(result.current.site).toBeNull();
    });

    it('sets loading to false after successful fetch', async () => {
      vi.mocked(sitesApi.getSiteById).mockResolvedValue({ id: 'site-1' } as unknown as GazaSite);

      const { result } = renderHook(() => useSiteById('site-1'));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('does not load when ID is null', () => {
      const { result } = renderHook(() => useSiteById(null));

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Successful Data Fetch', () => {
    it('returns site when fetch succeeds', async () => {
      const mockSite = {
        id: 'great-omari-mosque',
        name: 'Great Omari Mosque',
        type: 'mosque',
      };

      vi.mocked(sitesApi.getSiteById).mockResolvedValue(mockSite as unknown as GazaSite);

      const { result } = renderHook(() => useSiteById('great-omari-mosque'));

      await waitFor(() => {
        expect(result.current.site).toEqual(mockSite);
      });

      expect(result.current.error).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('sets error when fetch fails', async () => {
      const mockError = new Error('Site not found');
      vi.mocked(sitesApi.getSiteById).mockRejectedValue(mockError);

      const { result } = renderHook(() => useSiteById('invalid-id'));

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.site).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });

    it('converts non-Error objects to Error', async () => {
      vi.mocked(sitesApi.getSiteById).mockRejectedValue('String error');

      const { result } = renderHook(() => useSiteById('site-123'));

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });

      expect(result.current.error).toBeInstanceOf(Error);
    });
  });

  describe('Refetch Functionality', () => {
    it('provides refetch function', () => {
      vi.mocked(sitesApi.getSiteById).mockResolvedValue({} as unknown as GazaSite);

      const { result } = renderHook(() => useSiteById('site-1'));

      expect(typeof result.current.refetch).toBe('function');
    });

    it('refetches data when refetch is called', async () => {
      const firstData = { id: 'site-1', name: 'First' };
      const secondData = { id: 'site-1', name: 'Updated' };

      vi.mocked(sitesApi.getSiteById)
        .mockResolvedValueOnce(firstData as unknown as GazaSite)
        .mockResolvedValueOnce(secondData as unknown as GazaSite);

      const { result } = renderHook(() => useSiteById('site-1'));

      // Wait for initial fetch
      await waitFor(() => {
        expect(result.current.site).toEqual(firstData);
      });

      // Trigger refetch
      result.current.refetch();

      // Wait for refetch
      await waitFor(() => {
        expect(result.current.site).toEqual(secondData);
      });

      expect(sitesApi.getSiteById).toHaveBeenCalledTimes(2);
    });

    it('does not fetch when refetch called with null ID', () => {
      const { result } = renderHook(() => useSiteById(null));

      result.current.refetch();

      expect(sitesApi.getSiteById).not.toHaveBeenCalled();
    });
  });

  describe('ID Change Behavior', () => {
    it('fetches new data when ID changes', async () => {
      const site1 = { id: 'site-1', name: 'Site 1' };
      const site2 = { id: 'site-2', name: 'Site 2' };

      vi.mocked(sitesApi.getSiteById)
        .mockResolvedValueOnce(site1 as unknown as GazaSite)
        .mockResolvedValueOnce(site2 as unknown as GazaSite);

      const { result, rerender } = renderHook(
        ({ id }) => useSiteById(id),
        { initialProps: { id: 'site-1' } }
      );

      // Wait for first site
      await waitFor(() => {
        expect(result.current.site).toEqual(site1);
      });

      // Change ID
      rerender({ id: 'site-2' });

      // Wait for second site
      await waitFor(() => {
        expect(result.current.site).toEqual(site2);
      });

      expect(sitesApi.getSiteById).toHaveBeenCalledTimes(2);
      expect(sitesApi.getSiteById).toHaveBeenNthCalledWith(1, 'site-1');
      expect(sitesApi.getSiteById).toHaveBeenNthCalledWith(2, 'site-2');
    });

    it('clears data when ID changes to null', async () => {
      const mockSite = { id: 'site-1', name: 'Test' };
      vi.mocked(sitesApi.getSiteById).mockResolvedValue(mockSite as unknown as GazaSite);

      const { result, rerender } = renderHook(
        ({ id }) => useSiteById(id),
        { initialProps: { id: 'site-1' as string | null } }
      );

      // Wait for site
      await waitFor(() => {
        expect(result.current.site).toEqual(mockSite);
      });

      // Change to null
      rerender({ id: null });

      // Should clear immediately
      expect(result.current.site).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Return Value Structure', () => {
    it('returns object with expected properties', () => {
      const { result } = renderHook(() => useSiteById(null));

      expect(result.current).toHaveProperty('site');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('refetch');
    });
  });
});
