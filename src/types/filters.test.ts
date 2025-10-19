import { describe, it, expect } from 'vitest';
import {
  type FilterState,
  createEmptyFilterState,
  isFilterStateEmpty,
  areFiltersEqual,
} from './filters';

describe('Filter Utilities', () => {
  describe('createEmptyFilterState', () => {
    it('creates an empty filter state', () => {
      const empty = createEmptyFilterState();

      expect(empty.selectedTypes).toEqual([]);
      expect(empty.selectedStatuses).toEqual([]);
      expect(empty.destructionDateStart).toBeNull();
      expect(empty.destructionDateEnd).toBeNull();
      expect(empty.creationYearStart).toBeNull();
      expect(empty.creationYearEnd).toBeNull();
      expect(empty.searchTerm).toBe('');
    });
  });

  describe('isFilterStateEmpty', () => {
    it('returns true for empty filter state', () => {
      const empty = createEmptyFilterState();
      expect(isFilterStateEmpty(empty)).toBe(true);
    });

    it('returns false when types are selected', () => {
      const state: FilterState = {
        ...createEmptyFilterState(),
        selectedTypes: ['mosque'],
      };
      expect(isFilterStateEmpty(state)).toBe(false);
    });

    it('returns false when statuses are selected', () => {
      const state: FilterState = {
        ...createEmptyFilterState(),
        selectedStatuses: ['destroyed'],
      };
      expect(isFilterStateEmpty(state)).toBe(false);
    });

    it('returns false when destruction date start is set', () => {
      const state: FilterState = {
        ...createEmptyFilterState(),
        destructionDateStart: new Date('2023-01-01'),
      };
      expect(isFilterStateEmpty(state)).toBe(false);
    });

    it('returns false when destruction date end is set', () => {
      const state: FilterState = {
        ...createEmptyFilterState(),
        destructionDateEnd: new Date('2024-01-01'),
      };
      expect(isFilterStateEmpty(state)).toBe(false);
    });

    it('returns false when creation year start is set', () => {
      const state: FilterState = {
        ...createEmptyFilterState(),
        creationYearStart: 1900,
      };
      expect(isFilterStateEmpty(state)).toBe(false);
    });

    it('returns false when creation year end is set', () => {
      const state: FilterState = {
        ...createEmptyFilterState(),
        creationYearEnd: 2000,
      };
      expect(isFilterStateEmpty(state)).toBe(false);
    });

    it('returns false when search term is set (non-whitespace)', () => {
      const state: FilterState = {
        ...createEmptyFilterState(),
        searchTerm: 'mosque',
      };
      expect(isFilterStateEmpty(state)).toBe(false);
    });

    it('returns true when search term is only whitespace', () => {
      const state: FilterState = {
        ...createEmptyFilterState(),
        searchTerm: '   ',
      };
      expect(isFilterStateEmpty(state)).toBe(true);
    });
  });

  describe('areFiltersEqual', () => {
    it('returns true for two empty states', () => {
      const a = createEmptyFilterState();
      const b = createEmptyFilterState();
      expect(areFiltersEqual(a, b)).toBe(true);
    });

    it('returns true when filter states are identical', () => {
      const a: FilterState = {
        selectedTypes: ['mosque', 'church'],
        selectedStatuses: ['destroyed'],
        destructionDateStart: new Date('2023-01-01'),
        destructionDateEnd: new Date('2024-01-01'),
        creationYearStart: 1900,
        creationYearEnd: 2000,
        searchTerm: 'test',
      };
      const b: FilterState = { ...a };
      expect(areFiltersEqual(a, b)).toBe(true);
    });

    it('returns true when types are in different order', () => {
      const a: FilterState = {
        ...createEmptyFilterState(),
        selectedTypes: ['mosque', 'church'],
      };
      const b: FilterState = {
        ...createEmptyFilterState(),
        selectedTypes: ['church', 'mosque'],
      };
      expect(areFiltersEqual(a, b)).toBe(true);
    });

    it('returns true when statuses are in different order', () => {
      const a: FilterState = {
        ...createEmptyFilterState(),
        selectedStatuses: ['destroyed', 'damaged'],
      };
      const b: FilterState = {
        ...createEmptyFilterState(),
        selectedStatuses: ['damaged', 'destroyed'],
      };
      expect(areFiltersEqual(a, b)).toBe(true);
    });

    it('returns false when types differ', () => {
      const a: FilterState = {
        ...createEmptyFilterState(),
        selectedTypes: ['mosque'],
      };
      const b: FilterState = {
        ...createEmptyFilterState(),
        selectedTypes: ['church'],
      };
      expect(areFiltersEqual(a, b)).toBe(false);
    });

    it('returns false when statuses differ', () => {
      const a: FilterState = {
        ...createEmptyFilterState(),
        selectedStatuses: ['destroyed'],
      };
      const b: FilterState = {
        ...createEmptyFilterState(),
        selectedStatuses: ['damaged'],
      };
      expect(areFiltersEqual(a, b)).toBe(false);
    });

    it('returns false when destruction start dates differ', () => {
      const a: FilterState = {
        ...createEmptyFilterState(),
        destructionDateStart: new Date('2023-01-01'),
      };
      const b: FilterState = {
        ...createEmptyFilterState(),
        destructionDateStart: new Date('2023-02-01'),
      };
      expect(areFiltersEqual(a, b)).toBe(false);
    });

    it('returns false when destruction end dates differ', () => {
      const a: FilterState = {
        ...createEmptyFilterState(),
        destructionDateEnd: new Date('2024-01-01'),
      };
      const b: FilterState = {
        ...createEmptyFilterState(),
        destructionDateEnd: new Date('2024-02-01'),
      };
      expect(areFiltersEqual(a, b)).toBe(false);
    });

    it('returns false when creation year start differs', () => {
      const a: FilterState = {
        ...createEmptyFilterState(),
        creationYearStart: 1900,
      };
      const b: FilterState = {
        ...createEmptyFilterState(),
        creationYearStart: 1950,
      };
      expect(areFiltersEqual(a, b)).toBe(false);
    });

    it('returns false when creation year end differs', () => {
      const a: FilterState = {
        ...createEmptyFilterState(),
        creationYearEnd: 2000,
      };
      const b: FilterState = {
        ...createEmptyFilterState(),
        creationYearEnd: 2010,
      };
      expect(areFiltersEqual(a, b)).toBe(false);
    });

    it('returns false when search terms differ', () => {
      const a: FilterState = {
        ...createEmptyFilterState(),
        searchTerm: 'mosque',
      };
      const b: FilterState = {
        ...createEmptyFilterState(),
        searchTerm: 'church',
      };
      expect(areFiltersEqual(a, b)).toBe(false);
    });

    it('handles null dates correctly', () => {
      const a: FilterState = {
        ...createEmptyFilterState(),
        destructionDateStart: null,
      };
      const b: FilterState = {
        ...createEmptyFilterState(),
        destructionDateStart: new Date('2023-01-01'),
      };
      expect(areFiltersEqual(a, b)).toBe(false);
    });
  });
});
