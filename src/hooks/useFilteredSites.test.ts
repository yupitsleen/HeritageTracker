/**
 * Tests for useFilteredSites Hook
 *
 * Focus: Core filtering logic, memoization, filter pipeline
 * Priority: P0 - Critical hook used across entire application
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFilteredSites } from './useFilteredSites';
import type { GazaSite } from '../types';
import type { FilterState } from './useAppState';

// Mock the filter utilities
vi.mock('../utils/siteFilters', () => ({
  filterSitesByTypeAndStatus: vi.fn((sites) => sites),
  filterSitesByDestructionDate: vi.fn((sites) => sites),
  filterSitesByCreationYear: vi.fn((sites) => sites),
  filterSitesBySearch: vi.fn((sites) => sites),
}));

import * as siteFilters from '../utils/siteFilters';

describe('useFilteredSites', () => {
  // Mock sites data for testing
  const createMockSite = (overrides: Partial<GazaSite> = {}): GazaSite => ({
    id: 'test-site-1',
    name: 'Test Mosque',
    nameArabic: 'مسجد الاختبار',
    type: 'mosque',
    yearBuilt: '1200',
    coordinates: [31.5, 34.5],
    status: 'destroyed',
    dateDestroyed: '2023-10-15',
    lastUpdated: '2024-01-01',
    description: 'Test description',
    historicalSignificance: 'Test significance',
    culturalValue: 'Test value',
    verifiedBy: ['UNESCO'],
    sources: [],
    ...overrides,
  });

  const mockSites: GazaSite[] = [
    createMockSite({ id: 'site-1', type: 'mosque', status: 'destroyed' }),
    createMockSite({ id: 'site-2', type: 'church', status: 'damaged' }),
    createMockSite({ id: 'site-3', type: 'archaeological_site', status: 'destroyed' }),
  ];

  const emptyFilters: FilterState = {
    selectedTypes: [],
    selectedStatuses: [],
    destructionDateStart: null,
    destructionDateEnd: null,
    creationYearStart: null,
    creationYearEnd: null,
    searchTerm: '',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mocks to return sites unchanged by default
    vi.mocked(siteFilters.filterSitesByTypeAndStatus).mockImplementation((sites) => sites);
    vi.mocked(siteFilters.filterSitesByDestructionDate).mockImplementation((sites) => sites);
    vi.mocked(siteFilters.filterSitesByCreationYear).mockImplementation((sites) => sites);
    vi.mocked(siteFilters.filterSitesBySearch).mockImplementation((sites) => sites);
  });

  describe('Smoke Tests', () => {
    it('returns filtered sites with empty filters', () => {
      const { result } = renderHook(() =>
        useFilteredSites(mockSites, emptyFilters)
      );

      expect(result.current.filteredSites).toEqual(mockSites);
      expect(result.current.count).toBe(3);
      expect(result.current.total).toBe(3);
    });

    it('returns correct structure', () => {
      const { result } = renderHook(() =>
        useFilteredSites(mockSites, emptyFilters)
      );

      expect(result.current).toHaveProperty('filteredSites');
      expect(result.current).toHaveProperty('count');
      expect(result.current).toHaveProperty('total');
      expect(Array.isArray(result.current.filteredSites)).toBe(true);
    });

    it('handles empty sites array', () => {
      const { result } = renderHook(() =>
        useFilteredSites([], emptyFilters)
      );

      expect(result.current.filteredSites).toEqual([]);
      expect(result.current.count).toBe(0);
      expect(result.current.total).toBe(0);
    });
  });

  describe('Filter Pipeline', () => {
    it('calls filters in correct order', () => {
      const filters: FilterState = {
        selectedTypes: ['mosque'],
        selectedStatuses: ['destroyed'],
        destructionDateStart: '2023-01-01',
        destructionDateEnd: '2023-12-31',
        creationYearStart: '1000',
        creationYearEnd: '2000',
        searchTerm: 'test',
      };

      renderHook(() => useFilteredSites(mockSites, filters));

      // Verify filters called in sequence
      expect(siteFilters.filterSitesByTypeAndStatus).toHaveBeenCalledWith(
        mockSites,
        ['mosque'],
        ['destroyed']
      );

      expect(siteFilters.filterSitesByDestructionDate).toHaveBeenCalled();
      expect(siteFilters.filterSitesByCreationYear).toHaveBeenCalled();
      expect(siteFilters.filterSitesBySearch).toHaveBeenCalled();
    });

    it('passes results through pipeline stages', () => {
      const stage1Result = [mockSites[0]];
      const stage2Result = [mockSites[0]];
      const stage3Result = [mockSites[0]];
      const stage4Result = [mockSites[0]];

      vi.mocked(siteFilters.filterSitesByTypeAndStatus).mockReturnValue(stage1Result);
      vi.mocked(siteFilters.filterSitesByDestructionDate).mockReturnValue(stage2Result);
      vi.mocked(siteFilters.filterSitesByCreationYear).mockReturnValue(stage3Result);
      vi.mocked(siteFilters.filterSitesBySearch).mockReturnValue(stage4Result);

      const { result } = renderHook(() =>
        useFilteredSites(mockSites, emptyFilters)
      );

      // Verify final result is from last stage
      expect(result.current.filteredSites).toEqual(stage4Result);
      expect(result.current.count).toBe(1);
    });
  });

  describe('Type and Status Filtering', () => {
    it('filters by type', () => {
      const mosqueOnly = [mockSites[0]];
      vi.mocked(siteFilters.filterSitesByTypeAndStatus).mockReturnValue(mosqueOnly);
      vi.mocked(siteFilters.filterSitesBySearch).mockReturnValue(mosqueOnly);

      const filters: FilterState = {
        ...emptyFilters,
        selectedTypes: ['mosque'],
      };

      const { result } = renderHook(() =>
        useFilteredSites(mockSites, filters)
      );

      expect(siteFilters.filterSitesByTypeAndStatus).toHaveBeenCalledWith(
        mockSites,
        ['mosque'],
        []
      );
      expect(result.current.count).toBe(1);
    });

    it('filters by status', () => {
      const destroyedOnly = [mockSites[0], mockSites[2]];
      vi.mocked(siteFilters.filterSitesByTypeAndStatus).mockReturnValue(destroyedOnly);
      vi.mocked(siteFilters.filterSitesBySearch).mockReturnValue(destroyedOnly);

      const filters: FilterState = {
        ...emptyFilters,
        selectedStatuses: ['destroyed'],
      };

      const { result } = renderHook(() =>
        useFilteredSites(mockSites, filters)
      );

      expect(siteFilters.filterSitesByTypeAndStatus).toHaveBeenCalledWith(
        mockSites,
        [],
        ['destroyed']
      );
      expect(result.current.count).toBe(2);
    });

    it('filters by both type and status', () => {
      const mosqueDestroyed = [mockSites[0]];
      vi.mocked(siteFilters.filterSitesByTypeAndStatus).mockReturnValue(mosqueDestroyed);
      vi.mocked(siteFilters.filterSitesBySearch).mockReturnValue(mosqueDestroyed);

      const filters: FilterState = {
        ...emptyFilters,
        selectedTypes: ['mosque'],
        selectedStatuses: ['destroyed'],
      };

      const { result } = renderHook(() =>
        useFilteredSites(mockSites, filters)
      );

      expect(result.current.count).toBe(1);
    });
  });

  describe('Date Range Filtering', () => {
    it('filters by destruction date range', () => {
      const filteredByDate = [mockSites[0]];
      vi.mocked(siteFilters.filterSitesByDestructionDate).mockReturnValue(filteredByDate);
      vi.mocked(siteFilters.filterSitesBySearch).mockReturnValue(filteredByDate);

      const filters: FilterState = {
        ...emptyFilters,
        destructionDateStart: '2023-01-01',
        destructionDateEnd: '2023-12-31',
      };

      const { result } = renderHook(() =>
        useFilteredSites(mockSites, filters)
      );

      expect(siteFilters.filterSitesByDestructionDate).toHaveBeenCalled();
      expect(result.current.count).toBe(1);
    });

    it('filters by creation year range', () => {
      const filteredByYear = [mockSites[1]];
      vi.mocked(siteFilters.filterSitesByCreationYear).mockReturnValue(filteredByYear);
      vi.mocked(siteFilters.filterSitesBySearch).mockReturnValue(filteredByYear);

      const filters: FilterState = {
        ...emptyFilters,
        creationYearStart: '1000',
        creationYearEnd: '1500',
      };

      const { result } = renderHook(() =>
        useFilteredSites(mockSites, filters)
      );

      expect(siteFilters.filterSitesByCreationYear).toHaveBeenCalled();
      expect(result.current.count).toBe(1);
    });
  });

  describe('Search Filtering', () => {
    it('filters by search term', () => {
      const searchResults = [mockSites[0]];
      vi.mocked(siteFilters.filterSitesBySearch).mockReturnValue(searchResults);

      const filters: FilterState = {
        ...emptyFilters,
        searchTerm: 'mosque',
      };

      const { result } = renderHook(() =>
        useFilteredSites(mockSites, filters)
      );

      expect(siteFilters.filterSitesBySearch).toHaveBeenCalledWith(
        expect.anything(),
        'mosque'
      );
      expect(result.current.count).toBe(1);
    });

    it('handles empty search term', () => {
      const { result } = renderHook(() =>
        useFilteredSites(mockSites, emptyFilters)
      );

      expect(siteFilters.filterSitesBySearch).toHaveBeenCalledWith(
        expect.anything(),
        ''
      );
      expect(result.current.filteredSites).toEqual(mockSites);
    });
  });

  describe('Memoization', () => {
    it('memoizes results when filters unchanged', () => {
      const { result, rerender } = renderHook(
        ({ sites, filters }) => useFilteredSites(sites, filters),
        {
          initialProps: {
            sites: mockSites,
            filters: emptyFilters,
          },
        }
      );

      const firstResult = result.current.filteredSites;

      // Clear mock calls
      vi.clearAllMocks();

      // Rerender with same props
      rerender({ sites: mockSites, filters: emptyFilters });

      const secondResult = result.current.filteredSites;

      // Should return same reference (memoized)
      expect(firstResult).toBe(secondResult);
      // Filter functions should not be called again
      expect(siteFilters.filterSitesByTypeAndStatus).not.toHaveBeenCalled();
    });

    it('recalculates when filters change', () => {
      const { rerender } = renderHook(
        ({ sites, filters }) => useFilteredSites(sites, filters),
        {
          initialProps: {
            sites: mockSites,
            filters: emptyFilters,
          },
        }
      );

      // Clear mock calls
      vi.clearAllMocks();

      // Rerender with different filters
      const newFilters: FilterState = {
        ...emptyFilters,
        selectedTypes: ['mosque'],
      };
      rerender({ sites: mockSites, filters: newFilters });

      // Filter functions should be called again
      expect(siteFilters.filterSitesByTypeAndStatus).toHaveBeenCalled();
    });

    it('recalculates when sites array changes', () => {
      const { rerender } = renderHook(
        ({ sites, filters }) => useFilteredSites(sites, filters),
        {
          initialProps: {
            sites: mockSites,
            filters: emptyFilters,
          },
        }
      );

      // Clear mock calls
      vi.clearAllMocks();

      // Rerender with different sites
      const newSites = [...mockSites, createMockSite({ id: 'site-4' })];
      rerender({ sites: newSites, filters: emptyFilters });

      // Filter functions should be called with new sites
      expect(siteFilters.filterSitesByTypeAndStatus).toHaveBeenCalledWith(
        newSites,
        [],
        []
      );
    });
  });

  describe('Edge Cases', () => {
    it('handles null filter values', () => {
      const filters: FilterState = {
        selectedTypes: [],
        selectedStatuses: [],
        destructionDateStart: null,
        destructionDateEnd: null,
        creationYearStart: null,
        creationYearEnd: null,
        searchTerm: '',
      };

      const { result } = renderHook(() =>
        useFilteredSites(mockSites, filters)
      );

      expect(result.current.filteredSites).toBeDefined();
      expect(result.current.count).toBe(3);
    });

    it('handles all filters returning empty results', () => {
      vi.mocked(siteFilters.filterSitesBySearch).mockReturnValue([]);

      const { result } = renderHook(() =>
        useFilteredSites(mockSites, emptyFilters)
      );

      expect(result.current.filteredSites).toEqual([]);
      expect(result.current.count).toBe(0);
      expect(result.current.total).toBe(3);
    });

    it('maintains total count regardless of filters', () => {
      vi.mocked(siteFilters.filterSitesBySearch).mockReturnValue([mockSites[0]]);

      const { result } = renderHook(() =>
        useFilteredSites(mockSites, emptyFilters)
      );

      expect(result.current.count).toBe(1); // Filtered count
      expect(result.current.total).toBe(3); // Original total
    });
  });

  describe('Performance', () => {
    it('handles large site arrays efficiently', () => {
      const largeSiteArray = Array.from({ length: 1000 }, (_, i) =>
        createMockSite({ id: `site-${i}` })
      );

      const startTime = performance.now();
      renderHook(() => useFilteredSites(largeSiteArray, emptyFilters));
      const endTime = performance.now();

      // Should complete in reasonable time (< 100ms for mocked filters)
      expect(endTime - startTime).toBeLessThan(100);
    });
  });
});
