import { describe, it, expect } from 'vitest';
import {
  STATUS_REGISTRY,
  getStatuses,
  getStatusConfig,
  getStatusLabel,
  getMarkerColor,
} from './siteStatus';

describe('siteStatus', () => {
  describe('STATUS_REGISTRY', () => {
    it('contains default statuses', () => {
      expect(STATUS_REGISTRY).toHaveProperty('destroyed');
      expect(STATUS_REGISTRY).toHaveProperty('heavily-damaged');
      expect(STATUS_REGISTRY).toHaveProperty('damaged');
    });

    it('default statuses have required fields', () => {
      const destroyed = STATUS_REGISTRY['destroyed'];
      expect(destroyed).toHaveProperty('id', 'destroyed');
      expect(destroyed).toHaveProperty('label');
      expect(destroyed).toHaveProperty('labelArabic');
      expect(destroyed).toHaveProperty('severity');
      expect(destroyed).toHaveProperty('markerColor');
    });

    it('default statuses have correct severity ordering', () => {
      expect(STATUS_REGISTRY['destroyed'].severity).toBe(100);
      expect(STATUS_REGISTRY['heavily-damaged'].severity).toBe(75);
      expect(STATUS_REGISTRY['damaged'].severity).toBe(50);
    });
  });

  describe('getStatuses', () => {
    it('returns array of all statuses', () => {
      const statuses = getStatuses();
      expect(Array.isArray(statuses)).toBe(true);
      expect(statuses.length).toBeGreaterThanOrEqual(3);
    });

    it('returns statuses sorted by severity (highest first)', () => {
      const statuses = getStatuses();
      for (let i = 1; i < statuses.length; i++) {
        expect(statuses[i - 1].severity).toBeGreaterThanOrEqual(statuses[i].severity);
      }
    });
  });

  describe('getStatusConfig', () => {
    it('returns correct config for registered statuses', () => {
      const destroyed = getStatusConfig('destroyed');
      expect(destroyed.id).toBe('destroyed');
      expect(destroyed.label).toBe('Destroyed');
      expect(destroyed.severity).toBe(100);
    });

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
      expect(getStatusLabel('heavily-damaged')).toBe('Heavily Damaged');
      expect(getStatusLabel('damaged')).toBe('Damaged');
    });

    it('returns Arabic labels when locale is "ar"', () => {
      expect(getStatusLabel('destroyed', 'ar')).toBe('مدمر');
      expect(getStatusLabel('heavily-damaged', 'ar')).toBe('تضررت بشدة');
      expect(getStatusLabel('damaged', 'ar')).toBe('تضرر');
    });

    it('returns label for unregistered status', () => {
      const label = getStatusLabel('not-a-real-status');
      expect(label).toBe('not-a-real-status');
    });
  });

  describe('getMarkerColor', () => {
    it('returns correct colors for default statuses', () => {
      expect(getMarkerColor('destroyed')).toBe('red');
      expect(getMarkerColor('heavily-damaged')).toBe('orange');
      expect(getMarkerColor('damaged')).toBe('yellow');
    });

    it('returns grey for unregistered status', () => {
      expect(getMarkerColor('not-a-real-status')).toBe('grey');
    });
  });
});
