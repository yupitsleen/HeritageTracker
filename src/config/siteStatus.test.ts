import { describe, it, expect } from 'vitest';
import {
  getStatuses,
  getStatusConfig,
  getStatusLabel,
} from './siteStatus';

describe('siteStatus', () => {
  describe('getStatuses', () => {
    it('returns statuses sorted by severity (highest first)', () => {
      const statuses = getStatuses();
      expect(statuses.length).toBeGreaterThan(0);
      
      for (let i = 1; i < statuses.length; i++) {
        expect(statuses[i - 1].severity).toBeGreaterThanOrEqual(statuses[i].severity);
      }
    });
  });

  describe('getStatusConfig', () => {
    it('returns default config for unregistered status', () => {
      const unknown = getStatusConfig('not-a-real-status');
      expect(unknown.id).toBe('not-a-real-status');
      expect(unknown.label).toBe('not-a-real-status');
      expect(unknown.severity).toBe(0);
      expect(unknown.markerColor).toBe('grey');
    });
  });

  describe('getStatusLabel', () => {
    it('returns English labels by default', () => {
      expect(getStatusLabel('destroyed')).toBe('Destroyed');
    });

    it('returns Arabic labels when locale is "ar"', () => {
      expect(getStatusLabel('destroyed', 'ar')).toBe('مدمر');
    });
  });
});
