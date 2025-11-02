/**
 * Tests for Data Converters
 *
 * Tests transformation between database format (snake_case, PostGIS)
 * and API format (camelCase, [lat,lng] arrays)
 */

import { describe, it, expect } from 'vitest';
import { dbToApi, apiToDb, dbArrayToApi } from '../converters.js';
import { mockSite, mockSiteAPI } from '../../__tests__/setup.js';

describe('dbToApi', () => {
  it('converts database row to API format', () => {
    const result = dbToApi(mockSite);

    expect(result.id).toBe(mockSite.id);
    expect(result.name).toBe(mockSite.name);
    expect(result.nameArabic).toBe(mockSite.name_arabic);
    expect(result.type).toBe(mockSite.type);
    expect(result.yearBuilt).toBe(mockSite.year_built);
    expect(result.yearBuiltIslamic).toBe(mockSite.year_built_islamic);
    expect(result.status).toBe(mockSite.status);
    expect(result.dateDestroyed).toBe(mockSite.date_destroyed);
    expect(result.dateDestroyedIslamic).toBe(mockSite.date_destroyed_islamic);
    expect(result.lastUpdated).toBe(mockSite.last_updated);
    expect(result.description).toBe(mockSite.description);
    expect(result.historicalSignificance).toBe(mockSite.historical_significance);
    expect(result.culturalValue).toBe(mockSite.cultural_value);
    expect(result.verifiedBy).toEqual(mockSite.verified_by);
    expect(result.sources).toEqual(mockSite.sources);
    expect(result.images).toEqual(mockSite.images);
    expect(result.unescoListed).toBe(mockSite.unesco_listed);
    expect(result.artifactCount).toBe(mockSite.artifact_count);
    expect(result.isUnique).toBe(mockSite.is_unique);
    expect(result.religiousSignificance).toBe(mockSite.religious_significance);
    expect(result.communityGatheringPlace).toBe(mockSite.community_gathering_place);
    expect(result.historicalEvents).toEqual(mockSite.historical_events);
  });

  it('converts PostGIS coordinates from [lng, lat] to [lat, lng]', () => {
    const dbRow = {
      ...mockSite,
      coordinates: {
        type: 'Point',
        coordinates: [34.4668, 31.5036] // [lng, lat] from PostGIS
      }
    };

    const result = dbToApi(dbRow);

    expect(result.coordinates).toEqual([31.5036, 34.4668]); // [lat, lng] for API
  });

  it('handles null coordinates', () => {
    const dbRow = { ...mockSite, coordinates: null };
    const result = dbToApi(dbRow);

    expect(result.coordinates).toBeNull();
  });

  it('returns null for null input', () => {
    const result = dbToApi(null);

    expect(result).toBeNull();
  });

  it('defaults to empty arrays for missing array fields', () => {
    const dbRow = {
      id: 'test-1',
      name: 'Test Site',
      type: 'mosque',
      coordinates: { type: 'Point', coordinates: [34.5, 31.5] },
      status: 'destroyed',
      description: 'Test',
      historical_significance: 'Test',
      cultural_value: 'Test',
      last_updated: '2024-01-01',
      // No verified_by, sources, or historical_events
    };

    const result = dbToApi(dbRow);

    expect(result.verifiedBy).toEqual([]);
    expect(result.sources).toEqual([]);
    expect(result.historicalEvents).toEqual([]);
  });

  it('defaults to empty object for missing images', () => {
    const dbRow = {
      id: 'test-1',
      name: 'Test Site',
      type: 'mosque',
      coordinates: { type: 'Point', coordinates: [34.5, 31.5] },
      status: 'destroyed',
      description: 'Test',
      historical_significance: 'Test',
      cultural_value: 'Test',
      last_updated: '2024-01-01',
      verified_by: [],
      sources: [],
      // No images field
    };

    const result = dbToApi(dbRow);

    expect(result.images).toEqual({});
  });
});

