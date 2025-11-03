/**
 * Request Validator Middleware
 *
 * Validates request bodies and parameters
 * Returns 400 Bad Request for invalid data
 */

import {
  VALID_TYPES,
  VALID_STATUSES,
  COORDINATE_BOUNDS,
  PAGINATION,
  GEOSPATIAL,
  REQUIRED_FIELDS,
  BOOLEAN_FIELDS,
  ARRAY_FIELDS,
} from '../constants/validation.js';

/**
 * Validate site creation/update request body
 * @param {boolean} partial - If true, only validate provided fields (for PATCH)
 */
export function validateSiteBody(partial = false) {
  return (req, res, next) => {
    const { body } = req;

    // Check if body exists
    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Request body is required',
      });
    }

    // Required fields for POST (full validation)
    if (!partial) {
      const missingFields = REQUIRED_FIELDS.filter((field) => !body[field]);

      if (missingFields.length > 0) {
        return res.status(400).json({
          error: 'Validation Error',
          message: `Missing required fields: ${missingFields.join(', ')}`,
        });
      }
    }

    // Validate name if provided
    if (body.name !== undefined && (typeof body.name !== 'string' || body.name.trim().length === 0)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'name must be a non-empty string',
      });
    }

    // Validate type if provided
    if (body.type !== undefined && !VALID_TYPES.includes(body.type)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: `type must be one of: ${VALID_TYPES.join(', ')}`,
      });
    }

    // Validate status if provided
    if (body.status !== undefined && !VALID_STATUSES.includes(body.status)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: `status must be one of: ${VALID_STATUSES.join(', ')}`,
      });
    }

    // Validate coordinates if provided
    if (body.coordinates !== undefined) {
      if (!Array.isArray(body.coordinates) || body.coordinates.length !== 2) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'coordinates must be an array of [lat, lng]',
        });
      }

      const [lat, lng] = body.coordinates;
      if (
        typeof lat !== 'number' ||
        typeof lng !== 'number' ||
        lat < COORDINATE_BOUNDS.LAT_MIN ||
        lat > COORDINATE_BOUNDS.LAT_MAX ||
        lng < COORDINATE_BOUNDS.LNG_MIN ||
        lng > COORDINATE_BOUNDS.LNG_MAX
      ) {
        return res.status(400).json({
          error: 'Validation Error',
          message: `coordinates must be valid [lat, lng] with lat between ${COORDINATE_BOUNDS.LAT_MIN} and ${COORDINATE_BOUNDS.LAT_MAX}, lng between ${COORDINATE_BOUNDS.LNG_MIN} and ${COORDINATE_BOUNDS.LNG_MAX}`,
        });
      }
    }

    // Validate arrays if provided
    for (const field of ARRAY_FIELDS) {
      if (body[field] !== undefined && !Array.isArray(body[field])) {
        return res.status(400).json({
          error: 'Validation Error',
          message: `${field} must be an array`,
        });
      }
    }

    // Validate boolean fields if provided
    for (const field of BOOLEAN_FIELDS) {
      if (body[field] !== undefined && typeof body[field] !== 'boolean') {
        return res.status(400).json({
          error: 'Validation Error',
          message: `${field} must be a boolean`,
        });
      }
    }

    // Validate number fields if provided
    if (body.artifactCount !== undefined && (typeof body.artifactCount !== 'number' || body.artifactCount < 0)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'artifactCount must be a non-negative number',
      });
    }

    next();
  };
}

/**
 * Validate site ID parameter
 */
export function validateSiteId(req, res, next) {
  const { id } = req.params;

  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Valid site ID is required',
    });
  }

  next();
}

/**
 * Validate pagination query parameters
 */
export function validatePagination(req, res, next) {
  const { page, pageSize } = req.query;

  if (page !== undefined) {
    const pageNum = parseInt(page, 10);
    if (isNaN(pageNum) || pageNum < PAGINATION.MIN_PAGE) {
      return res.status(400).json({
        error: 'Validation Error',
        message: `page must be at least ${PAGINATION.MIN_PAGE}`,
      });
    }
  }

  if (pageSize !== undefined) {
    const pageSizeNum = parseInt(pageSize, 10);
    if (isNaN(pageSizeNum) || pageSizeNum < PAGINATION.MIN_PAGE_SIZE || pageSizeNum > PAGINATION.MAX_PAGE_SIZE) {
      return res.status(400).json({
        error: 'Validation Error',
        message: `pageSize must be between ${PAGINATION.MIN_PAGE_SIZE} and ${PAGINATION.MAX_PAGE_SIZE}`,
      });
    }
  }

  next();
}

/**
 * Validate nearby query parameters
 */
export function validateNearbyParams(req, res, next) {
  const { lat, lng, radius } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'lat and lng query parameters are required',
    });
  }

  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);

  if (isNaN(latNum) || latNum < COORDINATE_BOUNDS.LAT_MIN || latNum > COORDINATE_BOUNDS.LAT_MAX) {
    return res.status(400).json({
      error: 'Validation Error',
      message: `lat must be a number between ${COORDINATE_BOUNDS.LAT_MIN} and ${COORDINATE_BOUNDS.LAT_MAX}`,
    });
  }

  if (isNaN(lngNum) || lngNum < COORDINATE_BOUNDS.LNG_MIN || lngNum > COORDINATE_BOUNDS.LNG_MAX) {
    return res.status(400).json({
      error: 'Validation Error',
      message: `lng must be a number between ${COORDINATE_BOUNDS.LNG_MIN} and ${COORDINATE_BOUNDS.LNG_MAX}`,
    });
  }

  if (radius !== undefined) {
    const radiusNum = parseFloat(radius);
    if (isNaN(radiusNum) || radiusNum <= GEOSPATIAL.MIN_RADIUS_KM || radiusNum > GEOSPATIAL.MAX_RADIUS_KM) {
      return res.status(400).json({
        error: 'Validation Error',
        message: `radius must be a number between ${GEOSPATIAL.MIN_RADIUS_KM} and ${GEOSPATIAL.MAX_RADIUS_KM} km`,
      });
    }
  }

  next();
}
