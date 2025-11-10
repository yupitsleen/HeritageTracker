/**
 * Tests for useHeritageStats Hook
 *
 * Focus: Statistics calculations, age analysis, site categorization
 * Priority: P0 - Critical hook for dashboard statistics
 */

import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useHeritageStats } from './useHeritageStats';
import type { GazaSite } from '../types';

describe('useHeritageStats', () => {
  // Helper to create mock sites
  const createMockSite = (overrides: Partial<GazaSite> = {}): GazaSite => ({
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
    ...overrides,
  });

  describe('Smoke Tests', () => {
    it('returns statistics object with expected properties', () => {
      const sites = [createMockSite()];
      const { result } = renderHook(() => useHeritageStats(sites));

      expect(result.current).toHaveProperty('total');
      expect(result.current).toHaveProperty('destroyed');
      expect(result.current).toHaveProperty('damaged');
      expect(result.current).toHaveProperty('heavilyDamaged');
      expect(result.current).toHaveProperty('surviving');
      expect(result.current).toHaveProperty('religiousSites');
      expect(result.current).toHaveProperty('religiousDestroyed');
      expect(result.current).toHaveProperty('religiousSurviving');
      expect(result.current).toHaveProperty('oldestSiteAge');
      expect(result.current).toHaveProperty('ancientSites');
      expect(result.current).toHaveProperty('museums');
      expect(result.current).toHaveProperty('museumsDestroyed');
      expect(result.current).toHaveProperty('archaeological');
      expect(result.current).toHaveProperty('archaeologicalSurviving');
    });

    it('handles empty sites array', () => {
      const { result } = renderHook(() => useHeritageStats([]));

      expect(result.current.total).toBe(0);
      expect(result.current.destroyed).toBe(0);
      expect(result.current.damaged).toBe(0);
      expect(result.current.surviving).toBe(0);
      expect(result.current.oldestSiteAge).toBe(0);
    });
  });

  describe('Basic Statistics', () => {
    it('calculates total sites correctly', () => {
      const sites = [
        createMockSite({ id: 'site-1' }),
        createMockSite({ id: 'site-2' }),
        createMockSite({ id: 'site-3' }),
      ];

      const { result } = renderHook(() => useHeritageStats(sites));
      expect(result.current.total).toBe(3);
    });

    it('counts destroyed sites', () => {
      const sites = [
        createMockSite({ id: 'site-1', status: 'destroyed' }),
        createMockSite({ id: 'site-2', status: 'destroyed' }),
        createMockSite({ id: 'site-3', status: 'damaged' }),
      ];

      const { result } = renderHook(() => useHeritageStats(sites));
      expect(result.current.destroyed).toBe(2);
    });

    it('counts damaged sites', () => {
      const sites = [
        createMockSite({ id: 'site-1', status: 'damaged' }),
        createMockSite({ id: 'site-2', status: 'destroyed' }),
        createMockSite({ id: 'site-3', status: 'damaged' }),
      ];

      const { result } = renderHook(() => useHeritageStats(sites));
      expect(result.current.damaged).toBe(2);
    });

    it('counts heavily damaged sites', () => {
      const sites = [
        createMockSite({ id: 'site-1', status: 'heavily-damaged' }),
        createMockSite({ id: 'site-2', status: 'destroyed' }),
        createMockSite({ id: 'site-3', status: 'heavily-damaged' }),
      ];

      const { result } = renderHook(() => useHeritageStats(sites));
      expect(result.current.heavilyDamaged).toBe(2);
    });

    it('calculates surviving sites (damaged + heavily damaged)', () => {
      const sites = [
        createMockSite({ id: 'site-1', status: 'damaged' }),
        createMockSite({ id: 'site-2', status: 'heavily-damaged' }),
        createMockSite({ id: 'site-3', status: 'destroyed' }),
      ];

      const { result } = renderHook(() => useHeritageStats(sites));
      expect(result.current.surviving).toBe(2); // damaged + heavily-damaged
    });
  });

  describe('Religious Sites Statistics', () => {
    it('counts mosques as religious sites', () => {
      const sites = [
        createMockSite({ id: 'site-1', type: 'mosque' }),
        createMockSite({ id: 'site-2', type: 'church' }),
        createMockSite({ id: 'site-3', type: 'archaeological_site' }),
      ];

      const { result } = renderHook(() => useHeritageStats(sites));
      expect(result.current.religiousSites).toBe(2); // mosque + church
    });

    it('counts churches as religious sites', () => {
      const sites = [
        createMockSite({ id: 'site-1', type: 'church' }),
        createMockSite({ id: 'site-2', type: 'mosque' }),
      ];

      const { result } = renderHook(() => useHeritageStats(sites));
      expect(result.current.religiousSites).toBe(2);
    });

    it('counts destroyed religious sites', () => {
      const sites = [
        createMockSite({ id: 'site-1', type: 'mosque', status: 'destroyed' }),
        createMockSite({ id: 'site-2', type: 'church', status: 'destroyed' }),
        createMockSite({ id: 'site-3', type: 'mosque', status: 'damaged' }),
      ];

      const { result } = renderHook(() => useHeritageStats(sites));
      expect(result.current.religiousDestroyed).toBe(2);
    });

    it('counts surviving religious sites', () => {
      const sites = [
        createMockSite({ id: 'site-1', type: 'mosque', status: 'destroyed' }),
        createMockSite({ id: 'site-2', type: 'church', status: 'damaged' }),
        createMockSite({ id: 'site-3', type: 'mosque', status: 'heavily-damaged' }),
      ];

      const { result } = renderHook(() => useHeritageStats(sites));
      expect(result.current.religiousSurviving).toBe(2); // Not destroyed
    });
  });

  describe('Age Analysis', () => {
    it('calculates age from simple year (CE)', () => {
      const sites = [createMockSite({ yearBuilt: '1500' })];

      const { result } = renderHook(() => useHeritageStats(sites));
      // Age = 2024 - 1500 = 524 years
      expect(result.current.oldestSiteAge).toBe(524);
    });

    it('calculates age from BCE date', () => {
      const sites = [createMockSite({ yearBuilt: '500 BCE' })];

      const { result } = renderHook(() => useHeritageStats(sites));
      // BCE dates return the year value directly as age
      expect(result.current.oldestSiteAge).toBe(500);
    });

    it('calculates age from BC date', () => {
      const sites = [createMockSite({ yearBuilt: '800 BC' })];

      const { result } = renderHook(() => useHeritageStats(sites));
      expect(result.current.oldestSiteAge).toBe(800);
    });

    it('calculates age from CE date explicitly', () => {
      const sites = [createMockSite({ yearBuilt: '1200 CE' })];

      const { result } = renderHook(() => useHeritageStats(sites));
      // 2024 - 1200 = 824
      expect(result.current.oldestSiteAge).toBe(824);
    });

    it('finds oldest site among multiple sites', () => {
      const sites = [
        createMockSite({ id: 'site-1', yearBuilt: '1500' }), // 524 years
        createMockSite({ id: 'site-2', yearBuilt: '800' }),  // 1224 years
        createMockSite({ id: 'site-3', yearBuilt: '2000' }), // 24 years
      ];

      const { result } = renderHook(() => useHeritageStats(sites));
      expect(result.current.oldestSiteAge).toBe(1224); // Site from year 800
    });

    it('handles invalid year formats gracefully', () => {
      const sites = [
        createMockSite({ yearBuilt: 'unknown' }),
        createMockSite({ yearBuilt: '' }),
      ];

      const { result } = renderHook(() => useHeritageStats(sites));
      expect(result.current.oldestSiteAge).toBe(0);
    });

    it('counts ancient sites (>= 1000 years old)', () => {
      const sites = [
        createMockSite({ id: 'site-1', yearBuilt: '500' }),   // ~1524 years
        createMockSite({ id: 'site-2', yearBuilt: '1500' }),  // ~524 years
        createMockSite({ id: 'site-3', yearBuilt: '800' }),   // ~1224 years
      ];

      const { result } = renderHook(() => useHeritageStats(sites));
      expect(result.current.ancientSites).toBe(2); // sites from 500 and 800
    });

    it('does not count recent sites as ancient', () => {
      const sites = [
        createMockSite({ id: 'site-1', yearBuilt: '1800' }), // ~224 years
        createMockSite({ id: 'site-2', yearBuilt: '2000' }), // ~24 years
      ];

      const { result } = renderHook(() => useHeritageStats(sites));
      expect(result.current.ancientSites).toBe(0);
    });
  });

  describe('Museum Statistics', () => {
    it('counts total museums', () => {
      const sites = [
        createMockSite({ id: 'site-1', type: 'museum' }),
        createMockSite({ id: 'site-2', type: 'museum' }),
        createMockSite({ id: 'site-3', type: 'mosque' }),
      ];

      const { result } = renderHook(() => useHeritageStats(sites));
      expect(result.current.museums).toBe(2);
    });

    it('counts destroyed museums', () => {
      const sites = [
        createMockSite({ id: 'site-1', type: 'museum', status: 'destroyed' }),
        createMockSite({ id: 'site-2', type: 'museum', status: 'damaged' }),
        createMockSite({ id: 'site-3', type: 'museum', status: 'destroyed' }),
      ];

      const { result } = renderHook(() => useHeritageStats(sites));
      expect(result.current.museumsDestroyed).toBe(2);
    });

    it('handles case with no museums', () => {
      const sites = [
        createMockSite({ id: 'site-1', type: 'mosque' }),
        createMockSite({ id: 'site-2', type: 'church' }),
      ];

      const { result } = renderHook(() => useHeritageStats(sites));
      expect(result.current.museums).toBe(0);
      expect(result.current.museumsDestroyed).toBe(0);
    });
  });

  describe('Archaeological Site Statistics', () => {
    it('counts total archaeological sites', () => {
      const sites = [
        createMockSite({ id: 'site-1', type: 'archaeological' }),
        createMockSite({ id: 'site-2', type: 'archaeological' }),
        createMockSite({ id: 'site-3', type: 'mosque' }),
      ];

      const { result } = renderHook(() => useHeritageStats(sites));
      expect(result.current.archaeological).toBe(2);
    });

    it('counts surviving archaeological sites', () => {
      const sites = [
        createMockSite({ id: 'site-1', type: 'archaeological', status: 'destroyed' }),
        createMockSite({ id: 'site-2', type: 'archaeological', status: 'damaged' }),
        createMockSite({ id: 'site-3', type: 'archaeological', status: 'heavily-damaged' }),
      ];

      const { result } = renderHook(() => useHeritageStats(sites));
      expect(result.current.archaeologicalSurviving).toBe(2); // damaged + heavily-damaged
    });
  });

  describe('Complex Scenarios', () => {
    it('calculates all statistics correctly for mixed data', () => {
      const sites = [
        createMockSite({ id: 'site-1', type: 'mosque', status: 'destroyed', yearBuilt: '800' }),
        createMockSite({ id: 'site-2', type: 'church', status: 'damaged', yearBuilt: '1200' }),
        createMockSite({ id: 'site-3', type: 'museum', status: 'destroyed', yearBuilt: '1900' }),
        createMockSite({ id: 'site-4', type: 'archaeological', status: 'heavily-damaged', yearBuilt: '500 BCE' }),
      ];

      const { result } = renderHook(() => useHeritageStats(sites));

      expect(result.current.total).toBe(4);
      expect(result.current.destroyed).toBe(2);
      expect(result.current.damaged).toBe(1);
      expect(result.current.heavilyDamaged).toBe(1);
      expect(result.current.surviving).toBe(2);
      expect(result.current.religiousSites).toBe(2); // mosque + church
      expect(result.current.religiousDestroyed).toBe(1); // mosque
      expect(result.current.religiousSurviving).toBe(1); // church
      expect(result.current.museums).toBe(1);
      expect(result.current.museumsDestroyed).toBe(1);
      expect(result.current.archaeological).toBe(1);
      expect(result.current.archaeologicalSurviving).toBe(1);
      expect(result.current.ancientSites).toBe(1); // only site from 800 CE (1224 years old)
      expect(result.current.oldestSiteAge).toBeGreaterThan(500); // BCE site
    });
  });

  describe('Memoization', () => {
    it('memoizes results when sites array unchanged', () => {
      const sites = [createMockSite()];
      const { result, rerender } = renderHook(
        ({ sites }) => useHeritageStats(sites),
        { initialProps: { sites } }
      );

      const firstResult = result.current;

      // Rerender with same reference
      rerender({ sites });

      const secondResult = result.current;

      // Should return same reference (memoized)
      expect(firstResult).toBe(secondResult);
    });

    it('recalculates when sites array changes', () => {
      const initialSites = [createMockSite({ id: 'site-1' })];
      const { result, rerender } = renderHook(
        ({ sites }) => useHeritageStats(sites),
        { initialProps: { sites: initialSites } }
      );

      expect(result.current.total).toBe(1);

      // Rerender with different sites
      const newSites = [
        createMockSite({ id: 'site-1' }),
        createMockSite({ id: 'site-2' }),
      ];
      rerender({ sites: newSites });

      expect(result.current.total).toBe(2);
    });
  });

  describe('Edge Cases', () => {
    it('handles sites with missing yearBuilt', () => {
      const sites = [
        createMockSite({ yearBuilt: '' }),
        createMockSite({ yearBuilt: '1500' }),
      ];

      const { result } = renderHook(() => useHeritageStats(sites));
      expect(result.current.oldestSiteAge).toBe(524); // Only counts valid year
    });

    it('handles all sites with invalid yearBuilt', () => {
      const sites = [
        createMockSite({ yearBuilt: 'unknown' }),
        createMockSite({ yearBuilt: '' }),
      ];

      const { result } = renderHook(() => useHeritageStats(sites));
      expect(result.current.oldestSiteAge).toBe(0);
      expect(result.current.ancientSites).toBe(0);
    });

    it('handles single site', () => {
      const sites = [createMockSite({ type: 'mosque', status: 'destroyed' })];

      const { result } = renderHook(() => useHeritageStats(sites));
      expect(result.current.total).toBe(1);
      expect(result.current.destroyed).toBe(1);
      expect(result.current.religiousSites).toBe(1);
    });

    it('handles all sites destroyed', () => {
      const sites = [
        createMockSite({ id: 'site-1', status: 'destroyed' }),
        createMockSite({ id: 'site-2', status: 'destroyed' }),
      ];

      const { result } = renderHook(() => useHeritageStats(sites));
      expect(result.current.destroyed).toBe(2);
      expect(result.current.surviving).toBe(0);
    });

    it('handles all sites surviving', () => {
      const sites = [
        createMockSite({ id: 'site-1', status: 'damaged' }),
        createMockSite({ id: 'site-2', status: 'heavily-damaged' }),
      ];

      const { result } = renderHook(() => useHeritageStats(sites));
      expect(result.current.destroyed).toBe(0);
      expect(result.current.surviving).toBe(2);
    });

    it('handles very old BCE dates', () => {
      const sites = [createMockSite({ yearBuilt: '3000 BCE' })];

      const { result } = renderHook(() => useHeritageStats(sites));
      expect(result.current.oldestSiteAge).toBe(3000);
      expect(result.current.ancientSites).toBe(1);
    });
  });
});
