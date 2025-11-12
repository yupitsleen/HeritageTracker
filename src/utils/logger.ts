/**
 * Centralized logging utility for frontend
 *
 * Provides environment-aware logging with consistent formatting.
 * Debug logs are automatically suppressed in production builds.
 *
 * @example
 * ```typescript
 * import { logger } from '@/utils/logger';
 *
 * logger.debug('User selected site', { siteId: 'site-1' });
 * logger.info('Filters applied', { types: ['mosque'], status: ['destroyed'] });
 * logger.warn('Missing image URL for site', { siteId: 'site-2' });
 * logger.error('Failed to fetch sites', error);
 * ```
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Format log message with context
 */
function formatMessage(level: LogLevel, message: string, ...args: unknown[]): string {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  return args.length > 0 ? `${prefix} ${message}` : `${prefix} ${message}`;
}

/**
 * Centralized logger for frontend code
 *
 * Features:
 * - Debug logs only appear in development mode
 * - Production-safe (no sensitive data leaks)
 * - Consistent formatting with timestamps
 * - Type-safe with TypeScript
 */
export const logger = {
  /**
   * Debug logging - only active in development
   * Use for verbose logging that helps during development
   */
  debug: (message: string, ...args: unknown[]): void => {
    if (import.meta.env.DEV) {
      console.log(formatMessage('debug', message), ...args);
    }
  },

  /**
   * Info logging - active in all environments
   * Use for general informational messages
   */
  info: (message: string, ...args: unknown[]): void => {
    console.info(formatMessage('info', message), ...args);
  },

  /**
   * Warning logging - active in all environments
   * Use for non-critical issues that should be investigated
   */
  warn: (message: string, ...args: unknown[]): void => {
    console.warn(formatMessage('warn', message), ...args);
  },

  /**
   * Error logging - active in all environments
   * Use for errors that need immediate attention
   */
  error: (message: string, ...args: unknown[]): void => {
    console.error(formatMessage('error', message), ...args);
  },
};

/**
 * Type guard to check if error is an Error object
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Extract error message safely from unknown error type
 */
export function getErrorMessage(error: unknown): string {
  if (isError(error)) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}
