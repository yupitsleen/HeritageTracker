/**
 * Tests for API Client
 *
 * Focus: Behavior-based tests for error handling and type guards
 * Avoids: Implementation details, mocking internals
 */

import { describe, it, expect } from 'vitest';
import { ApiClientError } from './client';
import { isApiError } from './types';
import type { ApiError } from './types';

describe('API Client', () => {
  describe('ApiClientError', () => {
    it('creates error with message', () => {
      const error = new ApiClientError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('ApiClientError');
    });

    it('includes status code when provided', () => {
      const error = new ApiClientError('Not found', 404);
      expect(error.statusCode).toBe(404);
    });

    it('includes error code when provided', () => {
      const error = new ApiClientError('Invalid request', 400, 'BAD_REQUEST');
      expect(error.errorCode).toBe('BAD_REQUEST');
    });

    it('includes details when provided', () => {
      const details = { field: 'name', reason: 'required' };
      const error = new ApiClientError('Validation failed', 400, 'VALIDATION_ERROR', details);
      expect(error.details).toEqual(details);
    });

    it('extends Error class', () => {
      const error = new ApiClientError('Test');
      expect(error instanceof Error).toBe(true);
    });
  });

  describe('isApiError type guard', () => {
    it('returns true for valid API error response', () => {
      const apiError: ApiError = {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Resource not found',
        },
        timestamp: '2025-10-24T20:00:00.000Z',
      };

      expect(isApiError(apiError)).toBe(true);
    });

    it('returns false for success response', () => {
      const successResponse = {
        success: true,
        data: { id: '123' },
        timestamp: '2025-10-24T20:00:00.000Z',
      };

      expect(isApiError(successResponse)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isApiError(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isApiError(undefined)).toBe(false);
    });

    it('returns false for non-object types', () => {
      expect(isApiError('error')).toBe(false);
      expect(isApiError(123)).toBe(false);
      expect(isApiError(true)).toBe(false);
    });

    it('returns false for object without success field', () => {
      expect(isApiError({ error: { code: 'TEST' } })).toBe(false);
    });

    it('returns false for object with success=true', () => {
      expect(isApiError({ success: true, error: {} })).toBe(false);
    });

    it('returns false for object without error field', () => {
      expect(isApiError({ success: false })).toBe(false);
    });
  });
});
