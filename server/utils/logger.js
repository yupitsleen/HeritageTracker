/**
 * Structured Logger using Pino
 *
 * Provides structured JSON logging for production and
 * pretty-printed logs for development.
 *
 * Features:
 * - Structured JSON logs (machine-parseable)
 * - Log levels: trace, debug, info, warn, error, fatal
 * - Pretty printing in development
 * - Request ID correlation
 * - Timestamps
 * - Can pipe to log aggregators (Datadog, Loggly, etc.)
 *
 * Usage:
 *   import logger from './utils/logger.js';
 *
 *   logger.info('Server started');
 *   logger.error({ err, requestId }, 'Request failed');
 *   logger.debug({ query }, 'Database query');
 */

import pino from 'pino';

const isDevelopment = process.env.NODE_ENV !== 'production';

const logger = pino({
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),

  // Pretty print in development
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
          singleLine: false,
          messageFormat: '{msg}',
          customPrettifiers: {
            // Custom formatting for specific fields
            requestId: (requestId) => `[${requestId.substring(0, 8)}]`,
          },
        },
      }
    : undefined,

  // Format settings
  formatters: {
    // Custom log format
    level: (label) => {
      return { level: label };
    },
  },

  // Base fields included in every log
  base: {
    env: process.env.NODE_ENV || 'development',
  },

  // Timestamp format
  timestamp: pino.stdTimeFunctions.isoTime,
});

/**
 * Create a child logger with additional context
 * @param {Object} bindings - Context to include in all logs
 * @returns {import('pino').Logger} Child logger
 *
 * @example
 * const reqLogger = logger.child({ requestId: req.id });
 * reqLogger.info('Processing request');
 */
logger.createRequestLogger = function (requestId) {
  return this.child({ requestId });
};

export default logger;
