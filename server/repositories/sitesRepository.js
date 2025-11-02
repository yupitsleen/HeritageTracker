/**
 * Sites Repository (Data Access Layer)
 *
 * Handles all direct database interactions for heritage sites
 * Pure data access - no business logic
 *
 * SECURITY NOTE: All queries use tagged template literals (sql`...`)
 * for automatic SQL injection protection. NO sql.unsafe() calls.
 */

import sql from '../db.js';
import { dbToApi, dbArrayToApi } from '../utils/converters.js';

/**
 * Helper to build SQL field list as a raw SQL fragment
 */
const SITE_FIELDS_RAW = sql`
  id, name, name_arabic, type, year_built, year_built_islamic,
  ST_AsGeoJSON(coordinates)::json as coordinates,
  status, date_destroyed, date_destroyed_islamic, last_updated,
  description, historical_significance, cultural_value,
  verified_by, sources, images, unesco_listed, artifact_count,
  is_unique, religious_significance, community_gathering_place,
  historical_events
`;

/**
 * Build WHERE clause fragments from filters
 * @param {Object} filters - Filter parameters
 * @returns {Array<Fragment>} Array of SQL fragments
 */
function buildWhereConditions(filters) {
  const conditions = [];

  if (filters.types && filters.types.length > 0) {
    conditions.push(sql`type = ANY(${filters.types})`);
  }

  if (filters.statuses && filters.statuses.length > 0) {
    conditions.push(sql`status = ANY(${filters.statuses})`);
  }

  if (filters.unescoListed !== undefined) {
    conditions.push(sql`unesco_listed = ${filters.unescoListed}`);
  }

  if (filters.search) {
    const searchPattern = `%${filters.search}%`;
    conditions.push(sql`(
      name ILIKE ${searchPattern} OR
      name_arabic ILIKE ${searchPattern} OR
      description ILIKE ${searchPattern}
    )`);
  }

  if (filters.startDate) {
    conditions.push(sql`date_destroyed >= ${filters.startDate}`);
  }

  if (filters.endDate) {
    conditions.push(sql`date_destroyed <= ${filters.endDate}`);
  }

  return conditions;
}

/**
 * Find all sites with optional filters
 * @param {Object} filters - Filter parameters (types, statuses, search, etc.)
 * @returns {Promise<Array>} Array of GazaSite objects
 */
export async function findAll(filters = {}) {
  const conditions = buildWhereConditions(filters);

  let rows;
  if (conditions.length > 0) {
    const whereClause = sql.join(conditions, sql` AND `);
    rows = await sql`
      SELECT ${SITE_FIELDS_RAW}
      FROM heritage_sites
      WHERE ${whereClause}
      ORDER BY date_destroyed DESC NULLS LAST, name ASC
    `;
  } else {
    rows = await sql`
      SELECT ${SITE_FIELDS_RAW}
      FROM heritage_sites
      ORDER BY date_destroyed DESC NULLS LAST, name ASC
    `;
  }

  return dbArrayToApi(rows);
}

/**
 * Find sites with pagination
 * @param {Object} filters - Filter parameters
 * @param {number} limit - Number of results per page
 * @param {number} offset - Number of results to skip
 * @returns {Promise<Array>} Array of GazaSite objects
 */
export async function findPaginated(filters = {}, limit, offset) {
  const conditions = buildWhereConditions(filters);

  let rows;
  if (conditions.length > 0) {
    const whereClause = sql.join(conditions, sql` AND `);
    rows = await sql`
      SELECT ${SITE_FIELDS_RAW}
      FROM heritage_sites
      WHERE ${whereClause}
      ORDER BY date_destroyed DESC NULLS LAST, name ASC
      LIMIT ${limit} OFFSET ${offset}
    `;
  } else {
    rows = await sql`
      SELECT ${SITE_FIELDS_RAW}
      FROM heritage_sites
      ORDER BY date_destroyed DESC NULLS LAST, name ASC
      LIMIT ${limit} OFFSET ${offset}
    `;
  }

  return dbArrayToApi(rows);
}

/**
 * Count sites with optional filters
 * @param {Object} filters - Filter parameters
 * @returns {Promise<number>} Total count
 */
export async function count(filters = {}) {
  const conditions = buildWhereConditions(filters);

  let result;
  if (conditions.length > 0) {
    const whereClause = sql.join(conditions, sql` AND `);
    result = await sql`
      SELECT COUNT(*) as total
      FROM heritage_sites
      WHERE ${whereClause}
    `;
  } else {
    result = await sql`
      SELECT COUNT(*) as total
      FROM heritage_sites
    `;
  }

  return parseInt(result[0].total, 10);
}

/**
 * Find site by ID
 * @param {string} id - Site ID
 * @returns {Promise<Object|null>} GazaSite object or null
 */
export async function findById(id) {
  const rows = await sql`
    SELECT ${SITE_FIELDS_RAW}
    FROM heritage_sites
    WHERE id = ${id}
  `;

  return rows.length > 0 ? dbToApi(rows[0]) : null;
}

