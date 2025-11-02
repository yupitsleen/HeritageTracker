/**
 * Custom Error Classes
 *
 * Provides structured error handling with preserved context and stack traces.
 * All custom errors extend the base ServiceError class.
 */

/**
 * Base service error class
 * Preserves original error, stack trace, and operation context
 */
export class ServiceError extends Error {
  /**
   * Create a ServiceError
   * @param {string} operation - Operation that failed (e.g., "getAllSites", "updateSite")
   * @param {Error|string} originalError - Original error object or message
   * @param {Object} context - Additional context (filters, params, etc.)
   */
  constructor(operation, originalError, context = {}) {
    // Extract message from Error object or use string directly
    const message =
      originalError instanceof Error
        ? originalError.message
        : String(originalError);

    super(`${operation} failed: ${message}`);

    this.name = 'ServiceError';
    this.operation = operation;
    this.originalError = originalError instanceof Error ? originalError : new Error(message);
    this.context = context;
    this.timestamp = new Date().toISOString();

    // Preserve original stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ServiceError);
    }

    // Store original stack for debugging
    if (originalError instanceof Error) {
      this.originalStack = originalError.stack;
    }
  }

  /**
   * Convert error to JSON for logging
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      operation: this.operation,
      context: this.context,
      timestamp: this.timestamp,
      originalMessage: this.originalError.message,
      stack: this.stack,
      originalStack: this.originalStack,
    };
  }

  /**
   * Format error for console logging
   */
  toString() {
    return `[${this.name}] ${this.operation} failed: ${this.originalError.message}`;
  }
}

/**
 * Validation error - for invalid input data
 */
export class ValidationError extends ServiceError {
  constructor(operation, message, context = {}) {
    super(operation, new Error(message), context);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

/**
 * Not found error - for missing resources
 */
export class NotFoundError extends ServiceError {
  constructor(operation, resourceType, resourceId) {
    super(
      operation,
      new Error(`${resourceType} with ID "${resourceId}" not found`),
      { resourceType, resourceId }
    );
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

/**
 * Database error - for database operation failures
 */
export class DatabaseError extends ServiceError {
  constructor(operation, originalError, query = null) {
    super(operation, originalError, { query });
    this.name = 'DatabaseError';
    this.statusCode = 500;
  }
}

/**
 * Wrap an async function with error handling
 * Converts any thrown error into a ServiceError
 *
 * @param {Function} fn - Async function to wrap
 * @param {string} operation - Operation name for error context
 * @returns {Function} Wrapped function
 */
export function withErrorHandling(fn, operation) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      // If already a ServiceError, re-throw
      if (error instanceof ServiceError) {
        throw error;
      }

      // Convert to ServiceError
      throw new ServiceError(operation, error, { args });
    }
  };
}

/**
 * Create error context object for logging
 *
 * @param {Error} error - Error object
 * @param {Object} request - Express request object (optional)
 * @returns {Object} Error context
 */
export function createErrorContext(error, request = null) {
  const context = {
    timestamp: new Date().toISOString(),
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
  };

  // Add ServiceError specific fields
  if (error instanceof ServiceError) {
    context.error.operation = error.operation;
    context.error.context = error.context;
    context.error.originalMessage = error.originalError.message;
    context.error.originalStack = error.originalStack;
  }

  // Add request info if available
  if (request) {
    context.request = {
      method: request.method,
      path: request.path,
      query: request.query,
      params: request.params,
      ip: request.ip,
      userAgent: request.get('user-agent'),
    };

    // Add request ID if available (from request ID middleware)
    if (request.id) {
      context.requestId = request.id;
    }
  }

  return context;
}
