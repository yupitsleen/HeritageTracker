/**
 * Sites Service (Business Logic Layer)
 *
 * Contains business rules, validation, and orchestration
 * Calls repository layer for data access
 */

import * as sitesRepo from '../repositories/sitesRepository.js';
import { apiToDb } from '../utils/converters.js';
import { VALID_TYPES, VALID_STATUSES, COORDINATE_BOUNDS } from '../constants/validation.js';
import { ServiceError, ValidationError, NotFoundError, DatabaseError } from '../utils/errors.js';

/**
 * Get all sites with optional filtering
 * @param {Object} filters - Filter parameters
 * @returns {Promise<Array>} Array of GazaSite objects
 */
export async function getAllSites(filters = {}) {
  try {
    // Repository now handles filter building internally
    return await sitesRepo.findAll(filters);
  } catch (error) {
    throw new ServiceError('getAllSites', error, { filters });
  }
}

/**
 * Get paginated sites
 * @param {Object} filters - Filter parameters (including page and pageSize)
 * @returns {Promise<Object>} { sites: Array, pagination: Object }
 */
export async function getPaginatedSites(filters = {}) {
  try {
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 50;
    const offset = (page - 1) * pageSize;

    // Get total count and data in parallel
    // Repository now handles filter building internally
    const [total, sites] = await Promise.all([
      sitesRepo.count(filters),
      sitesRepo.findPaginated(filters, pageSize, offset),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return {
      sites,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  } catch (error) {
    throw new ServiceError('getPaginatedSites', error, { filters, page, pageSize });
  }
}

/**
 * Get site by ID
 * @param {string} id - Site ID
 * @returns {Promise<Object|null>} GazaSite object or null
 */
export async function getSiteById(id) {
  try {
    // Business rule: validate ID format
    if (!id || typeof id !== 'string') {
      throw new ValidationError('getSiteById', 'Invalid site ID', { id });
    }

    const site = await sitesRepo.findById(id);

    if (!site) {
      throw new NotFoundError('getSiteById', 'Site', id);
    }

    return site;
  } catch (error) {
    // Re-throw custom errors as-is
    if (error instanceof ValidationError || error instanceof NotFoundError) {
      throw error;
    }
    throw new ServiceError('getSiteById', error, { id });
  }
}

/**
 * Create new site
 * @param {Object} siteData - GazaSite object
 * @returns {Promise<Object>} Created GazaSite object
 */
export async function createSite(siteData) {
  try {
    // Business rule: validate required fields
    validateSiteData(siteData);

    // Business rule: check for duplicate ID
    if (siteData.id) {
      const existing = await sitesRepo.findById(siteData.id);
      if (existing) {
        throw new Error(`Site with ID ${siteData.id} already exists`);
      }
    }

    const dbData = apiToDb(siteData);

    // Business rule: generate ID if not provided
    if (!dbData.id) {
      dbData.id = `site-${Date.now()}`;
    }

    // Business rule: set last_updated timestamp
    dbData.last_updated = new Date().toISOString();

    return await sitesRepo.insert(dbData);
  } catch (error) {
    throw new Error(`Failed to create site: ${error.message}`);
  }
}

/**
 * Update existing site
 * @param {string} id - Site ID
 * @param {Object} updates - Partial GazaSite object with updates
 * @returns {Promise<Object|null>} Updated GazaSite object or null
 */
export async function updateSite(id, updates) {
  try {
    // Business rule: validate ID
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid site ID');
    }

    // Business rule: check if site exists
    const existingSite = await sitesRepo.findById(id);
    if (!existingSite) {
      return null;
    }

    // Business rule: validate update data
    validateSiteData(updates, true); // partial validation

    const dbUpdates = apiToDb(updates);

    // Business rule: always update last_updated timestamp
    dbUpdates.last_updated = new Date().toISOString();

    return await sitesRepo.update(id, dbUpdates);
  } catch (error) {
    throw new Error(`Failed to update site: ${error.message}`);
  }
}

/**
 * Delete site by ID
 * @param {string} id - Site ID
 * @returns {Promise<boolean>} True if deleted, false if not found
 */
export async function deleteSite(id) {
  try {
    // Business rule: validate ID
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid site ID');
    }

    // Business rule: check if site exists
    const existingSite = await sitesRepo.findById(id);
    if (!existingSite) {
      return false;
    }

    return await sitesRepo.remove(id);
  } catch (error) {
    throw new Error(`Failed to delete site: ${error.message}`);
  }
}

/**
 * Get sites near a geographic point
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radiusKm - Radius in kilometers (default: 10)
 * @returns {Promise<Array>} Array of GazaSite objects with distance
 */
export async function getSitesNearPoint(lat, lng, radiusKm = 10) {
  try {
    // Business rule: validate coordinates
    if (
      typeof lat !== 'number' ||
      typeof lng !== 'number' ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      throw new Error('Invalid coordinates');
    }

    // Business rule: validate radius
    if (typeof radiusKm !== 'number' || radiusKm <= 0 || radiusKm > 1000) {
      throw new Error('Radius must be between 0 and 1000 km');
    }

    return await sitesRepo.findNearPoint(lat, lng, radiusKm);
  } catch (error) {
    throw new Error(`Failed to fetch nearby sites: ${error.message}`);
  }
}

/**
 * Get statistics about heritage sites
 * @returns {Promise<Object>} Statistics object
 */
export async function getSiteStatistics() {
  try {
    return await sitesRepo.getStatistics();
  } catch (error) {
    throw new Error(`Failed to fetch statistics: ${error.message}`);
  }
}

/**
 * Validate site data (business rules)
 * @param {Object} siteData - Site data to validate
 * @param {boolean} partial - If true, only validate provided fields
 * @throws {Error} If validation fails
 */
function validateSiteData(siteData, partial = false) {
  if (!partial) {
    // Required fields for new sites
    if (!siteData.name || typeof siteData.name !== 'string') {
      throw new Error('Site name is required');
    }

    if (!siteData.type || typeof siteData.type !== 'string') {
      throw new Error('Site type is required');
    }

    if (!siteData.coordinates || !Array.isArray(siteData.coordinates) || siteData.coordinates.length !== 2) {
      throw new Error('Valid coordinates are required [lat, lng]');
    }

    if (!siteData.status || typeof siteData.status !== 'string') {
      throw new Error('Site status is required');
    }
  }

  // Validate coordinates if provided
  if (siteData.coordinates) {
    const [lat, lng] = siteData.coordinates;
    if (
      typeof lat !== 'number' ||
      typeof lng !== 'number' ||
      lat < COORDINATE_BOUNDS.LAT_MIN ||
      lat > COORDINATE_BOUNDS.LAT_MAX ||
      lng < COORDINATE_BOUNDS.LNG_MIN ||
      lng > COORDINATE_BOUNDS.LNG_MAX
    ) {
      throw new Error(`Invalid coordinates: must be [lat, lng] with lat between ${COORDINATE_BOUNDS.LAT_MIN} and ${COORDINATE_BOUNDS.LAT_MAX}, lng between ${COORDINATE_BOUNDS.LNG_MIN} and ${COORDINATE_BOUNDS.LNG_MAX}`);
    }
  }

  // Validate type if provided
  if (siteData.type && !VALID_TYPES.includes(siteData.type)) {
    throw new Error(`Invalid site type. Must be one of: ${VALID_TYPES.join(', ')}`);
  }

  // Validate status if provided
  if (siteData.status && !VALID_STATUSES.includes(siteData.status)) {
    throw new Error(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  // Validate arrays if provided
  if (siteData.verifiedBy && !Array.isArray(siteData.verifiedBy)) {
    throw new Error('verifiedBy must be an array');
  }

  if (siteData.sources && !Array.isArray(siteData.sources)) {
    throw new Error('sources must be an array');
  }

  if (siteData.historicalEvents && !Array.isArray(siteData.historicalEvents)) {
    throw new Error('historicalEvents must be an array');
  }
}
