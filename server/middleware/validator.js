/**
 * Request Validator Middleware
 *
 * Validates request bodies and parameters
 * Returns 400 Bad Request for invalid data
 */

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
      const requiredFields = ['name', 'type', 'coordinates', 'status'];
      const missingFields = requiredFields.filter((field) => !body[field]);

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
    const validTypes = [
      'mosque',
      'church',
      'archaeological_site',
      'museum',
      'library',
      'monument',
    ];
    if (body.type !== undefined && !validTypes.includes(body.type)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: `type must be one of: ${validTypes.join(', ')}`,
      });
    }

    // Validate status if provided
    const validStatuses = [
      'destroyed',
      'severely_damaged',
      'partially_damaged',
      'looted',
      'threatened',
    ];
    if (body.status !== undefined && !validStatuses.includes(body.status)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: `status must be one of: ${validStatuses.join(', ')}`,
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
        lat < -90 ||
        lat > 90 ||
        lng < -180 ||
        lng > 180
      ) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'coordinates must be valid [lat, lng] with lat between -90 and 90, lng between -180 and 180',
        });
      }
    }

    // Validate arrays if provided
    if (body.verifiedBy !== undefined && !Array.isArray(body.verifiedBy)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'verifiedBy must be an array',
      });
    }

    if (body.sources !== undefined && !Array.isArray(body.sources)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'sources must be an array',
      });
    }

    if (body.historicalEvents !== undefined && !Array.isArray(body.historicalEvents)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'historicalEvents must be an array',
      });
    }

    // Validate boolean fields if provided
    const booleanFields = ['unescoListed', 'isUnique', 'religiousSignificance', 'communityGatheringPlace'];
    for (const field of booleanFields) {
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
    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'page must be a positive integer',
      });
    }
  }

  if (pageSize !== undefined) {
    const pageSizeNum = parseInt(pageSize, 10);
    if (isNaN(pageSizeNum) || pageSizeNum < 1 || pageSizeNum > 100) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'pageSize must be between 1 and 100',
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

  if (isNaN(latNum) || latNum < -90 || latNum > 90) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'lat must be a number between -90 and 90',
    });
  }

  if (isNaN(lngNum) || lngNum < -180 || lngNum > 180) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'lng must be a number between -180 and 180',
    });
  }

  if (radius !== undefined) {
    const radiusNum = parseFloat(radius);
    if (isNaN(radiusNum) || radiusNum <= 0 || radiusNum > 1000) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'radius must be a number between 0 and 1000 km',
      });
    }
  }

  next();
}
