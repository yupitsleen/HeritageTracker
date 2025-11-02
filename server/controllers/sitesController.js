/**
 * Sites Controller (HTTP Request Handlers)
 *
 * Thin layer handling HTTP requests/responses
 * Delegates business logic to service layer
 */

import * as sitesService from '../services/sitesService.js';
import { extractFilters } from '../utils/converters.js';

/**
 * GET /api/sites
 * Get all sites with optional filtering
 */
export async function getAllSites(req, res, next) {
  try {
    const filters = extractFilters(req.query);
    const sites = await sitesService.getAllSites(filters);
    res.json(sites);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/sites/paginated
 * Get paginated sites
 */
export async function getPaginatedSites(req, res, next) {
  try {
    const filters = extractFilters(req.query);
    const result = await sitesService.getPaginatedSites(filters);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/sites/:id
 * Get site by ID
 */
export async function getSiteById(req, res, next) {
  try {
    const { id } = req.params;
    const site = await sitesService.getSiteById(id);

    if (!site) {
      return res.status(404).json({
        error: 'Site not found',
        message: `Site with ID ${id} does not exist`,
      });
    }

    res.json(site);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/sites
 * Create new site
 */
export async function createSite(req, res, next) {
  try {
    const siteData = req.body;
    const newSite = await sitesService.createSite(siteData);
    res.status(201).json(newSite);
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/sites/:id
 * Update existing site
 */
export async function updateSite(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedSite = await sitesService.updateSite(id, updates);

    if (!updatedSite) {
      return res.status(404).json({
        error: 'Site not found',
        message: `Site with ID ${id} does not exist`,
      });
    }

    res.json(updatedSite);
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/sites/:id
 * Delete site
 */
export async function deleteSite(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await sitesService.deleteSite(id);

    if (!deleted) {
      return res.status(404).json({
        error: 'Site not found',
        message: `Site with ID ${id} does not exist`,
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/sites/nearby
 * Get sites near a geographic point
 */
export async function getSitesNearby(req, res, next) {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    const radiusKm = parseFloat(req.query.radius || '10');

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({
        error: 'Invalid parameters',
        message: 'lat and lng query parameters are required and must be numbers',
      });
    }

    const sites = await sitesService.getSitesNearPoint(lat, lng, radiusKm);
    res.json(sites);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/sites/stats
 * Get site statistics
 */
export async function getSiteStatistics(req, res, next) {
  try {
    const stats = await sitesService.getSiteStatistics();
    res.json(stats);
  } catch (error) {
    next(error);
  }
}