describe('apiToDb', () => {
  it('converts API format to database row', () => {
    const result = apiToDb(mockSiteAPI);

    expect(result.id).toBe(mockSiteAPI.id);
    expect(result.name).toBe(mockSiteAPI.name);
    expect(result.name_arabic).toBe(mockSiteAPI.nameArabic);
    expect(result.type).toBe(mockSiteAPI.type);
    expect(result.year_built).toBe(mockSiteAPI.yearBuilt);
    expect(result.year_built_islamic).toBe(mockSiteAPI.yearBuiltIslamic);
    expect(result.status).toBe(mockSiteAPI.status);
    expect(result.date_destroyed).toBe(mockSiteAPI.dateDestroyed);
    expect(result.date_destroyed_islamic).toBe(mockSiteAPI.dateDestroyedIslamic);
    expect(result.last_updated).toBe(mockSiteAPI.lastUpdated);
    expect(result.description).toBe(mockSiteAPI.description);
    expect(result.historical_significance).toBe(mockSiteAPI.historicalSignificance);
    expect(result.cultural_value).toBe(mockSiteAPI.culturalValue);
    expect(result.verified_by).toEqual(mockSiteAPI.verifiedBy);
    expect(result.sources).toEqual(mockSiteAPI.sources);
    expect(result.images).toEqual(mockSiteAPI.images);
    expect(result.unesco_listed).toBe(mockSiteAPI.unescoListed);
    expect(result.artifact_count).toBe(mockSiteAPI.artifactCount);
    expect(result.is_unique).toBe(mockSiteAPI.isUnique);
    expect(result.religious_significance).toBe(mockSiteAPI.religiousSignificance);
    expect(result.community_gathering_place).toBe(mockSiteAPI.communityGatheringPlace);
    expect(result.historical_events).toEqual(mockSiteAPI.historicalEvents);
  });

  it('converts coordinates from [lat, lng] to PostGIS POINT(lng lat)', () => {
    const apiSite = {
      ...mockSiteAPI,
      coordinates: [31.5036, 34.4668] // [lat, lng] from API
    };

    const result = apiToDb(apiSite);

    expect(result.coordinates).toBe('POINT(34.4668 31.5036)'); // POINT(lng lat) for PostGIS
  });

  it('handles null coordinates', () => {
    const apiSite = { ...mockSiteAPI, coordinates: null };
    const result = apiToDb(apiSite);

    expect(result.coordinates).toBeNull();
  });

  it('returns null for null input', () => {
    const result = apiToDb(null);

    expect(result).toBeNull();
  });

  it('removes undefined fields', () => {
    const apiSite = {
      id: 'test-1',
      name: 'Test Site',
      type: 'mosque',
      coordinates: [31.5, 34.5],
      status: 'destroyed',
      description: 'Test',
      historicalSignificance: 'Test',
      culturalValue: 'Test',
      // No optional fields
    };

    const result = apiToDb(apiSite);

    expect(result.name_arabic).toBeUndefined();
    expect(result.year_built).toBeUndefined();
    expect(result.date_destroyed).toBeUndefined();
  });

  it('sets lastUpdated to current time if not provided', () => {
    const before = new Date().toISOString();
    const apiSite = {
      id: 'test-1',
      name: 'Test Site',
      type: 'mosque',
      coordinates: [31.5, 34.5],
      status: 'destroyed',
      description: 'Test',
      historicalSignificance: 'Test',
      culturalValue: 'Test'
    };

    const result = apiToDb(apiSite);
    const after = new Date().toISOString();

    expect(result.last_updated).toBeDefined();
    expect(result.last_updated).toMatch(/^\d{4}-\d{2}-\d{2}T/); // ISO format
    expect(result.last_updated >= before).toBe(true);
    expect(result.last_updated <= after).toBe(true);
  });

  it('defaults to empty arrays for missing array fields', () => {
    const apiSite = {
      id: 'test-1',
      name: 'Test Site',
      type: 'mosque',
      coordinates: [31.5, 34.5],
      status: 'destroyed',
      description: 'Test',
      historicalSignificance: 'Test',
      culturalValue: 'Test',
      lastUpdated: '2024-01-01'
    };

    const result = apiToDb(apiSite);

    expect(result.verified_by).toEqual([]);
    expect(result.sources).toEqual([]);
    expect(result.historical_events).toEqual([]);
  });

  it('defaults to empty object for missing images', () => {
    const apiSite = {
      id: 'test-1',
      name: 'Test Site',
      type: 'mosque',
      coordinates: [31.5, 34.5],
      status: 'destroyed',
      description: 'Test',
      historicalSignificance: 'Test',
      culturalValue: 'Test',
      lastUpdated: '2024-01-01'
    };

    const result = apiToDb(apiSite);

    expect(result.images).toEqual({});
  });
});

describe('dbArrayToApi', () => {
  it('converts array of database rows to API format', () => {
    const dbRows = [
      mockSite,
      {
        ...mockSite,
        id: 'site-2',
        name: 'Second Site'
      }
    ];

    const result = dbArrayToApi(dbRows);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('site-1');
    expect(result[0].name).toBe('Al-Omari Mosque');
    expect(result[1].id).toBe('site-2');
    expect(result[1].name).toBe('Second Site');
  });

  it('handles empty array', () => {
    const result = dbArrayToApi([]);

    expect(result).toEqual([]);
  });

  it('filters out null results', () => {
    const dbRows = [
      mockSite,
      null,
      {
        ...mockSite,
        id: 'site-2'
      }
    ];

    const result = dbArrayToApi(dbRows);

    expect(result).toHaveLength(3);
    expect(result[0]).not.toBeNull();
    expect(result[1]).toBeNull();
    expect(result[2]).not.toBeNull();
  });
});

describe('Round-trip conversion', () => {
  it('converts DB → API → DB without data loss', () => {
    const apiResult = dbToApi(mockSite);
    const dbResult = apiToDb(apiResult);

    // Compare all fields (except coordinates which are formatted differently)
    expect(dbResult.id).toBe(mockSite.id);
    expect(dbResult.name).toBe(mockSite.name);
    expect(dbResult.type).toBe(mockSite.type);
    expect(dbResult.status).toBe(mockSite.status);
    expect(dbResult.verified_by).toEqual(mockSite.verified_by);
    expect(dbResult.sources).toEqual(mockSite.sources);

    // Coordinates are converted to POINT string
    expect(dbResult.coordinates).toBe('POINT(34.4668 31.5036)');
  });

  it('handles partial data round-trip', () => {
    const minimalSite = {
      id: 'test',
      name: 'Test',
      type: 'mosque',
      coordinates: { type: 'Point', coordinates: [34.5, 31.5] },
      status: 'destroyed',
      description: 'Test',
      historical_significance: 'Test',
      cultural_value: 'Test',
      last_updated: '2024-01-01',
      verified_by: [],
      sources: []
    };

    const apiResult = dbToApi(minimalSite);
    const dbResult = apiToDb(apiResult);

    expect(dbResult.id).toBe(minimalSite.id);
    expect(dbResult.name).toBe(minimalSite.name);
    expect(dbResult.verified_by).toEqual([]);
    expect(dbResult.sources).toEqual([]);
  });
});
