/**
 * URL Query Parameter Builder Utility
 *
 * Provides type-safe, reusable query parameter construction
 * for API requests.
 */

/**
 * Supported query parameter value types
 */
type QueryParam = string | number | boolean | string[] | number[] | undefined | null;

/**
 * Build URL query parameters from an object
 *
 * Automatically handles:
 * - Arrays (appends multiple values with same key)
 * - Primitives (converts to string)
 * - Undefined/null (skips)
 *
 * @param params - Object with query parameters
 * @returns URLSearchParams object ready for use in fetch
 *
 * @example
 * const query = buildQueryParams({
 *   types: ['mosque', 'church'],
 *   search: 'Gaza',
 *   page: 1,
 *   active: true,
 *   unused: undefined,
 * });
 * // Result: "types=mosque&types=church&search=Gaza&page=1&active=true"
 */
export function buildQueryParams(params: Record<string, QueryParam>): URLSearchParams {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    // Skip undefined and null values
    if (value === undefined || value === null) {
      return;
    }

    // Handle arrays - append each value with the same key
    if (Array.isArray(value)) {
      value.forEach(item => {
        if (item !== undefined && item !== null) {
          query.append(key, String(item));
        }
      });
    } else {
      // Handle primitives - convert to string
      query.append(key, String(value));
    }
  });

  return query;
}

/**
 * Build query string from parameters object
 *
 * Convenience wrapper around buildQueryParams that returns a string
 *
 * @param params - Object with query parameters
 * @returns Query string (without leading ?)
 *
 * @example
 * const queryString = buildQueryString({ page: 1, search: 'test' });
 * // Result: "page=1&search=test"
 */
export function buildQueryString(params: Record<string, QueryParam>): string {
  return buildQueryParams(params).toString();
}

/**
 * Build full URL with query parameters
 *
 * @param baseUrl - Base URL
 * @param params - Object with query parameters
 * @returns Full URL with query string
 *
 * @example
 * const url = buildUrl('https://api.example.com/sites', { page: 1 });
 * // Result: "https://api.example.com/sites?page=1"
 */
export function buildUrl(baseUrl: string, params: Record<string, QueryParam>): string {
  const queryString = buildQueryString(params);
  if (!queryString) {
    return baseUrl;
  }
  return `${baseUrl}?${queryString}`;
}

/**
 * Parse query string into object
 *
 * Useful for reading URL parameters or converting URLSearchParams back to object
 *
 * @param queryString - Query string (with or without leading ?)
 * @returns Object with parsed parameters
 *
 * @example
 * const params = parseQueryString('?page=1&types=mosque&types=church');
 * // Result: { page: '1', types: ['mosque', 'church'] }
 */
export function parseQueryString(queryString: string): Record<string, string | string[]> {
  const params: Record<string, string | string[]> = {};
  const urlParams = new URLSearchParams(queryString);

  urlParams.forEach((value, key) => {
    const existing = params[key];

    if (existing) {
      // Key already exists - convert to array or append to existing array
      if (Array.isArray(existing)) {
        existing.push(value);
      } else {
        params[key] = [existing, value];
      }
    } else {
      params[key] = value;
    }
  });

  return params;
}
