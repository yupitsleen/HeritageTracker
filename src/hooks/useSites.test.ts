/**
 * Tests for useSites Hook
 *
 * Focus: Hook behavior, loading/error states, refetch functionality
 * Avoids: MSW internals, API implementation details
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useSites } from './useSites';
import * as sitesApi from '../api/sites';

// Mock the API module
vi.mock('../api/sites');

describe('useSites', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('starts with loading state', () => {
      vi.mocked(sitesApi.getAllSites).mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => useSites());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.sites).toEqual([]);
      expect(result.current.error).toBeNull();
    });
  });

  describe('Successful Data Fetch', () => {
    it('returns sites when fetch succeeds', async () => {
      const mockSites = [
        { id: 'site-1', name: 'Test Site 1' },
        { id: 'site-2', name: 'Test Site 2' },
      ];

      vi.mocked(sitesApi.getAllSites).mockResolvedValue(mockSites as unknown as Site[]);

      const { result } = renderHook(() => useSites());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.sites).toEqual(mockSites);
      expect(result.current.error).toBeNull();
    });

    it('sets loading to false after successful fetch', async () => {
      vi.mocked(sitesApi.getAllSites).mockResolvedValue([]);

      const { result } = renderHook(() => useSites());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('Error Handling', () => {
    it('sets error when fetch fails', async () => {
      const mockError = new Error('Failed to fetch sites');
      vi.mocked(sitesApi.getAllSites).mockRejectedValue(mockError);

      const { result } = renderHook(() => useSites());

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });

      expect(result.current.error?.message).toBe('Failed to fetch sites');
      expect(result.current.isLoading).toBe(false);
      expect(result.current.sites).toEqual([]);
    });

    it('converts non-Error objects to Error', async () => {
      vi.mocked(sitesApi.getAllSites).mockRejectedValue('String error');

      const { result } = renderHook(() => useSites());

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });

      expect(result.current.error?.message).toBe('Failed to fetch sites');
    });
  });

  describe('Refetch Functionality', () => {
    it('provides refetch function', () => {
      vi.mocked(sitesApi.getAllSites).mockResolvedValue([]);

      const { result } = renderHook(() => useSites());

      expect(typeof result.current.refetch).toBe('function');
    });

    it('refetches data when refetch is called', async () => {
      const firstData = [{ id: 'site-1', name: 'First' }];
      const secondData = [{ id: 'site-2', name: 'Second' }];

      vi.mocked(sitesApi.getAllSites)
        .mockResolvedValueOnce(firstData as unknown as Site[])
        .mockResolvedValueOnce(secondData as unknown as Site[]);

      const { result } = renderHook(() => useSites());

      // Wait for initial fetch
      await waitFor(() => {
        expect(result.current.sites).toEqual(firstData);
      });

      // Trigger refetch
      result.current.refetch();

      // Wait for refetch
      await waitFor(() => {
        expect(result.current.sites).toEqual(secondData);
      });

      expect(sitesApi.getAllSites).toHaveBeenCalledTimes(2);
    });

    it('clears error on successful refetch', async () => {
      const mockError = new Error('First error');
      const mockData = [{ id: 'site-1', name: 'Test' }];

      vi.mocked(sitesApi.getAllSites)
        .mockRejectedValueOnce(mockError)
        .mockResolvedValueOnce(mockData as unknown as Site[]);

      const { result } = renderHook(() => useSites());

      // Wait for error
      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });

      // Refetch
      result.current.refetch();

      // Wait for success
      await waitFor(() => {
        expect(result.current.error).toBeNull();
      });

      expect(result.current.sites).toEqual(mockData);
    });
  });

  describe('Return Value Structure', () => {
    it('returns object with expected properties', async () => {
      vi.mocked(sitesApi.getAllSites).mockResolvedValue([]);

      const { result } = renderHook(() => useSites());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current).toHaveProperty('sites');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('refetch');
    });
  });
});
