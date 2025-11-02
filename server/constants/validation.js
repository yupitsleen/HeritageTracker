/**
 * Validation Constants
 *
 * Centralized validation rules and constants
 * Single source of truth for valid site types, statuses, and validation rules
 */

/**
 * Valid heritage site types
 */
export const VALID_TYPES = [
  'mosque',
  'church',
  'archaeological_site',
  'museum',
  'library',
  'monument',
];

/**
 * Valid site status values
 */
export const VALID_STATUSES = [
  'destroyed',
  'severely_damaged',
  'partially_damaged',
  'looted',
  'threatened',
];

/**
 * Coordinate validation bounds
 */
export const COORDINATE_BOUNDS = {
  LAT_MIN: -90,
  LAT_MAX: 90,
  LNG_MIN: -180,
  LNG_MAX: 180,
};

/**
 * Pagination limits
 */
export const PAGINATION = {
  MIN_PAGE: 1,
  MIN_PAGE_SIZE: 1,
  MAX_PAGE_SIZE: 100,
};

/**
 * Geospatial query limits
 */
export const GEOSPATIAL = {
  MIN_RADIUS_KM: 0,
  MAX_RADIUS_KM: 1000,
};

/**
 * Required fields for site creation
 */
export const REQUIRED_FIELDS = ['name', 'type', 'coordinates', 'status'];

/**
 * Boolean field names for validation
 */
export const BOOLEAN_FIELDS = [
  'unescoListed',
  'isUnique',
  'religiousSignificance',
  'communityGatheringPlace',
];

/**
 * Array field names for validation
 */
export const ARRAY_FIELDS = ['verifiedBy', 'sources', 'historicalEvents'];
