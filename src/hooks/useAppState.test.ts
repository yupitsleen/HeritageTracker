/**
 * Tests for useAppState Hook
 *
 * Focus: Centralized state management, modal state, filter state composition
 * Priority: P0 - Critical hook used across entire application
 */

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAppState } from './useAppState';
import type { Site } from '../types';

describe('useAppState', () => {
  describe('Smoke Tests', () => {
    it('initializes with default state', () => {
      const { result } = renderHook(() => useAppState());

      // Filter state
      expect(result.current.filters.selectedTypes).toEqual([]);
      expect(result.current.filters.selectedStatuses).toEqual([]);
      expect(result.current.filters.destructionDateStart).toBeNull();
      expect(result.current.filters.destructionDateEnd).toBeNull();
      expect(result.current.filters.creationYearStart).toBeNull();
      expect(result.current.filters.creationYearEnd).toBeNull();
      expect(result.current.filters.searchTerm).toBe('');

      // Modal state
      expect(result.current.modals.isTableExpanded).toBe(false);
      expect(result.current.modals.isAboutOpen).toBe(false);
      expect(result.current.modals.isStatsOpen).toBe(false);
      expect(result.current.modals.isFilterOpen).toBe(false);
      expect(result.current.modals.isDonateOpen).toBe(false);
      expect(result.current.modals.isHelpOpen).toBe(false);

      // Site selection state
      expect(result.current.selectedSite).toBeNull();
      expect(result.current.highlightedSiteId).toBeNull();
    });

    it('returns all expected properties', () => {
      const { result } = renderHook(() => useAppState());

      // Filter properties
      expect(result.current).toHaveProperty('filters');
      expect(result.current).toHaveProperty('setSelectedTypes');
      expect(result.current).toHaveProperty('setSelectedStatuses');
      expect(result.current).toHaveProperty('setDestructionDateStart');
      expect(result.current).toHaveProperty('setDestructionDateEnd');
      expect(result.current).toHaveProperty('setCreationYearStart');
      expect(result.current).toHaveProperty('setCreationYearEnd');
      expect(result.current).toHaveProperty('setSearchTerm');
      expect(result.current).toHaveProperty('hasActiveFilters');
      expect(result.current).toHaveProperty('clearAllFilters');

      // Temp filter properties
      expect(result.current).toHaveProperty('tempFilters');
      expect(result.current).toHaveProperty('openFilterModal');
      expect(result.current).toHaveProperty('applyFilters');
      expect(result.current).toHaveProperty('clearTempFilters');

      // Modal properties
      expect(result.current).toHaveProperty('modals');
      expect(result.current).toHaveProperty('setIsTableExpanded');
      expect(result.current).toHaveProperty('setIsAboutOpen');
      expect(result.current).toHaveProperty('setIsStatsOpen');
      expect(result.current).toHaveProperty('setIsFilterOpen');
      expect(result.current).toHaveProperty('setIsDonateOpen');
      expect(result.current).toHaveProperty('setIsHelpOpen');

      // Site selection properties
      expect(result.current).toHaveProperty('selectedSite');
      expect(result.current).toHaveProperty('setSelectedSite');
      expect(result.current).toHaveProperty('highlightedSiteId');
      expect(result.current).toHaveProperty('setHighlightedSiteId');
    });
  });

  describe('Modal State Management', () => {
    it('opens and closes table expanded modal', () => {
      const { result } = renderHook(() => useAppState());

      expect(result.current.modals.isTableExpanded).toBe(false);

      act(() => {
        result.current.setIsTableExpanded(true);
      });

      expect(result.current.modals.isTableExpanded).toBe(true);

      act(() => {
        result.current.setIsTableExpanded(false);
      });

      expect(result.current.modals.isTableExpanded).toBe(false);
    });

    it('opens and closes about modal', () => {
      const { result } = renderHook(() => useAppState());

      act(() => {
        result.current.setIsAboutOpen(true);
      });

      expect(result.current.modals.isAboutOpen).toBe(true);

      act(() => {
        result.current.setIsAboutOpen(false);
      });

      expect(result.current.modals.isAboutOpen).toBe(false);
    });

    it('opens and closes stats modal', () => {
      const { result } = renderHook(() => useAppState());

      act(() => {
        result.current.setIsStatsOpen(true);
      });

      expect(result.current.modals.isStatsOpen).toBe(true);
    });

    it('opens and closes filter modal', () => {
      const { result } = renderHook(() => useAppState());

      act(() => {
        result.current.setIsFilterOpen(true);
      });

      expect(result.current.modals.isFilterOpen).toBe(true);
    });

    it('opens and closes donate modal', () => {
      const { result } = renderHook(() => useAppState());

      act(() => {
        result.current.setIsDonateOpen(true);
      });

      expect(result.current.modals.isDonateOpen).toBe(true);
    });

    it('opens and closes help modal', () => {
      const { result } = renderHook(() => useAppState());

      act(() => {
        result.current.setIsHelpOpen(true);
      });

      expect(result.current.modals.isHelpOpen).toBe(true);
    });

    it('supports multiple modals open simultaneously', () => {
      const { result } = renderHook(() => useAppState());

      act(() => {
        result.current.setIsAboutOpen(true);
        result.current.setIsStatsOpen(true);
      });

      expect(result.current.modals.isAboutOpen).toBe(true);
      expect(result.current.modals.isStatsOpen).toBe(true);
      expect(result.current.modals.isFilterOpen).toBe(false);
    });
  });

  describe('Filter State Management', () => {
    it('updates selected types', () => {
      const { result } = renderHook(() => useAppState());

      act(() => {
        result.current.setSelectedTypes(['mosque', 'church']);
      });

      expect(result.current.filters.selectedTypes).toEqual(['mosque', 'church']);
      expect(result.current.hasActiveFilters).toBe(true);
    });

    it('updates selected statuses', () => {
      const { result } = renderHook(() => useAppState());

      act(() => {
        result.current.setSelectedStatuses(['destroyed', 'damaged']);
      });

      expect(result.current.filters.selectedStatuses).toEqual(['destroyed', 'damaged']);
      expect(result.current.hasActiveFilters).toBe(true);
    });

    it('updates destruction date range', () => {
      const { result } = renderHook(() => useAppState());
      const startDate = new Date('2023-01-01');
      const endDate = new Date('2023-12-31');

      act(() => {
        result.current.setDestructionDateStart(startDate);
        result.current.setDestructionDateEnd(endDate);
      });

      expect(result.current.filters.destructionDateStart).toEqual(startDate);
      expect(result.current.filters.destructionDateEnd).toEqual(endDate);
      expect(result.current.hasActiveFilters).toBe(true);
    });

    it('updates creation year range', () => {
      const { result } = renderHook(() => useAppState());

      act(() => {
        result.current.setCreationYearStart(1000);
        result.current.setCreationYearEnd(2000);
      });

      expect(result.current.filters.creationYearStart).toBe(1000);
      expect(result.current.filters.creationYearEnd).toBe(2000);
      expect(result.current.hasActiveFilters).toBe(true);
    });

    it('updates search term', () => {
      const { result } = renderHook(() => useAppState());

      act(() => {
        result.current.setSearchTerm('mosque');
      });

      expect(result.current.filters.searchTerm).toBe('mosque');
      expect(result.current.hasActiveFilters).toBe(true);
    });

    it('clears all filters', () => {
      const { result } = renderHook(() => useAppState());

      // Set multiple filters
      act(() => {
        result.current.setSelectedTypes(['mosque']);
        result.current.setSelectedStatuses(['destroyed']);
        result.current.setSearchTerm('test');
      });

      expect(result.current.hasActiveFilters).toBe(true);

      // Clear all
      act(() => {
        result.current.clearAllFilters();
      });

      expect(result.current.filters.selectedTypes).toEqual([]);
      expect(result.current.filters.selectedStatuses).toEqual([]);
      expect(result.current.filters.searchTerm).toBe('');
      expect(result.current.hasActiveFilters).toBe(false);
    });
  });

  describe('Temporary Filter State (Modal Flow)', () => {
    it('opens filter modal and initializes temp filters', () => {
      const { result } = renderHook(() => useAppState());

      // Set some active filters
      act(() => {
        result.current.setSelectedTypes(['mosque']);
        result.current.setSelectedStatuses(['destroyed']);
      });

      // Open modal
      act(() => {
        result.current.openFilterModal();
      });

      // Modal should be open and temp filters initialized
      expect(result.current.modals.isFilterOpen).toBe(true);
      expect(result.current.tempFilters.selectedTypes).toEqual(['mosque']);
      expect(result.current.tempFilters.selectedStatuses).toEqual(['destroyed']);
    });

    it('updates temp filters without affecting active filters', () => {
      const { result } = renderHook(() => useAppState());

      // Set active filters
      act(() => {
        result.current.setSelectedTypes(['mosque']);
      });

      // Open modal and update temp filters
      act(() => {
        result.current.openFilterModal();
        result.current.setTempSelectedTypes(['church']);
      });

      // Temp filters changed, active filters unchanged
      expect(result.current.tempFilters.selectedTypes).toEqual(['church']);
      expect(result.current.filters.selectedTypes).toEqual(['mosque']);
    });

    it('applies temp filters when applyFilters called', () => {
      const { result } = renderHook(() => useAppState());

      // Open modal and set temp filters
      act(() => {
        result.current.openFilterModal();
        result.current.setTempSelectedTypes(['church']);
        result.current.setTempSelectedStatuses(['damaged']);
      });

      // Apply filters
      act(() => {
        result.current.applyFilters();
      });

      // Active filters should match temp filters
      expect(result.current.filters.selectedTypes).toEqual(['church']);
      expect(result.current.filters.selectedStatuses).toEqual(['damaged']);
      expect(result.current.modals.isFilterOpen).toBe(false);
    });

    it('clears temp filters', () => {
      const { result } = renderHook(() => useAppState());

      // Set temp filters
      act(() => {
        result.current.openFilterModal();
        result.current.setTempSelectedTypes(['mosque']);
      });

      // Clear temp filters
      act(() => {
        result.current.clearTempFilters();
      });

      expect(result.current.tempFilters.selectedTypes).toEqual([]);
    });

    it('tracks unapplied changes', () => {
      const { result } = renderHook(() => useAppState());

      // Set active filters
      act(() => {
        result.current.setSelectedTypes(['mosque']);
      });

      // Open modal
      act(() => {
        result.current.openFilterModal();
      });

      expect(result.current.hasUnappliedChanges).toBe(false);

      // Modify temp filters
      act(() => {
        result.current.setTempSelectedTypes(['church']);
      });

      expect(result.current.hasUnappliedChanges).toBe(true);
    });
  });

  describe('Site Selection Management', () => {
    const mockSite: Site = {
      id: 'test-site',
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
    };

    it('selects a site', () => {
      const { result } = renderHook(() => useAppState());

      expect(result.current.selectedSite).toBeNull();

      act(() => {
        result.current.setSelectedSite(mockSite);
      });

      expect(result.current.selectedSite).toEqual(mockSite);
    });

    it('clears selected site', () => {
      const { result } = renderHook(() => useAppState());

      act(() => {
        result.current.setSelectedSite(mockSite);
      });

      expect(result.current.selectedSite).toEqual(mockSite);

      act(() => {
        result.current.setSelectedSite(null);
      });

      expect(result.current.selectedSite).toBeNull();
    });

    it('highlights a site by ID', () => {
      const { result } = renderHook(() => useAppState());

      act(() => {
        result.current.setHighlightedSiteId('test-site-id');
      });

      expect(result.current.highlightedSiteId).toBe('test-site-id');
    });

    it('clears highlighted site', () => {
      const { result } = renderHook(() => useAppState());

      act(() => {
        result.current.setHighlightedSiteId('test-site-id');
      });

      act(() => {
        result.current.setHighlightedSiteId(null);
      });

      expect(result.current.highlightedSiteId).toBeNull();
    });
  });

  describe('Integration Tests', () => {
    it('manages complex state transitions', () => {
      const { result } = renderHook(() => useAppState());
      const mockSite: Site = {
        id: 'test-site',
        name: 'Test Site',
        type: 'mosque',
        yearBuilt: '1200',
        coordinates: [31.5, 34.5],
        status: 'destroyed',
        lastUpdated: '2024-01-01',
        description: 'Test',
        historicalSignificance: 'Test',
        culturalValue: 'Test',
        verifiedBy: ['UNESCO'],
        sources: [],
      };

      // Step 1: Select site and set filters
      act(() => {
        result.current.setSelectedSite(mockSite);
        result.current.setSelectedTypes(['mosque']);
      });

      // Step 2: Open filter modal and modify temp filters
      act(() => {
        result.current.openFilterModal();
      });

      act(() => {
        result.current.setTempSelectedStatuses(['destroyed']);
      });

      // Step 3: Apply filters and open stats modal
      act(() => {
        result.current.applyFilters();
        result.current.setIsStatsOpen(true);
      });

      // Verify final state
      expect(result.current.selectedSite).toEqual(mockSite);
      expect(result.current.filters.selectedTypes).toEqual(['mosque']);
      expect(result.current.filters.selectedStatuses).toEqual(['destroyed']);
      expect(result.current.modals.isFilterOpen).toBe(false);
      expect(result.current.modals.isStatsOpen).toBe(true);
    });

    it('maintains state independence between concerns', () => {
      const { result } = renderHook(() => useAppState());

      act(() => {
        // Update filter state
        result.current.setSelectedTypes(['mosque']);

        // Update modal state
        result.current.setIsAboutOpen(true);

        // Update site selection
        result.current.setHighlightedSiteId('site-123');
      });

      // All states should be independent
      expect(result.current.filters.selectedTypes).toEqual(['mosque']);
      expect(result.current.modals.isAboutOpen).toBe(true);
      expect(result.current.highlightedSiteId).toBe('site-123');

      // Clearing filters shouldn't affect other state
      act(() => {
        result.current.clearAllFilters();
      });

      expect(result.current.filters.selectedTypes).toEqual([]);
      expect(result.current.modals.isAboutOpen).toBe(true); // Still true
      expect(result.current.highlightedSiteId).toBe('site-123'); // Still set
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid state changes', () => {
      const { result } = renderHook(() => useAppState());

      act(() => {
        result.current.setIsAboutOpen(true);
        result.current.setIsAboutOpen(false);
        result.current.setIsAboutOpen(true);
      });

      expect(result.current.modals.isAboutOpen).toBe(true);
    });

    it('handles empty arrays in filters', () => {
      const { result } = renderHook(() => useAppState());

      act(() => {
        result.current.setSelectedTypes([]);
        result.current.setSelectedStatuses([]);
      });

      expect(result.current.filters.selectedTypes).toEqual([]);
      expect(result.current.filters.selectedStatuses).toEqual([]);
      expect(result.current.hasActiveFilters).toBe(false);
    });

    it('handles null values in date filters', () => {
      const { result } = renderHook(() => useAppState());

      act(() => {
        result.current.setDestructionDateStart(null);
        result.current.setDestructionDateEnd(null);
        result.current.setCreationYearStart(null);
        result.current.setCreationYearEnd(null);
      });

      expect(result.current.filters.destructionDateStart).toBeNull();
      expect(result.current.filters.destructionDateEnd).toBeNull();
      expect(result.current.filters.creationYearStart).toBeNull();
      expect(result.current.filters.creationYearEnd).toBeNull();
    });

    it('handles empty search term', () => {
      const { result } = renderHook(() => useAppState());

      act(() => {
        result.current.setSearchTerm('');
      });

      expect(result.current.filters.searchTerm).toBe('');
      expect(result.current.hasActiveFilters).toBe(false);
    });
  });
});
