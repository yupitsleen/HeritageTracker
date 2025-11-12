/**
 * API Configuration Constants
 *
 * Centralized configuration for all API-related behavior
 * across mock, local backend, and cloud adapters.
 */

/**
 * Simulated network delay for mock API responses (in milliseconds)
 * Used to simulate realistic network latency during development
 *
 * @default 800ms - Typical 3G/4G response time
 */
export const API_MOCK_DELAY_MS = 800;

/**
 * Maximum timeout for API requests (in milliseconds)
 *
 * @default 30000ms (30 seconds)
 */
export const API_TIMEOUT_MS = 30000;

/**
 * Default page size for paginated API requests
 *
 * @default 50 items per page
 */
export const API_DEFAULT_PAGE_SIZE = 50;

/**
 * Maximum page size for paginated API requests
 * Prevents excessive data transfer
 *
 * @default 100 items per page
 */
export const API_MAX_PAGE_SIZE = 100;
