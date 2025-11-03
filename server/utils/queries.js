/**
 * SQL Query Constants
 *
 * Centralized SQL query fragments to maintain DRY principle
 * Single source of truth for field selections
 */

/**
 * All site fields for SELECT statements
 * Uses ST_AsGeoJSON to convert PostGIS geography to JSON format
 */
export const SITE_FIELDS = `
  id, name, name_arabic, type, year_built, year_built_islamic,
  ST_AsGeoJSON(coordinates)::json as coordinates,
  status, date_destroyed, date_destroyed_islamic, last_updated,
  description, historical_significance, cultural_value,
  verified_by, sources, images, unesco_listed, artifact_count,
  is_unique, religious_significance, community_gathering_place,
  historical_events
`;

/**
 * Insert/Update field names (without ST_AsGeoJSON wrapper)
 */
export const INSERT_FIELDS = [
  'id',
  'name',
  'name_arabic',
  'type',
  'year_built',
  'year_built_islamic',
  'coordinates',
  'status',
  'date_destroyed',
  'date_destroyed_islamic',
  'last_updated',
  'description',
  'historical_significance',
  'cultural_value',
  'verified_by',
  'sources',
  'images',
  'unesco_listed',
  'artifact_count',
  'is_unique',
  'religious_significance',
  'community_gathering_place',
  'historical_events',
];
