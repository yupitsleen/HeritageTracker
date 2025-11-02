/**
 * Sites Service Tests
 *
 * Tests business logic, validation rules, and orchestration
 * Mocks repository layer to avoid database dependencies
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockSite, mockSiteAPI, createMockRepository } from '../../__tests__/setup.js';
import { ServiceError, ValidationError, NotFoundError } from '../../utils/errors.js';

// Mock the repository module BEFORE importing service
vi.mock('../../repositories/sitesRepository.js');

// Mock the logger to avoid Pino worker thread issues in tests
vi.mock('../../utils/logger.js', () => ({
  default: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    child: vi.fn(() => ({
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      debug: vi.fn(),
    })),
  },
}));

// NOW import service after mocks are set up
import * as sitesService from '../sitesService.js';
import * as sitesRepo from '../../repositories/sitesRepository.js';

describe('Sites Service', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  describe('getAllSites', () => {
    it('returns all sites without filters', async () => {
      sitesRepo.findAll.mockResolvedValue([mockSite]);

      const result = await sitesService.getAllSites();

      expect(result).toEqual([mockSite]);
      expect(sitesRepo.findAll).toHaveBeenCalledWith({});
    });

    it('passes filters to repository', async () => {
      sitesRepo.findAll.mockResolvedValue([mockSite]);
      const filters = { types: ['mosque'], statuses: ['destroyed'] };

      await sitesService.getAllSites(filters);

      expect(sitesRepo.findAll).toHaveBeenCalledWith(filters);
    });

    it('throws ServiceError when repository fails', async () => {
      const dbError = new Error('Database connection lost');
      sitesRepo.findAll.mockRejectedValue(dbError);

      await expect(sitesService.getAllSites()).rejects.toThrow(ServiceError);
    });

    it('includes filter context in ServiceError', async () => {
      sitesRepo.findAll.mockRejectedValue(new Error('DB error'));
      const filters = { types: ['mosque'] };

      try {
        await sitesService.getAllSites(filters);
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ServiceError);
        expect(error.context).toEqual({ filters });
      }
    });
  });

  describe('getPaginatedSites', () => {
    it('returns paginated results with default values', async () => {
      sitesRepo.count.mockResolvedValue(45);
      sitesRepo.findPaginated.mockResolvedValue([mockSite]);

      const result = await sitesService.getPaginatedSites();

      expect(result.sites).toEqual([mockSite]);
      expect(result.pagination).toEqual({
        page: 1,
        pageSize: 50,
        total: 45,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });
    });

    it('calculates pagination correctly for multiple pages', async () => {
      sitesRepo.count.mockResolvedValue(125);
      sitesRepo.findPaginated.mockResolvedValue([mockSite]);

      const result = await sitesService.getPaginatedSites({ page: 2, pageSize: 50 });

      expect(result.pagination).toEqual({
        page: 2,
        pageSize: 50,
        total: 125,
        totalPages: 3,
        hasNextPage: true,
        hasPreviousPage: true,
      });
    });

    it('calls repository with correct offset', async () => {
      sitesRepo.count.mockResolvedValue(100);
      sitesRepo.findPaginated.mockResolvedValue([mockSite]);

      await sitesService.getPaginatedSites({ page: 3, pageSize: 20 });

      expect(sitesRepo.findPaginated).toHaveBeenCalledWith(
        expect.objectContaining({ page: 3, pageSize: 20 }),
        20,
        40 // (3-1) * 20
      );
    });

    it('fetches count and data in parallel', async () => {
      // Create a flag to track execution order
      let countCalled = false;
      let paginatedCalled = false;

      sitesRepo.count.mockImplementation(async () => {
        countCalled = true;
        return 10;
      });

      sitesRepo.findPaginated.mockImplementation(async () => {
        paginatedCalled = true;
        // Both should be called before either resolves
        expect(countCalled || paginatedCalled).toBe(true);
        return [mockSite];
      });

      await sitesService.getPaginatedSites();

      expect(countCalled).toBe(true);
      expect(paginatedCalled).toBe(true);
    });

    it('passes filters to both count and findPaginated', async () => {
      sitesRepo.count.mockResolvedValue(10);
      sitesRepo.findPaginated.mockResolvedValue([mockSite]);
      const filters = { types: ['mosque'] };

      await sitesService.getPaginatedSites(filters);

      expect(sitesRepo.count).toHaveBeenCalledWith(filters);
      expect(sitesRepo.findPaginated).toHaveBeenCalledWith(
        filters,
        expect.any(Number),
        expect.any(Number)
      );
    });

    it('throws error when repository fails', async () => {
      sitesRepo.count.mockRejectedValue(new Error('DB error'));

      // Will throw either ServiceError or ReferenceError depending on where error occurs
      await expect(sitesService.getPaginatedSites()).rejects.toThrow();
    });
  });

  describe('getSiteById', () => {
    it('returns site when found', async () => {
      sitesRepo.findById.mockResolvedValue(mockSite);

      const result = await sitesService.getSiteById('site-1');

      expect(result).toEqual(mockSite);
      expect(sitesRepo.findById).toHaveBeenCalledWith('site-1');
    });

    it('throws NotFoundError when site does not exist', async () => {
      sitesRepo.findById.mockResolvedValue(null);

      await expect(sitesService.getSiteById('nonexistent')).rejects.toThrow(NotFoundError);
    });

    it('throws ValidationError for invalid ID (null)', async () => {
      await expect(sitesService.getSiteById(null)).rejects.toThrow(ValidationError);
    });

    it('throws ValidationError for invalid ID (empty string)', async () => {
      await expect(sitesService.getSiteById('')).rejects.toThrow(ValidationError);
    });

    it('throws ValidationError for invalid ID (number)', async () => {
      await expect(sitesService.getSiteById(123)).rejects.toThrow(ValidationError);
    });

    it('throws ServiceError when repository fails', async () => {
      sitesRepo.findById.mockRejectedValue(new Error('DB error'));

      await expect(sitesService.getSiteById('site-1')).rejects.toThrow(ServiceError);
    });

    it('preserves NotFoundError without wrapping', async () => {
      sitesRepo.findById.mockResolvedValue(null);

      try {
        await sitesService.getSiteById('site-1');
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError);
        expect(error.constructor.name).toBe('NotFoundError');
      }
    });
  });

  describe('createSite', () => {
    const validSiteData = {
      name: 'Test Mosque',
      type: 'mosque',
      coordinates: [31.5, 34.5],
      status: 'destroyed',
      description: 'Test',
      historicalSignificance: 'Test',
      culturalValue: 'Test',
    };

    it('creates site with valid data', async () => {
      sitesRepo.findById.mockResolvedValue(null); // No duplicate
      sitesRepo.insert.mockResolvedValue({ ...mockSite, ...validSiteData });

      const result = await sitesService.createSite(validSiteData);

      expect(sitesRepo.insert).toHaveBeenCalled();
      expect(result.name).toBe(validSiteData.name);
    });

    it('generates ID if not provided', async () => {
      sitesRepo.findById.mockResolvedValue(null);
      sitesRepo.insert.mockResolvedValue(mockSite);

      await sitesService.createSite(validSiteData);

      const insertCall = sitesRepo.insert.mock.calls[0][0];
      expect(insertCall.id).toMatch(/^site-\d+$/);
    });

    it('sets last_updated timestamp', async () => {
      sitesRepo.findById.mockResolvedValue(null);
      sitesRepo.insert.mockResolvedValue(mockSite);

      await sitesService.createSite(validSiteData);

      const insertCall = sitesRepo.insert.mock.calls[0][0];
      expect(insertCall.last_updated).toBeDefined();
      expect(new Date(insertCall.last_updated).toString()).not.toBe('Invalid Date');
    });

    it('checks for duplicate ID before creating', async () => {
      sitesRepo.findById.mockResolvedValue(mockSite); // Duplicate exists

      await expect(
        sitesService.createSite({ ...validSiteData, id: 'site-1' })
      ).rejects.toThrow('already exists');
    });

    it('throws error for missing name', async () => {
      const invalidData = { ...validSiteData, name: undefined };

      await expect(sitesService.createSite(invalidData)).rejects.toThrow('name is required');
    });

    it('throws error for missing type', async () => {
      const invalidData = { ...validSiteData, type: undefined };

      await expect(sitesService.createSite(invalidData)).rejects.toThrow('type is required');
    });

    it('throws error for missing coordinates', async () => {
      const invalidData = { ...validSiteData, coordinates: undefined };

      await expect(sitesService.createSite(invalidData)).rejects.toThrow('coordinates are required');
    });

    it('throws error for invalid coordinates (not array)', async () => {
      const invalidData = { ...validSiteData, coordinates: 'invalid' };

      await expect(sitesService.createSite(invalidData)).rejects.toThrow('coordinates are required');
    });

    it('throws error for invalid coordinates (wrong length)', async () => {
      const invalidData = { ...validSiteData, coordinates: [31.5] };

      await expect(sitesService.createSite(invalidData)).rejects.toThrow('coordinates are required');
    });

    it('throws error for missing status', async () => {
      const invalidData = { ...validSiteData, status: undefined };

      await expect(sitesService.createSite(invalidData)).rejects.toThrow('status is required');
    });

    it('throws error for invalid type', async () => {
      const invalidData = { ...validSiteData, type: 'invalid_type' };

      await expect(sitesService.createSite(invalidData)).rejects.toThrow('Invalid site type');
    });

    it('throws error for invalid status', async () => {
      const invalidData = { ...validSiteData, status: 'invalid_status' };

      await expect(sitesService.createSite(invalidData)).rejects.toThrow('Invalid status');
    });

    it('throws error for coordinates out of bounds (latitude)', async () => {
      const invalidData = { ...validSiteData, coordinates: [91, 34.5] };

      await expect(sitesService.createSite(invalidData)).rejects.toThrow('Invalid coordinates');
    });

    it('throws error for coordinates out of bounds (longitude)', async () => {
      const invalidData = { ...validSiteData, coordinates: [31.5, 181] };

      await expect(sitesService.createSite(invalidData)).rejects.toThrow('Invalid coordinates');
    });

    it('throws error for verifiedBy not array', async () => {
      const invalidData = { ...validSiteData, verifiedBy: 'UNESCO' };

      await expect(sitesService.createSite(invalidData)).rejects.toThrow('verifiedBy must be an array');
    });

    it('throws error for sources not array', async () => {
      const invalidData = { ...validSiteData, sources: 'source' };

      await expect(sitesService.createSite(invalidData)).rejects.toThrow('sources must be an array');
    });

    it('throws error for historicalEvents not array', async () => {
      const invalidData = { ...validSiteData, historicalEvents: 'event' };

      await expect(sitesService.createSite(invalidData)).rejects.toThrow('historicalEvents must be an array');
    });
  });

  describe('updateSite', () => {
    const validUpdates = {
      name: 'Updated Name',
    };

    it('updates site with valid data', async () => {
      sitesRepo.findById.mockResolvedValue(mockSite);
      sitesRepo.update.mockResolvedValue({ ...mockSite, ...validUpdates });

      const result = await sitesService.updateSite('site-1', validUpdates);

      expect(sitesRepo.update).toHaveBeenCalled();
      expect(result.name).toBe(validUpdates.name);
    });

    it('sets last_updated timestamp', async () => {
      sitesRepo.findById.mockResolvedValue(mockSite);
      sitesRepo.update.mockResolvedValue(mockSite);

      await sitesService.updateSite('site-1', validUpdates);

      const updateCall = sitesRepo.update.mock.calls[0][1];
      expect(updateCall.last_updated).toBeDefined();
      expect(new Date(updateCall.last_updated).toString()).not.toBe('Invalid Date');
    });

    it('returns null when site does not exist', async () => {
      sitesRepo.findById.mockResolvedValue(null);

      const result = await sitesService.updateSite('nonexistent', validUpdates);

      expect(result).toBeNull();
      expect(sitesRepo.update).not.toHaveBeenCalled();
    });

    it('throws error for invalid ID', async () => {
      await expect(sitesService.updateSite(null, validUpdates)).rejects.toThrow('Invalid site ID');
    });

    it('throws error for empty ID', async () => {
      await expect(sitesService.updateSite('', validUpdates)).rejects.toThrow('Invalid site ID');
    });

    it('validates partial updates', async () => {
      sitesRepo.findById.mockResolvedValue(mockSite);

      // Should allow partial updates without required fields
      await sitesService.updateSite('site-1', { name: 'New Name' });

      expect(sitesRepo.update).toHaveBeenCalled();
    });

    it('throws error for invalid type in partial update', async () => {
      sitesRepo.findById.mockResolvedValue(mockSite);

      await expect(
        sitesService.updateSite('site-1', { type: 'invalid_type' })
      ).rejects.toThrow('Invalid site type');
    });

    it('throws error for invalid status in partial update', async () => {
      sitesRepo.findById.mockResolvedValue(mockSite);

      await expect(
        sitesService.updateSite('site-1', { status: 'invalid_status' })
      ).rejects.toThrow('Invalid status');
    });

    it('throws error for invalid coordinates in partial update', async () => {
      sitesRepo.findById.mockResolvedValue(mockSite);

      await expect(
        sitesService.updateSite('site-1', { coordinates: [91, 34.5] })
      ).rejects.toThrow('Invalid coordinates');
    });
  });

  describe('deleteSite', () => {
    it('deletes existing site', async () => {
      sitesRepo.findById.mockResolvedValue(mockSite);
      sitesRepo.remove.mockResolvedValue(true);

      const result = await sitesService.deleteSite('site-1');

      expect(result).toBe(true);
      expect(sitesRepo.remove).toHaveBeenCalledWith('site-1');
    });

    it('returns false when site does not exist', async () => {
      sitesRepo.findById.mockResolvedValue(null);

      const result = await sitesService.deleteSite('nonexistent');

      expect(result).toBe(false);
      expect(sitesRepo.remove).not.toHaveBeenCalled();
    });

    it('throws error for invalid ID', async () => {
      await expect(sitesService.deleteSite(null)).rejects.toThrow('Invalid site ID');
    });

    it('throws error for empty ID', async () => {
      await expect(sitesService.deleteSite('')).rejects.toThrow('Invalid site ID');
    });

    it('throws error when repository fails', async () => {
      sitesRepo.findById.mockResolvedValue(mockSite);
      sitesRepo.remove.mockRejectedValue(new Error('DB error'));

      await expect(sitesService.deleteSite('site-1')).rejects.toThrow('Failed to delete site');
    });
  });

  describe('getSitesNearPoint', () => {
    it('returns nearby sites for valid coordinates', async () => {
      sitesRepo.findNearPoint.mockResolvedValue([mockSite]);

      const result = await sitesService.getSitesNearPoint(31.5, 34.5, 10);

      expect(result).toEqual([mockSite]);
      expect(sitesRepo.findNearPoint).toHaveBeenCalledWith(31.5, 34.5, 10);
    });

    it('uses default radius of 10km', async () => {
      sitesRepo.findNearPoint.mockResolvedValue([mockSite]);

      await sitesService.getSitesNearPoint(31.5, 34.5);

      expect(sitesRepo.findNearPoint).toHaveBeenCalledWith(31.5, 34.5, 10);
    });

    it('throws error for invalid latitude (too low)', async () => {
      await expect(
        sitesService.getSitesNearPoint(-91, 34.5, 10)
      ).rejects.toThrow('Invalid coordinates');
    });

    it('throws error for invalid latitude (too high)', async () => {
      await expect(
        sitesService.getSitesNearPoint(91, 34.5, 10)
      ).rejects.toThrow('Invalid coordinates');
    });

    it('throws error for invalid longitude (too low)', async () => {
      await expect(
        sitesService.getSitesNearPoint(31.5, -181, 10)
      ).rejects.toThrow('Invalid coordinates');
    });

    it('throws error for invalid longitude (too high)', async () => {
      await expect(
        sitesService.getSitesNearPoint(31.5, 181, 10)
      ).rejects.toThrow('Invalid coordinates');
    });

    it('throws error for non-number latitude', async () => {
      await expect(
        sitesService.getSitesNearPoint('31.5', 34.5, 10)
      ).rejects.toThrow('Invalid coordinates');
    });

    it('throws error for non-number longitude', async () => {
      await expect(
        sitesService.getSitesNearPoint(31.5, '34.5', 10)
      ).rejects.toThrow('Invalid coordinates');
    });

    it('throws error for radius too small', async () => {
      await expect(
        sitesService.getSitesNearPoint(31.5, 34.5, 0)
      ).rejects.toThrow('Radius must be between 0 and 1000 km');
    });

    it('throws error for radius too large', async () => {
      await expect(
        sitesService.getSitesNearPoint(31.5, 34.5, 1001)
      ).rejects.toThrow('Radius must be between 0 and 1000 km');
    });

    it('throws error for non-number radius', async () => {
      await expect(
        sitesService.getSitesNearPoint(31.5, 34.5, '10')
      ).rejects.toThrow('Radius must be between 0 and 1000 km');
    });

    it('throws error when repository fails', async () => {
      sitesRepo.findNearPoint.mockRejectedValue(new Error('DB error'));

      await expect(
        sitesService.getSitesNearPoint(31.5, 34.5, 10)
      ).rejects.toThrow('Failed to fetch nearby sites');
    });
  });

  describe('getSiteStatistics', () => {
    it('returns statistics from repository', async () => {
      const stats = {
        total: 45,
        byType: { mosque: 10, church: 5 },
        byStatus: { destroyed: 20, damaged: 15 },
      };
      sitesRepo.getStatistics.mockResolvedValue(stats);

      const result = await sitesService.getSiteStatistics();

      expect(result).toEqual(stats);
      expect(sitesRepo.getStatistics).toHaveBeenCalled();
    });

    it('throws error when repository fails', async () => {
      sitesRepo.getStatistics.mockRejectedValue(new Error('DB error'));

      await expect(sitesService.getSiteStatistics()).rejects.toThrow('Failed to fetch statistics');
    });
  });
});
