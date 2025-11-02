/**
 * Sites Repository (Data Access Layer)
 *
 * Handles all direct database interactions for heritage sites
 * Pure data access - no business logic
 */

import sql from '../db.js';
import { dbToApi, dbArrayToApi } from '../utils/converters.js';
import { SITE_FIELDS } from '../utils/queries.js';

/**
 * Find all sites with optional WHERE clause
 * @param {string} whereClause - SQL WHERE clause
 * @param {Array} params - Query parameters
 * @returns {Promise<Array>} Array of GazaSite objects
 */
export async function findAll(whereClause = '', params = []) {
  const query = `
    SELECT ${SITE_FIELDS}
    FROM heritage_sites
    ${whereClause}
    ORDER BY date_destroyed DESC NULLS LAST, name ASC
  `;

  const rows = await sql.unsafe(query, params);
  return dbArrayToApi(rows);
}

/**
 * Find sites with pagination
 * @param {string} whereClause - SQL WHERE clause
 * @param {Array} params - Query parameters
 * @param {number} limit - Number of results per page
 * @param {number} offset - Number of results to skip
 * @returns {Promise<Array>} Array of GazaSite objects
 */
export async function findPaginated(whereClause = '', params = [], limit, offset) {
  const query = `
    SELECT ${SITE_FIELDS}
    FROM heritage_sites
    ${whereClause}
    ORDER BY date_destroyed DESC NULLS LAST, name ASC
    LIMIT $${params.length + 1} OFFSET $${params.length + 2}
  `;

  const rows = await sql.unsafe(query, [...params, limit, offset]);
  return dbArrayToApi(rows);
}

/**
 * Count sites with optional WHERE clause
 * @param {string} whereClause - SQL WHERE clause
 * @param {Array} params - Query parameters
 * @returns {Promise<number>} Total count
 */
export async function count(whereClause = '', params = []) {
  const query = `
    SELECT COUNT(*) as total
    FROM heritage_sites
    ${whereClause}
  `;

  const result = await sql.unsafe(query, params);
  return parseInt(result[0].total, 10);
}

/**
 * Find site by ID
 * @param {string} id - Site ID
 * @returns {Promise<Object|null>} GazaSite object or null
 */
export async function findById(id) {
  const query = `SELECT ${SITE_FIELDS} FROM heritage_sites WHERE id = $1`;
  const rows = await sql.unsafe(query, [id]);

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
    RETURNING ${SITE_FIELDS}
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
  // Build SET clause dynamically
  const setFields = [];
  const values = [];
  let paramIndex = 1;

  Object.entries(dbUpdates).forEach(([key, value]) => {
    if (key !== 'id' && value !== undefined) {
      if (key === 'coordinates' && value) {
        setFields.push(`${key} = ST_GeogFromText($${paramIndex})`);
        values.push(value);
      } else if (key === 'sources' || key === 'images') {
        setFields.push(`${key} = $${paramIndex}::jsonb`);
        values.push(JSON.stringify(value));
      } else {
        setFields.push(`${key} = $${paramIndex}`);
        values.push(value);
      }
      paramIndex++;
    }
  });

  if (setFields.length === 0) {
    return await findById(id); // No updates to apply
  }

  const query = `
    UPDATE heritage_sites
    SET ${setFields.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING ${SITE_FIELDS}
  `;

  const rows = await sql.unsafe(query, [...values, id]);
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
  const query = `
    SELECT ${SITE_FIELDS},
      ST_Distance(coordinates, ST_MakePoint($2, $1)::geography) / 1000 as distance_km
    FROM heritage_sites
    WHERE ST_DWithin(
      coordinates,
      ST_MakePoint($2, $1)::geography,
      $3
    )
    ORDER BY distance_km ASC
  `;

  const rows = await sql.unsafe(query, [lat, lng, radiusKm * 1000]);
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
