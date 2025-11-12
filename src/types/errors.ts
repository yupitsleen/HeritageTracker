/**
 * Error Types for Heritage Tracker
 *
 * Provides type-safe error handling across the application.
 * All async operations should throw or return these typed errors.
 */

/**
 * Base interface for all application errors
 *
 * @example
 * ```typescript
 * const error: ApiError = {
 *   message: 'Failed to fetch sites',
 *   code: 'NETWORK_ERROR',
 *   statusCode: 500
 * };
 * ```
 */
export interface ApiError {
  /** Human-readable error message */
  message: string;
  /** Machine-readable error code for programmatic handling */
  code?: string;
  /** HTTP status code (for network errors) */
  statusCode?: number;
  /** Original error object (for debugging) */
  originalError?: unknown;
}

/**
 * Standard error codes used throughout the application
 */
export const ErrorCode = {
  // Network errors (4xx, 5xx)
  NETWORK_ERROR: 'NETWORK_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  TIMEOUT: 'TIMEOUT',
  ABORT: 'ABORT',

  // Data errors
  INVALID_DATA: 'INVALID_DATA',
  PARSE_ERROR: 'PARSE_ERROR',

  // Backend errors
  DATABASE_ERROR: 'DATABASE_ERROR',
  API_ERROR: 'API_ERROR',

  // Client errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode];

/**
 * Type guard to check if an error is an ApiError
 *
 * @example
 * ```typescript
 * try {
 *   await fetchSites();
 * } catch (err) {
 *   if (isApiError(err)) {
 *     console.log(err.code, err.statusCode);
 *   }
 * }
 * ```
 */
export function isApiError(error: unknown): error is ApiError {
  // Must not be an Error instance (Error has message but is not ApiError)
  if (error instanceof Error) {
    return false;
  }

  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as ApiError).message === 'string'
  );
}

/**
 * Converts any error to a typed ApiError
 *
 * @example
 * ```typescript
 * try {
 *   await fetch('/api/sites');
 * } catch (err) {
 *   const apiError = toApiError(err);
 *   console.log(apiError.message, apiError.code);
 * }
 * ```
 */
export function toApiError(error: unknown, defaultMessage = 'An error occurred'): ApiError {
  // Already an ApiError
  if (isApiError(error)) {
    return error;
  }

  // Standard Error object
  if (error instanceof Error) {
    return {
      message: error.message,
      code: error.name === 'AbortError' ? ErrorCode.ABORT : ErrorCode.UNKNOWN_ERROR,
      originalError: error,
    };
  }

  // String error
  if (typeof error === 'string') {
    return {
      message: error,
      code: ErrorCode.UNKNOWN_ERROR,
    };
  }

  // Unknown error type
  return {
    message: defaultMessage,
    code: ErrorCode.UNKNOWN_ERROR,
    originalError: error,
  };
}

/**
 * Creates an ApiError from a fetch Response
 *
 * @example
 * ```typescript
 * const response = await fetch('/api/sites');
 * if (!response.ok) {
 *   throw await createApiErrorFromResponse(response);
 * }
 * ```
 */
export async function createApiErrorFromResponse(response: Response): Promise<ApiError> {
  const statusCode = response.status;

  // Try to parse error message from response body
  let message = response.statusText || 'Request failed';
  try {
    const errorData = await response.json();
    if (errorData.message) {
      message = errorData.message;
    }
  } catch {
    // Response body is not JSON, use statusText
  }

  // Map status codes to error codes
  let code: ErrorCodeType;
  if (statusCode === 404) {
    code = ErrorCode.NOT_FOUND;
  } else if (statusCode === 401) {
    code = ErrorCode.UNAUTHORIZED;
  } else if (statusCode === 403) {
    code = ErrorCode.FORBIDDEN;
  } else if (statusCode >= 500) {
    code = ErrorCode.API_ERROR;
  } else {
    code = ErrorCode.NETWORK_ERROR;
  }

  return {
    message,
    code,
    statusCode,
  };
}

/**
 * User-friendly error messages for display
 */
export const ERROR_MESSAGES: Record<ErrorCodeType, string> = {
  [ErrorCode.NETWORK_ERROR]: 'Network error. Please check your connection and try again.',
  [ErrorCode.NOT_FOUND]: 'The requested resource was not found.',
  [ErrorCode.UNAUTHORIZED]: 'You are not authorized to access this resource.',
  [ErrorCode.FORBIDDEN]: 'Access to this resource is forbidden.',
  [ErrorCode.TIMEOUT]: 'Request timed out. Please try again.',
  [ErrorCode.ABORT]: 'Request was cancelled.',
  [ErrorCode.INVALID_DATA]: 'The data received is invalid.',
  [ErrorCode.PARSE_ERROR]: 'Failed to parse response data.',
  [ErrorCode.DATABASE_ERROR]: 'Database error occurred.',
  [ErrorCode.API_ERROR]: 'Server error. Please try again later.',
  [ErrorCode.VALIDATION_ERROR]: 'Validation error. Please check your input.',
  [ErrorCode.UNKNOWN_ERROR]: 'An unexpected error occurred.',
};

/**
 * Gets a user-friendly error message
 *
 * @example
 * ```typescript
 * const error = toApiError(err);
 * const userMessage = getUserFriendlyMessage(error);
 * alert(userMessage); // "Network error. Please check your connection..."
 * ```
 */
export function getUserFriendlyMessage(error: ApiError): string {
  if (error.code && error.code in ERROR_MESSAGES) {
    return ERROR_MESSAGES[error.code as ErrorCodeType];
  }
  return error.message || ERROR_MESSAGES[ErrorCode.UNKNOWN_ERROR];
}
