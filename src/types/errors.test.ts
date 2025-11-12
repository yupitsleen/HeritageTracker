import { describe, it, expect } from 'vitest';
import {
  isApiError,
  toApiError,
  createApiErrorFromResponse,
  getUserFriendlyMessage,
  ErrorCode,
  ERROR_MESSAGES,
  type ApiError,
} from './errors';

describe('errors', () => {
  describe('isApiError', () => {
    it('returns true for valid ApiError objects', () => {
      const error: ApiError = {
        message: 'Test error',
        code: ErrorCode.API_ERROR,
        statusCode: 500,
      };
      expect(isApiError(error)).toBe(true);
    });

    it('returns true for minimal ApiError (message only)', () => {
      const error = { message: 'Test error' };
      expect(isApiError(error)).toBe(true);
    });

    it('returns false for non-ApiError objects', () => {
      expect(isApiError(null)).toBe(false);
      expect(isApiError(undefined)).toBe(false);
      expect(isApiError('string')).toBe(false);
      expect(isApiError(123)).toBe(false);
      expect(isApiError({})).toBe(false);
      expect(isApiError({ code: 'ERROR' })).toBe(false); // missing message
    });

    it('returns false for Error objects', () => {
      const error = new Error('Test error');
      expect(isApiError(error)).toBe(false);
    });
  });

  describe('toApiError', () => {
    it('returns ApiError unchanged', () => {
      const error: ApiError = {
        message: 'Test error',
        code: ErrorCode.API_ERROR,
        statusCode: 500,
      };
      expect(toApiError(error)).toBe(error);
    });

    it('converts Error object to ApiError', () => {
      const error = new Error('Test error');
      const result = toApiError(error);
      expect(result.message).toBe('Test error');
      expect(result.code).toBe(ErrorCode.UNKNOWN_ERROR);
      expect(result.originalError).toBe(error);
    });

    it('handles AbortError specially', () => {
      const error = new Error('Aborted');
      error.name = 'AbortError';
      const result = toApiError(error);
      expect(result.code).toBe(ErrorCode.ABORT);
    });

    it('converts string to ApiError', () => {
      const result = toApiError('Test error message');
      expect(result.message).toBe('Test error message');
      expect(result.code).toBe(ErrorCode.UNKNOWN_ERROR);
    });

    it('converts unknown types to ApiError with default message', () => {
      const result = toApiError({ unknown: 'object' });
      expect(result.message).toBe('An error occurred');
      expect(result.code).toBe(ErrorCode.UNKNOWN_ERROR);
      expect(result.originalError).toEqual({ unknown: 'object' });
    });

    it('uses custom default message', () => {
      const result = toApiError(null, 'Custom default');
      expect(result.message).toBe('Custom default');
    });
  });

  describe('createApiErrorFromResponse', () => {
    it('creates error from 404 response', async () => {
      const response = new Response(JSON.stringify({ message: 'Site not found' }), {
        status: 404,
        statusText: 'Not Found',
      });

      const error = await createApiErrorFromResponse(response);
      expect(error.message).toBe('Site not found');
      expect(error.code).toBe(ErrorCode.NOT_FOUND);
      expect(error.statusCode).toBe(404);
    });

    it('creates error from 401 response', async () => {
      const response = new Response(null, {
        status: 401,
        statusText: 'Unauthorized',
      });

      const error = await createApiErrorFromResponse(response);
      expect(error.message).toBe('Unauthorized');
      expect(error.code).toBe(ErrorCode.UNAUTHORIZED);
      expect(error.statusCode).toBe(401);
    });

    it('creates error from 403 response', async () => {
      const response = new Response(null, {
        status: 403,
        statusText: 'Forbidden',
      });

      const error = await createApiErrorFromResponse(response);
      expect(error.code).toBe(ErrorCode.FORBIDDEN);
      expect(error.statusCode).toBe(403);
    });

    it('creates error from 500 response', async () => {
      const response = new Response(JSON.stringify({ message: 'Internal server error' }), {
        status: 500,
        statusText: 'Internal Server Error',
      });

      const error = await createApiErrorFromResponse(response);
      expect(error.message).toBe('Internal server error');
      expect(error.code).toBe(ErrorCode.API_ERROR);
      expect(error.statusCode).toBe(500);
    });

    it('creates error from 503 response', async () => {
      const response = new Response(null, {
        status: 503,
        statusText: 'Service Unavailable',
      });

      const error = await createApiErrorFromResponse(response);
      expect(error.code).toBe(ErrorCode.API_ERROR);
      expect(error.statusCode).toBe(503);
    });

    it('handles responses with no JSON body', async () => {
      const response = new Response('Plain text error', {
        status: 400,
        statusText: 'Bad Request',
        headers: { 'Content-Type': 'text/plain' },
      });

      const error = await createApiErrorFromResponse(response);
      expect(error.message).toBe('Bad Request');
      expect(error.code).toBe(ErrorCode.NETWORK_ERROR);
    });

    it('handles responses with invalid JSON', async () => {
      const response = new Response('Not JSON', {
        status: 500,
      });

      const error = await createApiErrorFromResponse(response);
      expect(error.code).toBe(ErrorCode.API_ERROR);
    });

    it('uses statusText when no message in response', async () => {
      const response = new Response(JSON.stringify({}), {
        status: 400,
        statusText: 'Bad Request',
      });

      const error = await createApiErrorFromResponse(response);
      expect(error.message).toBe('Bad Request');
    });
  });

  describe('getUserFriendlyMessage', () => {
    it('returns friendly message for known error codes', () => {
      const error: ApiError = {
        message: 'Technical error message',
        code: ErrorCode.NETWORK_ERROR,
      };
      const message = getUserFriendlyMessage(error);
      expect(message).toBe(ERROR_MESSAGES[ErrorCode.NETWORK_ERROR]);
      expect(message).toContain('Network error');
    });

    it('returns error message for unknown codes', () => {
      const error: ApiError = {
        message: 'Custom error message',
        code: 'UNKNOWN_CODE' as string,
      };
      const message = getUserFriendlyMessage(error);
      expect(message).toBe('Custom error message');
    });

    it('returns default message when no code and no message', () => {
      const error: ApiError = {
        message: '',
      };
      const message = getUserFriendlyMessage(error);
      expect(message).toBe(ERROR_MESSAGES[ErrorCode.UNKNOWN_ERROR]);
    });

    it('returns friendly messages for all error codes', () => {
      Object.values(ErrorCode).forEach((code) => {
        const error: ApiError = {
          message: 'Technical message',
          code,
        };
        const message = getUserFriendlyMessage(error);
        expect(message).toBeTruthy();
        expect(message.length).toBeGreaterThan(0);
      });
    });
  });

  describe('ErrorCode constants', () => {
    it('has all expected error codes', () => {
      expect(ErrorCode.NETWORK_ERROR).toBe('NETWORK_ERROR');
      expect(ErrorCode.NOT_FOUND).toBe('NOT_FOUND');
      expect(ErrorCode.UNAUTHORIZED).toBe('UNAUTHORIZED');
      expect(ErrorCode.FORBIDDEN).toBe('FORBIDDEN');
      expect(ErrorCode.TIMEOUT).toBe('TIMEOUT');
      expect(ErrorCode.ABORT).toBe('ABORT');
      expect(ErrorCode.INVALID_DATA).toBe('INVALID_DATA');
      expect(ErrorCode.PARSE_ERROR).toBe('PARSE_ERROR');
      expect(ErrorCode.DATABASE_ERROR).toBe('DATABASE_ERROR');
      expect(ErrorCode.API_ERROR).toBe('API_ERROR');
      expect(ErrorCode.VALIDATION_ERROR).toBe('VALIDATION_ERROR');
      expect(ErrorCode.UNKNOWN_ERROR).toBe('UNKNOWN_ERROR');
    });
  });

  describe('ERROR_MESSAGES', () => {
    it('has messages for all error codes', () => {
      Object.values(ErrorCode).forEach((code) => {
        expect(ERROR_MESSAGES[code]).toBeTruthy();
        expect(ERROR_MESSAGES[code].length).toBeGreaterThan(0);
      });
    });

    it('all messages are user-friendly', () => {
      Object.values(ERROR_MESSAGES).forEach((message) => {
        // Should not contain technical jargon
        expect(message).not.toContain('API');
        expect(message).not.toContain('HTTP');
        expect(message).not.toContain('null');
        expect(message).not.toContain('undefined');
      });
    });
  });
});
