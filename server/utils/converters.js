/**
 * Data Converters
 *
 * Transform between database format and API format
 * Handles PostGIS geography types, JSON fields, and date formatting
 */

/**
 * Convert database row to API GazaSite format
 * @param {Object} row - Database row
 * @returns {Object} GazaSite object
 */
export function dbToApi(row) {
  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    nameArabic: row.name_arabic,
    type: row.type,
    yearBuilt: row.year_built,
    yearBuiltIslamic: row.year_built_islamic,
    coordinates: row.coordinates
      ? [row.coordinates.coordinates[1], row.coordinates.coordinates[0]] // PostGIS returns [lng, lat], we want [lat, lng]
      : null,
    status: row.status,
    dateDestroyed: row.date_destroyed,
    dateDestroyedIslamic: row.date_destroyed_islamic,
    lastUpdated: row.last_updated,
    description: row.description,
    historicalSignificance: row.historical_significance,
    culturalValue: row.cultural_value,
    verifiedBy: row.verified_by || [],
    sources: row.sources || [],
    images: row.images || {},
    unescoListed: row.unesco_listed,
    artifactCount: row.artifact_count,
    isUnique: row.is_unique,
    religiousSignificance: row.religious_significance,
    communityGatheringPlace: row.community_gathering_place,
    historicalEvents: row.historical_events || [],
  };
}

/**
 * Convert API GazaSite format to database format
 * @param {Object} site - GazaSite object
 * @returns {Object} Database row object
 */
export function apiToDb(site) {
  if (!site) return null;

  const dbRow = {
    id: site.id,
    name: site.name,
    name_arabic: site.nameArabic,
    type: site.type,
    year_built: site.yearBuilt,
    year_built_islamic: site.yearBuiltIslamic,
    // PostGIS expects POINT(lng lat)
    coordinates: site.coordinates
      ? `POINT(${site.coordinates[1]} ${site.coordinates[0]})`
      : null,
    status: site.status,
    date_destroyed: site.dateDestroyed,
    date_destroyed_islamic: site.dateDestroyedIslamic,
    last_updated: site.lastUpdated || new Date().toISOString(),
    description: site.description,
    historical_significance: site.historicalSignificance,
    cultural_value: site.culturalValue,
    verified_by: site.verifiedBy || [],
    sources: site.sources || [],
    images: site.images || {},
    unesco_listed: site.unescoListed,
    artifact_count: site.artifactCount,
    is_unique: site.isUnique,
    religious_significance: site.religiousSignificance,
    community_gathering_place: site.communityGatheringPlace,
    historical_events: site.historicalEvents || [],
  };

  // Remove undefined fields
  Object.keys(dbRow).forEach((key) => {
    if (dbRow[key] === undefined) {
      delete dbRow[key];
    }
  });

  return dbRow;
}

/**
 * Convert array of database rows to API format
 * @param {Array} rows - Array of database rows
 * @returns {Array} Array of GazaSite objects
 */
export function dbArrayToApi(rows) {
  return rows.map(dbToApi);
}

/**
 * Extract filter parameters from query string
 * @param {Object} query - Express request query object
 * @returns {Object} Filter parameters
 */
export function extractFilters(query) {
  const filters = {};

  // Type filter (array)
  if (query.types) {
    filters.types = Array.isArray(query.types) ? query.types : [query.types];
  }

  // Status filter (array)
  if (query.statuses) {
    filters.statuses = Array.isArray(query.statuses)
      ? query.statuses
      : [query.statuses];
  }

  // UNESCO filter (boolean)
  if (query.unescoListed !== undefined) {
    filters.unescoListed = query.unescoListed === 'true';
  }

  // Date range filters
  if (query.startDate) {
    filters.startDate = query.startDate;
  }
  if (query.endDate) {
    filters.endDate = query.endDate;
  }

  // Search filter
  if (query.search) {
    filters.search = query.search;
  }

  // Pagination
  if (query.page) {
    filters.page = parseInt(query.page, 10);
  }
  if (query.pageSize) {
    filters.pageSize = parseInt(query.pageSize, 10);
  }

  return filters;
}

/**
 * Build WHERE clause for SQL query based on filters
 * @param {Object} filters - Filter parameters
 * @returns {Object} { whereClause: string, params: Array }
 */
export function buildWhereClause(filters) {
  const conditions = [];
  const params = [];
  let paramIndex = 1;

  if (filters.types && filters.types.length > 0) {
    conditions.push(`type = ANY($${paramIndex})`);
    params.push(filters.types);
    paramIndex++;
  }

  if (filters.statuses && filters.statuses.length > 0) {
    conditions.push(`status = ANY($${paramIndex})`);
    params.push(filters.statuses);
    paramIndex++;
  }

  if (filters.unescoListed !== undefined) {
    conditions.push(`unesco_listed = $${paramIndex}`);
    params.push(filters.unescoListed);
    paramIndex++;
  }

  if (filters.search) {
    conditions.push(
      `(name ILIKE $${paramIndex} OR name_arabic ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`
    );
    params.push(`%${filters.search}%`);
    paramIndex++;
  }

  // Date range filtering (handles BC/BCE dates)
  if (filters.startDate) {
    conditions.push(`date_destroyed >= $${paramIndex}`);
    params.push(filters.startDate);
    paramIndex++;
  }

  if (filters.endDate) {
    conditions.push(`date_destroyed <= $${paramIndex}`);
    params.push(filters.endDate);
    paramIndex++;
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  return { whereClause, params };
}
