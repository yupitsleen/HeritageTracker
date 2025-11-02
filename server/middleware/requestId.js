/**
 * Request ID Middleware
 *
 * Assigns a unique ID to each incoming request for tracing through logs.
 * The request ID is:
 * - Stored in req.id
 * - Returned in X-Request-ID response header
 * - Used throughout the application for correlated logging
 *
 * Benefits:
 * - Trace a single request through entire system
 * - Correlate errors with specific requests
 * - Debug production issues effectively
 */

import { v4 as uuidv4 } from 'uuid';

/**
 * Middleware to assign unique request IDs
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function requestIdMiddleware(req, res, next) {
  // Use existing request ID from header (for distributed tracing)
  // or generate a new one
  req.id = req.headers['x-request-id'] || uuidv4();

  // Return request ID in response header
  res.setHeader('X-Request-ID', req.id);

  next();
}
