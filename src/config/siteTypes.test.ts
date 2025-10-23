import { describe, it, expect } from 'vitest';
import {
  SITE_TYPE_REGISTRY,
  registerSiteType,
  getSiteTypes,
  getSiteTypeConfig,
  getSiteTypeLabel,
  isSiteTypeRegistered,
} from './siteTypes';
import type { SiteTypeConfig } from '../types/siteTypes';

describe('siteTypes', () => {
  describe('SITE_TYPE_REGISTRY', () => {
    it('contains default site types', () => {
      expect(SITE_TYPE_REGISTRY).toHaveProperty('mosque');
      expect(SITE_TYPE_REGISTRY).toHaveProperty('church');
      expect(SITE_TYPE_REGISTRY).toHaveProperty('archaeological');
      expect(SITE_TYPE_REGISTRY).toHaveProperty('museum');
      expect(SITE_TYPE_REGISTRY).toHaveProperty('historic-building');
    });

    it('default types have required fields', () => {
      const mosque = SITE_TYPE_REGISTRY['mosque'];
      expect(mosque).toHaveProperty('id', 'mosque');
      expect(mosque).toHaveProperty('label');
      expect(mosque).toHaveProperty('labelArabic');
      expect(mosque).toHaveProperty('icon');
    });
  });

  describe('getSiteTypes', () => {
    it('returns array of all site types', () => {
      const types = getSiteTypes();
      expect(Array.isArray(types)).toBe(true);
      expect(types.length).toBeGreaterThanOrEqual(5);
    });

    it('returns site type configurations', () => {
      const types = getSiteTypes();
      types.forEach(type => {
        expect(type).toHaveProperty('id');
        expect(type).toHaveProperty('label');
        expect(type).toHaveProperty('icon');
      });
    });
  });

  describe('getSiteTypeConfig', () => {
    it('returns config for registered type', () => {
      const config = getSiteTypeConfig('mosque');
      expect(config.id).toBe('mosque');
      expect(config.label).toBe('Mosque');
      expect(config.labelArabic).toBe('مسجد');
      expect(config.icon).toBe('☪');
    });

    it('returns default config for unregistered type', () => {
      const config = getSiteTypeConfig('unknown-type');
      expect(config.id).toBe('unknown-type');
      expect(config.label).toBe('unknown-type');
      expect(config.icon).toBe('📍');
    });

    it('gracefully handles empty string', () => {
      const config = getSiteTypeConfig('');
      expect(config).toHaveProperty('id');
      expect(config).toHaveProperty('label');
      expect(config).toHaveProperty('icon');
    });
  });

  describe('getSiteTypeLabel', () => {
    it('returns English label by default', () => {
      expect(getSiteTypeLabel('mosque')).toBe('Mosque');
      expect(getSiteTypeLabel('church')).toBe('Church');
    });

    it('returns Arabic label when locale is ar', () => {
      expect(getSiteTypeLabel('mosque', 'ar')).toBe('مسجد');
      expect(getSiteTypeLabel('church', 'ar')).toBe('كنيسة');
    });

    it('falls back to English when Arabic not available', () => {
      // Register type without Arabic label
      registerSiteType({
        id: 'test-no-arabic',
        label: 'Test Type',
        icon: '🏛',
      });

      expect(getSiteTypeLabel('test-no-arabic', 'ar')).toBe('Test Type');
    });

    it('returns label for unregistered type', () => {
      const label = getSiteTypeLabel('unknown');
      expect(label).toBe('unknown');
    });
  });

  describe('isSiteTypeRegistered', () => {
    it('returns true for registered types', () => {
      expect(isSiteTypeRegistered('mosque')).toBe(true);
      expect(isSiteTypeRegistered('church')).toBe(true);
    });

    it('returns false for unregistered types', () => {
      expect(isSiteTypeRegistered('library')).toBe(false);
      expect(isSiteTypeRegistered('unknown')).toBe(false);
    });
  });

  describe('registerSiteType', () => {
    // Tests dynamically add types to the registry

    it('adds new site type to registry', () => {
      const newType: SiteTypeConfig = {
        id: 'library',
        label: 'Library',
        labelArabic: 'مكتبة',
        icon: '📚',
        description: 'Repository of books and manuscripts',
      };

      registerSiteType(newType);

      expect(isSiteTypeRegistered('library')).toBe(true);
      expect(getSiteTypeConfig('library')).toEqual(newType);
    });

    it('allows custom unicode icons', () => {
      registerSiteType({
        id: 'school',
        label: 'School',
        icon: '🏫',
      });

      const config = getSiteTypeConfig('school');
      expect(config.icon).toBe('🏫');
    });

    it('overwrites existing type when re-registered', () => {
      const original = getSiteTypeConfig('mosque');
      expect(original.description).toBe('Islamic place of worship');

      registerSiteType({
        ...original,
        description: 'Updated description',
      });

      const updated = getSiteTypeConfig('mosque');
      expect(updated.description).toBe('Updated description');
    });

    it('supports types without Arabic labels', () => {
      registerSiteType({
        id: 'monument',
        label: 'Monument',
        icon: '🗿',
      });

      expect(isSiteTypeRegistered('monument')).toBe(true);
      expect(getSiteTypeLabel('monument', 'ar')).toBe('Monument'); // Falls back to English
    });
  });

  describe('extensibility', () => {
    it('allows adding multiple new types', () => {
      const newTypes: SiteTypeConfig[] = [
        { id: 'library', label: 'Library', labelArabic: 'مكتبة', icon: '📚' },
        { id: 'school', label: 'School', labelArabic: 'مدرسة', icon: '🏫' },
        { id: 'cemetery', label: 'Cemetery', labelArabic: 'مقبرة', icon: '🪦' },
      ];

      newTypes.forEach(registerSiteType);

      newTypes.forEach(type => {
        expect(isSiteTypeRegistered(type.id)).toBe(true);
        expect(getSiteTypeLabel(type.id)).toBe(type.label);
      });
    });

    it('maintains backward compatibility with existing data', () => {
      // Existing site types should still work
      const existingTypes = ['mosque', 'church', 'archaeological', 'museum', 'historic-building'];

      existingTypes.forEach(type => {
        expect(isSiteTypeRegistered(type)).toBe(true);
        const config = getSiteTypeConfig(type);
        expect(config.id).toBe(type);
        expect(config.label).toBeTruthy();
        expect(config.icon).toBeTruthy();
      });
    });
  });
});
