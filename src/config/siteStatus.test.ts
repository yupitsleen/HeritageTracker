import { describe, it, expect } from 'vitest';
import {
  STATUS_REGISTRY,
  registerStatus,
  getStatuses,
  getStatusConfig,
  getStatusLabel,
  isStatusRegistered,
  getMarkerColor,
} from './siteStatus';
import type { StatusConfig } from '../types/siteStatus';

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

    it('returns status configurations', () => {
      const statuses = getStatuses();
      statuses.forEach(status => {
        expect(status).toHaveProperty('id');
        expect(status).toHaveProperty('label');
        expect(status).toHaveProperty('severity');
        expect(status).toHaveProperty('markerColor');
      });
    });
  });

  describe('getStatusConfig', () => {
    it('returns config for registered status', () => {
      const config = getStatusConfig('destroyed');
      expect(config.id).toBe('destroyed');
      expect(config.label).toBe('Destroyed');
      expect(config.labelArabic).toBe('مدمر');
      expect(config.severity).toBe(100);
      expect(config.markerColor).toBe('red');
    });

    it('returns default config for unregistered status', () => {
      const config = getStatusConfig('unknown-status');
      expect(config.id).toBe('unknown-status');
      expect(config.label).toBe('unknown-status');
      expect(config.severity).toBe(0);
      expect(config.markerColor).toBe('grey');
    });

    it('gracefully handles empty string', () => {
      const config = getStatusConfig('');
      expect(config).toHaveProperty('id');
      expect(config).toHaveProperty('label');
      expect(config).toHaveProperty('severity');
      expect(config).toHaveProperty('markerColor');
    });
  });

  describe('getStatusLabel', () => {
    it('returns English label by default', () => {
      expect(getStatusLabel('destroyed')).toBe('Destroyed');
      expect(getStatusLabel('heavily-damaged')).toBe('Heavily Damaged');
      expect(getStatusLabel('damaged')).toBe('Damaged');
    });

    it('returns Arabic label when locale is ar', () => {
      expect(getStatusLabel('destroyed', 'ar')).toBe('مدمر');
      expect(getStatusLabel('heavily-damaged', 'ar')).toBe('تضررت بشدة');
      expect(getStatusLabel('damaged', 'ar')).toBe('تضرر');
    });

    it('falls back to English when Arabic not available', () => {
      // Register status without Arabic label
      registerStatus({
        id: 'test-no-arabic',
        label: 'Test Status',
        severity: 10,
        markerColor: 'blue',
      });

      expect(getStatusLabel('test-no-arabic', 'ar')).toBe('Test Status');
    });

    it('returns label for unregistered status', () => {
      const label = getStatusLabel('unknown');
      expect(label).toBe('unknown');
    });
  });

  describe('isStatusRegistered', () => {
    it('returns true for registered statuses', () => {
      expect(isStatusRegistered('destroyed')).toBe(true);
      expect(isStatusRegistered('heavily-damaged')).toBe(true);
      expect(isStatusRegistered('damaged')).toBe(true);
    });

    it('returns false for unregistered statuses', () => {
      expect(isStatusRegistered('partially-restored')).toBe(false);
      expect(isStatusRegistered('unknown')).toBe(false);
    });
  });

  describe('getMarkerColor', () => {
    it('returns correct colors for default statuses', () => {
      expect(getMarkerColor('destroyed')).toBe('red');
      expect(getMarkerColor('heavily-damaged')).toBe('orange');
      expect(getMarkerColor('damaged')).toBe('yellow');
    });

    it('returns grey for unregistered status', () => {
      expect(getMarkerColor('unknown')).toBe('grey');
    });

    it('returns custom color for registered custom status', () => {
      registerStatus({
        id: 'at-risk',
        label: 'At Risk',
        severity: 25,
        markerColor: 'blue',
      });

      expect(getMarkerColor('at-risk')).toBe('blue');
    });
  });

  describe('registerStatus', () => {
    it('adds new status to registry', () => {
      const newStatus: StatusConfig = {
        id: 'partially-restored',
        label: 'Partially Restored',
        labelArabic: 'تم ترميمه جزئيا',
        severity: 30,
        markerColor: 'green',
        description: 'Restoration work in progress',
      };

      registerStatus(newStatus);

      expect(isStatusRegistered('partially-restored')).toBe(true);
      expect(getStatusConfig('partially-restored')).toEqual(newStatus);
    });

    it('allows custom marker colors', () => {
      registerStatus({
        id: 'looted',
        label: 'Looted',
        severity: 60,
        markerColor: 'purple',
      });

      const config = getStatusConfig('looted');
      expect(config.markerColor).toBe('purple');
    });

    it('overwrites existing status when re-registered', () => {
      const original = getStatusConfig('destroyed');
      expect(original.severity).toBe(100);

      registerStatus({
        ...original,
        severity: 95,
      });

      const updated = getStatusConfig('destroyed');
      expect(updated.severity).toBe(95);
    });

    it('supports statuses without Arabic labels', () => {
      registerStatus({
        id: 'under-threat',
        label: 'Under Threat',
        severity: 20,
        markerColor: 'violet',
      });

      expect(isStatusRegistered('under-threat')).toBe(true);
      expect(getStatusLabel('under-threat', 'ar')).toBe('Under Threat'); // Falls back
    });
  });

  describe('extensibility', () => {
    it('allows adding multiple new statuses', () => {
      const newStatuses: StatusConfig[] = [
        { id: 'at-risk', label: 'At Risk', labelArabic: 'في خطر', severity: 25, markerColor: 'blue' },
        { id: 'partially-restored', label: 'Partially Restored', labelArabic: 'تم ترميمه جزئيا', severity: 30, markerColor: 'green' },
        { id: 'looted', label: 'Looted', labelArabic: 'منهوبة', severity: 60, markerColor: 'purple' },
      ];

      newStatuses.forEach(registerStatus);

      newStatuses.forEach(status => {
        expect(isStatusRegistered(status.id)).toBe(true);
        expect(getStatusLabel(status.id)).toBe(status.label);
        expect(getMarkerColor(status.id)).toBe(status.markerColor);
      });
    });

    it('maintains backward compatibility with existing data', () => {
      // Existing statuses should still work
      const existingStatuses = ['destroyed', 'heavily-damaged', 'damaged'];

      existingStatuses.forEach(status => {
        expect(isStatusRegistered(status)).toBe(true);
        const config = getStatusConfig(status);
        expect(config.id).toBe(status);
        expect(config.label).toBeTruthy();
        expect(config.severity).toBeGreaterThan(0);
        expect(config.markerColor).toBeTruthy();
      });
    });

    it('sorts new statuses correctly by severity', () => {
      registerStatus({ id: 'critical', label: 'Critical', severity: 90, markerColor: 'darkred' });
      registerStatus({ id: 'minor', label: 'Minor', severity: 10, markerColor: 'lightblue' });

      const statuses = getStatuses();
      const critical = statuses.find(s => s.id === 'critical');
      const minor = statuses.find(s => s.id === 'minor');

      expect(critical).toBeDefined();
      expect(minor).toBeDefined();

      const criticalIndex = statuses.indexOf(critical!);
      const minorIndex = statuses.indexOf(minor!);

      expect(criticalIndex).toBeLessThan(minorIndex);
    });
  });
});
