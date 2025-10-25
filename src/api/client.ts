/**
 * Base HTTP Client for Heritage Tracker API
 *
 * Provides centralized fetch wrapper with:
 * - Environment-based URL configuration
 * - Standard error handling
 * - Request/response interceptors
 * - Type-safe responses
 */

import { isApiError } from './types';

/**
 * Get API base URL from environment variables
 */
const getApiUrl = (): string => {
  const url = import.meta.env.VITE_API_URL;
  if (!url) {
    console.warn('VITE_API_URL not set, using default localhost:5000');
    return 'http://localhost:5000/api';
  }
  return url;
};

/**
 * Check if mock API should be used
 */
export const useMockApi = (): boolean => {
  return import.meta.env.VITE_USE_MOCK_API === 'true';
};

/**
 * Custom error class for API errors
 */
export class ApiClientError extends Error {
  statusCode?: number;
  errorCode?: string;
  details?: Record<string, unknown>;

  constructor(
    message: string,
    statusCode?: number,
    errorCode?: string,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
  }
}

/**
 * HTTP client configuration
 */
interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | string[]>;
}

/**
 * Build URL with query parameters
 */
function buildUrl(endpoint: string, params?: Record<string, string | number | boolean | string[]>): string {
  const baseUrl = getApiUrl();
  const url = new URL(endpoint, baseUrl);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => url.searchParams.append(key, String(v)));
      } else if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

/**
 * Handle API response and errors
 */
async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');

  if (!response.ok) {
    if (isJson) {
      const errorData = await response.json();
      if (isApiError(errorData)) {
        throw new ApiClientError(
          errorData.error.message,
          response.status,
          errorData.error.code,
          errorData.error.details
        );
      }
    }
    throw new ApiClientError(
      `HTTP ${response.status}: ${response.statusText}`,
      response.status
    );
  }

  if (!isJson) {
    throw new ApiClientError('Expected JSON response from API', response.status);
  }

  const data = await response.json();
  return data;
}

/**
 * Base HTTP client methods
 */
export const apiClient = {
  /**
   * GET request
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const url = buildUrl(endpoint, config?.params);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
      ...config,
    });
    return handleResponse<T>(response);
  },

  /**
   * POST request
   */
  async post<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    const url = buildUrl(endpoint, config?.params);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      ...config,
    });
    return handleResponse<T>(response);
  },

  /**
   * PUT request
   */
  async put<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    const url = buildUrl(endpoint, config?.params);
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      ...config,
    });
    return handleResponse<T>(response);
  },

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const url = buildUrl(endpoint, config?.params);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
      ...config,
    });
    return handleResponse<T>(response);
  },
};
