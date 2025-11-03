/**
 * Request Logger Middleware
 *
 * Logs all HTTP requests with timing and request ID using Pino.
 * Provides structured JSON logging for production and
 * pretty-printed logs for development.
 */

import logger from '../utils/logger.js';

/**
 * Middleware to log HTTP requests with Pino
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function loggerMiddleware(req, res, next) {
  const start = Date.now();

  // Create request-specific logger
  req.log = logger.child({ requestId: req.id });

  // Log incoming request
  req.log.info(
    {
      method: req.method,
      path: req.path,
      query: Object.keys(req.query).length > 0 ? req.query : undefined,
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    },
    `${req.method} ${req.path}`
  );

  // Log when response finishes
  res.on('finish', () => {
    const duration = Date.now() - start;

    const logData = {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      contentLength: res.get('content-length'),
    };

    // Choose log level based on status code
    if (res.statusCode >= 500) {
      req.log.error(logData, `${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
    } else if (res.statusCode >= 400) {
      req.log.warn(logData, `${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
    } else {
      req.log.info(logData, `${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
    }
  });

  next();
}
