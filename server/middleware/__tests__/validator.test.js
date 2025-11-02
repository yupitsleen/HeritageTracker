/**
 * Tests for Request Validator Middleware
 *
 * Tests validation of request bodies, parameters, and query strings
 */

import { describe, it, expect } from 'vitest';
import {
  validateSiteBody,
  validateSiteId,
  validatePagination,
  validateNearbyParams,
} from '../validator.js';
import { createMockRequest, createMockResponse, createMockNext } from '../../__tests__/setup.js';

describe('validateSiteBody', () => {
  describe('Full validation (POST)', () => {
    it('accepts valid site data', () => {
      const req = createMockRequest({
        body: {
          id: 'site-1',
          name: 'Test Mosque',
          type: 'mosque',
          coordinates: [31.5, 34.5],
          status: 'destroyed',
          description: 'Test',
          historicalSignificance: 'Test',
          culturalValue: 'Test',
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validateSiteBody(false);
      middleware(req, res, next);

      expect(next.called).toBe(true);
      expect(next.error).toBeUndefined();
    });

    it('rejects empty body', () => {
      const req = createMockRequest({ body: {} });
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validateSiteBody(false);
      middleware(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('Request body is required');
      expect(next.called).toBeUndefined();
    });

    it('rejects missing required fields', () => {
      const req = createMockRequest({
        body: {
          name: 'Test Mosque',
          // Missing type, coordinates, status, description, etc.
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validateSiteBody(false);
      middleware(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('Missing required fields');
      expect(next.called).toBeUndefined();
    });
  });

  describe('Partial validation (PATCH)', () => {
    it('accepts partial data', () => {
      const req = createMockRequest({
        body: {
          name: 'Updated Name'
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validateSiteBody(true);
      middleware(req, res, next);

      expect(next.called).toBe(true);
    });

    it('validates provided fields', () => {
      const req = createMockRequest({
        body: {
          type: 'invalid_type'
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validateSiteBody(true);
      middleware(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('type must be one of');
    });
  });

  describe('Name validation', () => {
    it('rejects empty string', () => {
      const req = createMockRequest({
        body: {
          id: 'site-1',
          name: '   ',
          type: 'mosque',
          coordinates: [31.5, 34.5],
          status: 'destroyed',
          description: 'Test',
          historicalSignificance: 'Test',
          culturalValue: 'Test',
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validateSiteBody(false);
      middleware(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('name must be a non-empty string');
    });

    it('rejects non-string', () => {
      const req = createMockRequest({
        body: {
          id: 'site-1',
          name: 123,
          type: 'mosque',
          coordinates: [31.5, 34.5],
          status: 'destroyed',
          description: 'Test',
          historicalSignificance: 'Test',
          culturalValue: 'Test',
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validateSiteBody(false);
      middleware(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('name must be a non-empty string');
    });
  });

  describe('Type validation', () => {
    it('accepts valid types', () => {
      const validTypes = ['mosque', 'church', 'archaeological_site', 'museum', 'library', 'monument'];

      for (const type of validTypes) {
        const req = createMockRequest({
          body: {
            id: 'site-1',
            name: 'Test',
            type,
            coordinates: [31.5, 34.5],
            status: 'destroyed',
            description: 'Test',
            historicalSignificance: 'Test',
            culturalValue: 'Test',
          }
        });
        const res = createMockResponse();
        const next = createMockNext();

        const middleware = validateSiteBody(false);
        middleware(req, res, next);

        expect(next.called).toBe(true);
      }
    });

    it('rejects invalid type', () => {
      const req = createMockRequest({
        body: {
          id: 'site-1',
          name: 'Test',
          type: 'invalid_type',
          coordinates: [31.5, 34.5],
          status: 'destroyed',
          description: 'Test',
          historicalSignificance: 'Test',
          culturalValue: 'Test',
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validateSiteBody(false);
      middleware(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('type must be one of');
    });
  });

  describe('Status validation', () => {
    it('accepts valid statuses', () => {
      const validStatuses = ['destroyed', 'severely_damaged', 'partially_damaged', 'looted', 'threatened'];

      for (const status of validStatuses) {
        const req = createMockRequest({
          body: {
            id: 'site-1',
            name: 'Test',
            type: 'mosque',
            coordinates: [31.5, 34.5],
            status,
            description: 'Test',
            historicalSignificance: 'Test',
            culturalValue: 'Test',
          }
        });
        const res = createMockResponse();
        const next = createMockNext();

        const middleware = validateSiteBody(false);
        middleware(req, res, next);

        expect(next.called).toBe(true);
      }
    });

    it('rejects invalid status', () => {
      const req = createMockRequest({
        body: {
          id: 'site-1',
          name: 'Test',
          type: 'mosque',
          coordinates: [31.5, 34.5],
          status: 'invalid_status',
          description: 'Test',
          historicalSignificance: 'Test',
          culturalValue: 'Test',
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validateSiteBody(false);
      middleware(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('status must be one of');
    });
  });

  describe('Coordinates validation', () => {
    it('accepts valid coordinates', () => {
      const req = createMockRequest({
        body: {
          id: 'site-1',
          name: 'Test',
          type: 'mosque',
          coordinates: [31.5, 34.5],
          status: 'destroyed',
          description: 'Test',
          historicalSignificance: 'Test',
          culturalValue: 'Test',
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validateSiteBody(false);
      middleware(req, res, next);

      expect(next.called).toBe(true);
    });

    it('rejects non-array coordinates', () => {
      const req = createMockRequest({
        body: {
          id: 'site-1',
          name: 'Test',
          type: 'mosque',
          coordinates: 'invalid',
          status: 'destroyed',
          description: 'Test',
          historicalSignificance: 'Test',
          culturalValue: 'Test',
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validateSiteBody(false);
      middleware(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('coordinates must be an array');
    });

    it('rejects wrong array length', () => {
      const req = createMockRequest({
        body: {
          id: 'site-1',
          name: 'Test',
          type: 'mosque',
          coordinates: [31.5],
          status: 'destroyed',
          description: 'Test',
          historicalSignificance: 'Test',
          culturalValue: 'Test',
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validateSiteBody(false);
      middleware(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('coordinates must be an array');
    });

    it('rejects out of bounds latitude', () => {
      const req = createMockRequest({
        body: {
          id: 'site-1',
          name: 'Test',
          type: 'mosque',
          coordinates: [91, 34.5], // lat > 90
          status: 'destroyed',
          description: 'Test',
          historicalSignificance: 'Test',
          culturalValue: 'Test',
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validateSiteBody(false);
      middleware(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('coordinates must be valid');
    });

    it('rejects out of bounds longitude', () => {
      const req = createMockRequest({
        body: {
          id: 'site-1',
          name: 'Test',
          type: 'mosque',
          coordinates: [31.5, 181], // lng > 180
          status: 'destroyed',
          description: 'Test',
          historicalSignificance: 'Test',
          culturalValue: 'Test',
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validateSiteBody(false);
      middleware(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('coordinates must be valid');
    });
  });

  describe('Array field validation', () => {
    it('rejects non-array for array fields', () => {
      const req = createMockRequest({
        body: {
          id: 'site-1',
          name: 'Test',
          type: 'mosque',
          coordinates: [31.5, 34.5],
          status: 'destroyed',
          description: 'Test',
          historicalSignificance: 'Test',
          culturalValue: 'Test',
          verifiedBy: 'not-an-array'
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validateSiteBody(false);
      middleware(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('must be an array');
    });
  });

  describe('Boolean field validation', () => {
    it('rejects non-boolean for boolean fields', () => {
      const req = createMockRequest({
        body: {
          id: 'site-1',
          name: 'Test',
          type: 'mosque',
          coordinates: [31.5, 34.5],
          status: 'destroyed',
          description: 'Test',
          historicalSignificance: 'Test',
          culturalValue: 'Test',
          unescoListed: 'yes'
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validateSiteBody(false);
      middleware(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('must be a boolean');
    });
  });

  describe('Artifact count validation', () => {
    it('accepts valid artifact count', () => {
      const req = createMockRequest({
        body: {
          id: 'site-1',
          name: 'Test',
          type: 'mosque',
          coordinates: [31.5, 34.5],
          status: 'destroyed',
          description: 'Test',
          historicalSignificance: 'Test',
          culturalValue: 'Test',
          artifactCount: 50
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validateSiteBody(false);
      middleware(req, res, next);

      expect(next.called).toBe(true);
    });

    it('rejects negative artifact count', () => {
      const req = createMockRequest({
        body: {
          id: 'site-1',
          name: 'Test',
          type: 'mosque',
          coordinates: [31.5, 34.5],
          status: 'destroyed',
          description: 'Test',
          historicalSignificance: 'Test',
          culturalValue: 'Test',
          artifactCount: -1
        }
      });
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validateSiteBody(false);
      middleware(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('artifactCount must be a non-negative number');
    });
  });
});

describe('validateSiteId', () => {
  it('accepts valid site ID', () => {
    const req = createMockRequest({ params: { id: 'site-1' } });
    const res = createMockResponse();
    const next = createMockNext();

    validateSiteId(req, res, next);

    expect(next.called).toBe(true);
  });

  it('rejects missing ID', () => {
    const req = createMockRequest({ params: {} });
    const res = createMockResponse();
    const next = createMockNext();

    validateSiteId(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('Valid site ID is required');
  });

  it('rejects empty ID', () => {
    const req = createMockRequest({ params: { id: '   ' } });
    const res = createMockResponse();
    const next = createMockNext();

    validateSiteId(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('Valid site ID is required');
  });
});

describe('validatePagination', () => {
  it('accepts valid pagination', () => {
    const req = createMockRequest({ query: { page: '1', pageSize: '10' } });
    const res = createMockResponse();
    const next = createMockNext();

    validatePagination(req, res, next);

    expect(next.called).toBe(true);
  });

  it('accepts missing pagination (uses defaults)', () => {
    const req = createMockRequest({ query: {} });
    const res = createMockResponse();
    const next = createMockNext();

    validatePagination(req, res, next);

    expect(next.called).toBe(true);
  });

  it('rejects page less than 1', () => {
    const req = createMockRequest({ query: { page: '0' } });
    const res = createMockResponse();
    const next = createMockNext();

    validatePagination(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('page must be at least');
  });

  it('rejects invalid page number', () => {
    const req = createMockRequest({ query: { page: 'abc' } });
    const res = createMockResponse();
    const next = createMockNext();

    validatePagination(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('page must be at least');
  });

  it('rejects pageSize too small', () => {
    const req = createMockRequest({ query: { pageSize: '0' } });
    const res = createMockResponse();
    const next = createMockNext();

    validatePagination(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('pageSize must be between');
  });

  it('rejects pageSize too large', () => {
    const req = createMockRequest({ query: { pageSize: '1001' } });
    const res = createMockResponse();
    const next = createMockNext();

    validatePagination(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('pageSize must be between');
  });
});

describe('validateNearbyParams', () => {
  it('accepts valid nearby parameters', () => {
    const req = createMockRequest({ query: { lat: '31.5', lng: '34.5', radius: '10' } });
    const res = createMockResponse();
    const next = createMockNext();

    validateNearbyParams(req, res, next);

    expect(next.called).toBe(true);
  });

  it('accepts without radius (uses default)', () => {
    const req = createMockRequest({ query: { lat: '31.5', lng: '34.5' } });
    const res = createMockResponse();
    const next = createMockNext();

    validateNearbyParams(req, res, next);

    expect(next.called).toBe(true);
  });

  it('rejects missing lat', () => {
    const req = createMockRequest({ query: { lng: '34.5' } });
    const res = createMockResponse();
    const next = createMockNext();

    validateNearbyParams(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('lat and lng query parameters are required');
  });

  it('rejects missing lng', () => {
    const req = createMockRequest({ query: { lat: '31.5' } });
    const res = createMockResponse();
    const next = createMockNext();

    validateNearbyParams(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('lat and lng query parameters are required');
  });

  it('rejects invalid lat', () => {
    const req = createMockRequest({ query: { lat: 'abc', lng: '34.5' } });
    const res = createMockResponse();
    const next = createMockNext();

    validateNearbyParams(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('lat must be a number');
  });

  it('rejects invalid lng', () => {
    const req = createMockRequest({ query: { lat: '31.5', lng: 'abc' } });
    const res = createMockResponse();
    const next = createMockNext();

    validateNearbyParams(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('lng must be a number');
  });

  it('rejects invalid radius', () => {
    const req = createMockRequest({ query: { lat: '31.5', lng: '34.5', radius: '-1' } });
    const res = createMockResponse();
    const next = createMockNext();

    validateNearbyParams(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('radius must be a number');
  });

  it('rejects radius too large', () => {
    const req = createMockRequest({ query: { lat: '31.5', lng: '34.5', radius: '1001' } });
    const res = createMockResponse();
    const next = createMockNext();

    validateNearbyParams(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('radius must be a number');
  });
});
