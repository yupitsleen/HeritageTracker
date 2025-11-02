/**
 * Test Setup and Mock Utilities for Backend Tests
 *
 * Provides reusable mock objects and utilities for testing the backend
 * without requiring a real database connection.
 */

/**
 * Mock site data for testing
 */
export const mockSite = {
  id: 'site-1',
  name: 'Al-Omari Mosque',
  name_arabic: 'مسجد العمري',
  type: 'mosque',
  year_built: '1277',
  year_built_islamic: '676 AH',
  coordinates: { type: 'Point', coordinates: [34.4668, 31.5036] }, // GeoJSON format (DB)
  status: 'destroyed',
  date_destroyed: '2023-12-07',
  date_destroyed_islamic: '22 Jumada al-Awwal 1445',
  last_updated: '2024-01-15T10:00:00Z',
  description: 'Historic mosque from the Mamluk period',
  historical_significance: 'One of the oldest mosques in Gaza',
  cultural_value: 'Major center for Islamic learning',
  verified_by: ['UNESCO', 'Heritage for Peace'],
  sources: [
    {
      title: 'UNESCO Report',
      url: 'https://unesco.org/report',
      date: '2024-01-15',
      organization: 'UNESCO'
    }
  ],
  images: {
    before: 'https://example.com/before.jpg',
    after: 'https://example.com/after.jpg'
  },
  unesco_listed: true,
  artifact_count: 50,
  is_unique: true,
  religious_significance: true,
  community_gathering_place: true,
  historical_events: ['Built in 1277', 'Renovated in 1925']
};

/**
 * Mock site in API format (camelCase)
 */
export const mockSiteAPI = {
  id: 'site-1',
  name: 'Al-Omari Mosque',
  nameArabic: 'مسجد العمري',
  type: 'mosque',
  yearBuilt: '1277',
  yearBuiltIslamic: '676 AH',
  coordinates: [31.5036, 34.4668], // [lat, lng] format (API)
  status: 'destroyed',
  dateDestroyed: '2023-12-07',
  dateDestroyedIslamic: '22 Jumada al-Awwal 1445',
  lastUpdated: '2024-01-15T10:00:00Z',
  description: 'Historic mosque from the Mamluk period',
  historicalSignificance: 'One of the oldest mosques in Gaza',
  culturalValue: 'Major center for Islamic learning',
  verifiedBy: ['UNESCO', 'Heritage for Peace'],
  sources: [
    {
      title: 'UNESCO Report',
      url: 'https://unesco.org/report',
      date: '2024-01-15',
      organization: 'UNESCO'
    }
  ],
  images: {
    before: 'https://example.com/before.jpg',
    after: 'https://example.com/after.jpg'
  },
  unescoListed: true,
  artifactCount: 50,
  isUnique: true,
  religiousSignificance: true,
  communityGatheringPlace: true,
  historicalEvents: ['Built in 1277', 'Renovated in 1925']
};

/**
 * Mock database client with common operations
 */
export function createMockDb() {
  const sites = [mockSite];

  return {
    // Mock query with tagged template literal support
    query: async (strings, ...values) => {
      // Return mock data based on query
      return sites;
    },

    // Direct query methods (like postgres library)
    unsafe: async (query, params = []) => {
      return sites;
    },

    // Transaction support
    begin: async (callback) => {
      return callback(this);
    }
  };
}

/**
 * Mock repository with preset return values
 */
export function createMockRepository(overrides = {}) {
  return {
    findAll: async () => [mockSite],
    findById: async (id) => mockSite,
    findPaginated: async () => ({
      sites: [mockSite],
      total: 1,
      page: 1,
      pageSize: 10,
      totalPages: 1
    }),
    insert: async (data) => ({ ...mockSite, ...data }),
    update: async (id, data) => ({ ...mockSite, ...data }),
    delete: async (id) => undefined,
    findNearPoint: async (lat, lng, radius) => [mockSite],
    ...overrides
  };
}

/**
 * Mock service with preset return values
 */
export function createMockService(overrides = {}) {
  return {
    getAllSites: async (filters) => [mockSiteAPI],
    getSiteById: async (id) => mockSiteAPI,
    getSitesPaginated: async (filters, page, pageSize) => ({
      sites: [mockSiteAPI],
      pagination: {
        total: 1,
        page: 1,
        pageSize: 10,
        totalPages: 1
      }
    }),
    createSite: async (data) => ({ ...mockSiteAPI, ...data }),
    updateSite: async (id, updates) => ({ ...mockSiteAPI, ...updates }),
    deleteSite: async (id) => undefined,
    getSitesNearPoint: async (lat, lng, radius) => [mockSiteAPI],
    ...overrides
  };
}

/**
 * Create mock Express request object
 */
export function createMockRequest(overrides = {}) {
  return {
    params: {},
    query: {},
    body: {},
    headers: {},
    method: 'GET',
    url: '/api/sites',
    id: 'test-request-id',
    ...overrides
  };
}

/**
 * Create mock Express response object
 */
export function createMockResponse() {
  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    status: function(code) {
      this.statusCode = code;
      return this;
    },
    json: function(data) {
      this.body = data;
      return this;
    },
    setHeader: function(key, value) {
      this.headers[key] = value;
      return this;
    },
    send: function(data) {
      this.body = data;
      return this;
    }
  };
  return res;
}

/**
 * Create mock next function for middleware
 */
export function createMockNext() {
  return function next(error) {
    if (error) {
      next.error = error;
    }
    next.called = true;
  };
}

/**
 * Helper to test async error handling
 */
export async function expectAsyncError(fn, errorMatcher) {
  try {
    await fn();
    throw new Error('Expected function to throw an error');
  } catch (error) {
    if (errorMatcher) {
      if (typeof errorMatcher === 'string') {
        expect(error.message).toContain(errorMatcher);
      } else if (errorMatcher instanceof RegExp) {
        expect(error.message).toMatch(errorMatcher);
      } else if (typeof errorMatcher === 'function') {
        expect(error).toBeInstanceOf(errorMatcher);
      }
    }
    return error;
  }
}