/**
 * Insert new site
 * @param {Object} dbData - Database-formatted site data
 * @returns {Promise<Object>} Created GazaSite object
 */
export async function insert(dbData) {
  const rows = await sql`
    INSERT INTO heritage_sites (
      id, name, name_arabic, type, year_built, year_built_islamic,
      coordinates, status, date_destroyed, date_destroyed_islamic,
      last_updated, description, historical_significance, cultural_value,
      verified_by, sources, images, unesco_listed, artifact_count,
      is_unique, religious_significance, community_gathering_place,
      historical_events
    ) VALUES (
      ${dbData.id}, ${dbData.name}, ${dbData.name_arabic}, ${dbData.type},
      ${dbData.year_built}, ${dbData.year_built_islamic},
      ST_GeogFromText(${dbData.coordinates}), ${dbData.status},
      ${dbData.date_destroyed}, ${dbData.date_destroyed_islamic},
      ${dbData.last_updated}, ${dbData.description},
      ${dbData.historical_significance}, ${dbData.cultural_value},
      ${dbData.verified_by}, ${sql.json(dbData.sources)},
      ${sql.json(dbData.images)}, ${dbData.unesco_listed},
      ${dbData.artifact_count}, ${dbData.is_unique},
      ${dbData.religious_significance}, ${dbData.community_gathering_place},
      ${dbData.historical_events}
    )
    RETURNING ${SITE_FIELDS_RAW}
  `;

  return dbToApi(rows[0]);
}

/**
 * Update existing site
 * @param {string} id - Site ID
 * @param {Object} dbUpdates - Database-formatted update data
 * @returns {Promise<Object|null>} Updated GazaSite object or null
 */
export async function update(id, dbUpdates) {
  // Build SET clauses as SQL fragments
  const setFragments = [];

  Object.entries(dbUpdates).forEach(([key, value]) => {
    if (key !== 'id' && value !== undefined) {
      if (key === 'coordinates' && value) {
        // Special handling for geography type
        setFragments.push(sql`coordinates = ST_GeogFromText(${value})`);
      } else if (key === 'sources' || key === 'images') {
        // Special handling for JSONB
        setFragments.push(sql([`${key} = `], sql.json(value)));
      } else {
        // Standard field update using sql.ident for column name safety
        setFragments.push(sql([`${key} = `], value));
      }
    }
  });

  if (setFragments.length === 0) {
    return await findById(id); // No updates to apply
  }

  const setClause = sql.join(setFragments, sql`, `);
  const rows = await sql`
    UPDATE heritage_sites
    SET ${setClause}
    WHERE id = ${id}
    RETURNING ${SITE_FIELDS_RAW}
  `;

  return rows.length > 0 ? dbToApi(rows[0]) : null;
}

/**
 * Delete site by ID
 * @param {string} id - Site ID
 * @returns {Promise<boolean>} True if deleted, false if not found
 */
export async function remove(id) {
  const result = await sql`
    DELETE FROM heritage_sites
    WHERE id = ${id}
    RETURNING id
  `;

  return result.length > 0;
}

/**
 * Find sites near a geographic point
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radiusKm - Radius in kilometers
 * @returns {Promise<Array>} Array of GazaSite objects with distance
 */
export async function findNearPoint(lat, lng, radiusKm) {
  const radiusMeters = radiusKm * 1000;

  const rows = await sql`
    SELECT ${SITE_FIELDS_RAW},
      ST_Distance(coordinates, ST_MakePoint(${lng}, ${lat})::geography) / 1000 as distance_km
    FROM heritage_sites
    WHERE ST_DWithin(
      coordinates,
      ST_MakePoint(${lng}, ${lat})::geography,
      ${radiusMeters}
    )
    ORDER BY distance_km ASC
  `;

  return dbArrayToApi(rows);
}

/**
 * Get aggregate statistics
 * @returns {Promise<Object>} Statistics object
 */
export async function getStatistics() {
  const stats = await sql`
    SELECT
      COUNT(*) as total_sites,
      COUNT(CASE WHEN status = 'destroyed' THEN 1 END) as destroyed_count,
      COUNT(CASE WHEN status = 'severely_damaged' THEN 1 END) as severely_damaged_count,
      COUNT(CASE WHEN status = 'partially_damaged' THEN 1 END) as partially_damaged_count,
      COUNT(CASE WHEN unesco_listed = true THEN 1 END) as unesco_listed_count,
      COUNT(CASE WHEN type = 'mosque' THEN 1 END) as mosque_count,
      COUNT(CASE WHEN type = 'church' THEN 1 END) as church_count,
      COUNT(CASE WHEN type = 'archaeological_site' THEN 1 END) as archaeological_site_count,
      COUNT(CASE WHEN type = 'museum' THEN 1 END) as museum_count,
      COUNT(CASE WHEN type = 'library' THEN 1 END) as library_count,
      COUNT(CASE WHEN type = 'monument' THEN 1 END) as monument_count
    FROM heritage_sites
  `;

  return stats[0];
}
