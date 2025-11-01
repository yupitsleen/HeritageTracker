import { describe, it, expect } from 'vitest';
import {
  registerSiteType,
  getSiteTypes,
  getSiteTypeConfig,
  getSiteTypeLabel,
} from './siteTypes';

describe('siteTypes', () => {
  describe('getSiteTypes', () => {
    it('returns array of all site types', () => {
      const types = getSiteTypes();
      expect(Array.isArray(types)).toBe(true);
      expect(types.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe('getSiteTypeConfig', () => {
    it('returns default config for unregistered type', () => {
      const config = getSiteTypeConfig('unknown-type');
      expect(config.id).toBe('unknown-type');
      expect(config.label).toBe('unknown-type');
      expect(config.icon).toBe('📍');
    });
  });

  describe('getSiteTypeLabel', () => {
    it('returns English label by default', () => {
      expect(getSiteTypeLabel('mosque')).toBe('Mosque');
    });

    it('returns Arabic label when locale is ar', () => {
      expect(getSiteTypeLabel('mosque', 'ar')).toBe('مسجد');
    });

    it('falls back to English when Arabic not available', () => {
      registerSiteType({
        id: 'test-no-arabic',
        label: 'Test Type',
        icon: '🏛',
      });

      expect(getSiteTypeLabel('test-no-arabic', 'ar')).toBe('Test Type');
    });
  });

  describe('registerSiteType', () => {
    it('adds new site type to registry', () => {
      registerSiteType({
        id: 'test-library',
        label: 'Library',
        labelArabic: 'مكتبة',
        icon: '📚',
      });

      const config = getSiteTypeConfig('test-library');
      expect(config.id).toBe('test-library');
      expect(config.label).toBe('Library');
    });
  });
});
