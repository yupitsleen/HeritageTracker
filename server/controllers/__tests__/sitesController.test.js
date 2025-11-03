/**
 * Sites Controller Tests
 *
 * Tests HTTP request/response handling
 * Mocks service layer to avoid business logic dependencies
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockSiteAPI, createMockRequest, createMockResponse, createMockNext } from '../../__tests__/setup.js';

// Mock the service layer BEFORE importing controller
vi.mock('../../services/sitesService.js', () => ({
  getAllSites: vi.fn(),
  getPaginatedSites: vi.fn(),
  getSiteById: vi.fn(),
  createSite: vi.fn(),
  updateSite: vi.fn(),
  deleteSite: vi.fn(),
  getSitesNearPoint: vi.fn(),
  getSiteStatistics: vi.fn(),
}));

// Mock logger
vi.mock('../../utils/logger.js', () => ({
  default: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

// Mock converters
vi.mock('../../utils/converters.js', () => ({
  extractFilters: vi.fn((query) => query || {}),
  dbToApi: vi.fn((row) => row),
  dbArrayToApi: vi.fn((rows) => rows),
  apiToDb: vi.fn((data) => data),
}));

// NOW import after mocks
import * as sitesController from '../sitesController.js';
import * as sitesService from '../../services/sitesService.js';

describe('Sites Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllSites', () => {
    it('returns all sites successfully', async () => {
      const req = createMockRequest({ query: {} });
      const res = createMockResponse();
      const next = createMockNext();

      sitesService.getAllSites.mockResolvedValue([mockSiteAPI]);

      await sitesController.getAllSites(req, res, next);

      expect(sitesService.getAllSites).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith([mockSiteAPI]);
      expect(next).not.toHaveBeenCalled();
    });

    it('passes filters to service', async () => {
      const req = createMockRequest({ query: { types: 'mosque' } });
      const res = createMockResponse();
      const next = createMockNext();

      sitesService.getAllSites.mockResolvedValue([mockSiteAPI]);

      await sitesController.getAllSites(req, res, next);

      expect(sitesService.getAllSites).toHaveBeenCalledWith(expect.objectContaining({}));
    });

    it('calls next with error on failure', async () => {
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();
      const error = new Error('Service error');

      sitesService.getAllSites.mockRejectedValue(error);

      await sitesController.getAllSites(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getPaginatedSites', () => {
    it('returns paginated results', async () => {
      const req = createMockRequest({ query: { page: '1', pageSize: '50' } });
      const res = createMockResponse();
      const next = createMockNext();

      const paginatedResult = {
        sites: [mockSiteAPI],
        pagination: { page: 1, pageSize: 50, total: 45, totalPages: 1 },
      };

      sitesService.getPaginatedSites.mockResolvedValue(paginatedResult);

      await sitesController.getPaginatedSites(req, res, next);

      expect(sitesService.getPaginatedSites).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(paginatedResult);
    });

    it('calls next with error on failure', async () => {
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();
      const error = new Error('Service error');

      sitesService.getPaginatedSites.mockRejectedValue(error);

      await sitesController.getPaginatedSites(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getSiteById', () => {
    it('returns site when found', async () => {
      const req = createMockRequest({ params: { id: 'site-1' } });
      const res = createMockResponse();
      const next = createMockNext();

      sitesService.getSiteById.mockResolvedValue(mockSiteAPI);

      await sitesController.getSiteById(req, res, next);

      expect(sitesService.getSiteById).toHaveBeenCalledWith('site-1');
      expect(res.json).toHaveBeenCalledWith(mockSiteAPI);
    });

    it('returns 404 when site not found', async () => {
      const req = createMockRequest({ params: { id: 'nonexistent' } });
      const res = createMockResponse();
      const next = createMockNext();

      sitesService.getSiteById.mockResolvedValue(null);

      await sitesController.getSiteById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Site not found',
        })
      );
    });

    it('calls next with error on failure', async () => {
      const req = createMockRequest({ params: { id: 'site-1' } });
      const res = createMockResponse();
      const next = createMockNext();
      const error = new Error('Service error');

      sitesService.getSiteById.mockRejectedValue(error);

      await sitesController.getSiteById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('createSite', () => {
    it('creates site and returns 201', async () => {
      const req = createMockRequest({ body: mockSiteAPI });
      const res = createMockResponse();
      const next = createMockNext();

      sitesService.createSite.mockResolvedValue(mockSiteAPI);

      await sitesController.createSite(req, res, next);

      expect(sitesService.createSite).toHaveBeenCalledWith(mockSiteAPI);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockSiteAPI);
    });

    it('calls next with error on failure', async () => {
      const req = createMockRequest({ body: mockSiteAPI });
      const res = createMockResponse();
      const next = createMockNext();
      const error = new Error('Validation error');

      sitesService.createSite.mockRejectedValue(error);

      await sitesController.createSite(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('updateSite', () => {
    it('updates site successfully', async () => {
      const req = createMockRequest({
        params: { id: 'site-1' },
        body: { name: 'Updated Name' },
      });
      const res = createMockResponse();
      const next = createMockNext();

      sitesService.updateSite.mockResolvedValue({ ...mockSiteAPI, name: 'Updated Name' });

      await sitesController.updateSite(req, res, next);

      expect(sitesService.updateSite).toHaveBeenCalledWith('site-1', { name: 'Updated Name' });
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: 'Updated Name' }));
    });

    it('returns 404 when site not found', async () => {
      const req = createMockRequest({
        params: { id: 'nonexistent' },
        body: { name: 'Updated Name' },
      });
      const res = createMockResponse();
      const next = createMockNext();

      sitesService.updateSite.mockResolvedValue(null);

      await sitesController.updateSite(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Site not found',
        })
      );
    });

    it('calls next with error on failure', async () => {
      const req = createMockRequest({
        params: { id: 'site-1' },
        body: { name: 'Updated Name' },
      });
      const res = createMockResponse();
      const next = createMockNext();
      const error = new Error('Service error');

      sitesService.updateSite.mockRejectedValue(error);

      await sitesController.updateSite(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteSite', () => {
    it('deletes site and returns 204', async () => {
      const req = createMockRequest({ params: { id: 'site-1' } });
      const res = createMockResponse();
      const next = createMockNext();

      sitesService.deleteSite.mockResolvedValue(true);

      await sitesController.deleteSite(req, res, next);

      expect(sitesService.deleteSite).toHaveBeenCalledWith('site-1');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('returns 404 when site not found', async () => {
      const req = createMockRequest({ params: { id: 'nonexistent' } });
      const res = createMockResponse();
      const next = createMockNext();

      sitesService.deleteSite.mockResolvedValue(false);

      await sitesController.deleteSite(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Site not found',
        })
      );
    });

    it('calls next with error on failure', async () => {
      const req = createMockRequest({ params: { id: 'site-1' } });
      const res = createMockResponse();
      const next = createMockNext();
      const error = new Error('Service error');

      sitesService.deleteSite.mockRejectedValue(error);

      await sitesController.deleteSite(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getSitesNearby', () => {
    it('returns nearby sites', async () => {
      const req = createMockRequest({
        query: { lat: '31.5', lng: '34.5', radius: '10' },
      });
      const res = createMockResponse();
      const next = createMockNext();

      sitesService.getSitesNearPoint.mockResolvedValue([mockSiteAPI]);

      await sitesController.getSitesNearby(req, res, next);

      expect(sitesService.getSitesNearPoint).toHaveBeenCalledWith(31.5, 34.5, 10);
      expect(res.json).toHaveBeenCalledWith([mockSiteAPI]);
    });

    it('uses default radius of 10km', async () => {
      const req = createMockRequest({
        query: { lat: '31.5', lng: '34.5' },
      });
      const res = createMockResponse();
      const next = createMockNext();

      sitesService.getSitesNearPoint.mockResolvedValue([mockSiteAPI]);

      await sitesController.getSitesNearby(req, res, next);

      expect(sitesService.getSitesNearPoint).toHaveBeenCalledWith(31.5, 34.5, 10);
    });

    it('returns 400 for missing lat', async () => {
      const req = createMockRequest({
        query: { lng: '34.5' },
      });
      const res = createMockResponse();
      const next = createMockNext();

      await sitesController.getSitesNearby(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Invalid parameters',
        })
      );
    });

    it('returns 400 for missing lng', async () => {
      const req = createMockRequest({
        query: { lat: '31.5' },
      });
      const res = createMockResponse();
      const next = createMockNext();

      await sitesController.getSitesNearby(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('returns 400 for invalid lat', async () => {
      const req = createMockRequest({
        query: { lat: 'invalid', lng: '34.5' },
      });
      const res = createMockResponse();
      const next = createMockNext();

      await sitesController.getSitesNearby(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('calls next with error on service failure', async () => {
      const req = createMockRequest({
        query: { lat: '31.5', lng: '34.5' },
      });
      const res = createMockResponse();
      const next = createMockNext();
      const error = new Error('Service error');

      sitesService.getSitesNearPoint.mockRejectedValue(error);

      await sitesController.getSitesNearby(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getSiteStatistics', () => {
    it('returns statistics', async () => {
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      const stats = {
        total: 45,
        byType: { mosque: 10, church: 5 },
        byStatus: { destroyed: 20, damaged: 15 },
      };

      sitesService.getSiteStatistics.mockResolvedValue(stats);

      await sitesController.getSiteStatistics(req, res, next);

      expect(sitesService.getSiteStatistics).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(stats);
    });

    it('calls next with error on failure', async () => {
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();
      const error = new Error('Service error');

      sitesService.getSiteStatistics.mockRejectedValue(error);

      await sitesController.getSiteStatistics(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
